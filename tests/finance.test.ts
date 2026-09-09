import { describe, it, expect } from 'vitest'
import {
  calculerIndicateurs,
  serieDouzeMois,
  calculerPrevisionnel,
  auditerFinances,
  messageDeSituation,
  type LigneTransaction,
} from '@/lib/finance'

/**
 * Les calculs financiers sont la partie du produit ou une erreur coute le plus
 * cher : un dirigeant qui decouvre un chiffre faux ne fait plus confiance a
 * l'outil. Ces tests fixent chaque formule.
 *
 * Rappel de convention : tous les montants sont en CENTIMES.
 */

const REFERENCE = new Date('2026-09-15T12:00:00Z')

function jour(decalage: number): Date {
  return new Date(REFERENCE.getTime() - decalage * 86400000)
}

const revenu = (montant: number, decalage: number): LigneTransaction => ({
  type: 'REVENUE', amountHt: montant, transactionDate: jour(decalage),
})

const charge = (montant: number, decalage: number): LigneTransaction => ({
  type: 'EXPENSE', amountHt: montant, transactionDate: jour(decalage),
})

describe('calculerIndicateurs', () => {
  it('additionne les revenus du mois en cours', () => {
    const i = calculerIndicateurs([revenu(100000, 2), revenu(50000, 5)], 0, REFERENCE)
    expect(i.caDuMois).toBe(150000)
  })

  it('ignore les transactions des mois precedents dans le CA du mois', () => {
    const i = calculerIndicateurs([revenu(100000, 2), revenu(999999, 45)], 0, REFERENCE)
    expect(i.caDuMois).toBe(100000)
  })

  it('compte la tresorerie sur tout l historique, pas seulement le mois', () => {
    const i = calculerIndicateurs([revenu(100000, 2), revenu(60000, 45), charge(20000, 50)], 0, REFERENCE)
    expect(i.tresorerie).toBe(140000)
  })

  it('deduit le resultat net des revenus moins les charges du mois', () => {
    const i = calculerIndicateurs([revenu(100000, 2), charge(30000, 3)], 0, REFERENCE)
    expect(i.resultatNet).toBe(70000)
  })

  it('accepte un resultat net negatif', () => {
    const i = calculerIndicateurs([revenu(20000, 2), charge(50000, 3)], 0, REFERENCE)
    expect(i.resultatNet).toBe(-30000)
  })

  it('calcule le ratio de charges en pourcentage entier', () => {
    const i = calculerIndicateurs([revenu(100000, 2), charge(40000, 3)], 0, REFERENCE)
    expect(i.ratioCharges).toBe(40)
  })

  it('renvoie un ratio nul plutot qu une division par zero quand le CA est nul', () => {
    const i = calculerIndicateurs([charge(40000, 3)], 0, REFERENCE)
    expect(i.ratioCharges).toBe(0)
    expect(Number.isFinite(i.ratioCharges)).toBe(true)
  })

  it('mesure la progression vers l objectif mensuel du cycle', () => {
    const i = calculerIndicateurs([revenu(250000, 2)], 500000, REFERENCE)
    expect(i.progressionObjectif).toBe(50)
  })

  it('renvoie zero sur une liste vide, sans planter', () => {
    const i = calculerIndicateurs([], 500000, REFERENCE)
    expect(i).toMatchObject({ tresorerie: 0, caDuMois: 0, chargesDuMois: 0, resultatNet: 0, ratioCharges: 0 })
  })
})

describe('serieDouzeMois', () => {
  it('renvoie toujours douze points, meme sans transaction', () => {
    expect(serieDouzeMois([], REFERENCE)).toHaveLength(12)
  })

  it('se termine sur le mois en cours', () => {
    const points = serieDouzeMois([], REFERENCE)
    expect(points[points.length - 1].cle).toBe('2026-09')
  })

  it('commence onze mois plus tot', () => {
    expect(serieDouzeMois([], REFERENCE)[0].cle).toBe('2025-10')
  })

  it('convertit les centimes en euros', () => {
    const points = serieDouzeMois([revenu(150000, 2)], REFERENCE)
    expect(points[points.length - 1].ca).toBe(1500)
  })

  it('rattache chaque transaction a son mois', () => {
    const points = serieDouzeMois([revenu(100000, 2), revenu(200000, 40)], REFERENCE)
    const septembre = points.find((p) => p.cle === '2026-09')
    const aout = points.find((p) => p.cle === '2026-08')
    expect(septembre?.ca).toBe(1000)
    expect(aout?.ca).toBe(2000)
  })

  it('calcule le net comme la difference du CA et des charges', () => {
    const points = serieDouzeMois([revenu(100000, 2), charge(30000, 3)], REFERENCE)
    const septembre = points.find((p) => p.cle === '2026-09')
    expect(septembre?.net).toBe(700)
  })
})

describe('calculerPrevisionnel', () => {
  const historique = [
    revenu(300000, 5), charge(100000, 6),
    revenu(300000, 35), charge(100000, 36),
    revenu(300000, 65), charge(100000, 66),
  ]

  it('projette six mois', () => {
    expect(calculerPrevisionnel(historique, REFERENCE).points).toHaveLength(6)
  })

  it('classe les trois scenarios dans l ordre attendu', () => {
    const { totaux } = calculerPrevisionnel(historique, REFERENCE)
    expect(totaux.pessimiste).toBeLessThan(totaux.realiste)
    expect(totaux.realiste).toBeLessThan(totaux.optimiste)
  })

  it('etablit sa base sur la moyenne des mois reellement actifs', () => {
    const { baseCa, baseCharges } = calculerPrevisionnel(historique, REFERENCE)
    expect(baseCa).toBe(3000)
    expect(baseCharges).toBe(1000)
  })

  it('ne divise pas par zero sur un historique vide', () => {
    const p = calculerPrevisionnel([], REFERENCE)
    expect(p.baseCa).toBe(0)
    expect(Number.isFinite(p.totaux.realiste)).toBe(true)
  })
})

describe('auditerFinances', () => {
  const previsionnelNeutre = calculerPrevisionnel([], REFERENCE)

  it('alerte quand la tresorerie est negative', () => {
    const i = calculerIndicateurs([charge(50000, 3)], 0, REFERENCE)
    const constats = auditerFinances(i, previsionnelNeutre, 1)
    expect(constats.some((c) => c.niveau === 'ALERTE' && c.titre.includes('Tresorerie'))).toBe(true)
  })

  it('signale un ratio de charges au-dela de 40 %', () => {
    const i = calculerIndicateurs([revenu(100000, 2), charge(45000, 3)], 0, REFERENCE)
    const constats = auditerFinances(i, previsionnelNeutre, 5)
    expect(constats.some((c) => c.titre.includes('Ratio charges'))).toBe(true)
  })

  it('passe en alerte, et non en attention, au-dela de 60 %', () => {
    const i = calculerIndicateurs([revenu(100000, 2), charge(70000, 3)], 0, REFERENCE)
    const ratio = auditerFinances(i, previsionnelNeutre, 5).find((c) => c.titre.includes('Ratio charges'))
    expect(ratio?.niveau).toBe('ALERTE')
  })

  it('ne signale rien sur un ratio de 40 % pile : le seuil est strict', () => {
    const i = calculerIndicateurs([revenu(100000, 2), charge(40000, 3)], 0, REFERENCE)
    const constats = auditerFinances(i, previsionnelNeutre, 5)
    expect(constats.some((c) => c.titre.includes('Ratio charges') && c.niveau !== 'ANALYSE')).toBe(false)
  })

  it('accompagne chaque constat de la regle qui l a declenche', () => {
    const i = calculerIndicateurs([revenu(100000, 2), charge(70000, 3)], 0, REFERENCE)
    for (const c of auditerFinances(i, previsionnelNeutre, 5)) {
      expect(c.regle.length).toBeGreaterThan(10)
    }
  })

  it('classe les alertes avant les attentions, puis les analyses', () => {
    const i = calculerIndicateurs([revenu(100000, 2), charge(200000, 3)], 500000, REFERENCE)
    const niveaux = auditerFinances(i, previsionnelNeutre, 2).map((c) => c.niveau)
    const rang = { ALERTE: 0, ATTENTION: 1, ANALYSE: 2 }
    for (let k = 1; k < niveaux.length; k++) {
      expect(rang[niveaux[k]]).toBeGreaterThanOrEqual(rang[niveaux[k - 1]])
    }
  })
})

describe('messageDeSituation', () => {
  it('annonce une tresorerie saine en l absence de signal', () => {
    expect(messageDeSituation([]).ton).toBe('SAIN')
  })

  it('retient le constat le plus grave', () => {
    const constats = [
      { niveau: 'ANALYSE' as const, titre: 'a', valeur: '1', regle: 'r' },
      { niveau: 'ALERTE' as const, titre: 'b', valeur: '2', regle: 'r' },
      { niveau: 'ATTENTION' as const, titre: 'c', valeur: '3', regle: 'r' },
    ]
    expect(messageDeSituation(constats).ton).toBe('ALERTE')
  })
})
