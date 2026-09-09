import { cache } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { RoleUtilisateur } from '@/types/next-auth'
import type { Formule, Capacite, ProfilHabilitation } from '@/lib/habilitations'

export type UtilisateurSession = ProfilHabilitation & {
  id: string
  role: RoleUtilisateur
  name?: string | null
  email?: string | null
  theme: string
  echelleTexte: number
}

/**
 * Utilisateur authentifie, ou null.
 *
 * Les habilitations et les preferences d'affichage sont lues en BASE, pas dans
 * le jeton. Un jeton vit trente jours : une formule revoquee ou un acces retire
 * ne prendrait effet qu'a la reconnexion, ce qui est exactement ce qu'on ne
 * veut pas d'un mecanisme d'autorisation.
 *
 * `cache` de React memorise le resultat pour la duree d'UNE requete : les dix
 * appels d'un rendu de page ne font qu'une seule lecture.
 */
export const getCurrentUser = cache(async (): Promise<UtilisateurSession | null> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  const enregistre = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { formule: true, capacites: true, theme: true, echelleTexte: true },
  })

  // Compte supprime pendant que le jeton court : on refuse plutot que de
  // retomber sur des valeurs par defaut permissives.
  if (!enregistre) return null

  return {
    id: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    formule: enregistre.formule as Formule,
    capacites: enregistre.capacites as Capacite[],
    theme: enregistre.theme,
    echelleTexte: enregistre.echelleTexte,
  }
})

/**
 * Fiche client du compte connecte.
 *
 * Cloisonnement multi-tenant : la recherche part TOUJOURS du userId de la
 * session, jamais d'un identifiant fourni par le client HTTP.
 *
 * Il n'y a plus de test sur le role. Posseder un dossier d'entrepreneur n'est
 * pas une question de role mais un simple fait : ce compte a-t-il une fiche.
 * C'est ce qui permet a un consultant de piloter sa propre activite avec
 * l'outil qu'il vend, ce que le cahier des charges prevoit page 11.
 */
export async function getCurrentClient() {
  const user = await getCurrentUser()
  if (!user) return null
  return prisma.client.findUnique({ where: { userId: user.id } })
}
