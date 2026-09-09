import { describe, it, expect } from 'vitest'
import {
  peut, peutAuMoins, accesDe,
  ACCES_PERSONNELS, ACCES_COMMUNS, ACCES_DELEGUES,
  type Acces, type ProfilHabilitation,
} from '@/lib/habilitations'

/** Un client de Sandrine : les cinq axes, en autonomie. */
const autonome: ProfilHabilitation = { formule: 'AUTONOMIE', capacites: [] }

/** Un client d'Alexis : l'audit, support des seances d'accompagnement. */
const accompagne: ProfilHabilitation = { formule: 'ACCOMPAGNEMENT', capacites: [] }

/** Un consultant : pas d'espace personnel, mais un portefeuille a suivre. */
const consultant: ProfilHabilitation = {
  formule: 'AUCUNE',
  capacites: ['PORTEFEUILLE_CONSULTER', 'COMPTES_ADMINISTRER'],
}

/** Un consultant qui pilote aussi sa propre activite avec l'outil. */
const consultantEntrepreneur: ProfilHabilitation = {
  formule: 'COMPLETE',
  capacites: ['PORTEFEUILLE_CONSULTER', 'COMPTES_ADMINISTRER'],
}

const TOUS: Acces[] = [...ACCES_PERSONNELS, ...ACCES_COMMUNS, ...ACCES_DELEGUES]

describe('refus par defaut', () => {
  it('refuse tout a un profil absent', () => {
    for (const acces of TOUS) {
      expect(peut(null, acces)).toBe(false)
      expect(peut(undefined, acces)).toBe(false)
    }
  })

  it('refuse tout pour une formule hors table', () => {
    // Le cas d'une formule ajoutee en base et pas encore declaree ici : elle ne
    // doit rien ouvrir. C'est la propriete qui distingue un refus par defaut
    // d'une restriction par soustraction.
    const inconnue = { formule: 'PREMIUM', capacites: [] } as unknown as ProfilHabilitation
    expect(accesDe(inconnue)).toEqual([])
    for (const acces of TOUS) expect(peut(inconnue, acces)).toBe(false)
  })

  it('ignore une capacite inconnue au lieu de l accorder', () => {
    const bricole = {
      formule: 'AUCUNE',
      capacites: ['TOUT_VOIR', 'PORTEFEUILLE_CONSULTER'],
    } as unknown as ProfilHabilitation
    expect(peut(bricole, 'PORTEFEUILLE_CONSULTER')).toBe(true)
    expect(accesDe(bricole)).not.toContain('TOUT_VOIR')
  })

  it('n accorde a personne un acces declare mais non distribue', () => {
    for (const profil of [autonome, accompagne, consultant, consultantEntrepreneur]) {
      expect(peut(profil, 'REPERES_SECTORIELS')).toBe(false)
    }
  })
})

describe('formule AUTONOMIE, les clients qui pilotent seuls', () => {
  it('ouvre les cinq axes et le tableau de bord', () => {
    for (const acces of ['AXE_VISION', 'AXE_CHIFFRES', 'AXE_OFFRES', 'AXE_COMMUNICATION', 'AXE_PILOTAGE', 'TABLEAU_DE_BORD'] as const) {
      expect(peut(autonome, acces)).toBe(true)
    }
  })

  it('ne donne pas l audit, qui appartient a la formule accompagnement', () => {
    expect(peut(autonome, 'AUDIT_PERSONNEL')).toBe(false)
  })

  it('ne donne aucun acces delegue', () => {
    for (const acces of ACCES_DELEGUES) expect(peut(autonome, acces)).toBe(false)
  })
})

describe('formule ACCOMPAGNEMENT, les clients suivis en seance', () => {
  it('ouvre l audit et le dossier personnel', () => {
    expect(peut(accompagne, 'AUDIT_PERSONNEL')).toBe(true)
    // La page d'audit porte la saisie des transactions : sans dossier
    // personnel, le client n'aurait aucun chiffre a auditer.
    expect(peut(accompagne, 'DOSSIER_PERSONNEL')).toBe(true)
  })

  it('n ouvre ni les axes ni le tableau de bord qui les resume', () => {
    for (const acces of ['AXE_VISION', 'AXE_CHIFFRES', 'AXE_OFFRES', 'AXE_COMMUNICATION', 'AXE_PILOTAGE', 'TABLEAU_DE_BORD'] as const) {
      expect(peut(accompagne, acces)).toBe(false)
    }
  })
})

describe('formule COMPLETE', () => {
  it('ouvre tous les acces personnels', () => {
    for (const acces of ACCES_PERSONNELS) {
      expect(peut(consultantEntrepreneur, acces)).toBe(true)
    }
  })
})

describe('capacites deleguees', () => {
  it('ouvrent le portefeuille et l administration des comptes', () => {
    expect(peut(consultant, 'PORTEFEUILLE_CONSULTER')).toBe(true)
    expect(peut(consultant, 'COMPTES_ADMINISTRER')).toBe(true)
  })

  it('sont independantes de la formule : un consultant sans espace personnel n a aucun axe', () => {
    for (const acces of ACCES_PERSONNELS) {
      expect(peut(consultant, acces)).toBe(false)
    }
  })

  it('se cumulent avec la formule sans interferer', () => {
    expect(peut(consultantEntrepreneur, 'AXE_PILOTAGE')).toBe(true)
    expect(peut(consultantEntrepreneur, 'PORTEFEUILLE_CONSULTER')).toBe(true)
  })
})

describe('socle commun', () => {
  it('est ouvert a toutes les formules, y compris AUCUNE', () => {
    for (const profil of [autonome, accompagne, consultant, consultantEntrepreneur]) {
      for (const acces of ACCES_COMMUNS) expect(peut(profil, acces)).toBe(true)
    }
  })
})

describe('peutAuMoins', () => {
  it('accorde des qu un seul acces de la liste est ouvert', () => {
    expect(peutAuMoins(consultant, ['AXE_VISION', 'PORTEFEUILLE_CONSULTER'])).toBe(true)
  })

  it('refuse quand aucun ne l est', () => {
    expect(peutAuMoins(autonome, ['PORTEFEUILLE_CONSULTER', 'COMPTES_ADMINISTRER'])).toBe(false)
  })

  it('refuse sur une liste vide', () => {
    expect(peutAuMoins(consultant, [])).toBe(false)
  })
})
