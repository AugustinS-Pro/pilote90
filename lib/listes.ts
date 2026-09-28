/**
 * Listes de valeurs utilisees a la fois par des composants serveur et des
 * composants client. Ce fichier ne porte PAS 'use client' : les exports d'un
 * module client deviennent des references cote serveur et ne peuvent pas y
 * etre parcourus.
 */

export type Option = { valeur: string; libelle: string }

export const CATEGORIES_DECISION: Option[] = [
  { valeur: 'STRATEGIE', libelle: 'Stratégie' },
  { valeur: 'OFFRE', libelle: 'Offre' },
  { valeur: 'FINANCE', libelle: 'Finance' },
  { valeur: 'COMMUNICATION', libelle: 'Communication' },
  { valeur: 'ORGANISATION', libelle: 'Organisation' },
  { valeur: 'AUTRE', libelle: 'Autre' },
]

export const TYPES_RESSOURCE: Option[] = [
  { valeur: 'COURS', libelle: 'Cours' },
  { valeur: 'GUIDE', libelle: 'Guide' },
  { valeur: 'RITUEL', libelle: 'Rituel' },
  { valeur: 'MODELE', libelle: 'Modèle de cycle' },
  { valeur: 'LIEN', libelle: 'Lien' },
]

/**
 * Axes auxquels une ressource peut servir de cours. La valeur vide laisse la
 * ressource dans la bibliotheque sans la rattacher a un axe : c'est le cas le
 * plus courant, donc le premier de la liste.
 */
export const AXES_RESSOURCE: Option[] = [
  { valeur: '', libelle: 'Aucun — ressource de bibliothèque' },
  { valeur: 'VISION', libelle: 'Cours de l’axe Vision CEO' },
  { valeur: 'CHIFFRES', libelle: 'Cours de l’axe Chiffres & Admin' },
  { valeur: 'OFFRES', libelle: 'Cours de l’axe Offres & Clients' },
  { valeur: 'COMMUNICATION', libelle: 'Cours de l’axe Com & Ventes' },
  { valeur: 'PILOTAGE', libelle: 'Cours de l’axe Pilotage 90 jours' },
]

export const libelleDe = (liste: Option[], valeur: string): string =>
  liste.find((o) => o.valeur === valeur)?.libelle ?? valeur
