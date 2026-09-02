import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export const THEMES = [
  {
    cle: 'clair',
    nom: 'Clair',
    description: 'Sable clair et indigo. Le theme par defaut, pense pour un usage prolonge.',
    apercu: ['#faf9f6', '#ffffff', '#6366f1', '#0d9488'],
  },
  {
    cle: 'pilote90',
    nom: 'PILOTE90',
    description: 'Marine, or et sable, la charte de la methode Pilote90.',
    apercu: ['#f6f2ea', '#fffdf9', '#c9a84c', '#1b2a4a'],
  },
] as const

export type CleTheme = (typeof THEMES)[number]['cle']

const CLE_COOKIE = 'pilote90_theme'

/** Le schema stocke une valeur d'enumeration, l'interface manipule une cle. */
const versEnum = (cle: CleTheme) => (cle === 'pilote90' ? 'PILOTE90' : 'CLAIR')
const depuisEnum = (valeur: string): CleTheme => (valeur === 'PILOTE90' ? 'pilote90' : 'clair')
const normaliser = (valeur: unknown): CleTheme => (valeur === 'pilote90' ? 'pilote90' : 'clair')

/**
 * Theme applique au rendu, resolu cote serveur pour eviter tout clignotement.
 *
 * La preference appartient au COMPTE : deux utilisateurs du meme poste gardent
 * chacun le sien. Le cookie n'est plus la source de verite, seulement un repli
 * pour l'ecran de connexion, ou aucun utilisateur n'est encore identifie.
 */
export async function themeActif(): Promise<CleTheme> {
  const utilisateur = await getCurrentUser()

  if (utilisateur) {
    const enregistre = await prisma.user.findUnique({
      where: { id: utilisateur.id },
      select: { theme: true },
    })
    if (enregistre) return depuisEnum(enregistre.theme)
  }

  const store = await cookies()
  return normaliser(store.get(CLE_COOKIE)?.value)
}

export async function changerTheme(formData: FormData): Promise<void> {
  'use server'
  const choisi = normaliser(formData.get('theme'))

  const utilisateur = await getCurrentUser()
  if (utilisateur) {
    await prisma.user.update({
      where: { id: utilisateur.id },
      data: { theme: versEnum(choisi) },
    })
  }

  // Le cookie suit, pour que l'ecran de connexion reprenne les couleurs de la
  // derniere personne a s'etre servie de ce navigateur.
  const store = await cookies()
  store.set(CLE_COOKIE, choisi, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  })
}
