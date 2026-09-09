import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import type { PDFPage, PDFFont, RGB } from 'pdf-lib'
import {
  calculerIndicateurs, serieDouzeMois, calculerPrevisionnel,
  auditerFinances, messageDeSituation,
} from '@/lib/finance'
import type { PointMensuel, ConstatAudit } from '@/lib/finance'

/**
 * Rapport comptable en PDF, dessine entierement cote serveur.
 *
 * Pendant du CSV : le CSV sert a etre retraite, le PDF sert a etre lu et
 * archive. Les deux partent des memes fonctions de lib/finance.ts — aucun
 * calcul n'est refait ici, sinon les deux exports pourraient diverger.
 *
 * Ce module ne connait ni la session ni la base : il recoit des donnees et
 * rend des octets. Le cloisonnement est l'affaire des routes qui l'appellent,
 * l'une pour l'entrepreneur, l'autre pour son consultant. Une seule mise en
 * page pour les deux, donc aucun risque que les deux documents divergent.
 */

// ---------------------------------------------------------------------------
// Mise en page
// ---------------------------------------------------------------------------

const PAGE = { largeur: 595.28, hauteur: 841.89 } // A4 portrait, en points
const MARGE = 48
const UTILE = PAGE.largeur - MARGE * 2

const ENCRE = rgb(0.059, 0.09, 0.165)
const DOUX = rgb(0.278, 0.333, 0.412)
const PALE = rgb(0.58, 0.639, 0.722)
const TRAIT = rgb(0.886, 0.91, 0.941)
const FOND_PALE = rgb(0.973, 0.98, 0.988)
const ACCENT = rgb(0.388, 0.4, 0.945)
const POSITIF = rgb(0.051, 0.58, 0.533)
const NEGATIF = rgb(0.937, 0.267, 0.267)
const AVERTIR = rgb(0.851, 0.467, 0.024)

const COULEUR_NIVEAU: Record<ConstatAudit['niveau'], RGB> = {
  ALERTE: NEGATIF,
  ATTENTION: AVERTIR,
  ANALYSE: ACCENT,
}

const LIBELLE_NIVEAU: Record<ConstatAudit['niveau'], string> = {
  ALERTE: 'ALERTE',
  ATTENTION: 'ATTENTION',
  ANALYSE: 'ANALYSE',
}

/**
 * Les polices standard d'un PDF sont encodees en WinAnsi : elles couvrent
 * l'alphabet francais accentue et l'euro, mais rien au-dela. Les libelles
 * saisis par l'utilisateur peuvent contenir n'importe quoi — un emoji suffit
 * a faire echouer la generation. On replie donc les caracteres hors table
 * sur leur equivalent sans diacritique, et a defaut sur un point median.
 */
const CP1252_HORS_LATIN1 = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ'

/**
 * Quelques caracteres frequents qui ne sont pas dans la table : l'espace fine
 * insecable que `toLocaleString('fr-FR')` glisse entre les milliers en est le
 * meilleur exemple — sans cette ligne, 101 060 s'imprime « 101?060 ».
 */
const EQUIVALENTS: Record<string, string> = {
  '\u00a0': ' ', '\u202f': ' ', '\u2009': ' ', '\u2007': ' ', '\u2011': '-',
  '\u2192': '->', '\u2190': '<-', '\u2264': '<=', '\u2265': '>=', '\u00d7': 'x',
}

function sain(valeur: string | null | undefined): string {
  if (!valeur) return ''
  let sortie = ''
  for (const caractere of valeur) {
    // Un equivalent connu est substitue tel quel : il peut faire plus d'un
    // caractere (la fleche devient « -> »), d'ou le test sur la cle et non
    // sur la longueur — un emoji occupe lui aussi deux unites de code.
    const equivalent = EQUIVALENTS[caractere]
    if (equivalent !== undefined) {
      sortie += equivalent
      continue
    }
    const code = caractere.codePointAt(0) ?? 0
    const encodable =
      (code >= 0x20 && code <= 0x7e) ||
      (code >= 0xa0 && code <= 0xff) ||
      CP1252_HORS_LATIN1.includes(caractere)
    if (encodable) {
      sortie += caractere
      continue
    }
    const dediacrite = caractere.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    sortie += /^[\x20-\x7e]+$/.test(dediacrite) ? dediacrite : '·'
  }
  return sortie
}

const euros = (centimes: number) =>
  `${(centimes / 100).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`

const eurosUnite = (montant: number) =>
  `${montant.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`

// ---------------------------------------------------------------------------
// Le document, et son curseur vertical
// ---------------------------------------------------------------------------

type Rapport = {
  pdf: PDFDocument
  pages: PDFPage[]
  page: PDFPage
  y: number
  normal: PDFFont
  gras: PDFFont
}

function nouvellePage(doc: Rapport): void {
  doc.page = doc.pdf.addPage([PAGE.largeur, PAGE.hauteur])
  doc.pages.push(doc.page)
  doc.y = PAGE.hauteur - MARGE
}

/** Ouvre une page si la hauteur demandee ne tient plus sous le curseur. */
function reserver(doc: Rapport, hauteur: number): void {
  if (doc.y - hauteur < MARGE + 30) nouvellePage(doc)
}

type OptionsTexte = {
  taille?: number
  gras?: boolean
  couleur?: RGB
  x?: number
  aDroite?: number
}

function ecrire(doc: Rapport, contenu: string, options: OptionsTexte = {}): void {
  const taille = options.taille ?? 10
  const police = options.gras ? doc.gras : doc.normal
  const texte = sain(contenu)
  const x =
    options.aDroite !== undefined
      ? options.aDroite - police.widthOfTextAtSize(texte, taille)
      : options.x ?? MARGE
  doc.page.drawText(texte, {
    x, y: doc.y, size: taille, font: police, color: options.couleur ?? ENCRE,
  })
}

/** Ecrit puis descend le curseur de la hauteur de ligne. */
function ligne(doc: Rapport, contenu: string, options: OptionsTexte & { interligne?: number } = {}): void {
  const taille = options.taille ?? 10
  reserver(doc, taille + 6)
  ecrire(doc, contenu, options)
  doc.y -= options.interligne ?? taille + 6
}

/** Decoupe un paragraphe a la largeur disponible. */
function decouper(texte: string, police: PDFFont, taille: number, largeur: number): string[] {
  const mots = sain(texte).split(/\s+/).filter(Boolean)
  const lignes: string[] = []
  let courante = ''
  for (const mot of mots) {
    const essai = courante ? `${courante} ${mot}` : mot
    if (police.widthOfTextAtSize(essai, taille) > largeur && courante) {
      lignes.push(courante)
      courante = mot
    } else {
      courante = essai
    }
  }
  if (courante) lignes.push(courante)
  return lignes
}

function titreSection(doc: Rapport, titre: string): void {
  reserver(doc, 48)
  doc.y -= 10
  ecrire(doc, titre, { taille: 12, gras: true })
  doc.page.drawRectangle({
    x: MARGE, y: doc.y - 7, width: 34, height: 2, color: ACCENT,
  })
  doc.y -= 24
}

// ---------------------------------------------------------------------------
// Les blocs du rapport
// ---------------------------------------------------------------------------

function enTete(doc: Rapport, entreprise: string, periode: string): void {
  doc.page.drawRectangle({
    x: 0, y: PAGE.hauteur - 96, width: PAGE.largeur, height: 96, color: ENCRE,
  })
  doc.y = PAGE.hauteur - 44
  ecrire(doc, 'Pilote90', { taille: 17, gras: true, couleur: rgb(1, 1, 1) })
  ecrire(doc, 'Rapport comptable', { taille: 11, couleur: PALE, aDroite: PAGE.largeur - MARGE })
  doc.y -= 20
  ecrire(doc, entreprise, { taille: 11, couleur: rgb(0.85, 0.88, 0.93) })
  ecrire(doc, periode, { taille: 9, couleur: PALE, aDroite: PAGE.largeur - MARGE })
  doc.y = PAGE.hauteur - 96 - 28
}

function bandeauSituation(doc: Rapport, texte: string, couleur: RGB, sousTitre: string): void {
  const hauteur = 46
  reserver(doc, hauteur + 12)
  doc.page.drawRectangle({
    x: MARGE, y: doc.y - hauteur + 12, width: UTILE, height: hauteur,
    color: FOND_PALE, borderColor: TRAIT, borderWidth: 1,
  })
  doc.page.drawRectangle({
    x: MARGE, y: doc.y - hauteur + 12, width: 3.5, height: hauteur, color: couleur,
  })
  doc.y -= 6
  ecrire(doc, texte, { taille: 10.5, gras: true, x: MARGE + 14, couleur })
  doc.y -= 15
  ecrire(doc, sousTitre, { taille: 8.5, x: MARGE + 14, couleur: DOUX })
  doc.y -= 37
}

type Indicateur = { titre: string; valeur: string; formule: string; couleur: RGB }

function cartesIndicateurs(doc: Rapport, indicateurs: Indicateur[]): void {
  const colonnes = 2
  const gouttiere = 12
  const largeur = (UTILE - gouttiere) / colonnes
  const hauteur = 62

  for (let i = 0; i < indicateurs.length; i += colonnes) {
    reserver(doc, hauteur + gouttiere)
    const rangee = indicateurs.slice(i, i + colonnes)
    const haut = doc.y

    rangee.forEach((indicateur, colonne) => {
      const x = MARGE + colonne * (largeur + gouttiere)
      doc.page.drawRectangle({
        x, y: haut - hauteur + 10, width: largeur, height: hauteur,
        color: rgb(1, 1, 1), borderColor: TRAIT, borderWidth: 1,
      })
      doc.y = haut - 6
      ecrire(doc, indicateur.titre.toUpperCase(), { taille: 7.5, gras: true, x: x + 12, couleur: PALE })
      doc.y -= 20
      ecrire(doc, indicateur.valeur, { taille: 15, gras: true, x: x + 12, couleur: indicateur.couleur })
      doc.y -= 15
      for (const l of decouper(indicateur.formule, doc.normal, 7, largeur - 24).slice(0, 2)) {
        ecrire(doc, l, { taille: 7, x: x + 12, couleur: PALE })
        doc.y -= 8
      }
    })

    doc.y = haut - hauteur - gouttiere + 10
  }
}

/**
 * Graphe CA / charges en barres. Trace a la main : un PDF n'a pas de moteur
 * de rendu, on pose des rectangles. Six mois pour rester lisible sur A4.
 */
function grapheBarres(doc: Rapport, points: PointMensuel[]): void {
  const hauteurZone = 132
  reserver(doc, hauteurZone + 34)

  const derniers = points.slice(-6)
  const base = doc.y - hauteurZone
  const maximum = Math.max(...derniers.flatMap((p) => [p.ca, p.charges]), 1)
  const largeurCase = UTILE / derniers.length
  const largeurBarre = 17

  // Trois lignes de repere, avec leur valeur.
  for (let i = 0; i <= 2; i++) {
    const y = base + (hauteurZone * i) / 2
    doc.page.drawLine({
      start: { x: MARGE, y }, end: { x: MARGE + UTILE, y },
      thickness: 0.5, color: TRAIT,
    })
    const valeur = Math.round((maximum * i) / 2)
    doc.y = y + 2
    ecrire(doc, eurosUnite(valeur), { taille: 6.5, couleur: PALE, aDroite: MARGE + UTILE })
  }

  derniers.forEach((point, index) => {
    const centre = MARGE + index * largeurCase + largeurCase / 2
    const hCa = (point.ca / maximum) * hauteurZone
    const hCharges = (point.charges / maximum) * hauteurZone

    doc.page.drawRectangle({
      x: centre - largeurBarre - 2, y: base, width: largeurBarre,
      height: Math.max(hCa, 0.6), color: POSITIF,
    })
    doc.page.drawRectangle({
      x: centre + 2, y: base, width: largeurBarre,
      height: Math.max(hCharges, 0.6), color: NEGATIF,
    })

    doc.y = base - 12
    const etiquette = sain(point.mois)
    ecrire(doc, etiquette, {
      taille: 7.5, couleur: DOUX,
      x: centre - doc.normal.widthOfTextAtSize(etiquette, 7.5) / 2,
    })
  })

  doc.y = base - 26
  const legende: Array<[string, RGB]> = [
    ['Chiffre d affaires', POSITIF],
    ['Charges', NEGATIF],
  ]
  let curseurX = MARGE
  for (const [texte, couleur] of legende) {
    doc.page.drawRectangle({ x: curseurX, y: doc.y - 1, width: 8, height: 8, color: couleur })
    ecrire(doc, texte, { taille: 8, x: curseurX + 12, couleur: DOUX })
    curseurX += 14 + doc.normal.widthOfTextAtSize(texte, 8) + 20
  }
  doc.y -= 18
}

function tableauMensuel(doc: Rapport, points: PointMensuel[]): void {
  const colonnes = [
    { titre: 'Mois', largeur: 130, aDroite: false },
    { titre: 'Chiffre d affaires', largeur: 125, aDroite: true },
    { titre: 'Charges', largeur: 120, aDroite: true },
    { titre: 'Net', largeur: UTILE - 375, aDroite: true },
  ]
  const hauteurLigne = 17

  const enTeteTableau = () => {
    reserver(doc, hauteurLigne * 3)
    doc.page.drawRectangle({
      x: MARGE, y: doc.y - 5, width: UTILE, height: hauteurLigne, color: FOND_PALE,
    })
    let x = MARGE
    for (const colonne of colonnes) {
      ecrire(doc, colonne.titre, {
        taille: 7.5, gras: true, couleur: DOUX,
        ...(colonne.aDroite ? { aDroite: x + colonne.largeur - 8 } : { x: x + 8 }),
      })
      x += colonne.largeur
    }
    doc.y -= hauteurLigne + 3
  }

  enTeteTableau()

  let totalCa = 0
  let totalCharges = 0

  points.forEach((point, index) => {
    if (doc.y - hauteurLigne < MARGE + 40) {
      nouvellePage(doc)
      enTeteTableau()
    }
    if (index % 2 === 1) {
      doc.page.drawRectangle({
        x: MARGE, y: doc.y - 5, width: UTILE, height: hauteurLigne, color: FOND_PALE,
      })
    }
    const cellules = [
      sain(point.cle),
      eurosUnite(point.ca),
      eurosUnite(point.charges),
      eurosUnite(point.net),
    ]
    let x = MARGE
    cellules.forEach((cellule, i) => {
      const colonne = colonnes[i]
      const couleur = i === 3 ? (point.net >= 0 ? POSITIF : NEGATIF) : ENCRE
      ecrire(doc, cellule, {
        taille: 8.5, couleur,
        ...(colonne.aDroite ? { aDroite: x + colonne.largeur - 8 } : { x: x + 8 }),
      })
      x += colonne.largeur
    })
    totalCa += point.ca
    totalCharges += point.charges
    doc.y -= hauteurLigne
  })

  doc.y -= 4
  doc.page.drawLine({
    start: { x: MARGE, y: doc.y + 9 }, end: { x: MARGE + UTILE, y: doc.y + 9 },
    thickness: 1, color: ENCRE,
  })
  let x = MARGE
  const totaux = [
    'Total sur la periode',
    eurosUnite(totalCa),
    eurosUnite(totalCharges),
    eurosUnite(totalCa - totalCharges),
  ]
  totaux.forEach((cellule, i) => {
    const colonne = colonnes[i]
    ecrire(doc, cellule, {
      taille: 8.5, gras: true,
      couleur: i === 3 ? (totalCa - totalCharges >= 0 ? POSITIF : NEGATIF) : ENCRE,
      ...(colonne.aDroite ? { aDroite: x + colonne.largeur - 8 } : { x: x + 8 }),
    })
    x += colonne.largeur
  })
  doc.y -= 20
}

function blocConstats(doc: Rapport, constats: ConstatAudit[]): void {
  if (constats.length === 0) {
    ligne(doc, 'Aucun signal sur la periode.', { taille: 9, couleur: DOUX })
    return
  }

  for (const constat of constats) {
    const lignesRegle = decouper(constat.regle, doc.normal, 7.5, UTILE - 28)
    const hauteur = 34 + lignesRegle.length * 9
    reserver(doc, hauteur + 8)

    const couleur = COULEUR_NIVEAU[constat.niveau]
    doc.page.drawRectangle({
      x: MARGE, y: doc.y - hauteur + 12, width: UTILE, height: hauteur,
      color: rgb(1, 1, 1), borderColor: TRAIT, borderWidth: 1,
    })
    doc.page.drawRectangle({
      x: MARGE, y: doc.y - hauteur + 12, width: 3.5, height: hauteur, color: couleur,
    })

    doc.y -= 5
    ecrire(doc, LIBELLE_NIVEAU[constat.niveau], { taille: 7, gras: true, x: MARGE + 14, couleur })
    ecrire(doc, constat.valeur, { taille: 9, gras: true, aDroite: MARGE + UTILE - 12, couleur })
    doc.y -= 13
    ecrire(doc, constat.titre, { taille: 9.5, gras: true, x: MARGE + 14 })
    doc.y -= 12
    for (const l of lignesRegle) {
      ecrire(doc, l, { taille: 7.5, x: MARGE + 14, couleur: DOUX })
      doc.y -= 9
    }
    doc.y -= 12
  }
}

function blocPrevisionnel(
  doc: Rapport,
  totaux: Record<'pessimiste' | 'realiste' | 'optimiste', number>,
  baseCa: number,
  baseCharges: number,
): void {
  const scenarios: Array<{ cle: keyof typeof totaux; libelle: string; hypothese: string; couleur: RGB }> = [
    { cle: 'pessimiste', libelle: 'Pessimiste', hypothese: 'Encaissements -15 % et charges +5 % par mois', couleur: NEGATIF },
    { cle: 'realiste', libelle: 'Realiste', hypothese: 'Encaissements et charges stables', couleur: ACCENT },
    { cle: 'optimiste', libelle: 'Optimiste', hypothese: 'Encaissements +12 % et charges +2 % par mois', couleur: POSITIF },
  ]

  const gouttiere = 10
  const largeur = (UTILE - gouttiere * 2) / 3
  const hauteur = 72
  reserver(doc, hauteur + 30)
  const haut = doc.y

  scenarios.forEach((scenario, index) => {
    const x = MARGE + index * (largeur + gouttiere)
    doc.page.drawRectangle({
      x, y: haut - hauteur + 10, width: largeur, height: hauteur,
      color: rgb(1, 1, 1), borderColor: TRAIT, borderWidth: 1,
    })
    doc.page.drawRectangle({
      x, y: haut + 8, width: largeur, height: 2.5, color: scenario.couleur,
    })
    doc.y = haut - 6
    ecrire(doc, scenario.libelle.toUpperCase(), { taille: 7.5, gras: true, x: x + 10, couleur: scenario.couleur })
    doc.y -= 19
    ecrire(doc, eurosUnite(totaux[scenario.cle]), {
      taille: 13, gras: true, x: x + 10,
      couleur: totaux[scenario.cle] >= 0 ? ENCRE : NEGATIF,
    })
    doc.y -= 14
    for (const l of decouper(scenario.hypothese, doc.normal, 6.8, largeur - 20).slice(0, 3)) {
      ecrire(doc, l, { taille: 6.8, x: x + 10, couleur: PALE })
      doc.y -= 8
    }
  })

  doc.y = haut - hauteur - 4
  ligne(doc, `Base de projection : ${eurosUnite(baseCa)} de chiffre d affaires et ${eurosUnite(baseCharges)} de charges par mois, moyennes des mois actifs observes.`, {
    taille: 7.5, couleur: PALE,
  })
  doc.y -= 6
}

type LigneDetail = {
  transactionDate: Date
  type: 'REVENUE' | 'EXPENSE'
  label: string | null
  category: string | null
  amountHt: number
}

function tableauDetail(doc: Rapport, transactions: LigneDetail[]): void {
  const colonnes = [
    { titre: 'Date', largeur: 68, aDroite: false },
    { titre: 'Type', largeur: 58, aDroite: false },
    { titre: 'Libelle', largeur: 195, aDroite: false },
    { titre: 'Categorie', largeur: 95, aDroite: false },
    { titre: 'Montant HT', largeur: UTILE - 416, aDroite: true },
  ]
  const hauteurLigne = 15

  const enTeteTableau = () => {
    doc.page.drawRectangle({
      x: MARGE, y: doc.y - 4, width: UTILE, height: hauteurLigne, color: FOND_PALE,
    })
    let x = MARGE
    for (const colonne of colonnes) {
      ecrire(doc, colonne.titre, {
        taille: 7.5, gras: true, couleur: DOUX,
        ...(colonne.aDroite ? { aDroite: x + colonne.largeur - 8 } : { x: x + 8 }),
      })
      x += colonne.largeur
    }
    doc.y -= hauteurLigne + 3
  }

  reserver(doc, hauteurLigne * 4)
  enTeteTableau()

  if (transactions.length === 0) {
    ligne(doc, 'Aucune transaction sur la periode.', { taille: 8.5, couleur: DOUX })
    return
  }

  transactions.forEach((transaction, index) => {
    if (doc.y - hauteurLigne < MARGE + 30) {
      nouvellePage(doc)
      enTeteTableau()
    }
    if (index % 2 === 1) {
      doc.page.drawRectangle({
        x: MARGE, y: doc.y - 4, width: UTILE, height: hauteurLigne, color: FOND_PALE,
      })
    }

    const revenu = transaction.type === 'REVENUE'
    // Le libelle est tronque plutot que renvoye a la ligne : une ecriture
    // comptable tient sur une ligne, sinon le tableau devient illisible.
    const tronquer = (valeur: string, largeur: number) => {
      let texte = sain(valeur)
      while (texte && doc.normal.widthOfTextAtSize(texte, 8) > largeur) {
        texte = texte.slice(0, -1)
      }
      return texte.length < sain(valeur).length ? `${texte.slice(0, -1)}...` : texte
    }

    const cellules = [
      new Date(transaction.transactionDate).toLocaleDateString('fr-FR'),
      revenu ? 'Revenu' : 'Charge',
      tronquer(transaction.label ?? '', colonnes[2].largeur - 16),
      tronquer(transaction.category ?? '', colonnes[3].largeur - 16),
      `${revenu ? '+' : '-'}${euros(transaction.amountHt)}`,
    ]

    let x = MARGE
    cellules.forEach((cellule, i) => {
      const colonne = colonnes[i]
      const couleur = i === 1 || i === 4 ? (revenu ? POSITIF : NEGATIF) : ENCRE
      ecrire(doc, cellule, {
        taille: 8, couleur, gras: i === 4,
        ...(colonne.aDroite ? { aDroite: x + colonne.largeur - 8 } : { x: x + 8 }),
      })
      x += colonne.largeur
    })
    doc.y -= hauteurLigne
  })

  doc.y -= 10
}

/** Pied de page, pose apres coup : la pagination suppose le total connu. */
function pieds(doc: Rapport, entreprise: string, genereLe: string): void {
  doc.pages.forEach((page, index) => {
    page.drawLine({
      start: { x: MARGE, y: MARGE + 18 }, end: { x: MARGE + UTILE, y: MARGE + 18 },
      thickness: 0.5, color: TRAIT,
    })
    const gauche = sain(`Pilote90 · ${entreprise} · genere le ${genereLe}`)
    page.drawText(gauche, {
      x: MARGE, y: MARGE + 6, size: 7, font: doc.normal, color: PALE,
    })
    const droite = `Page ${index + 1} / ${doc.pages.length}`
    page.drawText(droite, {
      x: MARGE + UTILE - doc.normal.widthOfTextAtSize(droite, 7),
      y: MARGE + 6, size: 7, font: doc.normal, color: PALE,
    })
  })
}

// ---------------------------------------------------------------------------
// La construction du document
// ---------------------------------------------------------------------------

export type DonneesRapport = {
  companyName: string
  transactions: LigneDetail[]
  /** Objectif de chiffre d affaires mensuel du cycle actif, en centimes. */
  objectifCaMensuel: number
  aujourdhui?: Date
}

export type RapportConstruit = {
  octets: Uint8Array
  nomFichier: string
}

export async function construireRapportComptable(
  donnees: DonneesRapport,
): Promise<RapportConstruit> {
  const aujourdhui = donnees.aujourdhui ?? new Date()
  const transactions = donnees.transactions

  // Exactement les memes fonctions que la page /audit : le rapport imprime
  // ne peut pas afficher autre chose que l ecran.
  const indicateurs = calculerIndicateurs(transactions, donnees.objectifCaMensuel, aujourdhui)
  const historique = serieDouzeMois(transactions, aujourdhui)
  const previsionnel = calculerPrevisionnel(transactions, aujourdhui)
  const constats = auditerFinances(indicateurs, previsionnel, transactions.length)
  const situation = messageDeSituation(constats)

  const debutPeriode = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth() - 11, 1)
  const surLaPeriode = transactions
    .filter((t) => new Date(t.transactionDate) >= debutPeriode)
    .sort((a, b) => +new Date(b.transactionDate) - +new Date(a.transactionDate))

  const pdf = await PDFDocument.create()
  pdf.setTitle(`Pilote90 - rapport comptable - ${donnees.companyName}`)
  pdf.setAuthor('Pilote90')
  pdf.setSubject('Rapport comptable sur douze mois glissants')
  pdf.setCreationDate(aujourdhui)

  const doc: Rapport = {
    pdf,
    pages: [],
    page: null as unknown as PDFPage,
    y: 0,
    normal: await pdf.embedFont(StandardFonts.Helvetica),
    gras: await pdf.embedFont(StandardFonts.HelveticaBold),
  }
  nouvellePage(doc)

  const moisLong = (date: Date) =>
    date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const periode = `Periode : ${moisLong(debutPeriode)} a ${moisLong(aujourdhui)}`
  const genereLe = aujourdhui.toLocaleDateString('fr-FR')

  enTete(doc, donnees.companyName, periode)

  const couleurSituation =
    situation.ton === 'ALERTE' ? NEGATIF : situation.ton === 'ATTENTION' ? AVERTIR : POSITIF
  bandeauSituation(
    doc,
    situation.texte,
    couleurSituation,
    `${constats.length} constat${constats.length > 1 ? 's' : ''} issu${constats.length > 1 ? 's' : ''} de l audit automatique, ${transactions.length} transaction${transactions.length > 1 ? 's' : ''} enregistree${transactions.length > 1 ? 's' : ''}`,
  )

  titreSection(doc, 'Indicateurs cles')
  cartesIndicateurs(doc, [
    {
      titre: 'Tresorerie',
      valeur: euros(indicateurs.tresorerie),
      formule: 'Encaissements moins decaissements depuis le debut',
      couleur: indicateurs.tresorerie >= 0 ? POSITIF : NEGATIF,
    },
    {
      titre: 'CA du mois',
      valeur: euros(indicateurs.caDuMois),
      formule: 'Somme des revenus rattaches au mois en cours',
      couleur: POSITIF,
    },
    {
      titre: 'Charges du mois',
      valeur: euros(indicateurs.chargesDuMois),
      formule: `Somme des charges du mois, ratio ${indicateurs.ratioCharges} % du chiffre d affaires`,
      couleur: NEGATIF,
    },
    {
      titre: 'Resultat net',
      valeur: euros(indicateurs.resultatNet),
      formule: 'Chiffre d affaires du mois moins charges du mois',
      couleur: indicateurs.resultatNet >= 0 ? ENCRE : NEGATIF,
    },
  ])

  titreSection(doc, 'Chiffre d affaires et charges, six derniers mois')
  grapheBarres(doc, historique)

  titreSection(doc, 'Synthese mensuelle, douze mois glissants')
  tableauMensuel(doc, historique)

  titreSection(doc, 'Audit financier automatique')
  ligne(doc, 'Chaque constat indique la regle qui l a declenche.', { taille: 8, couleur: PALE })
  doc.y -= 4
  blocConstats(doc, constats)

  titreSection(doc, 'Previsionnel a six mois')
  blocPrevisionnel(doc, previsionnel.totaux, previsionnel.baseCa, previsionnel.baseCharges)

  nouvellePage(doc)
  titreSection(doc, 'Detail des ecritures sur la periode')
  tableauDetail(doc, surLaPeriode)

  pieds(doc, donnees.companyName, genereLe)

  return {
    octets: await pdf.save(),
    nomFichier: `pilote90-rapport-${aujourdhui.toISOString().slice(0, 10)}.pdf`,
  }
}

/** Reponse HTTP de telechargement, commune aux deux routes. */
export function reponsePdf(rapport: RapportConstruit): Response {
  return new Response(Buffer.from(rapport.octets), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${rapport.nomFichier}"`,
      'Cache-Control': 'no-store',
    },
  })
}
