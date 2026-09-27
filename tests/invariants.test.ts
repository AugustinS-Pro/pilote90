import { describe, it, expect } from 'vitest'
import {
  MAX_PRIORITES_PAR_CYCLE,
  MAX_THEMATIQUES,
  placeDisponible,
  depassement,
} from '@/lib/invariants'

describe('plafonds', () => {
  it('reprend les nombres annonces a l ecran', () => {
    expect(MAX_PRIORITES_PAR_CYCLE).toBe(3)
    expect(MAX_THEMATIQUES).toBe(5)
  })
})

describe('placeDisponible', () => {
  it('offre l ajout sous le plafond', () => {
    expect(placeDisponible(0, 3)).toBe(true)
    expect(placeDisponible(2, 3)).toBe(true)
  })

  it('ferme l ajout au plafond', () => {
    expect(placeDisponible(3, 3)).toBe(false)
  })

  it('reste ferme au-dela du plafond', () => {
    // Le cas d'une base deja en depassement : l'ajout ne se rouvre pas.
    expect(placeDisponible(8, 3)).toBe(false)
  })
})

describe('depassement', () => {
  it('ne signale rien quand la regle est tenue', () => {
    expect(depassement(0, 3)).toBe(0)
    expect(depassement(3, 3)).toBe(0)
  })

  it('compte les elements en trop', () => {
    expect(depassement(8, 3)).toBe(5)
    expect(depassement(6, 5)).toBe(1)
  })

  it('ne descend jamais sous zero', () => {
    expect(depassement(1, 3)).toBe(0)
  })
})
