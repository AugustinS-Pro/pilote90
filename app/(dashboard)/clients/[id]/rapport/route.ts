import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut } from '@/lib/habilitations'
import { construireRapportComptable, reponsePdf } from '@/lib/rapport-pdf'

export const runtime = 'nodejs'

/**
 * Le meme rapport, edite par le consultant pour un client de son portefeuille.
 *
 * Deux garde-fous, et le second est le plus important : l identifiant du
 * client vient bien de l URL, mais la recherche impose `adminId` pris dans la
 * session. Changer le chiffre dans la barre d adresse ne donne donc acces a
 * rien : un client qui n est pas dans le portefeuille du demandeur ne remonte
 * simplement pas, et la route repond 404 sans reveler qu il existe.
 */
export async function GET(
  _requete: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) return new Response('Non autorise', { status: 401 })
  if (!peut(utilisateur, 'PORTEFEUILLE_CONSULTER')) {
    return new Response('Non autorise', { status: 403 })
  }

  const { id } = await params

  const client = await prisma.client.findFirst({
    where: { id, adminId: utilisateur.id },
    include: {
      transactions: { orderBy: { transactionDate: 'desc' } },
      cycles: { where: { status: 'ACTIVE' }, take: 1 },
    },
  })
  if (!client) return new Response('Client introuvable', { status: 404 })

  return reponsePdf(
    await construireRapportComptable({
      companyName: client.companyName,
      transactions: client.transactions,
      objectifCaMensuel: client.cycles[0]?.caTargetMonthly ?? 0,
    }),
  )
}
