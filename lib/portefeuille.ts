/**
 * Ce qui demande une action dans un portefeuille.
 *
 * Les constats d'audit existent par client, mais il fallait ouvrir chaque
 * fiche pour les lire. Un consultant qui suit quinze dossiers ne le fait pas :
 * il regarde ce qui remonte, ou il ne regarde rien.
 *
 * Cette fonction aplatit les constats de tout le portefeuille en une liste
 * unique, du plus grave au moins grave, avec le nom du client a cote. Elle
 * n'ajoute aucune regle : elle rassemble celles qui existent deja.
 */

import type { ConstatAudit, NiveauAudit } from './finance'
import type { Fraicheur } from './fraicheur'

export type DossierSurveille = {
  id: string
  nom: string
  constats: readonly ConstatAudit[]
  fraicheur: Fraicheur
}

export type SignalPortefeuille = {
  clientId: string
  client: string
  niveau: NiveauAudit
  titre: string
  valeur: string
  regle: string
}

const GRAVITE: Record<NiveauAudit, number> = { ALERTE: 0, ATTENTION: 1, ANALYSE: 2 }

/** Un dossier sans saisie depuis longtemps est un signal, au meme titre qu'un ratio. */
function signalDeFraicheur(dossier: DossierSurveille): SignalPortefeuille | null {
  const { niveau, jours, libelle } = dossier.fraicheur
  if (niveau === 'ACTIF') return null

  const gravite: NiveauAudit = niveau === 'DECROCHE' ? 'ALERTE' : 'ATTENTION'
  return {
    clientId: dossier.id,
    client: dossier.nom,
    niveau: gravite,
    titre: niveau === 'JAMAIS' ? 'Dossier jamais alimenté' : 'Dossier sans saisie',
    valeur: libelle,
    regle:
      jours === null
        ? 'Un dossier sans aucune saisie ne produit aucun indicateur.'
        : 'Au-delà de 21 jours le client est à relancer, au-delà de 45 il décroche.',
  }
}

/**
 * Signaux du portefeuille, tries par gravite puis par client.
 *
 * Les constats de niveau ANALYSE sont ecartes : ce sont des observations, pas
 * des actions, et les melanger ferait passer la liste de dix lignes a cent.
 */
export function signauxDuPortefeuille(
  dossiers: readonly DossierSurveille[],
): SignalPortefeuille[] {
  const signaux: SignalPortefeuille[] = []

  for (const dossier of dossiers) {
    const fraicheur = signalDeFraicheur(dossier)
    if (fraicheur) signaux.push(fraicheur)

    for (const constat of dossier.constats) {
      if (constat.niveau === 'ANALYSE') continue
      signaux.push({
        clientId: dossier.id,
        client: dossier.nom,
        niveau: constat.niveau,
        titre: constat.titre,
        valeur: constat.valeur,
        regle: constat.regle,
      })
    }
  }

  return signaux.sort(
    (a, b) => GRAVITE[a.niveau] - GRAVITE[b.niveau] || a.client.localeCompare(b.client, 'fr'),
  )
}

/** Combien de dossiers distincts demandent une action. */
export function dossiersConcernes(signaux: readonly SignalPortefeuille[]): number {
  return new Set(signaux.map((s) => s.clientId)).size
}
