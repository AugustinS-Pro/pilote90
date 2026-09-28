/**
 * Lecture d'une facture Factur-X.
 *
 * Une facture Factur-X est un PDF ordinaire, lisible a l'oeil, qui embarque en
 * piece jointe un fichier XML decrivant les memes montants sous forme
 * structuree. C'est ce qui la distingue d'un scan : il n'y a rien a reconnaitre,
 * les chiffres sont ecrits. Aucune reconnaissance de caracteres, donc aucune
 * erreur de lecture a rattraper — ou le montant est la, ou le fichier n'est pas
 * une facture Factur-X, et on le dit.
 *
 * Le calendrier explique l'interet : la reception des factures electroniques est
 * obligatoire depuis le 1er septembre 2026, l'emission pour les TPE et PME au
 * 1er septembre 2027. Le gisement se constitue maintenant chez les clients du
 * cabinet, et c'est la fonction qui supprime la ressaisie pour de bon.
 *
 * Deux etapes separees, testables l'une sans l'autre :
 *
 *   extraireXmlFacturX(pdf)  -> le XML embarque, ou null
 *   lireFacturX(xml)         -> la facture lue, ou la raison du refus
 *
 * Rien n'est ecrit en base ici. La fonction propose une ecriture, le dirigeant
 * la valide : une facture recue n'est pas une depense engagee tant qu'il ne l'a
 * pas dit.
 */

import { inflateSync, inflateRawSync } from 'node:zlib'
import { lireXml, chemin, enfant, texteAu, type Element } from './xml-minimal'

/** Noms de piece jointe normalises par les versions successives du format. */
const NOMS_ATTENDUS = [
  'factur-x.xml',
  'zugferd-invoice.xml',
  'xrechnung.xml',
  'order-x.xml',
]

/**
 * Codes de type de document que l'on sait interpreter.
 *
 * 380 facture, 381 avoir, 384 facture rectificative, 389 autofacturation.
 * Un avoir porte des montants positifs dans le XML : c'est son code de type,
 * pas son signe, qui dit qu'il vient en deduction.
 */
const TYPES_CONNUS: Record<string, { libelle: string; deduction: boolean }> = {
  '380': { libelle: 'Facture', deduction: false },
  '381': { libelle: 'Avoir', deduction: true },
  '384': { libelle: 'Facture rectificative', deduction: false },
  '389': { libelle: 'Autofacturation', deduction: false },
}

export type FactureLue = {
  /** Numero de la facture chez l'emetteur. Sert a ne pas l'importer deux fois. */
  numero: string
  dateEmission: Date
  /** Libelle du type : Facture, Avoir, Facture rectificative. */
  typeDocument: string
  /** Vrai pour un avoir : le montant vient en deduction. */
  deduction: boolean
  vendeur: string | null
  acheteur: string | null
  /** Total hors taxes, en centimes. C'est ce que l'application enregistre. */
  montantHt: number
  /** Total toutes taxes comprises, en centimes. Affiche, pas enregistre. */
  montantTtc: number | null
  devise: string
}

export type LectureFacture =
  | { ok: true; facture: FactureLue }
  | { ok: false; raison: string }

/** Convertit une chaine XML de montant en centimes. */
function centimes(valeur: string | null): number | null {
  if (valeur === null) return null
  const nombre = Number(valeur.replace(',', '.'))
  if (!Number.isFinite(nombre)) return null
  return Math.round(nombre * 100)
}

/**
 * Lit une date CII. Le format 102 (AAAAMMJJ) est celui qu'imposent les profils
 * Factur-X ; la forme ISO est acceptee parce qu'on la rencontre.
 */
function dateCii(brut: string | null): Date | null {
  if (brut === null) return null

  const compact = brut.match(/^(\d{4})(\d{2})(\d{2})$/)
  if (compact) {
    const [, a, m, j] = compact
    const date = new Date(Date.UTC(Number(a), Number(m) - 1, Number(j), 12))
    return Number.isNaN(date.getTime()) ? null : date
  }

  const iso = brut.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    const [, a, m, j] = iso
    const date = new Date(Date.UTC(Number(a), Number(m) - 1, Number(j), 12))
    return Number.isNaN(date.getTime()) ? null : date
  }

  return null
}

/** Nom d'une partie : sa raison sociale, sinon celle de son interlocuteur. */
function nomPartie(partie: Element | null): string | null {
  return texteAu(partie, 'Name') ?? texteAu(partie, 'SpecifiedTradeContact', 'PersonName')
}

/**
 * Lit le XML d'une facture au format CII.
 *
 * Le refus est explicite et nomme le champ manquant : une facture qu'on ne sait
 * pas lire doit dire pourquoi, sinon le dirigeant retourne a la saisie manuelle
 * sans comprendre ce qui a echoue.
 */
export function lireFacturX(source: string): LectureFacture {
  const racine = lireXml(source)
  if (!racine) return { ok: false, raison: 'Le fichier joint n’est pas un XML lisible.' }

  if (racine.nom !== 'CrossIndustryInvoice' && racine.nom !== 'CrossIndustryDocument') {
    return {
      ok: false,
      raison: `Format inattendu : la racine du XML est « ${racine.nom} », une facture Factur-X annonce « CrossIndustryInvoice ».`,
    }
  }

  const entete = enfant(racine, 'ExchangedDocument')
    ?? chemin(racine, 'SpecifiedExchangedDocumentContext')
  const numero = texteAu(entete, 'ID')
  if (!numero) return { ok: false, raison: 'Facture sans numero : rien ne permettrait d’eviter un doublon.' }

  const codeType = texteAu(entete, 'TypeCode') ?? '380'
  const type = TYPES_CONNUS[codeType]
  if (!type) {
    return { ok: false, raison: `Type de document ${codeType} non gere : seules les factures et les avoirs sont lus.` }
  }

  const dateEmission = dateCii(texteAu(entete, 'IssueDateTime', 'DateTimeString'))
  if (!dateEmission) return { ok: false, raison: 'Date d’emission absente ou illisible.' }

  const transaction = enfant(racine, 'SupplyChainTradeTransaction')
  const accord = enfant(transaction, 'ApplicableHeaderTradeAgreement')
  const reglement = enfant(transaction, 'ApplicableHeaderTradeSettlement')

  const totaux = enfant(reglement, 'SpecifiedTradeSettlementHeaderMonetarySummation')
  const montantHt = centimes(texteAu(totaux, 'TaxBasisTotalAmount'))
    ?? centimes(texteAu(totaux, 'LineTotalAmount'))
  if (montantHt === null) {
    return { ok: false, raison: 'Total hors taxes absent : c’est le montant que l’application enregistre.' }
  }

  return {
    ok: true,
    facture: {
      numero,
      dateEmission,
      typeDocument: type.libelle,
      deduction: type.deduction,
      vendeur: nomPartie(enfant(accord, 'SellerTradeParty')),
      acheteur: nomPartie(enfant(accord, 'BuyerTradeParty')),
      montantHt,
      montantTtc: centimes(texteAu(totaux, 'GrandTotalAmount')),
      devise: texteAu(reglement, 'InvoiceCurrencyCode') ?? 'EUR',
    },
  }
}

/**
 * Extrait le XML embarque d'un PDF Factur-X.
 *
 * Le fichier joint est un flux compresse du PDF. On ne construit pas l'arbre
 * complet du document : on parcourt les flux, on tente de les decompresser, et
 * on garde celui qui ressemble a une facture CII. C'est plus robuste qu'une
 * lecture stricte de la table des pieces jointes, que les generateurs de PDF
 * ecrivent de facons variees, et cela suffit parce qu'un PDF de facture ne
 * contient qu'un seul XML de ce genre.
 */
export function extraireXmlFacturX(pdf: Uint8Array): string | null {
  const octets = Buffer.from(pdf)
  if (!octets.subarray(0, 5).toString('latin1').startsWith('%PDF-')) return null

  const brut = octets.toString('latin1')
  const debutFlux = /stream\r?\n?/g
  let trouve: RegExpExecArray | null

  while ((trouve = debutFlux.exec(brut)) !== null) {
    const depart = trouve.index + trouve[0].length
    const fin = brut.indexOf('endstream', depart)
    if (fin === -1) continue

    const flux = octets.subarray(depart, fin)
    const texte = decompresser(flux)
    if (texte === null) continue

    if (texte.includes('CrossIndustryInvoice') || texte.includes('CrossIndustryDocument')) {
      const ouverture = texte.search(/<[A-Za-z_][\w.-]*:?CrossIndustry(Invoice|Document)[\s>]/)
      if (ouverture === -1) continue
      const prologue = texte.lastIndexOf('<?xml', ouverture)
      return texte.slice(prologue === -1 ? ouverture : prologue)
    }
  }

  return null
}

/**
 * Rend le contenu d'un flux en texte, decompresse si besoin.
 *
 * Un flux peut etre compresse (Flate, avec ou sans en-tete zlib) ou non, et son
 * dictionnaire n'est pas toujours fiable sur ce point. On essaie, dans l'ordre,
 * ce qui a une chance de marcher, et on renonce en silence : un flux qu'on ne
 * sait pas lire est un flux qui ne nous concerne pas.
 */
function decompresser(flux: Buffer): string | null {
  // Un XML non compresse se reconnait a l'oeil, inutile de le passer a zlib.
  const tel = flux.subarray(0, 512).toString('latin1')
  if (tel.includes('<?xml') || tel.includes('CrossIndustry')) return flux.toString('utf8')

  for (const tenter of [inflateSync, inflateRawSync]) {
    try {
      return tenter(flux).toString('utf8')
    } catch {
      // flux illisible par cette methode : on passe a la suivante
    }
  }
  return null
}

/** Nom de piece jointe attendu pour une facture Factur-X. Expose pour le test. */
export function estNomDeFactureAttendu(nom: string): boolean {
  return NOMS_ATTENDUS.includes(nom.toLowerCase().trim())
}
