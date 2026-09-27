/**
 * Lecture d'un fichier CSV de transactions.
 *
 * Pendant de l'export comptable, et premiere marche vers une reprise de
 * l'existant sans dependre d'un connecteur. Le format lu est exactement celui
 * que l'application ecrit : un aller-retour doit rendre le meme dossier.
 *
 * Aucune ligne n'est perdue en silence. Une ligne illisible est rapportee avec
 * son numero et sa raison, et les autres passent : un fichier de deux cents
 * ecritures ne doit pas etre refuse en bloc pour une date mal tapee.
 *
 * Fonction pure : elle recoit du texte, elle rend des lignes et des erreurs.
 */

import { eurosVersCentimes } from './validation'

export type TransactionLue = {
  type: 'REVENUE' | 'EXPENSE'
  transactionDate: Date
  label: string
  category: string | null
  amountHt: number
}

export type LigneRefusee = { ligne: number; raison: string; contenu: string }

export type LectureCsv = {
  transactions: TransactionLue[]
  refusees: LigneRefusee[]
  /** Vrai quand la ligne d'entete attendue n'a jamais ete trouvee. */
  enteteIntrouvable: boolean
}

const COLONNES = ['date', 'type', 'libelle', 'categorie', 'montant']

function sansAccent(valeur: string): string {
  return valeur.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

/** Decoupe une ligne CSV en respectant les guillemets et les "" echappes. */
export function decouperLigne(ligne: string, separateur = ';'): string[] {
  const cellules: string[] = []
  let courante = ''
  let dansGuillemets = false

  for (let i = 0; i < ligne.length; i++) {
    const c = ligne[i]
    if (dansGuillemets) {
      if (c === '"') {
        if (ligne[i + 1] === '"') { courante += '"'; i++ } else { dansGuillemets = false }
      } else {
        courante += c
      }
    } else if (c === '"') {
      dansGuillemets = true
    } else if (c === separateur) {
      cellules.push(courante.trim()); courante = ''
    } else {
      courante += c
    }
  }
  cellules.push(courante.trim())
  return cellules
}

/** Date francaise jour/mois/annee. Rend `null` si elle n'existe pas au calendrier. */
export function lireDateFrancaise(valeur: string): Date | null {
  const m = valeur.trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  if (!m) return null
  const [, j, mois, annee] = m.map(Number) as unknown as [string, number, number, number]
  const date = new Date(annee, mois - 1, j, 12)
  // Le 31 fevrier deviendrait le 3 mars sans ce controle.
  if (date.getFullYear() !== annee || date.getMonth() !== mois - 1 || date.getDate() !== j) {
    return null
  }
  return date
}

function lireType(valeur: string): 'REVENUE' | 'EXPENSE' | null {
  const v = sansAccent(valeur)
  if (v === 'revenu' || v === 'revenue' || v === 'recette') return 'REVENUE'
  if (v === 'charge' || v === 'expense' || v === 'depense') return 'EXPENSE'
  return null
}

/** L'entete attendu : ses cinq colonnes, dans cet ordre, accents et casse libres. */
function estEntete(cellules: string[]): boolean {
  if (cellules.length < COLONNES.length) return false
  return COLONNES.every((attendue, i) => sansAccent(cellules[i]).startsWith(attendue))
}

export function lireTransactionsCsv(contenu: string): LectureCsv {
  const lignes = contenu.replace(/^﻿/, '').split(/\r?\n/)

  const indexEntete = lignes.findIndex((l) => estEntete(decouperLigne(l)))
  if (indexEntete === -1) {
    return { transactions: [], refusees: [], enteteIntrouvable: true }
  }

  const transactions: TransactionLue[] = []
  const refusees: LigneRefusee[] = []

  for (let i = indexEntete + 1; i < lignes.length; i++) {
    const brut = lignes[i]
    const cellules = decouperLigne(brut)

    // Une ligne vide ferme le tableau : l'export ecrit ensuite sa synthese
    // mensuelle, qui n'a rien a faire dans les ecritures.
    if (cellules.every((c) => c === '')) break

    const numero = i + 1
    const refuser = (raison: string) => refusees.push({ ligne: numero, raison, contenu: brut })

    if (cellules.length < COLONNES.length) { refuser('Colonnes manquantes'); continue }

    const [dateBrute, typeBrut, label, categorie, montantBrut] = cellules

    const transactionDate = lireDateFrancaise(dateBrute)
    if (!transactionDate) { refuser('Date illisible'); continue }

    const type = lireType(typeBrut)
    if (!type) { refuser('Type inconnu, attendu Revenu ou Charge'); continue }

    if (!label.trim()) { refuser('Libelle vide'); continue }

    const amountHt = eurosVersCentimes(montantBrut)
    if (amountHt === null) { refuser('Montant invalide'); continue }

    transactions.push({
      type,
      transactionDate,
      label: label.trim().slice(0, 120),
      category: categorie.trim() ? categorie.trim().slice(0, 60) : null,
      amountHt,
    })
  }

  return { transactions, refusees, enteteIntrouvable: false }
}
