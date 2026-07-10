import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function Axe2Page() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const role = (session.user as any).role

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

  return (
    <div className="p-8 w-full">

      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Chiffres & Administratif
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Suivez vos revenus et charges en temps réel
        </p>
      </div>

      {/* 4 KPIs Bento */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
            CA ce mois
          </p>
          <p className="text-2xl font-extrabold text-teal-600">
            {(revenue / 100).toLocaleString('fr-FR')}€
          </p>
          {caTarget > 0 && (
            <p className="text-xs text-slate-400 mt-1">
              {caProgress}% de l'objectif
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
            Charges ce mois
          </p>
          <p className="text-2xl font-extrabold text-red-500">
            {(expenses / 100).toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Ratio {chargeRatio}%
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
            Résultat net
          </p>
          <p className={`text-2xl font-extrabold ${netResult >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
            {(netResult / 100).toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-slate-400 mt-1">
            CA moins charges
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
            Objectif 90j
          </p>
          <p className="text-2xl font-extrabold text-purple-600">
            {((caTarget * 3) / 100).toLocaleString('fr-FR')}€
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Cycle {cycle?.cycleNumber ?? '—'}
          </p>
        </div>
      </div>

      {/* Alerte ratio charges si nécessaire */}
      {chargeRatio > 40 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm text-amber-800">
            Le ratio charges/CA dépasse 40% ce mois-ci. Pensez à revoir vos postes de dépense.
          </p>
        </div>
      )}

      {/* Grille deux colonnes : saisie + liste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Formulaires de saisie rapide */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full" />
              Enregistrer un revenu
            </h2>
            <div className="space-y-3">
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#FAF9F6] text-sm
                           focus:outline-none focus:border-indigo-400 focus:bg-white"
              />
              <input
                type="text"
                placeholder="Client"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#FAF9F6] text-sm
                           focus:outline-none focus:border-indigo-400 focus:bg-white"
              />
              <input
                type="number"
                placeholder="Montant HT (€)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#FAF9F6] text-sm
                           focus:outline-none focus:border-indigo-400 focus:bg-white"
              />
              <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold
                                 py-2.5 rounded-lg text-sm transition-colors">
                Enregistrer le revenu
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Enregistrer une charge
            </h2>
            <div className="space-y-3">
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#FAF9F6] text-sm
                           focus:outline-none focus:border-indigo-400 focus:bg-white"
              />
              <input
                type="text"
                placeholder="Fournisseur"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#FAF9F6] text-sm
                           focus:outline-none focus:border-indigo-400 focus:bg-white"
              />
              <input
                type="number"
                placeholder="Montant HT (€)"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#FAF9F6] text-sm
                           focus:outline-none focus:border-indigo-400 focus:bg-white"
              />
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold
                                 py-2.5 rounded-lg text-sm transition-colors">
                Enregistrer la charge
              </button>
            </div>
          </div>
        </div>

        {/* Liste des transactions récentes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">
            Transactions récentes
          </h2>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map(t => (
                <div
                  key={t.id}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {t.label ?? (t.type === 'REVENUE' ? 'Revenu' : 'Charge')}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(t.transactionDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className={`text-sm font-bold ${
                    t.type === 'REVENUE' ? 'text-teal-600' : 'text-red-500'
                  }`}>
                    {t.type === 'REVENUE' ? '+' : '-'}{(t.amountHt / 100).toLocaleString('fr-FR')}€
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              Aucune transaction enregistrée pour l'instant.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}