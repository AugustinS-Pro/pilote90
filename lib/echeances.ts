/**
 * Echeances administratives : ce qui arrive, et ce qui est deja passe.
 *
 * Le modele existe depuis le debut et rien n'en prevenait : une echeance
 * saisie dormait dans l'axe 2 jusqu'a ce qu'on aille la relire. Or une
 * echeance fiscale qui passe inapercue est exactement ce que l'outil promet
 * d'eviter.
 *
 * Fonction pure : elle recoit des lignes et une date, elle ne lit rien.
 */

export type Echeance = {
  id: string
  label: string
  dueDate: Date
  done: boolean
}

export type UrgenceEcheance = 'DEPASSEE' | 'AUJOURDHUI' | 'CETTE_SEMAINE' | 'A_VENIR'

export type EcheanceAVenir = Echeance & {
  urgence: UrgenceEcheance
  /** Jours calendaires jusqu'a l'echeance. Negatif si elle est passee. */
  jours: number
  libelle: string
}

/** Au-dela, une echeance n'a pas sa place sur un tableau de bord. */
const HORIZON = 30

function joursEntre(depuis: Date, jusqua: Date): number {
  const a = new Date(depuis.getFullYear(), depuis.getMonth(), depuis.getDate())
  const b = new Date(jusqua.getFullYear(), jusqua.getMonth(), jusqua.getDate())
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

function urgenceDe(jours: number): UrgenceEcheance {
  if (jours < 0) return 'DEPASSEE'
  if (jours === 0) return 'AUJOURDHUI'
  if (jours <= 7) return 'CETTE_SEMAINE'
  return 'A_VENIR'
}

function libelleDe(jours: number): string {
  if (jours < -1) return `En retard de ${-jours} jours`
  if (jours === -1) return 'En retard depuis hier'
  if (jours === 0) return "Aujourd'hui"
  if (jours === 1) return 'Demain'
  return `Dans ${jours} jours`
}

/**
 * Echeances non faites a signaler, de la plus urgente a la plus lointaine.
 *
 * Une echeance depassee reste signalee sans limite de temps : ce n'est pas
 * parce qu'un retard dure qu'il cesse de compter.
 */
export function echeancesASignaler(
  echeances: readonly Echeance[],
  aujourdhui: Date = new Date(),
  horizon: number = HORIZON,
): EcheanceAVenir[] {
  return echeances
    .filter((e) => !e.done)
    .map((e) => {
      const jours = joursEntre(aujourdhui, new Date(e.dueDate))
      return { ...e, jours, urgence: urgenceDe(jours), libelle: libelleDe(jours) }
    })
    .filter((e) => e.jours <= horizon)
    .sort((a, b) => a.jours - b.jours)
}

/** Ton d'etiquette associe, pour ne pas repeter la correspondance dans les pages. */
export const TON_ECHEANCE: Record<UrgenceEcheance, 'alerte' | 'attente' | 'neutre'> = {
  DEPASSEE: 'alerte',
  AUJOURDHUI: 'alerte',
  CETTE_SEMAINE: 'attente',
  A_VENIR: 'neutre',
}
