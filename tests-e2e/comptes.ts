/**
 * Comptes du jeu de demonstration.
 *
 * Les tests de parcours supposent `npm run seed` execute. Ce sont des mots de
 * passe de demonstration, publics par nature : ils n'ont rien a faire sur un
 * serveur en ligne, et l'etape 1.6 de la procedure de deploiement impose de
 * les remplacer avant toute mise en production.
 */
export const COMPTES = {
  /** Cliente vitrine : formule complete, les cinq axes et l'audit. */
  marie: { email: 'marie@demo.fr', motDePasse: 'marie2026', entreprise: 'Marie & Co' },
  /** Client accompagne : l'audit seulement, pas les axes. */
  thomas: { email: 'thomas@demo.fr', motDePasse: 'thomas2026' },
  /** Consultant, portefeuille de Marie et Thomas. */
  alexis: { email: 'alexis@pilote90.fr', motDePasse: 'pilote90' },
  /** Consultante, portefeuille distinct de celui d'Alexis. */
  sandrine: { email: 'sandrine@pilote90.fr', motDePasse: 'sandrine2026' },
} as const
