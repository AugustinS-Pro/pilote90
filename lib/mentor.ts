/**
 * Le Mentor : le cours a lire avant de remplir un axe.
 *
 * Chaque axe de la version Notion s'ouvre sur un lien vers un cours, avec une
 * phrase qui dit pourquoi le lire d'abord : « Avant de remplir les quatre blocs
 * ci-dessous, prends cinq minutes pour lire le mentor. Une vision floue donne
 * des decisions floues. » C'est la demande d'Alexis du 19 septembre, et c'est
 * l'un des deux motifs que la reference Notion repete sur chaque axe — l'autre
 * etant le coffre strategique, en pied de page.
 *
 * Le cours n'est pas un contenu de l'application : c'est une ressource de la
 * bibliotheque qu'un consultant rattache a un axe. Rien n'est ecrit en dur ici
 * que la phrase d'accroche, qui appartient a la methode et non au dossier d'un
 * client.
 */

import type { AxeCoffre } from './coffre'

/** Phrase qui dit pourquoi lire le cours avant de remplir l'axe. */
export const ACCROCHES: Record<AxeCoffre, string> = {
  VISION:
    'Avant de remplir les blocs ci-dessous, prenez cinq minutes pour lire le cours. Une vision floue donne des décisions floues.',
  CHIFFRES:
    'Lisez le cours avant de saisir vos taux. Des charges mal estimées faussent tout ce qui en découle, jusqu’au nombre de clients à trouver.',
  OFFRES:
    'Le cours cadre ce que cette page fait et ne fait pas : elle aide à piloter une offre, pas à la concevoir depuis zéro.',
  COMMUNICATION:
    'Le cours part du problème vécu par votre client, pas de ce que vous avez envie de dire. C’est l’ordre qui fait la différence.',
  PILOTAGE:
    'Le cours explique le cycle de 90 jours : pourquoi trois priorités, pourquoi une revue par semaine, et ce qui se passe à la clôture.',
}

/**
 * Appartenances possibles d'une ressource visible par cet utilisateur.
 *
 * Trois cas, et aucun autre : ses propres ressources, les ressources communes
 * de SON accompagnant, et, s'il est consultant, celles qu'il a lui-meme
 * deposees. La regle vivait dans la page de bibliotheque ; le Mentor la lit
 * aussi, donc elle vit maintenant a un seul endroit. Une ressource commune
 * n'est jamais visible par tous les locataires de l'instance.
 */
export function appartenancesRessources(opts: {
  clientId: string | null
  adminDuClient: string | null
  utilisateurEstConsultant: boolean
  utilisateurId: string
}): { clientId: string | null; adminId?: string }[] {
  return [
    ...(opts.clientId ? [{ clientId: opts.clientId }] : []),
    ...(opts.adminDuClient ? [{ clientId: null, adminId: opts.adminDuClient }] : []),
    ...(opts.utilisateurEstConsultant ? [{ clientId: null, adminId: opts.utilisateurId }] : []),
  ]
}
