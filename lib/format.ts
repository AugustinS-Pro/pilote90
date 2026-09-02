/**
 * Formatage partage entre composants serveur et composants client.
 * Ce fichier ne porte PAS la directive 'use client' : c'est ce qui permet
 * a une page serveur d'appeler ces fonctions directement.
 */

/** Les montants circulent en centimes ; on ne divise qu'a l'affichage. */
export function euros(centimes: number, decimales = 0): string {
  return `${(centimes / 100).toLocaleString('fr-FR', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })} €`
}

export function dateCourte(valeur: Date | string): string {
  return new Date(valeur).toLocaleDateString('fr-FR')
}
