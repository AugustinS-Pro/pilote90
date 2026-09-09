import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { pageAccueil } from '@/lib/habilitations'

/**
 * Aiguillage d'entree. Un seul endroit decide de la destination, en fonction
 * des habilitations du compte : la connexion, la racine et les gardes de page
 * s'y referent toutes, au lieu de rediriger chacune vers une page ecrite en
 * dur.
 */
export default async function Home() {
  const utilisateur = await getCurrentUser()
  redirect(utilisateur ? pageAccueil(utilisateur) : '/login')
}
