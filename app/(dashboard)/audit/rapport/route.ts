import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut } from '@/lib/habilitations'
import { construireRapportComptable, reponsePdf } from '@/lib/rapport-pdf'

export const runtime = 'nodejs'

/**
 * Rapport comptable de l entrepreneur connecte.
 *
 * Cloisonnement : la recherche part du userId de la SESSION, jamais d un
 * identifiant fourni par le navigateur. La mise en page vit dans
 * `lib/rapport-pdf.ts`, partagee avec la variante consultant.
 */
export async function GET() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) return new Response('Non autorise', { status: 401 })
  if (!peut(utilisateur, 'AUDIT_PERSONNEL')) {
    return new Response('Non autorise', { status: 403 })
  }

  const client = await prisma.client.findUnique({
    where: { userId: utilisateur.id },
    include: {
      transactions: { orderBy: { transactionDate: 'desc' } },
      cycles: { where: { status: 'ACTIVE' }, take: 1 },
    },
  })
  if (!client) return new Response('Aucun dossier client', { status: 404 })

  return reponsePdf(
    await construireRapportComptable({
      companyName: client.companyName,
      transactions: client.transactions,
      objectifCaMensuel: client.cycles[0]?.caTargetMonthly ?? 0,
    }),
  )
}
