import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/session'

const CLE = 'pilote90_confidentiel'

/**
 * Mode Confidentialite : masque les noms des entreprises clientes
 * lors d'une demonstration publique. Stocke dans un cookie de session.
 */
export async function estConfidentiel(): Promise<boolean> {
  const store = await cookies()
  return store.get(CLE)?.value === '1'
}

export async function basculerConfidentialite(): Promise<void> {
  'use server'
  // Seule action du projet qui n'avait aucune garde. L'impact etait nul, elle
  // ne pose qu'un cookie, mais une action serveur ouverte se remarque a la
  // relecture.
  const utilisateur = await getCurrentUser()
  if (!utilisateur) return

  const store = await cookies()
  const actif = store.get(CLE)?.value === '1'
  store.set(CLE, actif ? '0' : '1', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })
}

/** Remplace un nom par une initiale suivie de points, si le mode est actif. */
export function masquer(nom: string, actif: boolean): string {
  if (!actif) return nom
  const initiale = nom.trim().charAt(0).toUpperCase() || '?'
  return `${initiale}${'•'.repeat(Math.max(3, Math.min(8, nom.length - 1)))}`
}
