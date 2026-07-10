import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function Axe1Page() {
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
            include: { objectives: true },
            take: 1,
          },
        },
      })
    : null

  const cycle = client?.cycles[0]
  const objectives = cycle?.objectives ?? []

  const today = new Date()
  const startDate = cycle ? new Date(cycle.startDate) : null
  const endDate = cycle ? new Date(cycle.endDate) : null
  const daysElapsed = startDate
    ? Math.floor((today.getTime() - startDate.getTime()) / 86400000)
    : 0
  const daysRemaining = endDate
    ? Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / 86400000))
    : 0

  const avgProgress = objectives.length > 0
    ? Math.round(objectives.reduce((s, o) => s + o.progressPct, 0) / objectives.length)
    : 0

  return (
    <div className="p-8 w-full">

      {/* Bandeau Vision */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 mb-6 text-white">
        <p className="text-xs uppercase tracking-wider text-indigo-100 font-semibold mb-2">
          Vision stratégique
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold leading-snug mb-1 max-w-2xl">
          {cycle?.mainObjective ?? 'Définissez votre objectif principal'}
        </h1>
        <p className="text-indigo-100 text-sm">
          Cycle {cycle?.cycleNumber ?? '—'} • {daysRemaining} jours restants
        </p>

        {/* 4 KPIs en ligne */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-2xl font-extrabold">
              {((cycle?.caTargetMonthly ?? 0) / 100).toLocaleString('fr-FR')}€
            </p>
            <p className="text-xs text-indigo-100 mt-1">Objectif CA / mois</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-2xl font-extrabold">{avgProgress}%</p>
            <p className="text-xs text-indigo-100 mt-1">Progression moyenne</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-2xl font-extrabold">{objectives.length}</p>
            <p className="text-xs text-indigo-100 mt-1">Priorités actives</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-2xl font-extrabold">{daysElapsed}j</p>
            <p className="text-xs text-indigo-100 mt-1">Depuis le début</p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['Vision', 'Priorités', 'Décisions', 'Idées parking'].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              i === 0
                ? 'bg-indigo-500 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grille Bento des priorités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {objectives.length > 0 ? (
          objectives.map((obj, i) => {
            const icons = ['🎯', '👥', '🚀']
            const statusColor = obj.status === 'COMPLETED'
              ? 'bg-teal-50 text-teal-700'
              : obj.status === 'LATE'
              ? 'bg-red-50 text-red-700'
              : 'bg-amber-50 text-amber-700'
            const statusLabel = obj.status === 'COMPLETED'
              ? 'Terminé'
              : obj.status === 'LATE'
              ? 'En retard'
              : 'En cours'

            return (
              <div
                key={obj.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5
                           hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{icons[i % icons.length]}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">
                  {obj.title}
                </h3>
                {obj.description && (
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    {obj.description}
                  </p>
                )}
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Progression</span>
                  <span className="font-semibold text-slate-700">{obj.progressPct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div
                    className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${obj.progressPct}%` }}
                  />
                </div>
              </div>
            )
          })
        ) : (
          <div className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-sm text-slate-400">
              Aucune priorité définie pour ce cycle. Créez-en une pour commencer.
            </p>
          </div>
        )}
      </div>

      {/* Parking d'idées */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-slate-700">Parking d'idées</h2>
          <button className="text-xs bg-indigo-500 hover:bg-indigo-600 text-white
                             font-semibold px-3 py-1.5 rounded-lg transition-colors">
            + Idée
          </button>
        </div>
        <p className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 inline-block">
          Ces idées sont relues en fin de cycle, pas avant.
        </p>
      </div>
    </div>
  )
}