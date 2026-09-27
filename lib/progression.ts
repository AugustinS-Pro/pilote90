/**
 * Progression d'une priorite de cycle.
 *
 * Regle : une priorite qui porte des taches n'a PAS de progression saisissable.
 * Sa valeur se deduit de ses taches, et rien d'autre ne l'ecrit.
 *
 * Cette regle manquait. Son absence laissait deux ecritures concurrentes sur le
 * meme champ `Objective.progressPct` : un curseur dans l'axe 1 (`majPriorite`)
 * et un recalcul dans l'axe 5 (`basculerTache`). Aucune des deux n'etait
 * prioritaire, il n'y avait ni horodatage ni arbitrage : la derniere ecriture
 * gagnait. Defaut identifie en preparant la soutenance du 25 septembre 2026.
 *
 * Fonctions pures, sans acces base : elles se testent a l'unite et s'importent
 * aussi bien dans une Server Action que dans un composant.
 */

/** Ce dont le calcul a besoin : l'etat d'achevement, rien de plus. */
export type TacheRattachee = { done: boolean }

/**
 * Pourcentage deduit des taches rattachees, arrondi a l'entier.
 * `null` quand aucune tache n'est rattachee : il n'y a alors rien a deduire,
 * et c'est ce cas - et lui seul - qui autorise une saisie manuelle.
 */
export function progressionDeduite(taches: readonly TacheRattachee[]): number | null {
  if (taches.length === 0) return null
  const faites = taches.filter((t) => t.done).length
  return Math.round((faites / taches.length) * 100)
}

/** Une progression est saisissable a la main tant qu'aucune tache n'est rattachee. */
export function progressionEstSaisissable(nombreDeTaches: number): boolean {
  return nombreDeTaches === 0
}

/** Statut deduit d'une progression : seul 100 % conclut une priorite. */
export function statutDeduit(pourcentage: number): 'COMPLETED' | 'IN_PROGRESS' {
  return pourcentage === 100 ? 'COMPLETED' : 'IN_PROGRESS'
}
