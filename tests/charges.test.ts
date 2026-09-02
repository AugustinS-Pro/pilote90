import { describe, it, expect } from 'vitest'
import {
  tauxTotal, caNecessaire, clientsNecessaires,
  chargesEstimees, revenuNet, joursAvant,
} from '@/lib/charges'

/**
 * Les six formules que la version Notion fait recopier a la main.
 * Une erreur ici se propage a tout l'axe Chiffres & Administratif.
 */

const TAUX_MICRO = { socialContributionPct: 21.2, incomeTaxPct: 2.2, trainingPct: 0.2 }

describe('tauxTotal', () => {
  it('additionne les trois taux', () => {
    expect(tauxTotal(TAUX_MICRO)).toBe(23.6)
  })

  it('evite les artefacts de virgule flottante', () => {
    expect(tauxTotal({ socialContributionPct: 0.1, incomeTaxPct: 0.2, trainingPct: 0 })).toBe(0.3)
  })

  it('renvoie zero quand rien n est renseigne', () => {
    expect(tauxTotal({ socialContributionPct: 0, incomeTaxPct: 0, trainingPct: 0 })).toBe(0)
  })
})

describe('caNecessaire', () => {
  it('remonte du revenu net vise au chiffre d affaires a realiser', () => {
    // 2 000 € nets avec 20 % de charges : 2000 / 0,8 = 2 500 €
    expect(caNecessaire(200000, 20)).toBe(250000)
  })

  it('renvoie le revenu vise lui-meme quand il n y a aucune charge', () => {
    expect(caNecessaire(200000, 0)).toBe(200000)
  })

  it('refuse de calculer au-dela de 100 % de charges plutot que de renvoyer un infini', () => {
    expect(caNecessaire(200000, 100)).toBeNull()
    expect(caNecessaire(200000, 130)).toBeNull()
  })
})

describe('clientsNecessaires', () => {
  it('arrondit au superieur : un demi-client n existe pas', () => {
    expect(clientsNecessaires(250000, 100000)).toBe(3)
  })

  it('tombe juste quand le CA est un multiple du prix', () => {
    expect(clientsNecessaires(300000, 100000)).toBe(3)
  })

  it('ne divise pas par un prix nul', () => {
    expect(clientsNecessaires(250000, 0)).toBeNull()
  })

  it('propage l impossibilite du CA necessaire', () => {
    expect(clientsNecessaires(null, 100000)).toBeNull()
  })
})

describe('chargesEstimees et revenuNet', () => {
  it('applique le taux au chiffre d affaires', () => {
    expect(chargesEstimees(100000, 23.6)).toBe(23600)
  })

  it('deduit le revenu net du chiffre d affaires', () => {
    expect(revenuNet(100000, 23.6)).toBe(76400)
  })

  it('laisse le revenu net egal au CA sans charges', () => {
    expect(revenuNet(100000, 0)).toBe(100000)
  })

  it('reste coherent : CA = charges + net', () => {
    const ca = 543210
    expect(chargesEstimees(ca, 23.6) + revenuNet(ca, 23.6)).toBe(ca)
  })
})

describe('joursAvant', () => {
  const reference = new Date('2026-09-15T08:00:00Z')

  it('compte les jours restants', () => {
    expect(joursAvant(new Date('2026-09-25T20:00:00Z'), reference)).toBe(10)
  })

  it('renvoie zero le jour meme, quelle que soit l heure', () => {
    expect(joursAvant(new Date('2026-09-15T23:00:00Z'), reference)).toBe(0)
  })

  it('renvoie un nombre negatif pour une echeance depassee', () => {
    expect(joursAvant(new Date('2026-09-10T00:00:00Z'), reference)).toBe(-5)
  })
})
