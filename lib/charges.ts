/**
 * Formules de l'axe Chiffres & Administratif.
 *
 * Dans la version Notion, ces six valeurs sont des colonnes de formule que
 * l'utilisatrice recopie a la main. Ici elles sont calculees, et l'interface
 * affiche la formule a cote du chiffre.
 *
 * Montants en CENTIMES, taux en pourcentage (21.2 pour 21,2 %).
 */

export type Taux = {
  socialContributionPct: number
  incomeTaxPct: number
  trainingPct: number
}

/** Total des charges = cotisations + impot + contribution formation. */
export function tauxTotal(t: Taux): number {
  return Math.round((t.socialContributionPct + t.incomeTaxPct + t.trainingPct) * 100) / 100
}

/**
 * CA necessaire = revenu net vise / (1 - taux total).
 * Un taux superieur ou egal a 100 % rendrait l'objectif inatteignable :
 * on renvoie null plutot qu'un infini.
 */
export function caNecessaire(revenuNetVise: number, total: number): number | null {
  if (total >= 100) return null
  return Math.round(revenuNetVise / (1 - total / 100))
}

/** Nombre de clients necessaires = CA necessaire / prix de l'offre, arrondi au superieur. */
export function clientsNecessaires(ca: number | null, prixOffre: number): number | null {
  if (ca === null || prixOffre <= 0) return null
  return Math.ceil(ca / prixOffre)
}

/** Charges estimees a partir du chiffre d'affaires et du taux total. */
export function chargesEstimees(ca: number, total: number): number {
  return Math.round(ca * (total / 100))
}

/** Revenu net = chiffre d'affaires moins charges estimees. */
export function revenuNet(ca: number, total: number): number {
  return ca - chargesEstimees(ca, total)
}

/**
 * Nombre de jours avant une echeance, negatif si elle est depassee.
 *
 * Le calcul se fait en jours calendaires LOCAUX : les deux dates sont ramenees
 * a midi avant comparaison. C'est ce qui donne « aujourd'hui » pour une
 * echeance a 23 h, et ce qui rend le resultat juste au passage a l'heure
 * d'hiver, ou la journee locale dure vingt-cinq heures.
 */
export function joursAvant(echeance: Date, reference: Date = new Date()): number {
  const a = new Date(echeance); a.setHours(12, 0, 0, 0)
  const b = new Date(reference); b.setHours(12, 0, 0, 0)
  return Math.round((a.getTime() - b.getTime()) / 86400000)
}
