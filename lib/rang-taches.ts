import { prisma } from '@/lib/prisma'

/**
 * Rang de la prochaine tache du cockpit d'un client.
 *
 * Les deux endroits qui creent des taches comptaient les taches en cours pour
 * en deduire un rang. Des qu'une tache etait cochee, le compte redescendait et
 * la suivante reprenait un rang deja pris : deux taches de meme rang
 * s'affichaient alors dans un ordre que rien ne garantissait. On repart du rang
 * le plus haut deja attribue, coche ou non.
 */
export async function rangSuivant(clientId: string): Promise<number> {
  const derniere = await prisma.task.findFirst({
    where: { clientId },
    orderBy: { position: 'desc' },
    select: { position: true },
  })
  return (derniere?.position ?? -1) + 1
}
