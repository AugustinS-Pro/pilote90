'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentClientAutorise } from '@/lib/session'
import type { Acces } from '@/lib/habilitations'
import { transactionInput, eurosVersCentimes } from '@/lib/validation'
import { lireTransactionsCsv } from '@/lib/import-transactions'
import { extraireXmlFacturX, lireFacturX, type FactureLue } from '@/lib/factur-x'

/**
 * Acces requis pour ecrire dans cet axe. La page fait la meme verification,
 * mais une Server Action s'appelle aussi sans passer par la page.
 */
const ACCES_REQUIS: readonly Acces[] = ['AXE_CHIFFRES']

/**
 * Les transactions font exception : la page d'audit reutilise leur saisie, et
 * un compte en formule Accompagnement doit pouvoir y ecrire sans avoir l'axe 2.
 */
const ACCES_TRANSACTIONS: readonly Acces[] = ['AXE_CHIFFRES', 'AUDIT_PERSONNEL']

export type EtatAction = {
  ok: boolean
  message?: string
  erreurs?: Record<string, string>
}

/**
 * Facture lue, presentee au dirigeant avant tout enregistrement.
 *
 * Les montants sont en centimes, la date en ISO : c'est ce qui repart dans le
 * formulaire de confirmation, donc ce qui doit traverser une frontiere reseau
 * sans se faire reinterpreter au passage.
 */
export type FactureProposee = {
  numero: string
  dateEmission: string
  typeDocument: string
  deduction: boolean
  vendeur: string | null
  acheteur: string | null
  montantHt: number
  montantTtc: number | null
  devise: string
}

export type EtatFacture = {
  ok: boolean
  message?: string
  /** Presente quand la lecture a abouti et attend une validation. */
  facture?: FactureProposee
}

/** Cree une transaction pour le client connecte. */
export async function creerTransaction(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClientAutorise(ACCES_TRANSACTIONS)
  if (!client) return { ok: false, message: 'Session expirée ou compte non client.' }

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
    message:
      parsed.data.type === 'REVENUE'
        ? 'Revenu ajouté au tableau des revenus.'
        : 'Charge ajoutée au tableau des charges.',
  }
}

/** Supprime une transaction, apres verification qu'elle appartient bien au client connecte. */
export async function supprimerTransaction(formData: FormData): Promise<void> {
  const client = await getCurrentClientAutorise(ACCES_TRANSACTIONS)
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
  const client = await getCurrentClientAutorise(ACCES_REQUIS)
  if (!client) return { ok: false, message: 'Session expirée.' }

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
  return { ok: true, message: 'Structure enregistrée.' }
}

export async function enregistrerTaux(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClientAutorise(ACCES_REQUIS)
  if (!client) return { ok: false, message: 'Session expirée.' }

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
  return { ok: true, message: 'Taux enregistrés. Le total est recalculé.' }
}

export async function enregistrerObjectifRevenu(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClientAutorise(ACCES_REQUIS)
  if (!client) return { ok: false, message: 'Session expirée.' }

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
  return { ok: true, message: 'Objectif enregistré.' }
}

export async function supprimerObjectifRevenu(formData: FormData): Promise<void> {
  const client = await getCurrentClientAutorise(ACCES_REQUIS)
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.revenueGoal.deleteMany({ where: { id, clientId: client.id } })
  revalidatePath('/axe2')
}

export async function creerEcheance(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClientAutorise(ACCES_REQUIS)
  if (!client) return { ok: false, message: 'Session expirée.' }

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
  return { ok: true, message: 'Échéance ajoutée.' }
}

export async function basculerEcheance(formData: FormData): Promise<void> {
  const client = await getCurrentClientAutorise(ACCES_REQUIS)
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
  const client = await getCurrentClientAutorise(ACCES_REQUIS)
  const id = String(formData.get('id') ?? '')
  if (!client || !id) return
  await prisma.adminDeadline.deleteMany({ where: { id, clientId: client.id } })
  revalidatePath('/axe2')
}

/**
 * Modification en place de l intitule.
 *
 * Meme cloisonnement que la suppression : le `clientId` de la session entre
 * dans le WHERE, donc un identifiant qui ne serait pas du client connecte ne
 * met simplement rien a jour. La valeur vide est refusee plutot que d effacer
 * l intitule.
 */
export async function modifierEcheance(formData: FormData): Promise<void> {
  const client = await getCurrentClientAutorise(ACCES_REQUIS)
  const id = String(formData.get('id') ?? '')
  const valeur = String(formData.get('valeur') ?? '').trim()
  if (!client || !id || valeur.length === 0 || valeur.length > 300) return
  await prisma.adminDeadline.updateMany({
    where: { id, clientId: client.id },
    data: { label: valeur },
  })
  revalidatePath('/axe2')
}

/**
 * Modification d'une transaction deja enregistree.
 *
 * Une transaction porte un montant, une date et une categorie : contrairement
 * aux entites dont on ne corrige que l'intitule, elle demande un vrai
 * formulaire. C'est aussi le cas de correction le plus frequent, un montant
 * mal saisi se remarquant plus vite qu'un titre approximatif.
 *
 * Le cloisonnement passe par le WHERE, comme la suppression : un identifiant
 * qui n'appartient pas au client connecte ne met simplement rien a jour, et la
 * fonction repond la meme chose que si la transaction n'existait pas.
 */
export async function modifierTransaction(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClientAutorise(ACCES_TRANSACTIONS)
  if (!client) return { ok: false, message: 'Session expirée ou compte non client.' }

  const id = String(formData.get('id') ?? '')
  if (!id) return { ok: false, message: 'Transaction introuvable.' }

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

  const { count } = await prisma.transaction.updateMany({
    where: { id, clientId: client.id },
    data: {
      type: parsed.data.type,
      amountHt: centimes,
      transactionDate: date,
      label: parsed.data.label,
      category: parsed.data.category || null,
    },
  })

  if (count === 0) return { ok: false, message: 'Transaction introuvable.' }

  revalidatePath('/axe2')
  revalidatePath('/audit')
  revalidatePath('/dashboard')
  revalidatePath('/historique')

  return { ok: true, message: 'Transaction modifiée.' }
}

/** Taille au-dela de laquelle on refuse sans lire : un CSV d'ecritures est petit. */
const TAILLE_MAX_IMPORT = 2 * 1024 * 1024

/**
 * Importe des transactions depuis un fichier CSV au format de l'export.
 *
 * Le fichier n'est pas conserve : il est lu, ecrit en base, puis oublie.
 * Les lignes illisibles sont comptees et rapportees, les autres passent.
 */
export async function importerTransactions(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClientAutorise(ACCES_TRANSACTIONS)
  if (!client) return { ok: false, message: 'Session expirée ou compte non client.' }

  const fichier = formData.get('fichier')
  if (!(fichier instanceof File) || fichier.size === 0) {
    return { ok: false, message: 'Choisissez un fichier CSV.' }
  }
  if (fichier.size > TAILLE_MAX_IMPORT) {
    return { ok: false, message: 'Fichier trop volumineux, 2 Mo au maximum.' }
  }

  const lecture = lireTransactionsCsv(await fichier.text())

  if (lecture.enteteIntrouvable) {
    return {
      ok: false,
      message:
        'Entête introuvable. Le fichier doit porter les colonnes Date, Type, Libellé, Catégorie, Montant — celles de l’export.',
    }
  }
  if (lecture.transactions.length === 0) {
    return { ok: false, message: 'Aucune ligne exploitable dans ce fichier.' }
  }

  await prisma.transaction.createMany({
    data: lecture.transactions.map((t) => ({ ...t, clientId: client.id })),
  })

  revalidatePath('/axe2')
  revalidatePath('/audit')
  revalidatePath('/dashboard')

  const importees = lecture.transactions.length
  const refusees = lecture.refusees.length
  return {
    ok: true,
    message:
      refusees === 0
        ? `${importees} écriture${importees > 1 ? 's' : ''} importée${importees > 1 ? 's' : ''}.`
        : `${importees} écriture${importees > 1 ? 's' : ''} importée${importees > 1 ? 's' : ''}, ${refusees} ligne${refusees > 1 ? 's' : ''} ignorée${refusees > 1 ? 's' : ''} : ${lecture.refusees
            .slice(0, 3)
            .map((r) => `ligne ${r.ligne}, ${r.raison.toLowerCase()}`)
            .join(' ; ')}${refusees > 3 ? '…' : ''}`,
  }
}

/** Taille au-dela de laquelle on refuse une facture sans la lire. */
const TAILLE_MAX_FACTURE = 8 * 1024 * 1024

function versProposee(facture: FactureLue): FactureProposee {
  return {
    numero: facture.numero,
    dateEmission: facture.dateEmission.toISOString(),
    typeDocument: facture.typeDocument,
    deduction: facture.deduction,
    vendeur: facture.vendeur,
    acheteur: facture.acheteur,
    montantHt: facture.montantHt,
    montantTtc: facture.montantTtc,
    devise: facture.devise,
  }
}

/**
 * Lit une facture Factur-X et propose l'ecriture correspondante.
 *
 * Rien n'est enregistre a cette etape, et c'est le point de la fonction. Une
 * facture recue n'est pas une depense engagee : le dirigeant voit ce que
 * l'application a lu, le corrige s'il le faut, et decide. La promesse du produit
 * est de supprimer la ressaisie, pas le jugement.
 *
 * Le PDF n'est pas conserve : il est lu, puis oublie. Ce qui reste en base est
 * l'ecriture et le numero de la facture, de quoi refuser un second import.
 */
export async function lireFactureRecue(
  _precedent: EtatFacture,
  formData: FormData,
): Promise<EtatFacture> {
  const client = await getCurrentClientAutorise(ACCES_TRANSACTIONS)
  if (!client) return { ok: false, message: 'Session expirée ou compte non client.' }

  const fichier = formData.get('fichier')
  if (!(fichier instanceof File) || fichier.size === 0) {
    return { ok: false, message: 'Choisissez une facture au format PDF.' }
  }
  if (fichier.size > TAILLE_MAX_FACTURE) {
    return { ok: false, message: 'Fichier trop volumineux, 8 Mo au maximum.' }
  }

  const xml = extraireXmlFacturX(new Uint8Array(await fichier.arrayBuffer()))
  if (xml === null) {
    return {
      ok: false,
      message:
        'Aucune donnée structurée dans ce PDF. Une facture Factur-X embarque un fichier de données ; un PDF imprimé ou scanné n’en a pas, et se saisit à la main.',
    }
  }

  const lecture = lireFacturX(xml)
  if (!lecture.ok) return { ok: false, message: lecture.raison }

  // Un numero deja connu : on le dit avant que le dirigeant ne valide, plutot
  // que de le laisser buter sur le refus de la base.
  const deja = await prisma.transaction.findFirst({
    where: { clientId: client.id, sourceRef: lecture.facture.numero },
    select: { transactionDate: true },
  })
  if (deja) {
    const jour = deja.transactionDate.toLocaleDateString('fr-FR')
    return {
      ok: false,
      message: `La facture ${lecture.facture.numero} est déjà enregistrée (écriture du ${jour}).`,
    }
  }

  return { ok: true, facture: versProposee(lecture.facture) }
}

/**
 * Enregistre l'ecriture proposee, apres validation du dirigeant.
 *
 * Le sens (depense ou revenu) vient du formulaire, pas du document : une facture
 * lue peut aussi bien etre une charge recue qu'une vente emise, et le fichier ne
 * dit pas lequel des deux noms est celui du dirigeant. Un avoir inverse le sens
 * retenu, puisqu'il vient en deduction.
 */
export async function enregistrerFactureLue(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClientAutorise(ACCES_TRANSACTIONS)
  if (!client) return { ok: false, message: 'Session expirée ou compte non client.' }

  const numero = String(formData.get('numero') ?? '').trim()
  const libelle = String(formData.get('label') ?? '').trim()
  const sens = formData.get('type') === 'REVENUE' ? 'REVENUE' : 'EXPENSE'
  const deduction = formData.get('deduction') === 'oui'
  const centimes = Number(formData.get('montantHt'))
  const date = new Date(String(formData.get('dateEmission') ?? ''))

  if (numero.length === 0 || libelle.length === 0) {
    return { ok: false, message: 'Numéro ou libellé manquant : relancez la lecture.' }
  }
  if (!Number.isInteger(centimes) || centimes <= 0) {
    return { ok: false, message: 'Montant illisible : relancez la lecture.' }
  }
  if (Number.isNaN(date.getTime())) {
    return { ok: false, message: 'Date illisible : relancez la lecture.' }
  }

  // Un avoir vient en deduction : une charge qui s'annule, une vente qui se
  // rembourse. Le sens s'inverse, le montant reste positif.
  const type = deduction ? (sens === 'EXPENSE' ? 'REVENUE' : 'EXPENSE') : sens

  try {
    await prisma.transaction.create({
      data: {
        clientId: client.id,
        type,
        amountHt: centimes,
        transactionDate: date,
        label: libelle,
        category: 'Facture lue',
        sourceRef: numero,
      },
    })
  } catch {
    // L'unicite en base est le dernier filet : deux envois simultanes de la
    // meme facture ne passent pas le controle applicatif, mais pas la base.
    return { ok: false, message: `La facture ${numero} est déjà enregistrée.` }
  }

  revalidatePath('/axe2')
  revalidatePath('/audit')
  revalidatePath('/dashboard')

  return { ok: true, message: `Facture ${numero} enregistrée.` }
}
