/**
 * Fraicheur d'un dossier client.
 *
 * Un client qui ne saisit plus est un client qui va resilier. C'est
 * l'information la plus predictive d'un portefeuille d'accompagnement, et
 * elle ne demande aucune donnee nouvelle : la date de creation des ecritures
 * dit deja quand le dossier a vecu pour la derniere fois.
 *
 * Attention a ne pas confondre `transactionDate`, qui est la date de
 * l'operation et que le client choisit librement, avec `createdAt`, qui est la
 * date de la SAISIE. Seule la seconde mesure une activite : on peut saisir
 * aujourd'hui une facture du mois dernier.
 *
 * Fonction pure, testable a l'unite.
 */

export type Saisie = { createdAt: Date }

export type NiveauFraicheur = 'ACTIF' | 'A_RELANCER' | 'DECROCHE' | 'JAMAIS'

export type Fraicheur = {
  niveau: NiveauFraicheur
  /** Jours calendaires depuis la derniere saisie. `null` si aucune saisie. */
  jours: number | null
  derniere: Date | null
  libelle: string
}

/** Seuils, en jours. Un cycle Pilote90 dure 90 jours, une revue est hebdomadaire. */
const A_RELANCER = 21
const DECROCHE = 45

/** Ecart en jours calendaires locaux, insensible a l'heure et au changement d'heure. */
function joursEntre(depuis: Date, jusqua: Date): number {
  const a = new Date(depuis.getFullYear(), depuis.getMonth(), depuis.getDate())
  const b = new Date(jusqua.getFullYear(), jusqua.getMonth(), jusqua.getDate())
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

export function evaluerFraicheur(
  saisies: Saisie[],
  aujourdhui: Date = new Date(),
): Fraicheur {
  if (saisies.length === 0) {
    return {
      niveau: 'JAMAIS',
      jours: null,
      derniere: null,
      libelle: 'Aucune saisie',
    }
  }

  const derniere = saisies.reduce(
    (recente, s) => (new Date(s.createdAt) > recente ? new Date(s.createdAt) : recente),
    new Date(saisies[0].createdAt),
  )

  const jours = Math.max(0, joursEntre(derniere, aujourdhui))

  const niveau: NiveauFraicheur =
    jours >= DECROCHE ? 'DECROCHE' : jours >= A_RELANCER ? 'A_RELANCER' : 'ACTIF'

  const libelle =
    jours === 0 ? "Saisie aujourd'hui"
    : jours === 1 ? 'Saisie hier'
    : `Derniere saisie il y a ${jours} jours`

  return { niveau, jours, derniere, libelle }
}

/** Ton d'etiquette associe, pour ne pas repeter la correspondance dans les pages. */
export const TON_FRAICHEUR: Record<NiveauFraicheur, 'succes' | 'attente' | 'alerte' | 'neutre'> = {
  ACTIF: 'succes',
  A_RELANCER: 'attente',
  DECROCHE: 'alerte',
  JAMAIS: 'neutre',
}
