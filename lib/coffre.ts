/**
 * Coffre strategique : la synthese de chaque axe, en quelques lignes.
 *
 * C'est le mecanisme qui fait de cinq pages independantes un cockpit. Chaque
 * axe se termine par les quelques reponses qui comptent vraiment, et le
 * tableau de bord les relit toutes au meme endroit. Le dirigeant n'a plus a
 * rouvrir cinq pages pour se rappeler ou il va.
 *
 * Le contenu reprend la reference de methode : ce ne sont pas des champs
 * inventes ici, ce sont les questions que la methode pose deja.
 *
 * La cle est technique et stable, le libelle est ce qui s'affiche : reformuler
 * un intitule ne doit jamais perdre une valeur deja saisie.
 */

export type AxeCoffre = 'VISION' | 'CHIFFRES' | 'OFFRES' | 'COMMUNICATION' | 'PILOTAGE'

export type LigneDefinie = {
  cle: string
  libelle: string
  /** Ce que la ligne attend, affiche tant qu'elle est vide. */
  intention: string
}

export type LigneCoffre = LigneDefinie & { valeur: string | null; rang: number }

export const TITRES_AXES: Record<AxeCoffre, string> = {
  VISION: 'Vision CEO',
  CHIFFRES: 'Chiffres & Admin',
  OFFRES: 'Offres & Clients',
  COMMUNICATION: 'Com & Ventes',
  PILOTAGE: 'Pilotage 90 jours',
}

export const CHEMINS_AXES: Record<AxeCoffre, string> = {
  VISION: '/axe1',
  CHIFFRES: '/axe2',
  OFFRES: '/axe3',
  COMMUNICATION: '/axe4',
  PILOTAGE: '/axe5',
}

const DEFINITION: Record<AxeCoffre, LigneDefinie[]> = {
  VISION: [
    { cle: 'vision', libelle: 'Ma vision', intention: 'Où en sera l’entreprise dans trois ans, en une phrase.' },
    { cle: 'pourquoi', libelle: 'Mon grand pourquoi', intention: 'Ce qui vous fait continuer un lundi matin sans motivation.' },
    { cle: 'mission', libelle: 'Ma mission', intention: 'Ce que vous dites en dix secondes à quelqu’un qui demande.' },
    { cle: 'objectif_annuel', libelle: 'Mon objectif annuel', intention: 'Un chiffre et une date. Sans ça, c’est un souhait.' },
  ],
  CHIFFRES: [
    { cle: 'revenu_net_vise', libelle: 'Revenu net mensuel visé', intention: 'Ce que vous voulez vous verser, chaque mois.' },
    { cle: 'statut', libelle: 'Statut juridique', intention: 'Micro-entreprise, SASU, autre.' },
    { cle: 'charges_estimees', libelle: 'Charges mensuelles estimées', intention: 'Le total que vous payez tous les mois, sans surprise.' },
    { cle: 'ca_a_atteindre', libelle: 'CA mensuel à atteindre', intention: 'Le chiffre qui rend le revenu visé possible.' },
  ],
  OFFRES: [
    { cle: 'client_ideal', libelle: 'Mon client idéal', intention: 'À qui vous vendez, en une ligne.' },
    { cle: 'douleur', libelle: 'Sa douleur principale', intention: 'Le problème qu’il vit et qu’il paierait pour régler.' },
    { cle: 'promesse', libelle: 'Ma promesse de transformation', intention: 'Où il est avant, où il est après.' },
    { cle: 'offre_coeur', libelle: 'Mon offre cœur de gamme', intention: 'Celle qui fait le chiffre, pas celle qui fait joli.' },
  ],
  COMMUNICATION: [
    { cle: 'thematiques', libelle: 'Mes thématiques', intention: 'Trois à cinq sujets, pas davantage.' },
    { cle: 'canal', libelle: 'Mon canal principal', intention: 'Celui où votre client idéal est déjà.' },
    { cle: 'role_contenus', libelle: 'Le rôle de mes contenus', intention: 'Faire découvrir, mettre en confiance, ou vendre.' },
  ],
  PILOTAGE: [
    { cle: 'cap', libelle: 'Mon cap sur ce cycle', intention: 'Ce qui doit être vrai dans 90 jours.' },
    { cle: 'rythme', libelle: 'Mon rythme de revue', intention: 'Le jour et l’heure où vous regardez vos chiffres.' },
    { cle: 'obstacle', libelle: 'Ce qui pourrait me freiner', intention: 'Le nommer maintenant coûte moins cher que le subir.' },
  ],
}

export function lignesDefinies(axe: AxeCoffre): readonly LigneDefinie[] {
  return DEFINITION[axe]
}

export type EntreeEnregistree = { cle: string; valeur: string | null }

/**
 * Definition d'un axe, remplie par ce qui est enregistre.
 *
 * La definition commande l'ordre et la presence : une entree en base dont la
 * cle n'existe plus est ignoree plutot que d'apparaitre sans intitule.
 */
export function fusionner(
  axe: AxeCoffre,
  entrees: readonly EntreeEnregistree[],
): LigneCoffre[] {
  const parCle = new Map(entrees.map((e) => [e.cle, e.valeur]))
  return DEFINITION[axe].map((ligne, rang) => ({
    ...ligne,
    rang,
    valeur: parCle.get(ligne.cle)?.trim() || null,
  }))
}

/** Part des lignes renseignees, en pourcentage entier. */
export function completude(lignes: readonly LigneCoffre[]): number {
  if (lignes.length === 0) return 0
  const remplies = lignes.filter((l) => l.valeur !== null).length
  return Math.round((remplies / lignes.length) * 100)
}

export const AXES: readonly AxeCoffre[] = [
  'VISION', 'CHIFFRES', 'OFFRES', 'COMMUNICATION', 'PILOTAGE',
]

export type EntreeAvecAxe = EntreeEnregistree & { axe: AxeCoffre }

export type AxeSynthese = {
  axe: AxeCoffre
  titre: string
  chemin: string
  lignes: LigneCoffre[]
  /** Lignes effectivement renseignees, dans l'ordre de la definition. */
  renseignees: LigneCoffre[]
  part: number
}

/** Le coffre entier, axe par axe. C'est ce que le tableau de bord relit. */
export function coffreComplet(entrees: readonly EntreeAvecAxe[]): AxeSynthese[] {
  return AXES.map((axe) => {
    const lignes = fusionner(axe, entrees.filter((e) => e.axe === axe))
    return {
      axe,
      titre: TITRES_AXES[axe],
      chemin: CHEMINS_AXES[axe],
      lignes,
      renseignees: lignes.filter((l) => l.valeur !== null),
      part: completude(lignes),
    }
  })
}

/** Part renseignee sur l'ensemble des axes, et non moyenne des parts par axe. */
export function completudeGlobale(synthese: readonly AxeSynthese[]): number {
  const total = synthese.reduce((s, a) => s + a.lignes.length, 0)
  const remplies = synthese.reduce((s, a) => s + a.renseignees.length, 0)
  return total > 0 ? Math.round((remplies / total) * 100) : 0
}
