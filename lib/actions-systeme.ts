'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentClient, getCurrentUser } from '@/lib/session'
import { decisionInput, ideaInput, resourceInput } from '@/lib/validation'
import { PILIER_PAR_CLE, type ClePilier } from '@/lib/piliers'
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

// ---------------------------------------------------------------------------
// Centre de decisions
// ---------------------------------------------------------------------------

export async function creerDecision(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = decisionInput.safeParse({
    title: formData.get('title'),
    category: formData.get('category'),
    context: texte(formData.get('context')),
    decidedAt: texte(formData.get('decidedAt')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }

  let date = new Date()
  if (parsed.data.decidedAt) {
    const d = new Date(parsed.data.decidedAt)
    if (!Number.isNaN(d.getTime())) date = d
  }

  const cycle = await prisma.cycle.findFirst({
    where: { clientId: client.id, status: 'ACTIVE' },
    select: { id: true },
  })

  await prisma.decision.create({
    data: {
      clientId: client.id,
      cycleId: cycle?.id ?? null,
      title: parsed.data.title,
      category: parsed.data.category,
      context: parsed.data.context ?? null,
      decidedAt: date,
    },
  })

  revalidatePath('/decisions')
  revalidatePath('/axe1')
  return { ok: true, message: 'Decision consignee.' }
}

export async function supprimerDecision(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.decision.deleteMany({ where: { id, clientId: client.id } })
  revalidatePath('/decisions')
  revalidatePath('/axe1')
}

// ---------------------------------------------------------------------------
// Parking d'idees
// ---------------------------------------------------------------------------

export async function creerIdee(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = ideaInput.safeParse({ content: formData.get('content') })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }

  const cycle = await prisma.cycle.findFirst({
    where: { clientId: client.id, status: 'ACTIVE' },
    select: { id: true },
  })

  await prisma.idea.create({
    data: { clientId: client.id, cycleId: cycle?.id ?? null, content: parsed.data.content },
  })

  revalidatePath('/axe1')
  revalidatePath('/historique')
  return { ok: true, message: 'Idee garee. Elle sera relue a la cloture du cycle.' }
}

/** Arbitrage d'une idee au moment de la cloture : gardee, reportee ou abandonnee. */
export async function arbitrerIdee(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  if (!client) return

  const id = String(formData.get('id') ?? '')
  const issue = String(formData.get('outcome') ?? '')
  const autorisees = ['PARKED', 'KEPT', 'POSTPONED', 'DROPPED'] as const
  if (!id || !autorisees.includes(issue as (typeof autorisees)[number])) return

  await prisma.idea.updateMany({
    where: { id, clientId: client.id },
    data: {
      outcome: issue as (typeof autorisees)[number],
      reviewedAt: issue === 'PARKED' ? null : new Date(),
    },
  })

  revalidatePath('/axe1')
  revalidatePath('/historique')
}

export async function supprimerIdee(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.idea.deleteMany({ where: { id, clientId: client.id } })
  revalidatePath('/axe1')
  revalidatePath('/historique')
}

// ---------------------------------------------------------------------------
// Bibliotheque strategique
// ---------------------------------------------------------------------------

export async function creerRessource(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) return { ok: false, message: 'Session expiree.' }

  const parsed = resourceInput.safeParse({
    title: formData.get('title'),
    type: formData.get('type'),
    description: texte(formData.get('description')),
    url: texte(formData.get('url')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }

  // Une ressource deposee par l'administrateur est commune (clientId nul)
  // et devient visible par tous ses clients.
  const client = await getCurrentClient()

  await prisma.resource.create({
    data: {
      clientId: client?.id ?? null,
      title: parsed.data.title,
      type: parsed.data.type,
      description: parsed.data.description ?? null,
      url: parsed.data.url ?? null,
    },
  })

  revalidatePath('/bibliotheque')
  return { ok: true, message: 'Ressource ajoutee.' }
}

export async function supprimerRessource(formData: FormData): Promise<void> {
  const utilisateur = await getCurrentUser()
  const id = String(formData.get('id') ?? '')
  if (!utilisateur || !id) return

  const client = await getCurrentClient()

  // Un client ne supprime que ses propres ressources ;
  // l'administrateur ne supprime que les ressources communes.
  await prisma.resource.deleteMany({
    where: client ? { id, clientId: client.id } : { id, clientId: null },
  })

  revalidatePath('/bibliotheque')
}

// ---------------------------------------------------------------------------
// Axe 1 - Les quatre piliers (coffre strategique)
// ---------------------------------------------------------------------------

/**
 * Enregistre un pilier : sa synthese et les reponses aux questions guidees.
 * Une seule entree par pilier et par client, garantie par la contrainte
 * d'unicite (clientId, key) du schema.
 */
export async function enregistrerPilier(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const cle = String(formData.get('cle') ?? '')
  const cles = ['VISION', 'MISSION', 'GRAND_POURQUOI', 'OBJECTIF_ANNUEL'] as const
  if (!cles.includes(cle as (typeof cles)[number])) {
    return { ok: false, message: 'Pilier inconnu.' }
  }

  const synthese = texte(formData.get('synthesis'))

  const entree = await prisma.strategyEntry.upsert({
    where: { clientId_key: { clientId: client.id, key: cle as (typeof cles)[number] } },
    update: { synthesis: synthese ?? null },
    create: { clientId: client.id, key: cle as (typeof cles)[number], synthesis: synthese ?? null },
  })

  // Les reponses arrivent sous la forme question-0, question-1, ...
  const pilier = PILIER_PAR_CLE[cle as ClePilier]
  for (let i = 0; i < pilier.questions.length; i++) {
    const question = pilier.questions[i]
    const reponse = texte(formData.get(`question-${i}`))

    const existante = await prisma.strategyNote.findFirst({
      where: { entryId: entree.id, question },
      select: { id: true },
    })

    if (existante) {
      await prisma.strategyNote.update({
        where: { id: existante.id },
        data: { answer: reponse ?? null, position: i },
      })
    } else if (reponse) {
      await prisma.strategyNote.create({
        data: { entryId: entree.id, question, answer: reponse, position: i },
      })
    }
  }

  revalidatePath('/axe1')
  revalidatePath('/dashboard')
  return { ok: true, message: `${pilier.titre} enregistre.` }
}
