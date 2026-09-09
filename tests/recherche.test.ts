import { describe, it, expect } from 'vitest'
import { contient, correspond } from '@/lib/recherche'

describe('contient', () => {
  it('ignore les accents dans les deux sens', () => {
    expect(contient('Lefèvre & Associés', 'lefevre')).toBe(true)
    expect(contient('Lefevre', 'lefèvre')).toBe(true)
  })

  it('ignore la casse', () => {
    expect(contient('URSSAF', 'urssaf')).toBe(true)
  })

  it('accepte tout quand la recherche est vide ou blanche', () => {
    expect(contient('quoi que ce soit', '')).toBe(true)
    expect(contient('quoi que ce soit', '   ')).toBe(true)
  })

  it('tolere les espaces autour de la recherche', () => {
    expect(contient('Atelier Lumiere', '  lumiere ')).toBe(true)
  })

  it('renvoie faux quand le texte ne correspond pas', () => {
    expect(contient('Atelier Lumiere', 'bergamote')).toBe(false)
  })

  it('traite un texte absent comme une chaine vide', () => {
    expect(contient(null, 'x')).toBe(false)
    expect(contient(undefined, 'x')).toBe(false)
    expect(contient(null, '')).toBe(true)
  })
})

describe('correspond', () => {
  it('accepte des qu un seul champ correspond', () => {
    expect(correspond(['Karim Benali', null, 'Design graphique'], 'graphique')).toBe(true)
  })

  it('refuse quand aucun champ ne correspond', () => {
    expect(correspond(['Karim Benali', null, 'Design'], 'cosmetique')).toBe(false)
  })

  it('accepte tout sur une recherche vide, meme sans aucun champ', () => {
    expect(correspond([], '')).toBe(true)
  })
})
