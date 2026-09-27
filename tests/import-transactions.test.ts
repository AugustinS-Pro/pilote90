import { describe, it, expect } from 'vitest'
import {
  lireTransactionsCsv,
  decouperLigne,
  lireDateFrancaise,
} from '@/lib/import-transactions'

const ENTETE = '"Date";"Type";"Libellé";"Catégorie";"Montant HT (euros)"'

const fichier = (...lignes: string[]) => [ENTETE, ...lignes].join('\r\n')

describe('decouperLigne', () => {
  it('decoupe sur le point-virgule', () => {
    expect(decouperLigne('a;b;c')).toEqual(['a', 'b', 'c'])
  })

  it('respecte les guillemets', () => {
    expect(decouperLigne('"Conseil; et suivi";"Charge"')).toEqual(['Conseil; et suivi', 'Charge'])
  })

  it('rend un guillemet double a sa valeur', () => {
    expect(decouperLigne('"Facture ""Atelier"""')).toEqual(['Facture "Atelier"'])
  })

  it('garde les cellules vides', () => {
    expect(decouperLigne('a;;c')).toEqual(['a', '', 'c'])
  })
})

describe('lireDateFrancaise', () => {
  it('lit jour/mois/annee', () => {
    const d = lireDateFrancaise('15/09/2026')
    expect(d?.getFullYear()).toBe(2026)
    expect(d?.getMonth()).toBe(8)
    expect(d?.getDate()).toBe(15)
  })

  it('accepte le point et le tiret', () => {
    expect(lireDateFrancaise('01.03.2026')?.getMonth()).toBe(2)
    expect(lireDateFrancaise('1-3-2026')?.getMonth()).toBe(2)
  })

  // Sans controle, le 31 fevrier devient le 3 mars et personne ne le voit.
  it('refuse une date qui n existe pas au calendrier', () => {
    expect(lireDateFrancaise('31/02/2026')).toBeNull()
    expect(lireDateFrancaise('32/01/2026')).toBeNull()
    expect(lireDateFrancaise('15/13/2026')).toBeNull()
  })

  it('refuse le format anglais et le texte', () => {
    expect(lireDateFrancaise('2026-09-15')).toBeNull()
    expect(lireDateFrancaise('hier')).toBeNull()
  })
})

describe('lireTransactionsCsv', () => {
  it('signale un fichier sans entete attendu', () => {
    const lecture = lireTransactionsCsv('n importe quoi;vraiment')
    expect(lecture.enteteIntrouvable).toBe(true)
    expect(lecture.transactions).toEqual([])
  })

  it('lit une ligne complete', () => {
    const lecture = lireTransactionsCsv(
      fichier('"15/09/2026";"Revenu";"Acompte Atelier";"Prestation";"1 250,50"'),
    )
    expect(lecture.enteteIntrouvable).toBe(false)
    expect(lecture.refusees).toEqual([])
    expect(lecture.transactions).toHaveLength(1)
    expect(lecture.transactions[0]).toMatchObject({
      type: 'REVENUE',
      label: 'Acompte Atelier',
      category: 'Prestation',
      amountHt: 125_050,
    })
  })

  it('reconnait les deux types, avec ou sans accent', () => {
    const lecture = lireTransactionsCsv(
      fichier(
        '"01/09/2026";"Revenu";"a";"";"10"',
        '"01/09/2026";"Charge";"b";"";"10"',
        '"01/09/2026";"REVENUE";"c";"";"10"',
        '"01/09/2026";"dépense";"d";"";"10"',
      ),
    )
    expect(lecture.transactions.map((t) => t.type)).toEqual([
      'REVENUE', 'EXPENSE', 'REVENUE', 'EXPENSE',
    ])
  })

  it('laisse la categorie vide a null', () => {
    const lecture = lireTransactionsCsv(fichier('"01/09/2026";"Revenu";"a";"";"10"'))
    expect(lecture.transactions[0].category).toBeNull()
  })

  // Un fichier de deux cents ecritures ne doit pas etre refuse en bloc.
  it('refuse ligne par ligne, avec le numero et la raison', () => {
    const lecture = lireTransactionsCsv(
      fichier(
        '"01/09/2026";"Revenu";"bonne";"";"10"',
        '"31/02/2026";"Revenu";"date fausse";"";"10"',
        '"01/09/2026";"Virement";"type inconnu";"";"10"',
        '"01/09/2026";"Revenu";"";"";"10"',
        '"01/09/2026";"Revenu";"montant nul";"";"0"',
        '"01/09/2026";"Revenu";"colonnes manquantes"',
      ),
    )
    expect(lecture.transactions).toHaveLength(1)
    expect(lecture.refusees.map((r) => r.raison)).toEqual([
      'Date illisible',
      'Type inconnu, attendu Revenu ou Charge',
      'Libelle vide',
      'Montant invalide',
      'Colonnes manquantes',
    ])
    expect(lecture.refusees[0].ligne).toBe(3)
  })

  // L'export ecrit sa synthese mensuelle apres une ligne vide.
  it('s arrete a la ligne vide et ignore la synthese', () => {
    const lecture = lireTransactionsCsv(
      [
        '"Pilote90, export comptable, Marie & Co"',
        '"Généré le 27/09/2026"',
        '',
        ENTETE,
        '"01/09/2026";"Revenu";"a";"";"10"',
        '',
        '"Synthèse mensuelle sur douze mois glissants"',
        '"Mois";"CA (euros)";"Charges (euros)";"Net (euros)"',
        '"2026-09";"1000";"400";"600"',
      ].join('\r\n'),
    )
    expect(lecture.transactions).toHaveLength(1)
    expect(lecture.refusees).toEqual([])
  })

  it('supporte le BOM et les fins de ligne simples', () => {
    const lecture = lireTransactionsCsv(
      '﻿' + [ENTETE, '"01/09/2026";"Revenu";"a";"";"10"'].join('\n'),
    )
    expect(lecture.transactions).toHaveLength(1)
  })

  it('tronque les champs trop longs plutot que de refuser la ligne', () => {
    const lecture = lireTransactionsCsv(
      fichier(`"01/09/2026";"Revenu";"${'x'.repeat(200)}";"${'y'.repeat(100)}";"10"`),
    )
    expect(lecture.transactions[0].label).toHaveLength(120)
    expect(lecture.transactions[0].category).toHaveLength(60)
  })
})
