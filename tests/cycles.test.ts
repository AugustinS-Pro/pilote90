import { describe, it, expect } from 'vitest'
import {
  mesurerCycle,
  comparerCycles,
  libelleEcart,
  TON_ECART,
  type CycleMesurable,
} from '@/lib/cycles'

const priorite = (progressPct: number, status = 'IN_PROGRESS') => ({ progressPct, status })
const semaine = (revue: boolean) => ({ review: revue ? {} : null })

const cycle = (
  cycleNumber: number,
  objectives: { progressPct: number; status: string }[],
  weeks: { review: unknown | null }[],
): CycleMesurable => ({
  cycleNumber,
  startDate: new Date(2026, 0, 1),
  endDate: new Date(2026, 2, 31),
  objectives,
  weeks,
})

describe('mesurerCycle', () => {
  it('mesure un cycle vide sans diviser par zero', () => {
    expect(mesurerCycle(cycle(1, [], []))).toMatchObject({
      priorites: 0,
      progressionMoyenne: 0,
      assiduite: 0,
    })
  })

  it('moyenne les avancements et arrondit', () => {
    const m = mesurerCycle(cycle(1, [priorite(100), priorite(50), priorite(33)], []))
    expect(m.progressionMoyenne).toBe(61)
  })

  it('compte les priorites terminees sur leur statut, pas sur leur avancement', () => {
    const m = mesurerCycle(
      cycle(1, [priorite(100, 'COMPLETED'), priorite(100, 'LATE'), priorite(20)], []),
    )
    expect(m.prioritesTerminees).toBe(1)
  })

  it('mesure l assiduite sur les semaines dont la revue est remplie', () => {
    const m = mesurerCycle(cycle(1, [], [semaine(true), semaine(true), semaine(false), semaine(false)]))
    expect(m.semainesRevues).toBe(2)
    expect(m.assiduite).toBe(50)
  })

  it('compte les jours du cycle', () => {
    expect(mesurerCycle(cycle(1, [], [])).jours).toBe(89)
  })
})

describe('comparerCycles', () => {
  it('ne compare rien sans cycle precedent', () => {
    expect(comparerCycles(cycle(1, [], []), null)).toBeNull()
  })

  it('rend les ecarts dans le bon sens', () => {
    const c = comparerCycles(
      cycle(2, [priorite(80, 'COMPLETED'), priorite(60)], [semaine(true), semaine(true)]),
      cycle(1, [priorite(40)], [semaine(true), semaine(false)]),
    )
    expect(c).not.toBeNull()
    expect(c!.numeroPrecedent).toBe(1)
    expect(c!.progression).toEqual({ delta: 30, sens: 'HAUSSE' })
    expect(c!.prioritesTerminees).toEqual({ delta: 1, sens: 'HAUSSE' })
    expect(c!.assiduite).toEqual({ delta: 50, sens: 'HAUSSE' })
  })

  it('reconnait une baisse et une stabilite', () => {
    const c = comparerCycles(
      cycle(3, [priorite(20)], [semaine(true)]),
      cycle(2, [priorite(60)], [semaine(true)]),
    )
    expect(c!.progression.sens).toBe('BAISSE')
    expect(c!.assiduite.sens).toBe('STABLE')
  })
})

describe('libelleEcart', () => {
  it('accorde le pluriel et pose le signe', () => {
    expect(libelleEcart({ delta: 12, sens: 'HAUSSE' }, 'points')).toBe('+ 12 points')
    expect(libelleEcart({ delta: 1, sens: 'HAUSSE' }, 'points')).toBe('+ 1 point')
    expect(libelleEcart({ delta: -2, sens: 'BAISSE' }, 'priorites')).toBe('− 2 priorités')
    expect(libelleEcart({ delta: 0, sens: 'STABLE' }, 'points')).toBe('stable')
  })
})

describe('TON_ECART', () => {
  // Une baisse est une information, pas une alerte : le ton reste mesure.
  it('ne traite pas une baisse en alerte', () => {
    expect(TON_ECART.BAISSE).toBe('attente')
  })
})
