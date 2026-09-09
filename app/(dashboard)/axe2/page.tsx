import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut, pageAccueil } from '@/lib/habilitations'
import { redirect } from 'next/navigation'
import { FormulairesTransaction } from './FormulairesTransaction'
import { LigneTransaction } from './LigneTransaction'
import { Recherche } from '@/components/ui'
import { correspond } from '@/lib/recherche'
import {
  SectionStructure, SectionTaux, SectionObjectifRevenu, SectionEcheances, SectionSuiviMensuel,
  type StructureVue, type TauxVue, type ObjectifVue, type EcheanceVue,
} from './SectionsStructure'
import {
  tauxTotal, caNecessaire, clientsNecessaires, chargesEstimees, revenuNet, joursAvant,
} from '@/lib/charges'
import { serieDouzeMois } from '@/lib/finance'

export default async function Axe2Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const recherche = ((await searchParams).q ?? '').trim()
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')
  // Sans l'habilitation, l'URL n'est pas la sienne : on le ramene chez lui
  // plutot que de lui afficher une page vide.
  if (!peut(utilisateur, 'AXE_CHIFFRES')) redirect(pageAccueil(utilisateur))

  const { id: userId } = utilisateur

  const client = await prisma.client.findUnique({
        where: { userId },
        include: {
          cycles: {
            where: { status: 'ACTIVE' },
            take: 1,
          },
          transactions: {
            orderBy: { transactionDate: 'desc' },
          },
          adminProfile: true,
          chargeRate: true,
          revenueGoals: { orderBy: { createdAt: 'asc' } },
          deadlines: { orderBy: { dueDate: 'asc' } },
        },
      })

  const cycle = client?.cycles[0]
  const allTransactions = client?.transactions ?? []

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthTransactions = allTransactions.filter(t => {
    const d = new Date(t.transactionDate)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const revenue = monthTransactions
    .filter(t => t.type === 'REVENUE')
    .reduce((s, t) => s + t.amountHt, 0)

  const expenses = monthTransactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amountHt, 0)

  const netResult = revenue - expenses
  const chargeRatio = revenue > 0 ? Math.round((expenses / revenue) * 100) : 0

  const caTarget = cycle?.caTargetMonthly ?? 0
  const caProgress = caTarget > 0 ? Math.round((revenue / caTarget) * 100) : 0

  // Recherche sur le libelle et la categorie. Sans recherche, on montre les
  // huit dernieres ; avec, on cherche dans tout l'historique, sinon le filtre
  // ne servirait qu'a filtrer ce qui est deja a l'ecran.
  const transactionsFiltrees = recherche
    ? allTransactions.filter((t) => correspond([t.label, t.category], recherche))
    : allTransactions
  const recentTransactions = transactionsFiltrees.slice(0, recherche ? 40 : 8)

  // --- Axe 2 : structure, taux et projections. Tout ce qui suit est calcule.
  const structure: StructureVue | null = client?.adminProfile
    ? {
        legalStatus: client.adminProfile.legalStatus,
        proBankAccount: client.adminProfile.proBankAccount,
        invoicingTool: client.adminProfile.invoicingTool,
        accountingTool: client.adminProfile.accountingTool,
        proInsurance: client.adminProfile.proInsurance,
        vatRegime: client.adminProfile.vatRegime,
        siret: client.adminProfile.siret,
        siren: client.adminProfile.siren,
      }
    : null

  const tauxBruts = {
    socialContributionPct: client?.chargeRate?.socialContributionPct ?? 0,
    incomeTaxPct: client?.chargeRate?.incomeTaxPct ?? 0,
    trainingPct: client?.chargeRate?.trainingPct ?? 0,
  }
  const total = tauxTotal(tauxBruts)

  const taux: TauxVue = {
    ...tauxBruts,
    category: client?.chargeRate?.category ?? 'BIC',
    total,
  }

  const objectifs: ObjectifVue[] = (client?.revenueGoals ?? []).map((g) => {
    const ca = caNecessaire(g.netTargetHt, total)
    return {
      id: g.id,
      offerName: g.offerName,
      netTargetHt: g.netTargetHt,
      offerPriceHt: g.offerPriceHt,
      caNecessaire: ca,
      clientsNecessaires: clientsNecessaires(ca, g.offerPriceHt),
    }
  })

  const echeances: EcheanceVue[] = (client?.deadlines ?? []).map((d) => ({
    id: d.id,
    label: d.label,
    echeance: new Date(d.dueDate).toLocaleDateString('fr-FR'),
    jours: joursAvant(new Date(d.dueDate)),
    done: d.done,
    recurrence: d.recurrence,
  }))

  const suiviMensuel = serieDouzeMois(allTransactions)
    .slice(-6)
    .map((p) => {
      const ca = p.ca * 100
      return { mois: p.mois, ca, charges: chargesEstimees(ca, total), net: revenuNet(ca, total) }
    })

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">

      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">
          Chiffres & Administratif
        </h1>
        <p className="text-muted text-sm mt-1">
          Suivez vos revenus et charges en temps réel
        </p>
      </div>

      {/* 4 KPIs Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">
            CA ce mois
          </p>
          <p className="text-2xl font-extrabold text-positive">
            {(revenue / 100).toLocaleString('fr-FR')}€
          </p>
          {caTarget > 0 && (
            <p className="text-xs text-ghost mt-1">
              {caProgress}% de l&apos;objectif
            </p>
          )}
        </div>

        <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">
            Charges ce mois
          </p>
          <p className="text-2xl font-extrabold text-negative">
            {(expenses / 100).toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-ghost mt-1">
            Ratio {chargeRatio}%
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">
            Résultat net
          </p>
          <p className={`text-2xl font-extrabold ${netResult >= 0 ? 'text-accent-ink' : 'text-negative'}`}>
            {(netResult / 100).toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-ghost mt-1">
            CA moins charges
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">
            Objectif 90j
          </p>
          <p className="text-2xl font-extrabold text-accent-ink">
            {((caTarget * 3) / 100).toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-ghost mt-1">
            Cycle {cycle?.cycleNumber ?? '—'}
          </p>
        </div>
      </div>

      {/* Alerte ratio charges si nécessaire */}
      {chargeRatio > 40 && (
        <div className="bg-warning-soft border border-warning rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm text-warning-ink">
            Le ratio charges/CA dépasse 40% ce mois-ci. Pensez à revoir vos postes de dépense.
          </p>
        </div>
      )}

      {/* Grille deux colonnes : saisie + liste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Saisie : formulaires branches en base (Server Actions + Zod) */}
        <FormulairesTransaction />

        {/* Liste des transactions récentes */}
        <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-bold text-ink-soft">
              {recherche ? `Transactions · « ${recherche} »` : 'Transactions récentes'}
            </h2>
            <Recherche action="/axe2" valeur={recherche} placeholder="Libellé ou catégorie" />
          </div>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map((t) => (
                <LigneTransaction
                  key={t.id}
                  transaction={{
                    id: t.id,
                    type: t.type,
                    amountHt: t.amountHt,
                    transactionDate: new Date(t.transactionDate).toISOString(),
                    label: t.label,
                    category: t.category,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ghost text-center py-8">
              {recherche
                ? `Aucune transaction ne correspond à « ${recherche} ».`
                : 'Aucune transaction enregistrée pour l\u2019instant.'}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start mt-6">
        <SectionStructure structure={structure} />
        <SectionTaux taux={taux} />
      </div>

      <div className="mt-6">
        <SectionObjectifRevenu objectifs={objectifs} total={total} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start mt-6">
        <SectionSuiviMensuel lignes={suiviMensuel} total={total} />
        <SectionEcheances echeances={echeances} />
      </div>
    </div>
  )
}
