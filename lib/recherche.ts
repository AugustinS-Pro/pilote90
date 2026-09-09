/**
 * Comparaison de chaines pour la recherche dans les listes.
 *
 * Volontairement dans `lib/` et non dans `components/ui`, qui porte la
 * directive `'use client'` : une fonction pure appelee depuis un composant
 * serveur ne doit pas vivre dans un module client. Le projet a deja paye cette
 * erreur une fois, avec le formateur d'euros.
 */

/** Sans casse et sans accents : « Lefevre » trouve « Lefèvre ». */
function normaliser(valeur: string): string {
  return valeur.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

/** Le texte contient-il la recherche ? Une recherche vide accepte tout. */
export function contient(texte: string | null | undefined, recherche: string): boolean {
  const cible = normaliser(recherche)
  if (!cible) return true
  return normaliser(texte ?? '').includes(cible)
}

/** Au moins un des champs correspond. */
export function correspond(champs: (string | null | undefined)[], recherche: string): boolean {
  if (!normaliser(recherche)) return true
  return champs.some((c) => contient(c, recherche))
}
