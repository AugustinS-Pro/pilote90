import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'


/**
 * Catalogue des themes et du confort de lecture.
 *
 * Un theme n'est rien d'autre qu'une redefinition des jetons semantiques de
 * `globals.css`. Aucun composant ne connait de couleur : en ajouter un ne
 * demande donc pas de retoucher une seule page.
 *
 * L'accessibilite emprunte le meme chemin plutot que de constituer un mode a
 * part : le contraste eleve et la palette sure pour le daltonisme sont des
 * themes comme les autres, et le confort de lecture agit sur la racine du
 * document, dont toutes les tailles dependent.
 */

export const THEMES = [
  {
    cle: 'clair',
    nom: 'Clair',
    description: 'Sable clair et indigo. Le theme par defaut.',
    apercu: ['#faf9f6', '#ffffff', '#6366f1', '#0d9488'],
    famille: 'Palettes',
  },
  {
    cle: 'pilote90',
    nom: 'PILOTE90',
    description: 'Marine, or et sable, la charte de la methode Pilote90.',
    apercu: ['#f6f2ea', '#fffdf9', '#c9a84c', '#1b2a4a'],
    famille: 'Palettes',
  },
  {
    cle: 'sombre',
    nom: 'Sombre',
    description: 'Pour les fins de soiree et les ecrans peu lumineux.',
    apercu: ['#0b1120', '#151d2e', '#818cf8', '#2dd4bf'],
    famille: 'Palettes',
  },
  {
    cle: 'contraste',
    nom: 'Contraste eleve',
    description: 'Noir sur blanc, bordures franches. Pour les basses visions et la lecture en plein soleil.',
    apercu: ['#ffffff', '#f2f2f2', '#0b3fb0', '#000000'],
    famille: 'Accessibilite',
  },
  {
    cle: 'daltonien',
    nom: 'Palette sure',
    description: 'Bleu et orange au lieu de vert et rouge, pour les daltonismes les plus courants.',
    apercu: ['#fbfbfa', '#ffffff', '#0072b2', '#d55e00'],
    famille: 'Accessibilite',
  },
] as const

export type CleTheme = (typeof THEMES)[number]['cle']

const CLES_THEME = THEMES.map((t) => t.cle) as readonly string[]

/** Echelle de lecture, en pourcentage de la taille de police de la racine. */
export const ECHELLES = [
  { valeur: 100, nom: 'Normale', apercu: 'Aa', description: 'La taille de reference.' },
  { valeur: 112, nom: 'Confortable', apercu: 'Aa', description: 'Un cran plus grand, sans rien deplacer.' },
  { valeur: 125, nom: 'Large', apercu: 'Aa', description: 'Pour lire de loin ou avec une basse vision.' },
] as const

export type Echelle = (typeof ECHELLES)[number]['valeur']

const VALEURS_ECHELLE = ECHELLES.map((e) => e.valeur) as readonly number[]

const CLE_COOKIE_THEME = 'pilote90_theme'
const CLE_COOKIE_ECHELLE = 'pilote90_echelle'

/** Le schema stocke une valeur d enumeration, l interface manipule une cle. */
const versEnum = (cle: CleTheme) => cle.toUpperCase() as Uppercase<CleTheme>
const depuisEnum = (valeur: string): CleTheme => normaliserTheme(valeur.toLowerCase())

function normaliserTheme(valeur: unknown): CleTheme {
  return CLES_THEME.includes(String(valeur)) ? (String(valeur) as CleTheme) : 'clair'
}

function normaliserEchelle(valeur: unknown): Echelle {
  const nombre = Number(valeur)
  return (VALEURS_ECHELLE.includes(nombre) ? nombre : 100) as Echelle
}

export type Affichage = { theme: CleTheme; echelle: Echelle }

/**
 * Reglages d affichage appliques au rendu, resolus cote serveur pour eviter
 * tout clignotement.
 *
 * La preference appartient au COMPTE : deux utilisateurs du meme poste gardent
 * chacun la sienne. Les cookies ne sont plus la source de verite, seulement un
 * repli pour l ecran de connexion, ou aucun utilisateur n est identifie.
 */
export async function affichageActif(): Promise<Affichage> {
  // La session porte deja les preferences : aucune lecture supplementaire.
  const utilisateur = await getCurrentUser()

  if (utilisateur) {
    return {
      theme: depuisEnum(utilisateur.theme),
      echelle: normaliserEchelle(utilisateur.echelleTexte),
    }
  }

  const store = await cookies()
  return {
    theme: normaliserTheme(store.get(CLE_COOKIE_THEME)?.value),
    echelle: normaliserEchelle(store.get(CLE_COOKIE_ECHELLE)?.value),
  }
}

const UN_AN = { httpOnly: true, sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 24 * 365 }

export async function changerTheme(formData: FormData): Promise<void> {
  'use server'
  const choisi = normaliserTheme(formData.get('theme'))

  const utilisateur = await getCurrentUser()
  if (utilisateur) {
    await prisma.user.update({
      where: { id: utilisateur.id },
      data: { theme: versEnum(choisi) },
    })
  }

  // Le cookie suit, pour que l ecran de connexion reprenne les reglages de la
  // derniere personne a s etre servie de ce navigateur.
  const store = await cookies()
  store.set(CLE_COOKIE_THEME, choisi, UN_AN)
}

export async function changerEchelle(formData: FormData): Promise<void> {
  'use server'
  const choisie = normaliserEchelle(formData.get('echelle'))

  const utilisateur = await getCurrentUser()
  if (utilisateur) {
    await prisma.user.update({
      where: { id: utilisateur.id },
      data: { echelleTexte: choisie },
    })
  }

  const store = await cookies()
  store.set(CLE_COOKIE_ECHELLE, String(choisie), UN_AN)
}
