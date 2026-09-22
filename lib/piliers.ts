/**
 * Les quatre piliers de l'axe Vision CEO, avec leurs questions guidees.
 * Les intitules sont ceux de la version Notion de Pilote90 : les utilisatrices
 * doivent retrouver leurs reperes d'un produit a l'autre.
 */

export type ClePilier = 'VISION' | 'MISSION' | 'GRAND_POURQUOI' | 'OBJECTIF_ANNUEL'

export type Pilier = {
  cle: ClePilier
  titre: string
  sousTitre: string
  questions: string[]
  aideSynthese: string
}

export const PILIERS: Pilier[] = [
  {
    cle: 'VISION',
    titre: 'Vision strategique',
    sousTitre: 'Le cap à trois ans',
    questions: [
      'Quelle entreprise suis-je en train de construire ?',
      'Où est-ce que je veux être dans 3 ans ?',
      'Quel style de vie mon activité doit-elle soutenir ?',
      "Qu’est-ce que je ne veux plus dans mon activité ?",
    ],
    aideSynthese: 'Résumez votre vision en quelques phrases, comme si vous la lisiez chaque matin.',
  },
  {
    cle: 'MISSION',
    titre: 'Mission de l’activité',
    sousTitre: 'Ce que vous faites, pour qui, et comment',
    questions: [
      "J'aide :",
      'A :',
      'Pour obtenir :',
      'Grâce à :',
    ],
    aideSynthese: 'Assemblez les quatre réponses en une seule phrase de mission.',
  },
  {
    cle: 'GRAND_POURQUOI',
    titre: 'Mon grand pourquoi',
    sousTitre: 'Ce qui vous fait tenir les jours difficiles',
    questions: [
      'Pourquoi cette activité est-elle importante pour moi ?',
      "Qu'est-ce que je veux defendre ?",
      'Quel impact je veux avoir ?',
      "Si mon entreprise disparaissait demain, qu'est-ce qui me manquerait le plus ?",
    ],
    aideSynthese: 'Une phrase qui vous ressemble, pas une phrase qui sonne bien.',
  },
  {
    cle: 'OBJECTIF_ANNUEL',
    titre: 'Objectif annuel',
    sousTitre: 'Le résultat qui rendrait cette année réussie',
    questions: [
      'Quel est l’objectif principal que je veux atteindre cette année ?',
      'Quel résultat concret signifierait que mon année est réussie ?',
      'Priorité secondaire 1',
      'Priorité secondaire 2',
    ],
    aideSynthese: 'Un objectif annuel se decoupe ensuite en cycles de 90 jours.',
  },
]

export const PILIER_PAR_CLE = Object.fromEntries(PILIERS.map((p) => [p.cle, p])) as Record<ClePilier, Pilier>
