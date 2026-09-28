import { describe, it, expect } from 'vitest'
import { lireXml, enfant, enfants, chemin, texteAu, resoudreEntites } from '@/lib/xml-minimal'

describe('lireXml', () => {
  it('lit un arbre simple', () => {
    const arbre = lireXml('<a><b>texte</b></a>')
    expect(arbre?.nom).toBe('a')
    expect(texteAu(arbre, 'b')).toBe('texte')
  })

  it('ignore les prefixes d espace de noms', () => {
    const arbre = lireXml('<rsm:Racine><ram:ID>F-2026-001</ram:ID></rsm:Racine>')
    expect(arbre?.nom).toBe('Racine')
    expect(texteAu(arbre, 'ID')).toBe('F-2026-001')
  })

  it('distingue deux elements de meme nom a deux endroits', () => {
    // Le cas qui compte : vendeur et acheteur portent tous deux « Name ».
    const arbre = lireXml(`
      <Facture>
        <Vendeur><Name>Atelier Claire</Name></Vendeur>
        <Acheteur><Name>Pilote et Vous</Name></Acheteur>
      </Facture>
    `)
    expect(texteAu(arbre, 'Vendeur', 'Name')).toBe('Atelier Claire')
    expect(texteAu(arbre, 'Acheteur', 'Name')).toBe('Pilote et Vous')
  })

  it('lit les attributs', () => {
    const arbre = lireXml('<a><montant currencyID="EUR">1200.00</montant></a>')
    expect(enfant(arbre, 'montant')?.attributs.currencyID).toBe('EUR')
  })

  it('accepte les balises auto-fermantes', () => {
    const arbre = lireXml('<a><vide /><b>x</b></a>')
    expect(arbre?.enfants.map((e) => e.nom)).toEqual(['vide', 'b'])
    expect(texteAu(arbre, 'b')).toBe('x')
  })

  it('resout les entites', () => {
    expect(texteAu(lireXml('<a><b>Pens&#233;e &amp; co</b></a>'), 'b')).toBe('Pensée & co')
  })

  it('retire le prologue, les commentaires et la DTD', () => {
    const arbre = lireXml('<?xml version="1.0"?><!-- note --><a><b>1</b></a>')
    expect(texteAu(arbre, 'b')).toBe('1')
  })

  it('lit une section CDATA sans y resoudre d entites', () => {
    expect(texteAu(lireXml('<a><b><![CDATA[a & b < c]]></b></a>'), 'b')).toBe('a & b < c')
  })

  it('rend plusieurs enfants de meme nom', () => {
    const arbre = lireXml('<a><l>1</l><l>2</l><l>3</l></a>')
    expect(enfants(arbre, 'l').map((e) => e.texte)).toEqual(['1', '2', '3'])
  })

  it('refuse un document dont les balises ne se referment pas', () => {
    expect(lireXml('<a><b>x</a>')).toBeNull()
    expect(lireXml('<a><b>x</b>')).toBeNull()
  })

  it('refuse deux racines', () => {
    expect(lireXml('<a/><b/>')).toBeNull()
  })

  it('rend null sur du texte qui n est pas du XML', () => {
    expect(lireXml('bonjour')).toBeNull()
  })

  it('rend null pour un chemin absent plutot que de deviner', () => {
    const arbre = lireXml('<a><b>1</b></a>')
    expect(chemin(arbre, 'b', 'c')).toBeNull()
    expect(texteAu(arbre, 'z')).toBeNull()
  })

  it('rend null pour un element vide plutot que la chaine vide', () => {
    expect(texteAu(lireXml('<a><b>   </b></a>'), 'b')).toBeNull()
  })
})

describe('resoudreEntites', () => {
  it('laisse une entite inconnue telle quelle', () => {
    expect(resoudreEntites('&inconnue;')).toBe('&inconnue;')
  })

  it('lit les formes numeriques decimale et hexadecimale', () => {
    expect(resoudreEntites('&#8364; &#x20AC;')).toBe('€ €')
  })
})
