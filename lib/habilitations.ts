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
 * une formule inconnue ou une lecture qui echoue referment l'application au
 * lieu de l'ouvrir. C'est le meme principe que le refus par defaut du
 * pare-feu dans la procedure de deploiement.
 *
 * Fonctions pures, sans acces base ni `next/headers` : elles s'importent aussi
 * bien dans un composant serveur que dans un composant client, et se testent a
 * l'unite.
 */

// ---------------------------------------------------------------------------
// Le vocabulaire des acces
// ---------------------------------------------------------------------------

/** Ce qu'un compte fait POUR LUI-MEME. Depend de la formule vendue. */
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
 * des delegations, et c'est pourquoi les deux notions ne partagent pas la meme
 * liste. Une habilitation correspond a ce qui se vend ou a ce qui se delegue,
 * jamais a une page : les pages bougent, les contrats non.
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

export type Formule = 'AUTONOMIE' | 'ACCOMPAGNEMENT' | 'COMPLETE' | 'AUCUNE'
export type Capacite = (typeof ACCES_DELEGUES)[number]

/** Le strict minimum dont la decision a besoin. Pas une session entiere. */
export type ProfilHabilitation = {
  formule: Formule
  capacites: readonly Capacite[]
}

// ---------------------------------------------------------------------------
// Ce que chaque formule ouvre
// ---------------------------------------------------------------------------

const LES_CINQ_AXES = [
  'AXE_VISION', 'AXE_CHIFFRES', 'AXE_OFFRES', 'AXE_COMMUNICATION', 'AXE_PILOTAGE',
] as const satisfies readonly Acces[]

/**
 * Deux offres distinctes, servies par la meme application.
 *
 * AUTONOMIE : les cinq axes et le tableau de bord qui les resume.
 *   L'entrepreneur pilote seul, personne n'intervient dans son espace.
 *
 * ACCOMPAGNEMENT : l'audit et le previsionnel, support des seances avec un
 *   consultant. Pas les axes, mais bien un dossier personnel, car la page
 *   d'audit porte elle-meme la saisie des transactions : un client accompagne
 *   entre ses chiffres sans avoir a passer par l'axe 2.
 *
 * COMPLETE : les deux, pour qui pilote seul et se fait aussi accompagner.
 *
 * AUCUNE : aucun espace personnel. Un compte purement administratif, qui ne
 *   dispose que de ce que ses capacites lui accordent.
 */
const ACCES_PAR_FORMULE: Readonly<Record<Formule, readonly Acces[]>> = {
  AUTONOMIE: ['DOSSIER_PERSONNEL', 'TABLEAU_DE_BORD', ...LES_CINQ_AXES],
  ACCOMPAGNEMENT: ['DOSSIER_PERSONNEL', 'AUDIT_PERSONNEL'],
  COMPLETE: [...ACCES_PERSONNELS],
  AUCUNE: [],
}

// ---------------------------------------------------------------------------
// La decision
// ---------------------------------------------------------------------------

/**
 * Liste des acces d'un profil : ce que sa formule ouvre, plus ce qui lui est
 * delegue, plus le socle commun. Un profil absent ou une formule hors table
 * n'ouvre rien.
 */
export function accesDe(profil: ProfilHabilitation | null | undefined): readonly Acces[] {
  if (!profil) return []
  const parFormule = ACCES_PAR_FORMULE[profil.formule]
  if (!parFormule) return []

  const delegues = (profil.capacites ?? []).filter((c): c is Capacite =>
    (ACCES_DELEGUES as readonly string[]).includes(c),
  )

  return [...parFormule, ...ACCES_COMMUNS, ...delegues]
}

/**
 * Le profil a-t-il cet acces ?
 *
 * Repond `false` pour un profil absent, une formule hors table et un acces non
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

// ---------------------------------------------------------------------------
// Ou atterrit-on ?
// ---------------------------------------------------------------------------

/**
 * Page d'accueil d'un compte, deduite de ses habilitations.
 *
 * Sans cette fonction, chaque garde de page redirigeait vers une destination
 * ecrite en dur, et un compte qui n'avait pas le tableau de bord se retrouvait
 * envoye au portefeuille consultant : une page qui lui expliquait qu'elle
 * n'etait pas pour lui. Le defaut ne venait pas des redirections prises une a
 * une mais de l'absence d'un endroit unique qui reponde a la question.
 *
 * L'ordre traduit ce que le compte vient faire. Un consultant vient voir son
 * portefeuille avant sa propre activite ; un entrepreneur vient a son espace.
 * Le dernier recours reste les parametres, accessibles a tous, plutot qu'une
 * page d'erreur.
 */
export function pageAccueil(profil: ProfilHabilitation | null | undefined): string {
  if (peut(profil, 'PORTEFEUILLE_CONSULTER')) return '/clients'
  if (peut(profil, 'TABLEAU_DE_BORD')) return '/dashboard'
  if (peut(profil, 'AUDIT_PERSONNEL')) return '/audit'
  if (peut(profil, 'PAGES_TRANSVERSES')) return '/historique'
  return '/parametres'
}
