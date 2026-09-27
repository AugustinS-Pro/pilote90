'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentClientAutorise } from '@/lib/session'
import type { Acces } from '@/lib/habilitations'
import { prioriteInput, progressionInput, versPourcentage } from '@/lib/validation'
import { progressionEstSaisissable, statutDeduit } from '@/lib/progression'
import { actionsAProposer } from '@/lib/modeles-taches'

/**
 * Acces requis pour ecrire dans cet axe. La page fait la meme verification,
 * mais une Server Action s'appelle aussi sans passer par la page.
 */
const ACCES_REQUIS: readonly Acces[] = ['AXE_VISION']

export type EtatAction = {
  ok: boolean
  message?: string
  erreurs?: Record<string, string>
}

/** Cycle actif du client connecte. Point d'entree unique du cloisonnement. */
async function cycleActifDuClient() {
  const client = await getCurrentClientAutorise(ACCES_REQUIS)
  if (!client) return null
  return prisma.cycle.findFirst({
    where: { clientId: client.id, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  })
}

function rafraichir() {
  revalidatePath('/axe1')
  revalidatePath('/dashboard')
}

/** Cree une priorite dans le cycle actif. */
export async function creerPriorite(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const cycle = await cycleActifDuClient()
  if (!cycle) return { ok: false, message: 'Aucun cycle actif : créez un cycle avant d’ajouter une priorité.' }

  const parsed = prioriteInput.safeParse({
    title: formData.get('title'),
    description: formData.get('description') ?? undefined,
  })

  if (!parsed.success) {
    const erreurs: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const champ = String(issue.path[0] ?? 'global')
      if (!erreurs[champ]) erreurs[champ] = issue.message
    }
    return { ok: false, message: 'Saisie incomplete.', erreurs }
  }

  // Trois priorites par cycle : regle commune au dossier professionnel,
  // au cahier des charges et a la version Notion (Priorite 1 / 2 / 3).
  const nombre = await prisma.objective.count({ where: { cycleId: cycle.id } })
  if (nombre >= 3) {
    return {
      ok: false,
      message: 'Trois priorités au maximum par cycle. Terminez-en une ou supprimez-la avant d’en ajouter une autre.',
    }
  }

  await prisma.objective.create({
    data: {
      cycleId: cycle.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      progressPct: 0,
      status: 'IN_PROGRESS',
    },
  })

  rafraichir()
  return { ok: true, message: 'Priorité ajoutée.' }
}

/** Met a jour progression et statut d'une priorite du cycle actif. */
export async function majPriorite(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const cycle = await cycleActifDuClient()
  if (!cycle) return { ok: false, message: 'Session expirée.' }

  const parsed = progressionInput.safeParse({
    id: formData.get('id'),
    progressPct: formData.get('progressPct'),
    status: formData.get('status'),
  })
  if (!parsed.success) return { ok: false, message: 'Valeurs invalides.' }

  const pct = versPourcentage(parsed.data.progressPct)
  if (pct === null) return { ok: false, message: 'Progression invalide.' }

  // Une priorite qui porte des taches n'a pas de progression saisissable.
  // Le refus est ici, cote serveur : le composant ne fait que s'y conformer.
  const nombreDeTaches = await prisma.task.count({
    where: { objectiveId: parsed.data.id, clientId: cycle.clientId },
  })

  if (!progressionEstSaisissable(nombreDeTaches)) {
    const seulStatut = await prisma.objective.updateMany({
      where: { id: parsed.data.id, cycleId: cycle.id },
      data: { status: parsed.data.status },
    })
    if (seulStatut.count === 0) return { ok: false, message: 'Priorité introuvable.' }
    rafraichir()
    return {
      ok: true,
      message: 'Statut enregistré. La progression est calculée à partir des tâches rattachées.',
    }
  }

  // Cloisonnement : le cycleId du client fait partie du filtre.
  const resultat = await prisma.objective.updateMany({
    where: { id: parsed.data.id, cycleId: cycle.id },
    data: {
      progressPct: pct,
      status: pct === 100 ? statutDeduit(pct) : parsed.data.status,
    },
  })

  if (resultat.count === 0) return { ok: false, message: 'Priorité introuvable.' }

  rafraichir()
  return { ok: true, message: 'Priorité mise à jour.' }
}

/** Supprime une priorite du cycle actif. */
export async function supprimerPriorite(formData: FormData): Promise<void> {
  const cycle = await cycleActifDuClient()
  if (!cycle) return

  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.objective.deleteMany({ where: { id, cycleId: cycle.id } })
  rafraichir()
}

/**
 * Cree les actions proposees pour une priorite.
 *
 * Le cahier des charges de janvier promettait cette generation ; elle manquait.
 * Rien n'est devine a la place du dirigeant : l'intitule de la priorite
 * designe un modele, et les actions creees se modifient et se suppriment
 * comme les autres. Une page blanche ne se remplit jamais, une proposition
 * qui ne convient pas se supprime en deux clics.
 */
export async function proposerActions(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const cycle = await cycleActifDuClient()
  if (!cycle) return { ok: false, message: 'Session expirée.' }

  const id = String(formData.get('id') ?? '')
  if (!id) return { ok: false, message: 'Priorité introuvable.' }

  // Cloisonnement : la priorite doit appartenir au cycle actif du client.
  const priorite = await prisma.objective.findFirst({
    where: { id, cycleId: cycle.id },
    select: { id: true, title: true, tasks: { select: { label: true } } },
  })
  if (!priorite) return { ok: false, message: 'Priorité introuvable.' }

  const actions = actionsAProposer(priorite.title, priorite.tasks.map((t) => t.label))
  if (actions.length === 0) {
    return { ok: true, message: 'Ces actions sont déjà dans votre cockpit.' }
  }

  const depart = await prisma.task.count({ where: { clientId: cycle.clientId, done: false } })

  await prisma.task.createMany({
    data: actions.map((action, i) => ({
      clientId: cycle.clientId,
      cycleId: cycle.id,
      objectiveId: priorite.id,
      label: action.label,
      tag: action.tag,
      position: depart + i,
    })),
  })

  rafraichir()
  revalidatePath('/axe5')

  return {
    ok: true,
    message: `${actions.length} actions ajoutées au cockpit. La progression de cette priorité se calcule désormais à partir d’elles.`,
  }
}
