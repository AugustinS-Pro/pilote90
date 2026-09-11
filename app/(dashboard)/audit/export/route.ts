import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut } from '@/lib/habilitations'
import { serieDouzeMois } from '@/lib/finance'

/**
 * Export CSV destine au comptable.
 * Le point-virgule et l'entete BOM assurent une ouverture correcte
 * dans Excel en configuration francaise.
 */
export async function GET() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) return new Response('Non autorise', { status: 401 })

  // Meme donnee que le rapport PDF, donc meme habilitation. Sans ce test, un
  // compte qui n'a pas achete le module Audit recuperait quand meme le CSV en
  // tapant l'URL : ce sont ses donnees, mais c'est un contournement de la
  // logique de formule.
  if (!peut(utilisateur, 'AUDIT_PERSONNEL')) return new Response('Non autorise', { status: 403 })

  const client = await prisma.client.findUnique({
    where: { userId: utilisateur.id },
    include: { transactions: { orderBy: { transactionDate: 'asc' } } },
  })
  if (!client) return new Response('Aucun dossier client', { status: 404 })

  const echapper = (valeur: string) => `"${valeur.replace(/"/g, '""')}"`
  const montant = (centimes: number) => (centimes / 100).toFixed(2).replace('.', ',')

  const lignes: string[] = []

  lignes.push(echapper(`Pilote90, export comptable, ${client.companyName}`))
  lignes.push(echapper(`Genere le ${new Date().toLocaleDateString('fr-FR')}`))
  lignes.push('')

  lignes.push(['Date', 'Type', 'Libelle', 'Categorie', 'Montant HT (euros)'].map(echapper).join(';'))
  for (const t of client.transactions) {
    lignes.push([
      new Date(t.transactionDate).toLocaleDateString('fr-FR'),
      t.type === 'REVENUE' ? 'Revenu' : 'Charge',
      t.label ?? '',
      t.category ?? '',
      montant(t.amountHt),
    ].map(echapper).join(';'))
  }

  lignes.push('')
  lignes.push(echapper('Synthese mensuelle sur douze mois glissants'))
  lignes.push(['Mois', 'CA (euros)', 'Charges (euros)', 'Net (euros)'].map(echapper).join(';'))
  for (const p of serieDouzeMois(client.transactions)) {
    lignes.push([p.cle, String(p.ca), String(p.charges), String(p.net)].map(echapper).join(';'))
  }

  const horodatage = new Date().toISOString().slice(0, 10)

  return new Response('\uFEFF' + lignes.join('\r\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pilote90-export-${horodatage}.csv"`,
    },
  })
}
