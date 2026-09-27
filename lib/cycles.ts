/**
 * Mesure et comparaison de cycles de 90 jours.
 *
 * Le cycle est la promesse centrale de la methode, et rien ne permettait
 * jusqu'ici de comparer deux cycles : on les lisait l'un apres l'autre sans
 * savoir si le suivant s'etait mieux passe que le precedent.
 *
 * Les mesures ne demandent aucune donnee nouvelle, elles se lisent sur ce que
 * le cycle porte deja : ses priorites, leur avancement, et les semaines dont
 * la revue a ete remplie.
 *
 * Fonctions pures, testables a l'unite.
 */

export type PrioriteMesurable = { progressPct: number; status: string }
export type SemaineMesurable = { review: unknown | null }

export type CycleMesurable = {
  cycleNumber: number
  startDate: Date | string
  endDate: Date | string
  objectives: readonly PrioriteMesurable[]
  weeks: readonly SemaineMesurable[]
}

export type MesuresCycle = {
  priorites: number
  prioritesTerminees: number
  /** Moyenne des avancements, arrondie. 0 sans priorite. */
  progressionMoyenne: number
  semaines: number
  semainesRevues: number
  /** Regularite du suivi : part des semaines dont la revue est remplie. */
  assiduite: number
  jours: number
}

export type Ecart = {
  /** Difference brute, du cycle mesure vers le precedent. */
  delta: number
  sens: 'HAUSSE' | 'BAISSE' | 'STABLE'
}

export type ComparaisonCycles = {
  mesures: MesuresCycle
  precedent: MesuresCycle
  numeroPrecedent: number
  progression: Ecart
  prioritesTerminees: Ecart
  assiduite: Ecart
}

function part(numerateur: number, denominateur: number): number {
  return denominateur > 0 ? Math.round((numerateur / denominateur) * 100) : 0
}

function joursEntre(debut: Date, fin: Date): number {
  const a = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate())
  const b = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate())
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86_400_000))
}

export function mesurerCycle(cycle: CycleMesurable): MesuresCycle {
  const priorites = cycle.objectives.length
  const prioritesTerminees = cycle.objectives.filter((o) => o.status === 'COMPLETED').length
  const semaines = cycle.weeks.length
  const semainesRevues = cycle.weeks.filter((s) => s.review != null).length

  const progressionMoyenne =
    priorites > 0
      ? Math.round(cycle.objectives.reduce((s, o) => s + o.progressPct, 0) / priorites)
      : 0

  return {
    priorites,
    prioritesTerminees,
    progressionMoyenne,
    semaines,
    semainesRevues,
    assiduite: part(semainesRevues, semaines),
    jours: joursEntre(new Date(cycle.startDate), new Date(cycle.endDate)),
  }
}

function ecart(valeur: number, reference: number): Ecart {
  const delta = valeur - reference
  return { delta, sens: delta > 0 ? 'HAUSSE' : delta < 0 ? 'BAISSE' : 'STABLE' }
}

/** `null` quand il n'y a pas de cycle precedent : il n'y a alors rien a comparer. */
export function comparerCycles(
  cycle: CycleMesurable,
  precedent: CycleMesurable | null | undefined,
): ComparaisonCycles | null {
  if (!precedent) return null

  const mesures = mesurerCycle(cycle)
  const mesuresPrecedent = mesurerCycle(precedent)

  return {
    mesures,
    precedent: mesuresPrecedent,
    numeroPrecedent: precedent.cycleNumber,
    progression: ecart(mesures.progressionMoyenne, mesuresPrecedent.progressionMoyenne),
    prioritesTerminees: ecart(mesures.prioritesTerminees, mesuresPrecedent.prioritesTerminees),
    assiduite: ecart(mesures.assiduite, mesuresPrecedent.assiduite),
  }
}

/** Ton d'etiquette : une baisse n'est pas une alerte, c'est une information. */
export const TON_ECART: Record<Ecart['sens'], 'succes' | 'attente' | 'neutre'> = {
  HAUSSE: 'succes',
  BAISSE: 'attente',
  STABLE: 'neutre',
}

/** « + 12 points », « − 2 », « stable ». L'unite depend de ce qu'on compare. */
export function libelleEcart(e: Ecart, unite: 'points' | 'priorites'): string {
  if (e.sens === 'STABLE') return 'stable'
  const signe = e.delta > 0 ? '+' : '−'
  const valeur = Math.abs(e.delta)
  if (unite === 'points') return `${signe} ${valeur} point${valeur > 1 ? 's' : ''}`
  return `${signe} ${valeur} priorité${valeur > 1 ? 's' : ''}`
}
