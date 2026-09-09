/**
 * Listes de valeurs utilisees a la fois par des composants serveur et des
 * composants client. Ce fichier ne porte PAS 'use client' : les exports d'un
 * module client deviennent des references cote serveur et ne peuvent pas y
 * etre parcourus.
 */

export type Option = { valeur: string; libelle: string }

export const CATEGORIES_DECISION: Option[] = [
  { valeur: 'STRATEGIE', libelle: 'Strategie' },
  { valeur: 'OFFRE', libelle: 'Offre' },
  { valeur: 'FINANCE', libelle: 'Finance' },
  { valeur: 'COMMUNICATION', libelle: 'Communication' },
  { valeur: 'ORGANISATION', libelle: 'Organisation' },
  { valeur: 'AUTRE', libelle: 'Autre' },
]

export const TYPES_RESSOURCE: Option[] = [
  { valeur: 'GUIDE', libelle: 'Guide' },
  { valeur: 'RITUEL', libelle: 'Rituel' },
  { valeur: 'MODELE', libelle: 'Modele de cycle' },
  { valeur: 'LIEN', libelle: 'Lien' },
]

export const libelleDe = (liste: Option[], valeur: string): string =>
  liste.find((o) => o.valeur === valeur)?.libelle ?? valeur
