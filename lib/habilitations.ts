/**
 * Habilitations : qui a le droit d'ouvrir quoi.
 *
 * Un seul point de decision pour toute l'application, sur le modele de
 * `lib/session.ts` qui concentre deja tout le cloisonnement multi-tenant.
 * Aucune page ne teste un role en direct.
 *
 * REFUS PAR DEFAUT. Le produit se decrit comme un compte qui donne acces a
 * tout, restreint ensuite par des habilitations. L'implementation prend le
 * chemin inverse : rien n'est ouvert tant qu'une habilitation ne le nomme.
 * L'experience de l'utilisateur legitime est la meme, mais un profil absent,
 * un role inconnu ou une lecture qui echoue referment l'application au lieu
 * de l'ouvrir. C'est le meme principe que le refus par defaut du pare-feu
 * dans la procedure de deploiement.
 *
 * Fonction pure, sans acces base ni `next/headers` : elle s'importe aussi
 * bien dans un composant serveur que dans un composant client, et elle se
 * teste a l'unite.
 */

import type { RoleUtilisateur } from '@/types/next-auth'

// ---------------------------------------------------------------------------
// Le vocabulaire des acces
// ---------------------------------------------------------------------------

/**
 * Ce qu'un compte fait POUR LUI-MEME. Ces acces suivront la formule vendue
 * (Decouverte, Pilotage, Accompagnement) a l'etape 2.
 */
export const ACCES_PERSONNELS = [
  /** Ce compte possede son propre dossier d'entrepreneur, donc des donnees a lui. */
  'DOSSIER_PERSONNEL',
  'TABLEAU_DE_BORD',
  'AXE_VISION',
  'AXE_CHIFFRES',
  'AXE_OFFRES',
  'AXE_COMMUNICATION',
  'AXE_PILOTAGE',
  'AUDIT_PERSONNEL',
] as const

/** Ce que tout compte possede, quelle que soit sa formule. */
export const ACCES_COMMUNS = ['PAGES_TRANSVERSES', 'PARAMETRES'] as const

/**
 * Ce qu'un compte fait POUR LES AUTRES. Rien a voir avec la formule : ce sont
 * des delegations, et c'est pourquoi les deux notions ne partagent pas la
 * meme liste. Une habilitation correspond a ce qui se vend ou a ce qui se
 * delegue, jamais a une page : les pages bougent, les contrats non.
 */
export const ACCES_DELEGUES = [
  'PORTEFEUILLE_CONSULTER',
  'COMPTES_ADMINISTRER',
  'REPERES_SECTORIELS',
] as const

export type Acces =
  | (typeof ACCES_PERSONNELS)[number]
  | (typeof ACCES_COMMUNS)[number]
  | (typeof ACCES_DELEGUES)[number]

/** Le strict minimum dont la decision a besoin. Pas une session entiere. */
export type ProfilHabilitation = { role: RoleUtilisateur }

// ---------------------------------------------------------------------------
// La table des accords
// ---------------------------------------------------------------------------

/**
 * ETAPE 1 : la table est adossee au role existant et reproduit exactement le
 * comportement actuel. L'etape 2 remplacera le contenu de cette constante par
 * une lecture de `formule` et `capacites` en base, sans qu'aucun appelant ne
 * change. C'est tout l'interet d'avoir un point de decision unique.
 */
const ACCORDS: Readonly<Record<RoleUtilisateur, readonly Acces[]>> = {
  CLIENT: [...ACCES_PERSONNELS, ...ACCES_COMMUNS],
  ADMIN: [...ACCES_COMMUNS, 'PORTEFEUILLE_CONSULTER', 'COMPTES_ADMINISTRER'],
}

// ---------------------------------------------------------------------------
// La decision
// ---------------------------------------------------------------------------

/** Liste des acces d'un profil. Un profil absent ou inconnu n'a rien. */
export function accesDe(profil: ProfilHabilitation | null | undefined): readonly Acces[] {
  if (!profil) return []
  return ACCORDS[profil.role] ?? []
}

/**
 * Le profil a-t-il cet acces ?
 *
 * Repond `false` pour un profil absent, un role hors table et un acces non
 * accorde : les trois cas de defaut referment l'application.
 */
export function peut(profil: ProfilHabilitation | null | undefined, acces: Acces): boolean {
  return accesDe(profil).includes(acces)
}

/** Au moins un des acces demandes. Utile pour afficher une entree de menu. */
export function peutAuMoins(
  profil: ProfilHabilitation | null | undefined,
  acces: readonly Acces[],
): boolean {
  return acces.some((a) => peut(profil, a))
}
