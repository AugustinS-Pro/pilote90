/**
 * Progression d'une priorite de cycle.
 *
 * Une priorite qui porte des taches n'a pas de progression saisissable : sa
 * valeur se deduit de ses taches. La regle manquait, et deux ecritures
 * visaient le meme champ sans arbitrage - le curseur de l'axe 1 et le recalcul
 * de l'axe 5. La derniere ecriture gagnait.
 *
 * Fonctions pures, testables a l'unite.
 */

export type TacheRattachee = { done: boolean }

/** Pourcentage deduit des taches, arrondi. `null` sans tache : rien a deduire. */
export function progressionDeduite(taches: readonly TacheRattachee[]): number | null {
  if (taches.length === 0) return null
  const faites = taches.filter((t) => t.done).length
  return Math.round((faites / taches.length) * 100)
}

/** La saisie manuelle reste ouverte tant qu'aucune tache n'est rattachee. */
export function progressionEstSaisissable(nombreDeTaches: number): boolean {
  return nombreDeTaches === 0
}

/** Seul 100 % conclut une priorite. */
export function statutDeduit(pourcentage: number): 'COMPLETED' | 'IN_PROGRESS' {
  return pourcentage === 100 ? 'COMPLETED' : 'IN_PROGRESS'
}
