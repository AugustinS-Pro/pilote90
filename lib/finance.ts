import { euros } from '@/lib/format'
/**
 * Calculs financiers du module Audit & Previsionnel.
 *
 * Regle du projet : rien de ce qui se calcule n'est stocke.
 * Chaque fonction porte sa formule en commentaire, et l'interface affiche
 * cette formule a cote du chiffre : un dirigeant doit pouvoir comprendre
 * d'ou sort un nombre pour lui accorder sa confiance.
 *
 * Tous les montants circulent en CENTIMES.
 */

export type LigneTransaction = {
  type: 'REVENUE' | 'EXPENSE'
  amountHt: number
  transactionDate: Date
}

const MOIS_COURTS = [
  'janv.', 'fevr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'aout', 'sept.', 'oct.', 'nov.', 'dec.',
]

function memeMois(d: Date, reference: Date): boolean {
  return d.getMonth() === reference.getMonth() && d.getFullYear() === reference.getFullYear()
}

function somme(lignes: LigneTransaction[], type: 'REVENUE' | 'EXPENSE'): number {
  return lignes.filter((t) => t.type === type).reduce((s, t) => s + t.amountHt, 0)
}

// ---------------------------------------------------------------------------
// Les quatre indicateurs cles
// ---------------------------------------------------------------------------

export type Indicateurs = {
  /** Solde de tout l'historique : encaissements moins decaissements. */
  tresorerie: number
  /** Revenus rattaches au mois en cours. */
  caDuMois: number
  /** Charges rattachees au mois en cours. */
  chargesDuMois: number
  /** CA du mois moins charges du mois. */
  resultatNet: number
  /** Charges rapportees au CA, en pourcentage entier. 0 si le CA est nul. */
  ratioCharges: number
  /** Avancement vers l'objectif de CA mensuel du cycle, en pourcentage. */
  progressionObjectif: number
}

export function calculerIndicateurs(
  transactions: LigneTransaction[],
  objectifCaMensuel: number,
  aujourdhui: Date = new Date(),
): Indicateurs {
  const duMois = transactions.filter((t) => memeMois(new Date(t.transactionDate), aujourdhui))

  const caDuMois = somme(duMois, 'REVENUE')
  const chargesDuMois = somme(duMois, 'EXPENSE')

  // Tresorerie = tout l'encaisse moins tout le decaisse depuis le debut.
  const tresorerie = somme(transactions, 'REVENUE') - somme(transactions, 'EXPENSE')

  return {
    tresorerie,
    caDuMois,
    chargesDuMois,
    resultatNet: caDuMois - chargesDuMois,
    ratioCharges: caDuMois > 0 ? Math.round((chargesDuMois / caDuMois) * 100) : 0,
    progressionObjectif:
      objectifCaMensuel > 0 ? Math.round((caDuMois / objectifCaMensuel) * 100) : 0,
  }
}

// ---------------------------------------------------------------------------
// Serie CA vs charges sur douze mois glissants
// ---------------------------------------------------------------------------

export type PointMensuel = {
  mois: string
  cle: string
  ca: number
  charges: number
  net: number
}

/** Douze mois glissants, du plus ancien au mois en cours. Montants en euros. */
export function serieDouzeMois(
  transactions: LigneTransaction[],
  aujourdhui: Date = new Date(),
): PointMensuel[] {
  const points: PointMensuel[] = []

  for (let recul = 11; recul >= 0; recul--) {
    const curseur = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth() - recul, 1)
    const duMois = transactions.filter((t) => memeMois(new Date(t.transactionDate), curseur))

    const ca = somme(duMois, 'REVENUE') / 100
    const charges = somme(duMois, 'EXPENSE') / 100

    points.push({
      mois: MOIS_COURTS[curseur.getMonth()],
      cle: `${curseur.getFullYear()}-${String(curseur.getMonth() + 1).padStart(2, '0')}`,
      ca: Math.round(ca),
      charges: Math.round(charges),
      net: Math.round(ca - charges),
    })
  }

  return points
}

// ---------------------------------------------------------------------------
// Previsionnel a six mois, trois scenarios
// ---------------------------------------------------------------------------

export type Scenario = 'pessimiste' | 'realiste' | 'optimiste'

export type PointPrevisionnel = {
  mois: string
  pessimiste: number
  realiste: number
  optimiste: number
}

export type Previsionnel = {
  points: PointPrevisionnel[]
  /** Cumul du CA projete sur six mois, par scenario, en euros. */
  totaux: Record<Scenario, number>
  /** Base de calcul : moyenne mensuelle observee, en euros. */
  baseCa: number
  baseCharges: number
}

/**
 * Deux parametres varient d'un scenario a l'autre : le rythme d'encaissement
 * et l'evolution des charges. Le dirigeant ne lit pas une prevision figee,
 * il lit une fourchette de possibles.
 *
 *   pessimiste : encaissements -15 %, charges +5 % par mois
 *   realiste   : encaissements stables, charges stables
 *   optimiste  : encaissements +12 %, charges +2 % par mois
 */
const PARAMETRES: Record<Scenario, { ca: number; charges: number }> = {
  pessimiste: { ca: -0.15, charges: 0.05 },
  realiste: { ca: 0, charges: 0 },
  optimiste: { ca: 0.12, charges: 0.02 },
}

export function calculerPrevisionnel(
  transactions: LigneTransaction[],
  aujourdhui: Date = new Date(),
): Previsionnel {
  const historique = serieDouzeMois(transactions, aujourdhui)
  const moisActifs = historique.filter((p) => p.ca > 0 || p.charges > 0)
  const diviseur = moisActifs.length || 1

  const baseCa = Math.round(moisActifs.reduce((s, p) => s + p.ca, 0) / diviseur)
  const baseCharges = Math.round(moisActifs.reduce((s, p) => s + p.charges, 0) / diviseur)

  const points: PointPrevisionnel[] = []
  const totaux: Record<Scenario, number> = { pessimiste: 0, realiste: 0, optimiste: 0 }

  for (let m = 1; m <= 6; m++) {
    const curseur = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth() + m, 1)
    const point: PointPrevisionnel = {
      mois: MOIS_COURTS[curseur.getMonth()],
      pessimiste: 0,
      realiste: 0,
      optimiste: 0,
    }

    for (const scenario of Object.keys(PARAMETRES) as Scenario[]) {
      const p = PARAMETRES[scenario]
      const ca = baseCa * Math.pow(1 + p.ca, m)
      const charges = baseCharges * Math.pow(1 + p.charges, m)
      const net = Math.round(ca - charges)
      point[scenario] = net
      totaux[scenario] += net
    }

    points.push(point)
  }

  return {
    points,
    totaux: {
      pessimiste: Math.round(totaux.pessimiste),
      realiste: Math.round(totaux.realiste),
      optimiste: Math.round(totaux.optimiste),
    },
    baseCa,
    baseCharges,
  }
}

// ---------------------------------------------------------------------------
// Audit financier automatique
// ---------------------------------------------------------------------------

export type NiveauAudit = 'ALERTE' | 'ATTENTION' | 'ANALYSE'

export type ConstatAudit = {
  niveau: NiveauAudit
  titre: string
  valeur: string
  /** La regle qui a declenche ce constat, affichee telle quelle a l'ecran. */
  regle: string
}

/**
 * Chaque constat nomme sa regle. Un audit qui ne dit pas pourquoi il alerte
 * n'est pas un outil d'aide a la decision, c'est un bandeau de couleur.
 */
export function auditerFinances(
  indicateurs: Indicateurs,
  previsionnel: Previsionnel,
  nombreTransactions: number,
): ConstatAudit[] {
  const constats: ConstatAudit[] = []

  if (indicateurs.tresorerie < 0) {
    constats.push({
      niveau: 'ALERTE',
      titre: 'Tresorerie negative',
      valeur: euros(indicateurs.tresorerie),
      regle: 'Se declenche des que le solde encaissements moins decaissements passe sous zero.',
    })
  }

  if (indicateurs.ratioCharges > 40) {
    constats.push({
      niveau: indicateurs.ratioCharges > 60 ? 'ALERTE' : 'ATTENTION',
      titre: 'Ratio charges sur chiffre d affaires eleve',
      valeur: `${indicateurs.ratioCharges} %`,
      regle: 'Attention au-dela de 40 %, alerte au-dela de 60 %.',
    })
  }

  if (indicateurs.resultatNet < 0) {
    constats.push({
      niveau: 'ALERTE',
      titre: 'Resultat net negatif sur le mois',
      valeur: euros(indicateurs.resultatNet),
      regle: 'Se declenche lorsque les charges du mois depassent les revenus du mois.',
    })
  }

  if (indicateurs.progressionObjectif > 0 && indicateurs.progressionObjectif < 50) {
    constats.push({
      niveau: 'ATTENTION',
      titre: 'Objectif de chiffre d affaires mensuel loin d etre atteint',
      valeur: `${indicateurs.progressionObjectif} % de l objectif`,
      regle: 'Attention en dessous de 50 % de l objectif mensuel du cycle en cours.',
    })
  }

  if (previsionnel.totaux.pessimiste < 0) {
    constats.push({
      niveau: 'ATTENTION',
      titre: 'Le scenario pessimiste passe en negatif sur six mois',
      valeur: `${previsionnel.totaux.pessimiste.toLocaleString('fr-FR')} €`,
      regle: 'Projection a six mois avec encaissements en baisse de 15 % et charges en hausse de 5 % par mois.',
    })
  }

  if (nombreTransactions < 5) {
    constats.push({
      niveau: 'ANALYSE',
      titre: 'Historique encore court',
      valeur: `${nombreTransactions} transaction${nombreTransactions > 1 ? 's' : ''}`,
      regle: 'En dessous de cinq transactions, les projections restent indicatives.',
    })
  }

  if (indicateurs.ratioCharges > 0 && indicateurs.ratioCharges <= 40) {
    constats.push({
      niveau: 'ANALYSE',
      titre: 'Structure de charges saine',
      valeur: `${indicateurs.ratioCharges} % du chiffre d affaires`,
      regle: 'Un ratio de charges inferieur ou egal a 40 % est considere comme sain.',
    })
  }

  const ordre: Record<NiveauAudit, number> = { ALERTE: 0, ATTENTION: 1, ANALYSE: 2 }
  return constats.sort((a, b) => ordre[a.niveau] - ordre[b.niveau])
}

/** Message de bandeau, deduit du constat le plus grave. */
export function messageDeSituation(constats: ConstatAudit[]): {
  ton: NiveauAudit | 'SAIN'
  texte: string
} {
  if (constats.some((c) => c.niveau === 'ALERTE')) {
    return { ton: 'ALERTE', texte: 'Votre situation financiere demande une action rapide' }
  }
  if (constats.some((c) => c.niveau === 'ATTENTION')) {
    return { ton: 'ATTENTION', texte: 'Votre situation financiere est a surveiller' }
  }
  return { ton: 'SAIN', texte: 'Votre tresorerie est saine' }
}
