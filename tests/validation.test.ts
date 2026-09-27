import { describe, it, expect } from 'vitest'
import { eurosVersCentimes, versPourcentage } from '@/lib/validation'

/**
 * eurosVersCentimes est sur le chemin de chaque montant saisi, et une erreur
 * d'echelle y vaut un facteur cent. Elle n'avait aucun test.
 *
 * Rappel de convention : tous les montants sont en CENTIMES.
 */

describe('eurosVersCentimes', () => {
  it('convertit un entier en centimes', () => {
    expect(eurosVersCentimes('12')).toBe(1200)
  })

  it('accepte la virgule decimale francaise', () => {
    expect(eurosVersCentimes('12,50')).toBe(1250)
  })

  it('accepte aussi le point decimal', () => {
    expect(eurosVersCentimes('12.50')).toBe(1250)
  })

  it('ignore les espaces de separation des milliers', () => {
    expect(eurosVersCentimes('1 234,56')).toBe(123456)
    expect(eurosVersCentimes(' 42 ')).toBe(4200)
  })

  // Le piege classique : 19.99 * 100 vaut 1998.9999999999998 en binaire.
  it('ne perd pas un centime sur les valeurs qui tombent mal en binaire', () => {
    expect(eurosVersCentimes('19,99')).toBe(1999)
    expect(eurosVersCentimes('0,07')).toBe(7)
    expect(eurosVersCentimes('0,29')).toBe(29)
    expect(eurosVersCentimes('8,15')).toBe(815)
  })

  it('arrondit au centime au-dela de deux decimales', () => {
    expect(eurosVersCentimes('12,345')).toBe(1235)
    expect(eurosVersCentimes('12,344')).toBe(1234)
  })

  it('refuse zero et les montants negatifs', () => {
    expect(eurosVersCentimes('0')).toBeNull()
    expect(eurosVersCentimes('0,00')).toBeNull()
    expect(eurosVersCentimes('-5')).toBeNull()
  })

  it('refuse une saisie vide ou non numerique', () => {
    expect(eurosVersCentimes('')).toBeNull()
    expect(eurosVersCentimes('   ')).toBeNull()
    expect(eurosVersCentimes('abc')).toBeNull()
    expect(eurosVersCentimes('12,5,3')).toBeNull()
    expect(eurosVersCentimes('Infinity')).toBeNull()
    expect(eurosVersCentimes('NaN')).toBeNull()
  })

  it('refuse au-dela de dix millions d euros, et accepte la borne', () => {
    expect(eurosVersCentimes('10000000')).toBe(1000000000)
    expect(eurosVersCentimes('10000001')).toBeNull()
  })

  // Comportement constate, pas recherche : Number() lit la notation
  // scientifique. Sans consequence ici - la borne haute tient - mais autant
  // que ce soit ecrit noir sur blanc plutot que decouvert un jour en production.
  it('accepte la notation scientifique, dans les bornes', () => {
    expect(eurosVersCentimes('1e3')).toBe(100000)
    expect(eurosVersCentimes('1e9')).toBeNull()
  })

  it('reste toujours un entier', () => {
    for (const saisie of ['0,01', '1,005', '999,999', '3,14159', '7 000,5']) {
      const centimes = eurosVersCentimes(saisie)
      expect(centimes).not.toBeNull()
      expect(Number.isInteger(centimes as number)).toBe(true)
    }
  })
})

describe('versPourcentage', () => {
  it('borne dans l intervalle 0-100', () => {
    expect(versPourcentage('-10')).toBe(0)
    expect(versPourcentage('150')).toBe(100)
    expect(versPourcentage('50')).toBe(50)
  })

  it('arrondit a l entier et accepte la virgule', () => {
    expect(versPourcentage('49,6')).toBe(50)
    expect(versPourcentage('49.4')).toBe(49)
  })

  it('refuse une saisie non numerique', () => {
    expect(versPourcentage('abc')).toBeNull()
  })
})
