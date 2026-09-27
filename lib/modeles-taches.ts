/**
 * Actions proposees a la creation d'une priorite.
 *
 * Le cahier des charges de janvier promettait une generation d'actions a
 * partir d'une priorite. Elle n'a jamais ete faite, et c'est l'ecart D1 de
 * l'audit de coherence.
 *
 * Le principe reste modeste, et c'est volontaire : rien n'est devine a la
 * place du dirigeant. L'intitule de la priorite est lu, un modele est propose,
 * et les actions creees restent modifiables et supprimables comme les autres.
 * Une proposition qui ne convient pas se supprime en deux clics ; une page
 * blanche, elle, ne se remplit jamais.
 *
 * Fonctions pures, testables a l'unite.
 */

export type EtiquetteTache =
  | 'VENTE'
  | 'OFFRE'
  | 'FINANCE'
  | 'COMMUNICATION'
  | 'ORGANISATION'
  | 'DIVERS'

export type ActionProposee = { label: string; tag: EtiquetteTache }

export type Modele = {
  cle: string
  /** Ce que le modele reconnait, en toutes lettres, pour l'afficher. */
  intitule: string
  motifs: readonly string[]
  actions: readonly ActionProposee[]
}

function normaliser(valeur: string): string {
  return valeur.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

const MODELES: readonly Modele[] = [
  {
    cle: 'chiffre',
    intitule: 'un objectif de chiffre d’affaires',
    motifs: ['chiffre', ' ca ', 'ca mensuel', 'euros', '€', 'revenu', 'facturation'],
    actions: [
      { label: 'Lister les devis en attente et relancer les plus anciens', tag: 'VENTE' },
      { label: 'Vérifier le montant qu’il reste à facturer ce mois-ci', tag: 'FINANCE' },
      { label: 'Identifier les trois clients les plus susceptibles de reprendre', tag: 'VENTE' },
    ],
  },
  {
    cle: 'clients',
    intitule: 'un objectif de nouveaux clients',
    motifs: ['client', 'signer', 'prospect', 'prospection', 'rendez-vous', 'contrat'],
    actions: [
      { label: 'Écrire la liste des vingt personnes à contacter', tag: 'VENTE' },
      { label: 'Préparer le message de premier contact', tag: 'COMMUNICATION' },
      { label: 'Bloquer deux créneaux de prospection par semaine', tag: 'VENTE' },
      { label: 'Relancer les propositions restées sans réponse', tag: 'VENTE' },
    ],
  },
  {
    cle: 'offre',
    intitule: 'un lancement d’offre',
    motifs: ['offre', 'lancer', 'lancement', 'produit', 'formule', 'prestation'],
    actions: [
      { label: 'Fixer le prix et ce que l’offre contient exactement', tag: 'OFFRE' },
      { label: 'Écrire la page de vente', tag: 'COMMUNICATION' },
      { label: 'Faire relire l’offre par un client de confiance', tag: 'OFFRE' },
      { label: 'Annoncer la date de sortie', tag: 'COMMUNICATION' },
    ],
  },
  {
    cle: 'visibilite',
    intitule: 'un objectif de visibilité',
    motifs: ['publier', 'communication', 'visibilite', 'contenu', 'reseau', 'audience', 'newsletter'],
    actions: [
      { label: 'Choisir les trois sujets du mois', tag: 'COMMUNICATION' },
      { label: 'Préparer deux publications à l’avance', tag: 'COMMUNICATION' },
      { label: 'Fixer le jour et l’heure de publication', tag: 'COMMUNICATION' },
    ],
  },
  {
    cle: 'organisation',
    intitule: 'un objectif d’organisation',
    motifs: ['organiser', 'process', 'outil', 'administratif', 'comptab', 'ranger', 'automatiser'],
    actions: [
      { label: 'Noter ce qui prend le plus de temps chaque semaine', tag: 'ORGANISATION' },
      { label: 'Choisir une seule chose à simplifier en premier', tag: 'ORGANISATION' },
      { label: 'Bloquer une heure par semaine pour l’administratif', tag: 'FINANCE' },
    ],
  },
]

/** Modele generique, quand l'intitule ne dit rien de reconnaissable. */
const PAR_DEFAUT: Modele = {
  cle: 'general',
  intitule: 'une priorité',
  motifs: [],
  actions: [
    { label: 'Découper la priorité en trois étapes concrètes', tag: 'ORGANISATION' },
    { label: 'Fixer la première échéance', tag: 'ORGANISATION' },
    { label: 'Nommer ce qui pourrait bloquer', tag: 'DIVERS' },
  ],
}

/**
 * Modele reconnu a l'intitule d'une priorite.
 *
 * Le premier modele qui correspond gagne, d'ou l'ordre de la liste : un
 * intitule qui parle de chiffre d'affaires ET de clients releve d'abord du
 * chiffre, parce que c'est lui qui porte le resultat.
 */
export function modelePour(titre: string): Modele {
  const cible = ` ${normaliser(titre)} `
  return MODELES.find((m) => m.motifs.some((motif) => cible.includes(motif))) ?? PAR_DEFAUT
}

/** Actions proposees, sans celles qui existent deja sous le meme intitule. */
export function actionsAProposer(
  titre: string,
  dejaPresentes: readonly string[] = [],
): ActionProposee[] {
  const connues = new Set(dejaPresentes.map(normaliser))
  return modelePour(titre).actions.filter((a) => !connues.has(normaliser(a.label)))
}
