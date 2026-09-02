import { describe, it, expect } from 'vitest'
import {
  peut, peutAuMoins, accesDe,
  ACCES_PERSONNELS, ACCES_COMMUNS, ACCES_DELEGUES,
  type Acces, type ProfilHabilitation,
} from '@/lib/habilitations'

const client: ProfilHabilitation = { role: 'CLIENT' }
const admin: ProfilHabilitation = { role: 'ADMIN' }

const TOUS: Acces[] = [...ACCES_PERSONNELS, ...ACCES_COMMUNS, ...ACCES_DELEGUES]

describe('refus par defaut', () => {
  it('refuse tout a un profil absent', () => {
    for (const acces of TOUS) {
      expect(peut(null, acces)).toBe(false)
      expect(peut(undefined, acces)).toBe(false)
    }
  })

  it('refuse tout a un role hors table', () => {
    // Le cas d'un role ajoute en base et pas encore declare ici : il ne doit
    // rien ouvrir. C'est la propriete qui distingue un refus par defaut d'une
    // restriction par soustraction.
    const inconnu = { role: 'AUDITEUR' } as unknown as ProfilHabilitation
    expect(accesDe(inconnu)).toEqual([])
    for (const acces of TOUS) {
      expect(peut(inconnu, acces)).toBe(false)
    }
  })

  it('refuse un acces qui n est accorde a personne', () => {
    // REPERES_SECTORIELS est declare mais pas encore distribue.
    expect(peut(client, 'REPERES_SECTORIELS')).toBe(false)
    expect(peut(admin, 'REPERES_SECTORIELS')).toBe(false)
  })
})

describe('acces d un entrepreneur', () => {
  it('ouvre les cinq axes, le tableau de bord et l audit personnel', () => {
    for (const acces of ACCES_PERSONNELS) {
      expect(peut(client, acces)).toBe(true)
    }
  })

  it('ouvre les pages transverses et les parametres', () => {
    for (const acces of ACCES_COMMUNS) {
      expect(peut(client, acces)).toBe(true)
    }
  })

  it('ferme le portefeuille et l administration des comptes', () => {
    expect(peut(client, 'PORTEFEUILLE_CONSULTER')).toBe(false)
    expect(peut(client, 'COMPTES_ADMINISTRER')).toBe(false)
  })
})

describe('acces d un consultant', () => {
  it('ouvre le portefeuille et l administration des comptes', () => {
    expect(peut(admin, 'PORTEFEUILLE_CONSULTER')).toBe(true)
    expect(peut(admin, 'COMPTES_ADMINISTRER')).toBe(true)
  })

  it('ouvre les pages transverses et les parametres', () => {
    for (const acces of ACCES_COMMUNS) {
      expect(peut(admin, acces)).toBe(true)
    }
  })

  it("ne donne pas encore les axes personnels : c'est l'objet de l'etape 2", () => {
    // Ce test documente une limite connue plutot qu'une intention. Quand
    // l'etape 2 rattachera les acces a la formule, il sera inverse, et ce
    // renversement sera le signe que le defaut produit est corrige.
    for (const acces of ACCES_PERSONNELS) {
      expect(peut(admin, acces)).toBe(false)
    }
  })
})

describe('peutAuMoins', () => {
  it('accorde des qu un seul acces de la liste est ouvert', () => {
    expect(peutAuMoins(admin, ['AXE_VISION', 'PORTEFEUILLE_CONSULTER'])).toBe(true)
  })

  it('refuse quand aucun ne l est', () => {
    expect(peutAuMoins(client, ['PORTEFEUILLE_CONSULTER', 'COMPTES_ADMINISTRER'])).toBe(false)
  })

  it('refuse sur une liste vide', () => {
    expect(peutAuMoins(admin, [])).toBe(false)
  })
})
