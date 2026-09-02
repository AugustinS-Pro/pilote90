'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentClient } from '@/lib/session'
import {
  cycleInput, monthlyPlanInput, weekInput, weekReviewInput, taskInput,
  eurosVersCentimes,
} from '@/lib/validation'
import type { ZodError } from 'zod'

export type EtatAction = {
  ok: boolean
  message?: string
  erreurs?: Record<string, string>
}

function versErreurs(error: ZodError): Record<string, string> {
  const erreurs: Record<string, string> = {}
  for (const issue of error.issues) {
    const champ = String(issue.path[0] ?? 'global')
    if (!erreurs[champ]) erreurs[champ] = issue.message
  }
  return erreurs
}

const texte = (v: FormDataEntryValue | null) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s === '' ? undefined : s
}

const JOUR = 86400000

function rafraichir() {
  revalidatePath('/axe5')
  revalidatePath('/axe1')
  revalidatePath('/dashboard')
  revalidatePath('/historique')
}

// ---------------------------------------------------------------------------
// Cycles
// ---------------------------------------------------------------------------

/**
 * Cree un cycle de 90 jours et ses douze semaines.
 * Un seul cycle peut etre actif a la fois : le precedent est clos.
 */
export async function creerCycle(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = cycleInput.safeParse({
    name: texte(formData.get('name')),
    mainObjective: formData.get('mainObjective'),
    caTarget: formData.get('caTarget'),
    startDate: formData.get('startDate'),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }

  const centimes = eurosVersCentimes(parsed.data.caTarget)
  if (centimes === null) {
    return { ok: false, message: 'Objectif de CA invalide.', erreurs: { caTarget: 'Montant invalide' } }
  }

  const debut = new Date(parsed.data.startDate)
  if (Number.isNaN(debut.getTime())) {
    return { ok: false, message: 'Date invalide.', erreurs: { startDate: 'Date invalide' } }
  }
  debut.setHours(12, 0, 0, 0)
  const fin = new Date(debut.getTime() + 90 * JOUR)

  const dernier = await prisma.cycle.findFirst({
    where: { clientId: client.id },
    orderBy: { cycleNumber: 'desc' },
    select: { cycleNumber: true },
  })

  // Un seul cycle en cours a la fois.
  await prisma.cycle.updateMany({
    where: { clientId: client.id, status: 'ACTIVE' },
    data: { status: 'COMPLETED' },
  })

  await prisma.cycle.create({
    data: {
      clientId: client.id,
      cycleNumber: (dernier?.cycleNumber ?? 0) + 1,
      name: parsed.data.name ?? null,
      mainObjective: parsed.data.mainObjective,
      caTargetMonthly: centimes,
      startDate: debut,
      endDate: fin,
      status: 'ACTIVE',
      weeks: {
        create: Array.from({ length: 12 }, (_, i) => ({
          weekNumber: i + 1,
          startDate: new Date(debut.getTime() + i * 7 * JOUR),
        })),
      },
      monthlyPlans: {
        create: [1, 2, 3].map((monthNumber) => ({ monthNumber })),
      },
    },
  })

  rafraichir()
  return { ok: true, message: 'Cycle cree, avec ses douze semaines et ses trois plans mensuels.' }
}

/** Cloture le cycle actif. Les idees du parking passent en relecture. */
export async function cloturerCycle(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const id = String(formData.get('id') ?? '')
  const bilan = texte(formData.get('closingNote'))
  if (!id) return { ok: false, message: 'Cycle introuvable.' }

  const maj = await prisma.cycle.updateMany({
    where: { id, clientId: client.id, status: 'ACTIVE' },
    data: { status: 'COMPLETED', closingNote: bilan ?? null },
  })
  if (maj.count === 0) return { ok: false, message: 'Aucun cycle actif a cloturer.' }

  rafraichir()
  return { ok: true, message: 'Cycle cloture. Relisez votre parking d idees avant d en ouvrir un nouveau.' }
}

// ---------------------------------------------------------------------------
// Plan mensuel
// ---------------------------------------------------------------------------

export async function enregistrerPlanMensuel(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const cycleId = String(formData.get('cycleId') ?? '')
  const parsed = monthlyPlanInput.safeParse({
    monthNumber: formData.get('monthNumber'),
    theme: texte(formData.get('theme')),
    caTarget: texte(formData.get('caTarget')),
    notes: texte(formData.get('notes')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.' }

  const cycle = await prisma.cycle.findFirst({
    where: { id: cycleId, clientId: client.id },
    select: { id: true },
  })
  if (!cycle) return { ok: false, message: 'Cycle introuvable.' }

  const mois = Number(parsed.data.monthNumber)
  if (![1, 2, 3].includes(mois)) return { ok: false, message: 'Mois invalide.' }

  const centimes = parsed.data.caTarget ? eurosVersCentimes(parsed.data.caTarget) : 0

  await prisma.monthlyPlan.upsert({
    where: { cycleId_monthNumber: { cycleId: cycle.id, monthNumber: mois } },
    update: { theme: parsed.data.theme ?? null, caTargetHt: centimes ?? 0, notes: parsed.data.notes ?? null },
    create: {
      cycleId: cycle.id, monthNumber: mois,
      theme: parsed.data.theme ?? null, caTargetHt: centimes ?? 0, notes: parsed.data.notes ?? null,
    },
  })

  rafraichir()
  return { ok: true, message: `Plan du mois ${mois} enregistre.` }
}

// ---------------------------------------------------------------------------
// Semaines et revue hebdomadaire
// ---------------------------------------------------------------------------

/** Verifie qu'une semaine appartient bien a un cycle du client connecte. */
async function semaineDuClient(weekId: string, clientId: string) {
  return prisma.week.findFirst({
    where: { id: weekId, cycle: { clientId } },
    select: { id: true },
  })
}

export async function enregistrerFocusSemaine(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = weekInput.safeParse({
    weekId: formData.get('weekId'),
    focusTitle: texte(formData.get('focusTitle')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie invalide.' }

  const semaine = await semaineDuClient(parsed.data.weekId, client.id)
  if (!semaine) return { ok: false, message: 'Semaine introuvable.' }

  await prisma.week.update({
    where: { id: semaine.id },
    data: { focusTitle: parsed.data.focusTitle ?? null },
  })

  rafraichir()
  return { ok: true, message: 'Focus de la semaine enregistre.' }
}

export async function enregistrerRevue(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = weekReviewInput.safeParse({
    weekId: formData.get('weekId'),
    whatWorks: texte(formData.get('whatWorks')),
    whatBlocks: texte(formData.get('whatBlocks')),
    adjustments: texte(formData.get('adjustments')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie invalide.' }

  const semaine = await semaineDuClient(parsed.data.weekId, client.id)
  if (!semaine) return { ok: false, message: 'Semaine introuvable.' }

  const donnees = {
    whatWorks: parsed.data.whatWorks ?? null,
    whatBlocks: parsed.data.whatBlocks ?? null,
    adjustments: parsed.data.adjustments ?? null,
  }

  await prisma.weekReview.upsert({
    where: { weekId: semaine.id },
    update: donnees,
    create: { weekId: semaine.id, ...donnees },
  })

  rafraichir()
  return { ok: true, message: 'Revue enregistree.' }
}

// ---------------------------------------------------------------------------
// Taches du cockpit
// ---------------------------------------------------------------------------

/**
 * Cree une tache, eventuellement rattachee a une priorite CEO du cycle actif.
 * C'est ce rattachement qui relie la strategie a l'execution quotidienne.
 */
export async function creerTache(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = taskInput.safeParse({
    label: formData.get('label'),
    tag: formData.get('tag'),
    objectiveId: texte(formData.get('objectiveId')),
    dueDate: texte(formData.get('dueDate')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }

  const cycle = await prisma.cycle.findFirst({
    where: { clientId: client.id, status: 'ACTIVE' },
    select: { id: true },
  })

  // La priorite est verifiee : elle doit appartenir a un cycle du client.
  let objectiveId: string | null = null
  if (parsed.data.objectiveId) {
    const priorite = await prisma.objective.findFirst({
      where: { id: parsed.data.objectiveId, cycle: { clientId: client.id } },
      select: { id: true },
    })
    objectiveId = priorite?.id ?? null
  }

  let echeance: Date | null = null
  if (parsed.data.dueDate) {
    const d = new Date(parsed.data.dueDate)
    if (!Number.isNaN(d.getTime())) echeance = d
  }

  const position = await prisma.task.count({ where: { clientId: client.id, done: false } })

  await prisma.task.create({
    data: {
      clientId: client.id,
      cycleId: cycle?.id ?? null,
      objectiveId,
      label: parsed.data.label,
      tag: parsed.data.tag,
      dueDate: echeance,
      position,
    },
  })

  rafraichir()
  return { ok: true, message: 'Tache ajoutee.' }
}

/**
 * Coche ou decoche une tache. Si elle est rattachee a une priorite,
 * la progression de cette priorite est recalculee a partir de ses taches.
 */
export async function basculerTache(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  if (!client) return

  const id = String(formData.get('id') ?? '')
  if (!id) return

  const tache = await prisma.task.findFirst({
    where: { id, clientId: client.id },
    select: { id: true, done: true, objectiveId: true },
  })
  if (!tache) return

  await prisma.task.update({ where: { id: tache.id }, data: { done: !tache.done } })

  if (tache.objectiveId) {
    const taches = await prisma.task.findMany({
      where: { objectiveId: tache.objectiveId, clientId: client.id },
      select: { done: true },
    })
    if (taches.length > 0) {
      const faites = taches.filter((t) => t.done).length
      const pct = Math.round((faites / taches.length) * 100)
      await prisma.objective.updateMany({
        where: { id: tache.objectiveId, cycle: { clientId: client.id } },
        data: { progressPct: pct, status: pct === 100 ? 'COMPLETED' : 'IN_PROGRESS' },
      })
    }
  }

  rafraichir()
}

export async function supprimerTache(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.task.deleteMany({ where: { id, clientId: client.id } })
  rafraichir()
}

/**
 * Modification en place de l intitule.
 *
 * Meme cloisonnement que la suppression : le `clientId` de la session entre
 * dans le WHERE, donc un identifiant qui ne serait pas du client connecte ne
 * met simplement rien a jour. La valeur vide est refusee plutot que d effacer
 * l intitule.
 */
export async function modifierTache(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  const valeur = String(formData.get('valeur') ?? '').trim()
  if (!client || !id || valeur.length === 0 || valeur.length > 300) return
  await prisma.task.updateMany({
    where: { id, clientId: client.id },
    data: { label: valeur },
  })
  rafraichir()
}
