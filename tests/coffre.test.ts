import { describe, it, expect } from 'vitest'
import {
  AXES,
  lignesDefinies,
  fusionner,
  completude,
  TITRES_AXES,
  CHEMINS_AXES,
  coffreComplet,
  completudeGlobale,
} from '@/lib/coffre'

describe('la definition du coffre', () => {
  it('couvre les cinq axes', () => {
    expect(AXES).toHaveLength(5)
    for (const axe of AXES) {
      expect(lignesDefinies(axe).length).toBeGreaterThan(0)
      expect(TITRES_AXES[axe]).toBeTruthy()
      expect(CHEMINS_AXES[axe]).toMatch(/^\/axe[1-5]$/)
    }
  })

  // Une cle qui change perd la valeur deja saisie : elles doivent rester stables
  // et distinctes a l'interieur d'un axe.
  it('n a pas deux fois la meme cle dans un axe', () => {
    for (const axe of AXES) {
      const cles = lignesDefinies(axe).map((l) => l.cle)
      expect(new Set(cles).size).toBe(cles.length)
    }
  })

  it('donne a chaque ligne un intitule et une intention', () => {
    for (const axe of AXES) {
      for (const ligne of lignesDefinies(axe)) {
        expect(ligne.libelle.trim()).not.toBe('')
        expect(ligne.intention.trim()).not.toBe('')
      }
    }
  })
})

describe('fusionner', () => {
  it('rend toutes les lignes vides quand rien n est enregistre', () => {
    const lignes = fusionner('VISION', [])
    expect(lignes).toHaveLength(lignesDefinies('VISION').length)
    expect(lignes.every((l) => l.valeur === null)).toBe(true)
  })

  it('remplit les lignes enregistrees et garde l ordre de la definition', () => {
    const lignes = fusionner('VISION', [{ cle: 'mission', valeur: 'Aider les artisans' }])
    expect(lignes.map((l) => l.cle)).toEqual(lignesDefinies('VISION').map((l) => l.cle))
    expect(lignes.find((l) => l.cle === 'mission')?.valeur).toBe('Aider les artisans')
  })

  it('traite une valeur vide ou blanche comme non renseignee', () => {
    const lignes = fusionner('VISION', [
      { cle: 'vision', valeur: '   ' },
      { cle: 'mission', valeur: '' },
      { cle: 'pourquoi', valeur: null },
    ])
    expect(lignes.every((l) => l.valeur === null)).toBe(true)
  })

  // Une cle retiree de la definition ne doit pas ressurgir sans intitule.
  it('ignore une entree dont la cle n existe plus', () => {
    const lignes = fusionner('VISION', [{ cle: 'cle_disparue', valeur: 'orpheline' }])
    expect(lignes.some((l) => l.valeur === 'orpheline')).toBe(false)
  })

  it('numerote les lignes dans l ordre', () => {
    expect(fusionner('CHIFFRES', []).map((l) => l.rang)).toEqual([0, 1, 2, 3])
  })
})

describe('completude', () => {
  it('rend 0 sur un coffre vide et 100 sur un coffre plein', () => {
    expect(completude(fusionner('VISION', []))).toBe(0)
    const pleines = lignesDefinies('VISION').map((l) => ({ cle: l.cle, valeur: 'x' }))
    expect(completude(fusionner('VISION', pleines))).toBe(100)
  })

  it('arrondit la part remplie', () => {
    const lignes = fusionner('VISION', [{ cle: 'vision', valeur: 'x' }])
    expect(completude(lignes)).toBe(25)
  })

  it('ne divise pas par zero', () => {
    expect(completude([])).toBe(0)
  })
})

describe('coffreComplet', () => {
  it('rend les cinq axes meme sans aucune entree', () => {
    const synthese = coffreComplet([])
    expect(synthese).toHaveLength(5)
    expect(synthese.every((a) => a.renseignees.length === 0)).toBe(true)
  })

  it('range chaque entree sous son axe', () => {
    const synthese = coffreComplet([
      { axe: 'VISION', cle: 'mission', valeur: 'Aider les artisans' },
      { axe: 'OFFRES', cle: 'client_ideal', valeur: 'Menuisier installé' },
    ])
    const vision = synthese.find((a) => a.axe === 'VISION')!
    const offres = synthese.find((a) => a.axe === 'OFFRES')!
    expect(vision.renseignees.map((l) => l.cle)).toEqual(['mission'])
    expect(offres.renseignees.map((l) => l.cle)).toEqual(['client_ideal'])
  })

  it('porte le titre et le chemin de chaque axe', () => {
    const vision = coffreComplet([]).find((a) => a.axe === 'VISION')!
    expect(vision.titre).toBe('Vision CEO')
    expect(vision.chemin).toBe('/axe1')
  })
})

describe('completudeGlobale', () => {
  it('rend 0 sur un coffre vide', () => {
    expect(completudeGlobale(coffreComplet([]))).toBe(0)
  })

  // Une moyenne des parts par axe donnerait un autre chiffre : un axe de trois
  // lignes ne pese pas autant qu'un axe de quatre.
  it('compte les lignes, pas les axes', () => {
    const total = coffreComplet([]).reduce((s, a) => s + a.lignes.length, 0)
    const une = completudeGlobale(
      coffreComplet([{ axe: 'COMMUNICATION', cle: 'canal', valeur: 'LinkedIn' }]),
    )
    expect(une).toBe(Math.round((1 / total) * 100))
  })

  it('rend 100 quand tout est renseigne', () => {
    const toutes = AXES.flatMap((axe) =>
      lignesDefinies(axe).map((l) => ({ axe, cle: l.cle, valeur: 'x' })),
    )
    expect(completudeGlobale(coffreComplet(toutes))).toBe(100)
  })
})
