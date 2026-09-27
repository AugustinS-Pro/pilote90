/**
 * Les plafonds de l'application, ecrits une seule fois.
 *
 * Trois priorites par cycle et cinq thematiques par client sont des regles du
 * cahier des charges, reprises dans le dossier professionnel et affichees a
 * l'ecran. Elles etaient tenues a la creation, par un compte dans la Server
 * Action, et nulle part ailleurs : une base remplie par plusieurs generations de
 * jeu de demonstration pouvait donc afficher huit priorites sous un sous-titre
 * qui en annonce trois, sans qu'aucun message ne le signale. Le plafond vit
 * desormais ici, et les deux cotes le lisent : la Server Action pour refuser, la
 * page pour le dire.
 */

/** Priorites strategiques d'un cycle de 90 jours (Priorite 1, 2, 3). */
export const MAX_PRIORITES_PAR_CYCLE = 3

/** Grandes thematiques de communication d'un client. */
export const MAX_THEMATIQUES = 5

/** Reste-t-il de la place sous le plafond ? Sert a offrir, ou non, l'ajout. */
export function placeDisponible(nombre: number, plafond: number): boolean {
  return nombre < plafond
}

/**
 * De combien le plafond est-il depasse ? Zero quand il est respecte.
 *
 * Un depassement ne se corrige pas tout seul : on ne supprime rien dans le dos
 * du dirigeant. On le lui dit, et il arbitre.
 */
export function depassement(nombre: number, plafond: number): number {
  return Math.max(0, nombre - plafond)
}
