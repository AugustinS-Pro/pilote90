'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentClient } from '@/lib/session'
import {
  personaInput, offerInput, offerLevelInput,
  crmClientInput, purchaseInput, feedbackInput,
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

function rafraichir() {
  revalidatePath('/axe3')
  revalidatePath('/dashboard')
}

const texte = (v: FormDataEntryValue | null) => {
  const s = typeof v === 'string' ? v.trim() : ''
  return s === '' ? undefined : s
}

// ---------------------------------------------------------------------------
// Persona
// ---------------------------------------------------------------------------

export async function enregistrerPersona(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = personaInput.safeParse({
    name: formData.get('name'),
    dailyLife: texte(formData.get('dailyLife')),
    frustrations: texte(formData.get('frustrations')),
    desires: texte(formData.get('desires')),
    objections: texte(formData.get('objections')),
    transformation: texte(formData.get('transformation')),
    magicSentence: texte(formData.get('magicSentence')),
  })
  if (!parsed.success) {
    return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }
  }

  const id = texte(formData.get('id'))
  const donnees = { ...parsed.data }

  if (id) {
    const maj = await prisma.persona.updateMany({
      where: { id, clientId: client.id },
      data: donnees,
    })
    if (maj.count === 0) return { ok: false, message: 'Persona introuvable.' }
  } else {
    await prisma.persona.create({ data: { clientId: client.id, ...donnees } })
  }

  rafraichir()
  return { ok: true, message: 'Client ideal enregistre.' }
}

export async function supprimerPersona(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.offer.updateMany({ where: { personaId: id, clientId: client.id }, data: { personaId: null } })
  await prisma.persona.deleteMany({ where: { id, clientId: client.id } })
  rafraichir()
}

// ---------------------------------------------------------------------------
// Offres
// ---------------------------------------------------------------------------

export async function creerOffre(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = offerInput.safeParse({
    name: formData.get('name'),
    promise: texte(formData.get('promise')),
    price: formData.get('price'),
    format: formData.get('format'),
    status: formData.get('status'),
    personaId: texte(formData.get('personaId')),
  })
  if (!parsed.success) {
    return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }
  }

  const centimes = eurosVersCentimes(parsed.data.price)
  if (centimes === null) {
    return { ok: false, message: 'Prix invalide.', erreurs: { price: 'Prix invalide' } }
  }

  // Le persona est verifie : on n'accepte pas un identifiant venu du navigateur
  // sans controler qu'il appartient bien au client connecte.
  let personaId: string | null = null
  if (parsed.data.personaId) {
    const persona = await prisma.persona.findFirst({
      where: { id: parsed.data.personaId, clientId: client.id },
      select: { id: true },
    })
    personaId = persona?.id ?? null
  }

  await prisma.offer.create({
    data: {
      clientId: client.id,
      name: parsed.data.name,
      promise: parsed.data.promise ?? null,
      priceHt: centimes,
      format: parsed.data.format,
      status: parsed.data.status,
      personaId,
    },
  })

  rafraichir()
  return { ok: true, message: 'Offre ajoutee au catalogue.' }
}

export async function changerStatutOffre(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  if (!client) return

  const id = String(formData.get('id') ?? '')
  const statut = String(formData.get('status') ?? '')
  const autorises = ['IDEE', 'EN_TEST', 'ACTIF', 'A_AMELIORER', 'ABANDONNE'] as const
  if (!id || !autorises.includes(statut as (typeof autorises)[number])) return

  await prisma.offer.updateMany({
    where: { id, clientId: client.id },
    data: { status: statut as (typeof autorises)[number] },
  })
  rafraichir()
}

export async function supprimerOffre(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.purchase.updateMany({ where: { offerId: id, clientId: client.id }, data: { offerId: null } })
  await prisma.feedback.updateMany({ where: { offerId: id, clientId: client.id }, data: { offerId: null } })
  await prisma.offer.deleteMany({ where: { id, clientId: client.id } })
  rafraichir()
}

// ---------------------------------------------------------------------------
// Architecture de gamme
// ---------------------------------------------------------------------------

export async function creerNiveauOffre(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = offerLevelInput.safeParse({
    level: formData.get('level'),
    offerName: formData.get('offerName'),
    price: texte(formData.get('price')),
    goal: texte(formData.get('goal')),
  })
  if (!parsed.success) {
    return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }
  }

  const position = await prisma.offerLevel.count({ where: { clientId: client.id } })
  await prisma.offerLevel.create({
    data: {
      clientId: client.id,
      level: parsed.data.level,
      offerName: parsed.data.offerName,
      price: parsed.data.price ?? null,
      goal: parsed.data.goal ?? null,
      position,
    },
  })

  rafraichir()
  return { ok: true, message: 'Niveau ajoute.' }
}

export async function supprimerNiveauOffre(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.offerLevel.deleteMany({ where: { id, clientId: client.id } })
  rafraichir()
}

// ---------------------------------------------------------------------------
// Mini-CRM
// ---------------------------------------------------------------------------

export async function enregistrerFicheClient(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = crmClientInput.safeParse({
    companyName: formData.get('companyName'),
    contactName: texte(formData.get('contactName')),
    email: texte(formData.get('email')),
    phone: texte(formData.get('phone')),
    status: formData.get('status'),
    notes: texte(formData.get('notes')),
  })
  if (!parsed.success) {
    return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }
  }

  const id = texte(formData.get('id'))
  const donnees = {
    companyName: parsed.data.companyName,
    contactName: parsed.data.contactName ?? null,
    email: parsed.data.email ?? null,
    phone: parsed.data.phone ?? null,
    status: parsed.data.status,
    notes: parsed.data.notes ?? null,
  }

  if (id) {
    const maj = await prisma.crmClient.updateMany({ where: { id, clientId: client.id }, data: donnees })
    if (maj.count === 0) return { ok: false, message: 'Fiche introuvable.' }
  } else {
    await prisma.crmClient.create({ data: { clientId: client.id, ...donnees } })
  }

  rafraichir()
  return { ok: true, message: 'Fiche client enregistree.' }
}

export async function supprimerFicheClient(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.feedback.updateMany({ where: { crmClientId: id, clientId: client.id }, data: { crmClientId: null } })
  await prisma.crmClient.deleteMany({ where: { id, clientId: client.id } })
  rafraichir()
}

// ---------------------------------------------------------------------------
// Achats et retours clients
// ---------------------------------------------------------------------------

export async function enregistrerAchat(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = purchaseInput.safeParse({
    crmClientId: formData.get('crmClientId'),
    offerId: texte(formData.get('offerId')),
    amount: formData.get('amount'),
    purchasedAt: formData.get('purchasedAt'),
  })
  if (!parsed.success) {
    return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }
  }

  const centimes = eurosVersCentimes(parsed.data.amount)
  if (centimes === null) return { ok: false, message: 'Montant invalide.', erreurs: { amount: 'Montant invalide' } }

  const date = new Date(parsed.data.purchasedAt)
  if (Number.isNaN(date.getTime())) return { ok: false, message: 'Date invalide.' }

  const fiche = await prisma.crmClient.findFirst({
    where: { id: parsed.data.crmClientId, clientId: client.id },
    select: { id: true },
  })
  if (!fiche) return { ok: false, message: 'Client introuvable.' }

  let offerId: string | null = null
  if (parsed.data.offerId) {
    const offre = await prisma.offer.findFirst({
      where: { id: parsed.data.offerId, clientId: client.id },
      select: { id: true },
    })
    offerId = offre?.id ?? null
  }

  await prisma.purchase.create({
    data: { clientId: client.id, crmClientId: fiche.id, offerId, amountHt: centimes, purchasedAt: date },
  })

  rafraichir()
  return { ok: true, message: 'Achat enregistre.' }
}

export async function enregistrerRetour(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree.' }

  const parsed = feedbackInput.safeParse({
    crmClientId: texte(formData.get('crmClientId')),
    offerId: texte(formData.get('offerId')),
    rating: formData.get('rating'),
    comment: texte(formData.get('comment')),
  })
  if (!parsed.success) {
    return { ok: false, message: 'Saisie incomplete.', erreurs: versErreurs(parsed.error) }
  }

  const note = Math.min(5, Math.max(1, Math.round(Number(parsed.data.rating))))
  if (!Number.isFinite(note)) return { ok: false, message: 'Note invalide.' }

  let crmClientId: string | null = null
  if (parsed.data.crmClientId) {
    const fiche = await prisma.crmClient.findFirst({
      where: { id: parsed.data.crmClientId, clientId: client.id },
      select: { id: true },
    })
    crmClientId = fiche?.id ?? null
  }

  let offerId: string | null = null
  if (parsed.data.offerId) {
    const offre = await prisma.offer.findFirst({
      where: { id: parsed.data.offerId, clientId: client.id },
      select: { id: true },
    })
    offerId = offre?.id ?? null
  }

  await prisma.feedback.create({
    data: { clientId: client.id, crmClientId, offerId, rating: note, comment: parsed.data.comment ?? null },
  })

  rafraichir()
  return { ok: true, message: 'Retour enregistre.' }
}

export async function supprimerRetour(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.feedback.deleteMany({ where: { id, clientId: client.id } })
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
export async function modifierOffre(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  const id = String(formData.get('id') ?? '')
  const valeur = String(formData.get('valeur') ?? '').trim()
  if (!client || !id || valeur.length === 0 || valeur.length > 300) return
  await prisma.offer.updateMany({
    where: { id, clientId: client.id },
    data: { name: valeur },
  })
  rafraichir()
}

