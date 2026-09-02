import { describe, it, expect } from 'vitest'
import { evaluerFraicheur } from '@/lib/fraicheur'

/** Dates locales : un horodatage UTC ferait dependre le test du fuseau. */
const local = (annee: number, mois: number, jour: number, heure = 12) =>
  new Date(annee, mois - 1, jour, heure, 0, 0, 0)

const reference = local(2026, 9, 2)
const saisie = (d: Date) => ({ createdAt: d })

describe('dossier sans aucune saisie', () => {
  it('renvoie le niveau JAMAIS sans nombre de jours', () => {
    const f = evaluerFraicheur([], reference)
    expect(f.niveau).toBe('JAMAIS')
    expect(f.jours).toBeNull()
    expect(f.derniere).toBeNull()
  })
})

describe('niveaux', () => {
  it('est actif en dessous de vingt et un jours', () => {
    expect(evaluerFraicheur([saisie(local(2026, 8, 20))], reference).niveau).toBe('ACTIF')
  })

  it('bascule a relancer a vingt et un jours pile', () => {
    expect(evaluerFraicheur([saisie(local(2026, 8, 12))], reference).niveau).toBe('A_RELANCER')
  })

  it('bascule decroche a quarante-cinq jours pile', () => {
    expect(evaluerFraicheur([saisie(local(2026, 7, 19))], reference).niveau).toBe('DECROCHE')
  })
})

describe('derniere saisie', () => {
  it('retient la plus recente, quel que soit l ordre de la liste', () => {
    const f = evaluerFraicheur(
      [saisie(local(2026, 5, 1)), saisie(local(2026, 8, 30)), saisie(local(2026, 6, 15))],
      reference,
    )
    expect(f.jours).toBe(3)
    expect(f.derniere?.getMonth()).toBe(7)
  })

  it('compte en jours calendaires, pas en tranches de vingt-quatre heures', () => {
    // Saisie hier a 23 h, consultation ce matin a 8 h : neuf heures d ecart,
    // mais bien un jour de calendrier.
    const f = evaluerFraicheur([saisie(local(2026, 9, 1, 23))], local(2026, 9, 2, 8))
    expect(f.jours).toBe(1)
    expect(f.libelle).toBe('Saisie hier')
  })

  it('reste juste au passage a l heure d hiver', () => {
    const f = evaluerFraicheur([saisie(local(2026, 10, 24))], local(2026, 10, 26))
    expect(f.jours).toBe(2)
  })

  it('ne renvoie jamais de nombre negatif pour une saisie dans le futur', () => {
    expect(evaluerFraicheur([saisie(local(2026, 12, 1))], reference).jours).toBe(0)
  })
})
