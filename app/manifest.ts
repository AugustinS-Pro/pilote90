import type { MetadataRoute } from 'next'

/**
 * Manifeste d'application web installable.
 * Le dossier professionnel decrit Pilote90 comme une Progressive Web App
 * accessible sans installation depuis un magasin d'applications.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pilote90 · Pilotage stratégique',
    short_name: 'Pilote90',
    description:
      "Pilotez votre activité par cycles de 90 jours : vision, chiffres, offres, communication et plan d'action.",
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    // Les deux seules couleurs ecrites en dur du projet, et elles n'ont pas le
    // choix : le manifeste est lu par le systeme d'exploitation avant que la
    // moindre feuille de style ne soit chargee, donc `var(--p90-canvas)` n'y
    // veut rien dire. Ce sont les valeurs du theme par defaut, a tenir a jour
    // avec `--p90-canvas` et `--p90-accent` dans `app/globals.css`.
    background_color: '#faf9f6',  // = --p90-canvas (theme clair)
    theme_color: '#6366f1',       // = --p90-accent (theme clair)
    lang: 'fr',
    categories: ['business', 'productivity', 'finance'],
    icons: [
      { src: '/icone.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  }
}
