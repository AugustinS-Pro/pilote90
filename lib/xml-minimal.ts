/**
 * Lecture d'un document XML, reduite a ce dont la lecture des factures a besoin.
 *
 * Une facture Factur-X embarque un XML au format CII (Cross Industry Invoice),
 * dont on ne lit qu'une douzaine de valeurs a des emplacements connus. Ajouter
 * une bibliotheque de lecture XML pour cela reviendrait a faire entrer un
 * analyseur generaliste, ses options et ses surprises, dans un projet qui en
 * compte dix en tout. On lit donc ce format-ci, et rien d'autre.
 *
 * Deux partis pris assumes :
 *
 * - les prefixes d'espace de noms sont ignores. « ram:Name », « Name » et
 *   « ns2:Name » designent le meme element. Les emetteurs de factures ne
 *   s'accordent pas sur les prefixes, seulement sur les noms locaux ;
 * - un chemin designe un enfant direct a chaque etape. C'est ce qui evite de
 *   confondre le nom du vendeur et celui de l'acheteur : ils portent le meme
 *   nom local, a deux endroits differents de l'arbre.
 *
 * Ce qui n'est pas gere, parce que le format ne s'en sert pas : les instructions
 * de traitement autres que le prologue, les DTD, les sections CDATA imbriquees
 * et les attributs autres que ceux qu'on demande explicitement.
 *
 * Fonction pure : elle recoit du texte, elle rend un arbre.
 */

export type Element = {
  /** Nom local, sans prefixe d'espace de noms. */
  nom: string
  attributs: Record<string, string>
  enfants: Element[]
  /** Texte propre a cet element, entites resolues. */
  texte: string
}

/** Retire le prefixe d'espace de noms : « ram:Name » devient « Name ». */
function nomLocal(brut: string): string {
  const deuxPoints = brut.indexOf(':')
  return deuxPoints === -1 ? brut : brut.slice(deuxPoints + 1)
}

const ENTITES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
}

/** Resout les entites XML, y compris les formes numeriques. */
export function resoudreEntites(texte: string): string {
  return texte.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (entier, corps: string) => {
    if (corps.startsWith('#x') || corps.startsWith('#X')) {
      return String.fromCodePoint(parseInt(corps.slice(2), 16))
    }
    if (corps.startsWith('#')) {
      return String.fromCodePoint(parseInt(corps.slice(1), 10))
    }
    return ENTITES[corps] ?? entier
  })
}

/** Lit les attributs d'une balise ouvrante. */
function lireAttributs(corps: string): Record<string, string> {
  const attributs: Record<string, string> = {}
  const motif = /([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g
  let trouve: RegExpExecArray | null
  while ((trouve = motif.exec(corps)) !== null) {
    const valeur = trouve[3] ?? trouve[4] ?? ''
    attributs[nomLocal(trouve[1])] = resoudreEntites(valeur)
  }
  return attributs
}

/**
 * Construit l'arbre d'un document XML. Rend null si aucun element racine n'est
 * trouve, ou si les balises ne se referment pas dans l'ordre : un document
 * malforme ne rend pas un arbre approximatif.
 */
export function lireXml(source: string): Element | null {
  const sansCommentaires = source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '')

  const pile: Element[] = []
  let racine: Element | null = null
  let position = 0

  while (position < sansCommentaires.length) {
    const debut = sansCommentaires.indexOf('<', position)
    if (debut === -1) break

    if (debut > position && pile.length > 0) {
      pile[pile.length - 1].texte += resoudreEntites(sansCommentaires.slice(position, debut))
    }

    const fin = sansCommentaires.indexOf('>', debut)
    if (fin === -1) return null

    let contenu = sansCommentaires.slice(debut + 1, fin)
    position = fin + 1

    // <![CDATA[...]]> : texte brut, aucune entite a resoudre.
    if (contenu.startsWith('![CDATA[')) {
      const finCdata = sansCommentaires.indexOf(']]>', debut)
      if (finCdata === -1) return null
      if (pile.length > 0) {
        pile[pile.length - 1].texte += sansCommentaires.slice(debut + 9, finCdata)
      }
      position = finCdata + 3
      continue
    }

    if (contenu.startsWith('/')) {
      const ferme = nomLocal(contenu.slice(1).trim())
      const ouvert = pile.pop()
      if (!ouvert || ouvert.nom !== ferme) return null
      continue
    }

    const autoFermante = contenu.endsWith('/')
    if (autoFermante) contenu = contenu.slice(0, -1)

    const espace = contenu.search(/\s/)
    const nom = nomLocal((espace === -1 ? contenu : contenu.slice(0, espace)).trim())
    if (nom.length === 0) return null

    const element: Element = {
      nom,
      attributs: espace === -1 ? {} : lireAttributs(contenu.slice(espace)),
      enfants: [],
      texte: '',
    }

    if (pile.length > 0) pile[pile.length - 1].enfants.push(element)
    else if (racine === null) racine = element
    else return null // deux racines : le document n'est pas un arbre

    if (!autoFermante) pile.push(element)
  }

  return pile.length === 0 ? racine : null
}

/** Premier enfant direct portant ce nom local. */
export function enfant(element: Element | null, nom: string): Element | null {
  if (!element) return null
  return element.enfants.find((e) => e.nom === nom) ?? null
}

/** Tous les enfants directs portant ce nom local. */
export function enfants(element: Element | null, nom: string): Element[] {
  if (!element) return []
  return element.enfants.filter((e) => e.nom === nom)
}

/**
 * Suit un chemin d'enfants directs. Rend null des qu'une etape manque : une
 * facture qui n'a pas le champ attendu se signale, elle ne se devine pas.
 */
export function chemin(element: Element | null, ...noms: string[]): Element | null {
  let courant = element
  for (const nom of noms) {
    courant = enfant(courant, nom)
    if (!courant) return null
  }
  return courant
}

/** Texte au bout d'un chemin, espaces retires. Null si le chemin n'existe pas. */
export function texteAu(element: Element | null, ...noms: string[]): string | null {
  const cible = chemin(element, ...noms)
  if (!cible) return null
  const valeur = cible.texte.trim()
  return valeur.length > 0 ? valeur : null
}
