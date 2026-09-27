import { describe, it, expect } from 'vitest'
import {
  signauxDuPortefeuille,
  dossiersConcernes,
  type DossierSurveille,
} from '@/lib/portefeuille'
import type { ConstatAudit } from '@/lib/finance'
import type { Fraicheur } from '@/lib/fraicheur'

const ACTIF: Fraicheur = { niveau: 'ACTIF', jours: 2, derniere: new Date(), libelle: 'Saisie il y a 2 jours' }
const DECROCHE: Fraicheur = { niveau: 'DECROCHE', jours: 60, derniere: new Date(), libelle: 'Derniere saisie il y a 60 jours' }
const A_RELANCER: Fraicheur = { niveau: 'A_RELANCER', jours: 25, derniere: new Date(), libelle: 'Derniere saisie il y a 25 jours' }
const JAMAIS: Fraicheur = { niveau: 'JAMAIS', jours: null, derniere: null, libelle: 'Aucune saisie' }

const constat = (niveau: ConstatAudit['niveau'], titre: string): ConstatAudit => ({
  niveau, titre, valeur: '42 %', regle: 'une regle',
})

const dossier = (
  id: string,
  nom: string,
  constats: ConstatAudit[],
  fraicheur: Fraicheur = ACTIF,
): DossierSurveille => ({ id, nom, constats, fraicheur })

describe('signauxDuPortefeuille', () => {
  it('ne signale rien sur un portefeuille sain', () => {
    expect(signauxDuPortefeuille([dossier('a', 'Atelier', [])])).toEqual([])
  })

  it('rassemble les constats de plusieurs dossiers', () => {
    const signaux = signauxDuPortefeuille([
      dossier('a', 'Atelier', [constat('ATTENTION', 'Ratio de charges')]),
      dossier('b', 'Bergamote', [constat('ALERTE', 'Trésorerie négative')]),
    ])
    expect(signaux).toHaveLength(2)
    expect(signaux.map((s) => s.client)).toEqual(['Bergamote', 'Atelier'])
  })

  // Une alerte passe devant, quel que soit l'ordre alphabetique.
  it('trie par gravite avant de trier par client', () => {
    const signaux = signauxDuPortefeuille([
      dossier('a', 'Atelier', [constat('ATTENTION', 'x')]),
      dossier('z', 'Zenith', [constat('ALERTE', 'y')]),
    ])
    expect(signaux.map((s) => s.niveau)).toEqual(['ALERTE', 'ATTENTION'])
  })

  it('range les dossiers de meme gravite par ordre alphabetique', () => {
    const signaux = signauxDuPortefeuille([
      dossier('c', 'Cerisier', [constat('ALERTE', 'x')]),
      dossier('a', 'Amandier', [constat('ALERTE', 'y')]),
    ])
    expect(signaux.map((s) => s.client)).toEqual(['Amandier', 'Cerisier'])
  })

  // Sinon la liste passe de dix lignes a cent et ne se lit plus.
  it('ecarte les constats de simple analyse', () => {
    const signaux = signauxDuPortefeuille([
      dossier('a', 'Atelier', [constat('ANALYSE', 'Structure saine'), constat('ALERTE', 'x')]),
    ])
    expect(signaux).toHaveLength(1)
    expect(signaux[0].titre).toBe('x')
  })

  it('traite un dossier qui decroche comme une alerte', () => {
    const signaux = signauxDuPortefeuille([dossier('a', 'Atelier', [], DECROCHE)])
    expect(signaux[0]).toMatchObject({ niveau: 'ALERTE', titre: 'Dossier sans saisie' })
  })

  it('traite un dossier a relancer comme une attention', () => {
    const signaux = signauxDuPortefeuille([dossier('a', 'Atelier', [], A_RELANCER)])
    expect(signaux[0].niveau).toBe('ATTENTION')
  })

  it('distingue un dossier jamais alimente', () => {
    const signaux = signauxDuPortefeuille([dossier('a', 'Atelier', [], JAMAIS)])
    expect(signaux[0].titre).toBe('Dossier jamais alimenté')
    expect(signaux[0].regle).toContain('aucune saisie')
  })

  it('cumule la fraicheur et les constats d un meme dossier', () => {
    const signaux = signauxDuPortefeuille([
      dossier('a', 'Atelier', [constat('ALERTE', 'Trésorerie négative')], DECROCHE),
    ])
    expect(signaux).toHaveLength(2)
    expect(signaux.every((s) => s.clientId === 'a')).toBe(true)
  })
})

describe('dossiersConcernes', () => {
  it('compte les dossiers distincts, pas les signaux', () => {
    const signaux = signauxDuPortefeuille([
      dossier('a', 'Atelier', [constat('ALERTE', 'x'), constat('ATTENTION', 'y')], DECROCHE),
      dossier('b', 'Bergamote', [constat('ALERTE', 'z')]),
    ])
    expect(signaux.length).toBe(4)
    expect(dossiersConcernes(signaux)).toBe(2)
  })
})
