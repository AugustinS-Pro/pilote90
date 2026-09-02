import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { RoleUtilisateur } from '@/types/next-auth'

export type UtilisateurSession = {
  id: string
  role: RoleUtilisateur
  name?: string | null
  email?: string | null
}

/** Utilisateur authentifie, ou null. */
export async function getCurrentUser(): Promise<UtilisateurSession | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  return {
    id: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
  }
}

/**
 * Fiche client du compte connecte.
 * Cloisonnement multi-tenant : la recherche part TOUJOURS du userId de la session,
 * jamais d'un identifiant fourni par le client HTTP.
 */
export async function getCurrentClient() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'CLIENT') return null
  return prisma.client.findUnique({ where: { userId: user.id } })
}
