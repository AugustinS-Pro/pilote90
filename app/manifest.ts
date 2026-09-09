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
    background_color: '#FAF9F6',
    theme_color: '#6366f1',
    lang: 'fr',
    categories: ['business', 'productivity', 'finance'],
    icons: [
      { src: '/icone.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  }
}
