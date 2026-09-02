'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentClient } from '@/lib/session'
import { transactionInput, eurosVersCentimes } from '@/lib/validation'

export type EtatAction = {
  ok: boolean
  message?: string
  erreurs?: Record<string, string>
}

/** Cree une transaction pour le client connecte. */
export async function creerTransaction(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree ou compte non client.' }

  const parsed = transactionInput.safeParse({
    type: formData.get('type'),
    transactionDate: formData.get('transactionDate'),
    label: formData.get('label'),
    amount: formData.get('amount'),
    category: formData.get('category') ?? undefined,
  })

  if (!parsed.success) {
    const erreurs: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const champ = String(issue.path[0] ?? 'global')
      if (!erreurs[champ]) erreurs[champ] = issue.message
    }
    return { ok: false, message: 'Saisie incomplete.', erreurs }
  }

  const centimes = eurosVersCentimes(parsed.data.amount)
  if (centimes === null) {
    return { ok: false, message: 'Montant invalide.', erreurs: { amount: 'Montant invalide' } }
  }

  const date = new Date(parsed.data.transactionDate)
  if (Number.isNaN(date.getTime())) {
    return { ok: false, message: 'Date invalide.', erreurs: { transactionDate: 'Date invalide' } }
  }

  await prisma.transaction.create({
    data: {
      clientId: client.id,
      type: parsed.data.type,
      amountHt: centimes,
      transactionDate: date,
      label: parsed.data.label,
      category: parsed.data.category || null,
    },
  })

  revalidatePath('/axe2')
  revalidatePath('/audit')
  revalidatePath('/dashboard')

  return {
    ok: true,
    message: parsed.data.type === 'REVENUE' ? 'Revenu enregistre.' : 'Charge enregistree.',
  }
}

/** Supprime une transaction, apres verification qu'elle appartient bien au client connecte. */
export async function supprimerTransaction(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  if (!client) return

  const id = String(formData.get('id') ?? '')
  if (!id) return

  // Cloisonnement : le clientId de la session fait partie du filtre de suppression.
  await prisma.transaction.deleteMany({ where: { id, clientId: client.id } })

  revalidatePath('/axe2')
  revalidatePath('/audit')
  revalidatePath('/dashboard')
}

// ---------------------------------------------------------------------------
// Structure administrative, taux de charges, objectif de revenu, echeances
// ---------------------------------------------------------------------------

import {
  adminProfileInput, chargeRateInput, revenueGoalInput, deadlineInput, versTaux,
} from '@/lib/validation'

const optionnel = (v: FormDataEntryValue | null) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s === '' ? undefined : s
}

export async function enregistrerStructure(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = adminProfileInput.safeParse({
    legalStatus: optionnel(formData.get('legalStatus')),
    proBankAccount: optionnel(formData.get('proBankAccount')),
    invoicingTool: optionnel(formData.get('invoicingTool')),
    accountingTool: optionnel(formData.get('accountingTool')),
    proInsurance: optionnel(formData.get('proInsurance')),
    vatRegime: optionnel(formData.get('vatRegime')),
    siret: optionnel(formData.get('siret')),
    siren: optionnel(formData.get('siren')),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie invalide.' }

  const donnees = {
    legalStatus: parsed.data.legalStatus ?? null,
    proBankAccount: parsed.data.proBankAccount === 'on',
    invoicingTool: parsed.data.invoicingTool ?? null,
    accountingTool: parsed.data.accountingTool ?? null,
    proInsurance: parsed.data.proInsurance === 'on',
    vatRegime: parsed.data.vatRegime ?? null,
    siret: parsed.data.siret ?? null,
    siren: parsed.data.siren ?? null,
  }

  await prisma.adminProfile.upsert({
    where: { clientId: client.id }, update: donnees,
    create: { clientId: client.id, ...donnees },
  })

  revalidatePath('/axe2')
  return { ok: true, message: 'Structure enregistree.' }
}

export async function enregistrerTaux(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = chargeRateInput.safeParse({
    socialContributionPct: optionnel(formData.get('socialContributionPct')),
    incomeTaxPct: optionnel(formData.get('incomeTaxPct')),
    trainingPct: optionnel(formData.get('trainingPct')),
    category: formData.get('category'),
  })
  if (!parsed.success) return { ok: false, message: 'Saisie invalide.' }

  const donnees = {
    socialContributionPct: versTaux(parsed.data.socialContributionPct),
    incomeTaxPct: versTaux(parsed.data.incomeTaxPct),
    trainingPct: versTaux(parsed.data.trainingPct),
    category: parsed.data.category,
  }

  await prisma.chargeRate.upsert({
    where: { clientId: client.id }, update: donnees,
    create: { clientId: client.id, ...donnees },
  })

  revalidatePath('/axe2')
  revalidatePath('/audit')
  return { ok: true, message: 'Taux enregistres. Le total est recalcule.' }
}

export async function enregistrerObjectifRevenu(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = revenueGoalInput.safeParse({
    offerName: formData.get('offerName'),
    netTarget: formData.get('netTarget'),
    offerPrice: formData.get('offerPrice'),
  })
  if (!parsed.success) {
    const erreurs: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const champ = String(issue.path[0] ?? 'global')
      if (!erreurs[champ]) erreurs[champ] = issue.message
    }
    return { ok: false, message: 'Saisie incomplete.', erreurs }
  }

  const net = eurosVersCentimes(parsed.data.netTarget)
  const prix = eurosVersCentimes(parsed.data.offerPrice)
  if (net === null || prix === null) return { ok: false, message: 'Montant invalide.' }

  const id = optionnel(formData.get('id'))
  const donnees = { offerName: parsed.data.offerName, netTargetHt: net, offerPriceHt: prix }

  if (id) {
    await prisma.revenueGoal.updateMany({ where: { id, clientId: client.id }, data: donnees })
  } else {
    await prisma.revenueGoal.create({ data: { clientId: client.id, ...donnees } })
  }

  revalidatePath('/axe2')
  return { ok: true, message: 'Objectif enregistre.' }
}

export async function supprimerObjectifRevenu(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.revenueGoal.deleteMany({ where: { id, clientId: client.id } })
  revalidatePath('/axe2')
}

export async function creerEcheance(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = deadlineInput.safeParse({
    label: formData.get('label'),
    dueDate: formData.get('dueDate'),
    recurrence: optionnel(formData.get('recurrence')),
  })
  if (!parsed.success) {
    const erreurs: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const champ = String(issue.path[0] ?? 'global')
      if (!erreurs[champ]) erreurs[champ] = issue.message
    }
    return { ok: false, message: 'Saisie incomplete.', erreurs }
  }

  const date = new Date(parsed.data.dueDate)
  if (Number.isNaN(date.getTime())) return { ok: false, message: 'Date invalide.' }

  await prisma.adminDeadline.create({
    data: {
      clientId: client.id, label: parsed.data.label,
      dueDate: date, recurrence: parsed.data.recurrence ?? null,
    },
  })

  revalidatePath('/axe2')
  return { ok: true, message: 'Echeance ajoutee.' }
}

export async function basculerEcheance(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  if (!client) return
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const echeance = await prisma.adminDeadline.findFirst({
    where: { id, clientId: client.id }, select: { id: true, done: true },
  })
  if (!echeance) return

  await prisma.adminDeadline.update({ where: { id: echeance.id }, data: { done: !echeance.done } })
  revalidatePath('/axe2')
}

export async function supprimerEcheance(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.adminDeadline.deleteMany({ where: { id, clientId: client.id } })
  revalidatePath('/axe2')
}
