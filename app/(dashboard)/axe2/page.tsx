import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { redirect } from 'next/navigation'
import { FormulairesTransaction } from './FormulairesTransaction'
import { supprimerTransaction } from './actions'
import {
  SectionStructure, SectionTaux, SectionObjectifRevenu, SectionEcheances, SectionSuiviMensuel,
  type StructureVue, type TauxVue, type ObjectifVue, type EcheanceVue,
} from './SectionsStructure'
import {
  tauxTotal, caNecessaire, clientsNecessaires, chargesEstimees, revenuNet, joursAvant,
} from '@/lib/charges'
import { serieDouzeMois } from '@/lib/finance'

export default async function Axe2Page() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  const { id: userId, role } = utilisateur

  const client = role === 'CLIENT'
    ? await prisma.client.findUnique({
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
    : null

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

  const recentTransactions = allTransactions.slice(0, 8)

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
    <div className="p-8 w-full">

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
          <h2 className="text-sm font-bold text-ink-soft mb-4">
            Transactions récentes
          </h2>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map(t => (
                <div
                  key={t.id}
                  className="group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-surface-muted"
                >
                  <div>
                    <p className="text-sm font-medium text-ink-soft">
                      {t.label ?? (t.type === 'REVENUE' ? 'Revenu' : 'Charge')}
                    </p>
                    <p className="text-xs text-ghost">
                      {new Date(t.transactionDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${
                      t.type === 'REVENUE' ? 'text-positive' : 'text-negative'
                    }`}>
                      {t.type === 'REVENUE' ? '+' : '-'}{(t.amountHt / 100).toLocaleString('fr-FR')}€
                    </span>
                    <form action={supprimerTransaction}>
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        aria-label={`Supprimer la transaction ${t.label ?? ''}`}
                        title="Supprimer"
                        className="opacity-0 group-hover:opacity-100 transition-opacity
                                   text-disabled hover:text-negative text-sm px-1"
                      >
                        ✕
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ghost text-center py-8">
              Aucune transaction enregistrée pour l&apos;instant.
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
