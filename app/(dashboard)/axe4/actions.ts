'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentClient } from '@/lib/session'
import {
  clientProblemInput, contentThemeInput, contentIdeaInput, prospectInput,
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

function rafraichir() {
  revalidatePath('/axe4')
  revalidatePath('/dashboard')
}

// ---------------------------------------------------------------------------
// Ce qui interesse mon client
// ---------------------------------------------------------------------------

export async function creerProbleme(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = clientProblemInput.safeParse({
    problem: formData.get('problem'),
    question: texte(formData.get('question')),
    understanding: texte(formData.get('understanding')),
    topic: texte(formData.get('topic')),
    angle: texte(formData.get('angle')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }

  const position = await prisma.clientProblem.count({ where: { clientId: client.id } })
  await prisma.clientProblem.create({
    data: {
      clientId: client.id,
      problem: parsed.data.problem,
      question: parsed.data.question ?? null,
      understanding: parsed.data.understanding ?? null,
      topic: parsed.data.topic ?? null,
      angle: parsed.data.angle ?? null,
      position,
    },
  })

  rafraichir()
  return { ok: true, message: 'Ligne ajoutee.' }
}

export async function supprimerProbleme(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.clientProblem.deleteMany({ where: { id, clientId: client.id } })
  rafraichir()
}

// ---------------------------------------------------------------------------
// Thematiques
// ---------------------------------------------------------------------------

export async function creerThematique(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = contentThemeInput.safeParse({
    label: formData.get('label'),
    whyImportant: texte(formData.get('whyImportant')),
    linkToOffer: texte(formData.get('linkToOffer')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }

  // Trois a cinq thematiques : au-dela, le message se dilue.
  const nombre = await prisma.contentTheme.count({ where: { clientId: client.id } })
  if (nombre >= 5) {
    return { ok: false, message: 'Cinq thematiques au maximum : au-dela, le message se dilue.' }
  }

  await prisma.contentTheme.create({
    data: {
      clientId: client.id,
      label: parsed.data.label,
      whyImportant: parsed.data.whyImportant ?? null,
      linkToOffer: parsed.data.linkToOffer ?? null,
      position: nombre,
    },
  })

  rafraichir()
  return { ok: true, message: 'Thematique ajoutee.' }
}

export async function supprimerThematique(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.contentIdea.updateMany({ where: { themeId: id, clientId: client.id }, data: { themeId: null } })
  await prisma.contentTheme.deleteMany({ where: { id, clientId: client.id } })
  rafraichir()
}

// ---------------------------------------------------------------------------
// Idees de contenu
// ---------------------------------------------------------------------------

export async function creerIdeeContenu(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = contentIdeaInput.safeParse({
    subject: formData.get('subject'),
    themeId: texte(formData.get('themeId')),
    contentType: formData.get('contentType'),
    format: formData.get('format'),
    platform: texte(formData.get('platform')),
    marketingGoal: formData.get('marketingGoal'),
    weekNumber: texte(formData.get('weekNumber')),
    status: formData.get('status'),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }

  let themeId: string | null = null
  if (parsed.data.themeId) {
    const theme = await prisma.contentTheme.findFirst({
      where: { id: parsed.data.themeId, clientId: client.id },
      select: { id: true },
    })
    themeId = theme?.id ?? null
  }

  const semaine = parsed.data.weekNumber ? Number(parsed.data.weekNumber) : null
  const semaineValide = semaine !== null && semaine >= 1 && semaine <= 4 ? semaine : null

  await prisma.contentIdea.create({
    data: {
      clientId: client.id,
      themeId,
      subject: parsed.data.subject,
      contentType: parsed.data.contentType,
      format: parsed.data.format,
      platform: parsed.data.platform ?? null,
      marketingGoal: parsed.data.marketingGoal,
      weekNumber: semaineValide,
      status: parsed.data.status,
      publishedAt: parsed.data.status === 'PUBLIE' ? new Date() : null,
    },
  })

  rafraichir()
  return { ok: true, message: 'Idee de contenu ajoutee.' }
}

export async function changerStatutContenu(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  if (!client) return

  const id = String(formData.get('id') ?? '')
  const statut = String(formData.get('status') ?? '')
  const autorises = ['IDEE', 'A_CREER', 'PUBLIE'] as const
  if (!id || !autorises.includes(statut as (typeof autorises)[number])) return

  await prisma.contentIdea.updateMany({
    where: { id, clientId: client.id },
    data: {
      status: statut as (typeof autorises)[number],
      publishedAt: statut === 'PUBLIE' ? new Date() : null,
    },
  })
  rafraichir()
}

export async function supprimerIdeeContenu(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.contentIdea.deleteMany({ where: { id, clientId: client.id } })
  rafraichir()
}

// ---------------------------------------------------------------------------
// Pipeline commercial
// ---------------------------------------------------------------------------

export async function creerProspect(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = prospectInput.safeParse({
    companyName: formData.get('companyName'),
    contactName: texte(formData.get('contactName')),
    estimated: formData.get('estimated'),
    source: texte(formData.get('source')),
    stage: formData.get('stage'),
    expectedCloseDate: texte(formData.get('expectedCloseDate')),
    notes: texte(formData.get('notes')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }

  const centimes = eurosVersCentimes(parsed.data.estimated)
  if (centimes === null) {
    return { ok: false, message: 'Montant invalide.', erreurs: { estimated: 'Montant invalide' } }
  }

  let echeance: Date | null = null
  if (parsed.data.expectedCloseDate) {
    const d = new Date(parsed.data.expectedCloseDate)
    if (!Number.isNaN(d.getTime())) echeance = d
  }

  await prisma.prospect.create({
    data: {
      clientId: client.id,
      companyName: parsed.data.companyName,
      contactName: parsed.data.contactName ?? null,
      estimatedHt: centimes,
      source: parsed.data.source ?? null,
      stage: parsed.data.stage,
      expectedCloseDate: echeance,
      notes: parsed.data.notes ?? null,
    },
  })

  rafraichir()
  return { ok: true, message: 'Prospect ajoute au pipeline.' }
}

/** Deplacement d'un prospect d'une etape a l'autre. */
export async function deplacerProspect(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  if (!client) return

  const id = String(formData.get('id') ?? '')
  const etape = String(formData.get('stage') ?? '')
  const autorisees = ['DECOUVERTE', 'QUALIFICATION', 'PROPOSITION', 'SIGNE'] as const
  if (!id || !autorisees.includes(etape as (typeof autorisees)[number])) return

  await prisma.prospect.updateMany({
    where: { id, clientId: client.id },
    data: { stage: etape as (typeof autorisees)[number] },
  })
  rafraichir()
}

export async function supprimerProspect(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.prospect.deleteMany({ where: { id, clientId: client.id } })
  rafraichir()
}
