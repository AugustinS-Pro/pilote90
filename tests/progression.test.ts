import { describe, it, expect } from 'vitest'
import {
  progressionDeduite,
  progressionEstSaisissable,
  statutDeduit,
} from '@/lib/progression'

/**
 * La progression d'une priorite avait deux auteurs : un curseur et un recalcul.
 * Ces tests fixent la regle qui tranche - les taches gagnent des qu'il y en a -
 * pour que le defaut ne puisse pas revenir par une autre porte.
 */

const fait = { done: true }
const aFaire = { done: false }

describe('progressionDeduite', () => {
  it('ne deduit rien sans tache rattachee', () => {
    expect(progressionDeduite([])).toBeNull()
  })

  it('rend 0 quand aucune tache n est faite', () => {
    expect(progressionDeduite([aFaire, aFaire])).toBe(0)
  })

  it('rend 50 pour une tache sur deux', () => {
    expect(progressionDeduite([fait, aFaire])).toBe(50)
  })

  it('rend 100 quand tout est fait', () => {
    expect(progressionDeduite([fait, fait, fait])).toBe(100)
  })

  it('arrondit a l entier : une sur trois donne 33', () => {
    expect(progressionDeduite([fait, aFaire, aFaire])).toBe(33)
  })

  it('arrondit deux sur trois a 67', () => {
    expect(progressionDeduite([fait, fait, aFaire])).toBe(67)
  })

  it('ne sort jamais de l intervalle 0-100', () => {
    for (let total = 1; total <= 12; total++) {
      for (let faites = 0; faites <= total; faites++) {
        const taches = [
          ...Array(faites).fill(fait),
          ...Array(total - faites).fill(aFaire),
        ]
        const pct = progressionDeduite(taches)
        expect(pct).not.toBeNull()
        expect(pct as number).toBeGreaterThanOrEqual(0)
        expect(pct as number).toBeLessThanOrEqual(100)
      }
    }
  })
})

describe('progressionEstSaisissable', () => {
  it('autorise la saisie manuelle sans tache rattachee', () => {
    expect(progressionEstSaisissable(0)).toBe(true)
  })

  it('refuse la saisie manuelle des la premiere tache rattachee', () => {
    expect(progressionEstSaisissable(1)).toBe(false)
    expect(progressionEstSaisissable(7)).toBe(false)
  })
})

describe('statutDeduit', () => {
  it('ne conclut une priorite qu a 100 %', () => {
    expect(statutDeduit(100)).toBe('COMPLETED')
    expect(statutDeduit(99)).toBe('IN_PROGRESS')
    expect(statutDeduit(0)).toBe('IN_PROGRESS')
  })
})

describe('la regle, vue de bout en bout', () => {
  it('une priorite avec taches n est jamais saisissable, et sa valeur est deduite', () => {
    const taches = [fait, aFaire]
    expect(progressionEstSaisissable(taches.length)).toBe(false)
    expect(progressionDeduite(taches)).toBe(50)
  })

  it('une priorite sans tache est saisissable, et rien ne se deduit', () => {
    expect(progressionEstSaisissable(0)).toBe(true)
    expect(progressionDeduite([])).toBeNull()
  })
})
