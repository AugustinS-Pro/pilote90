import { describe, it, expect } from 'vitest'
import { echeancesASignaler, TON_ECHEANCE, type Echeance } from '@/lib/echeances'

const REF = new Date(2026, 8, 15, 12, 0, 0) // 15 septembre 2026, heure locale

const le = (jour: number, mois = 8, annee = 2026) => new Date(annee, mois, jour, 9)

const echeance = (id: string, dueDate: Date, done = false): Echeance => ({
  id, label: `Echeance ${id}`, dueDate, done,
})

describe('echeancesASignaler', () => {
  it('ne signale rien sans echeance', () => {
    expect(echeancesASignaler([], REF)).toEqual([])
  })

  it('ignore les echeances deja faites', () => {
    expect(echeancesASignaler([echeance('a', le(16), true)], REF)).toEqual([])
  })

  it('classe de la plus urgente a la plus lointaine', () => {
    const resultat = echeancesASignaler(
      [echeance('c', le(30)), echeance('a', le(10)), echeance('b', le(16))],
      REF,
    )
    expect(resultat.map((e) => e.id)).toEqual(['a', 'b', 'c'])
  })

  it('qualifie chaque echeance', () => {
    const resultat = echeancesASignaler(
      [echeance('passee', le(10)), echeance('jour', le(15)), echeance('semaine', le(18)), echeance('loin', le(5, 9))],
      REF,
    )
    expect(resultat.map((e) => e.urgence)).toEqual([
      'DEPASSEE', 'AUJOURDHUI', 'CETTE_SEMAINE', 'A_VENIR',
    ])
  })

  it('compte les jours en calendaire, sans se laisser prendre par l heure', () => {
    const resultat = echeancesASignaler([echeance('a', new Date(2026, 8, 16, 1))], REF)
    expect(resultat[0].jours).toBe(1)
    expect(resultat[0].libelle).toBe('Demain')
  })

  it('ecarte ce qui depasse l horizon', () => {
    const resultat = echeancesASignaler([echeance('a', le(30, 9))], REF)
    expect(resultat).toEqual([])
  })

  // Un retard qui dure ne cesse pas de compter.
  it('garde une echeance depassee de longue date', () => {
    const resultat = echeancesASignaler([echeance('a', le(1, 5))], REF)
    expect(resultat).toHaveLength(1)
    expect(resultat[0].urgence).toBe('DEPASSEE')
  })

  it('formule le retard et l avance en francais', () => {
    const resultat = echeancesASignaler(
      [echeance('a', le(14)), echeance('b', le(11)), echeance('c', le(15)), echeance('d', le(20))],
      REF,
    )
    expect(resultat.map((e) => e.libelle)).toEqual([
      'En retard de 4 jours', 'En retard depuis hier', "Aujourd'hui", 'Dans 5 jours',
    ])
  })
})

describe('TON_ECHEANCE', () => {
  it('couvre les quatre urgences', () => {
    expect(Object.keys(TON_ECHEANCE)).toHaveLength(4)
  })
})
