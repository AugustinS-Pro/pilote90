import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'
import { prisma }           from '@/lib/prisma'
import { redirect }         from 'next/navigation'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const role   = (session.user as any).role

  // Récupérer le profil client si CLIENT
  const client = role === 'CLIENT'
    ? await prisma.client.findUnique({
        where: { userId },
        include: {
          cycles: {
            where:   { status: 'ACTIVE' },
            include: { weeks: { orderBy: { weekNumber: 'asc' } }, objectives: true },
            take:    1,
          },
          transactions: {
            where: {
              transactionDate: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            }
          }
        }
      })
    : null

  const cycle       = client?.cycles[0]
  const today       = new Date()
  const weekNumber  = cycle
    ? Math.min(12, Math.ceil(
        (today.getTime() - new Date(cycle.startDate).getTime())
        / (7 * 86400000)
      ))
    : 0

  const currentMonthRevenue = client?.transactions
    .filter(t => t.type === 'REVENUE')
    .reduce((s, t) => s + t.amountHt, 0) ?? 0

  const currentMonthExpenses = client?.transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amountHt, 0) ?? 0

  const caTarget    = cycle?.caTargetMonthly ?? 0
  const caProgress  = caTarget > 0
    ? Math.round((currentMonthRevenue / caTarget) * 100)
    : 0

  return (
    <div className="p-7">

      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">
          Bonjour {session.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {today.toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric',
            month: 'long', year: 'numeric'
          })}
        </p>
      </div>

      {/* Bandeau cycle */}
      {cycle && (
        <div className="bg-slate-900 rounded-2xl p-5 mb-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                Cycle {cycle.cycleNumber} — Semaine {weekNumber}/12
              </p>
              <p className="font-bold text-lg">{cycle.mainObjective}</p>
            </div>
            <span className="flex items-center gap-1.5 bg-teal-500/20
                             text-teal-400 text-xs font-semibold px-3 py-1.5
                             rounded-full">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full
                               animate-pulse" />
              Actif
            </span>
          </div>

          {/* Barre 12 semaines */}
          <div className="flex gap-1">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  i + 1 < weekNumber  ? 'bg-indigo-500' :
                  i + 1 === weekNumber ? 'bg-teal-400'  : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1.5">
            <span>Démarrage</span>
            <span>Mois 1</span>
            <span>Mois 2</span>
            <span>Fin</span>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200
                        shadow-sm p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase
                        tracking-wide mb-1">
            CA ce mois
          </p>
          <p className="text-3xl font-extrabold text-teal-600">
            {(currentMonthRevenue / 100).toLocaleString('fr-FR')} €
          </p>
          {caTarget > 0 && (
            <>
              <div className="h-1.5 bg-slate-100 rounded-full mt-3">
                <div
                  className="h-1.5 bg-gradient-to-r from-teal-400
                             to-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.min(100, caProgress)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {caProgress}% de l&apos;objectif
              </p>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200
                        shadow-sm p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase
                        tracking-wide mb-1">
            Charges ce mois
          </p>
          <p className="text-3xl font-extrabold text-red-500">
            {(currentMonthExpenses / 100).toLocaleString('fr-FR')} €
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Net : {((currentMonthRevenue - currentMonthExpenses) / 100)
              .toLocaleString('fr-FR')} €
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200
                        shadow-sm p-5">
          <p className="text-xs text-slate-500 font-semibold uppercase
                        tracking-wide mb-1">
            Priorités actives
          </p>
          <p className="text-3xl font-extrabold text-indigo-600">
            {cycle?.objectives?.length ?? 0}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Cycle {cycle?.cycleNumber ?? '—'}
          </p>
        </div>
      </div>

      {/* Priorités CEO */}
      {cycle?.objectives && cycle.objectives.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200
                        shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-700 mb-4">
            🎯 Priorités du cycle
          </h2>
          <div className="space-y-4">
            {cycle.objectives.map(obj => (
              <div key={obj.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-800">
                    {obj.title}
                  </span>
                  <span className="text-slate-500 font-semibold">
                    {obj.progressPct}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full">
                  <div
                    className="h-2 bg-gradient-to-r from-indigo-500
                               to-purple-500 rounded-full transition-all"
                    style={{ width: `${obj.progressPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}