import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut } from '@/lib/habilitations'
import { Recherche } from '@/components/ui'
import { correspond } from '@/lib/recherche'
import {
  Carte, Vide, Etiquette,
} from '@/components/ui'
import { euros } from '@/lib/format'
import { ArbitrageIdee, SuppressionIdee } from '@/components/FormulairesSysteme'

const LIBELLE_ISSUE: Record<string, { texte: string; ton: 'succes' | 'attente' | 'neutre' | 'info' }> = {
  PARKED: { texte: 'En attente de relecture', ton: 'info' },
  KEPT: { texte: 'Gardee', ton: 'succes' },
  POSTPONED: { texte: 'Reportee', ton: 'attente' },
  DROPPED: { texte: 'Abandonnee', ton: 'neutre' },
}

export default async function HistoriquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const recherche = ((await searchParams).q ?? '').trim()

  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  const client =
    peut(utilisateur, 'DOSSIER_PERSONNEL')
      ? await prisma.client.findUnique({
          where: { userId: utilisateur.id },
          include: {
            cycles: {
              where: { status: { in: ['COMPLETED', 'ARCHIVED'] } },
              orderBy: { cycleNumber: 'desc' },
              include: {
                objectives: { orderBy: { rank: 'asc' } },
                weeks: { orderBy: { weekNumber: 'asc' }, include: { review: true } },
              },
            },
            ideas: { orderBy: { createdAt: 'desc' } },
            transactions: { where: { type: 'REVENUE' } },
          },
        })
      : null

  if (!client) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Historique des cycles</h1>
        <p className="text-sm text-muted">Espace reserve aux entrepreneurs accompagnes.</p>
      </div>
    )
  }

  // La recherche porte sur le nom du cycle, son objectif principal et les
  // intitules de ses objectifs : c'est ainsi qu'on se souvient d'un cycle
  // passe, par ce qu'on y visait et non par son numero.
  const cycles = client.cycles.filter((c) =>
    correspond(
      [c.name, c.mainObjective, ...c.objectives.map((o) => o.title)],
      recherche,
    ),
  )

  const enAttente = client.ideas.filter((i) => i.outcome === 'PARKED')
  const arbitrees = client.ideas.filter((i) => i.outcome !== 'PARKED')

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Historique des cycles</h1>
          <p className="text-muted text-sm mt-1">
            Ce que vous avez vise, ce que vous avez obtenu, et ce que vous en avez appris
          </p>
        </div>
        <Recherche action="/historique" valeur={recherche} placeholder="Objectif ou nom de cycle" />
      </div>

      <Carte
        titre="Relecture du parking d'idees"
        sousTitre="Le rituel de cloture : chaque idee garee est reprise, gardee, reportee ou abandonnee"
        action={
          enAttente.length > 0
            ? <Etiquette texte={`${enAttente.length} en attente`} ton="attente" />
            : <Etiquette texte="Parking a jour" ton="succes" />
        }
      >
        {client.ideas.length > 0 ? (
          <div className="space-y-2">
            {[...enAttente, ...arbitrees].map((idee) => {
              const l = LIBELLE_ISSUE[idee.outcome] ?? LIBELLE_ISSUE.PARKED
              return (
                <div key={idee.id} className="group flex items-start justify-between gap-3 rounded-xl border border-subtle px-4 py-3">
                  <div className="min-w-0">
                    <p className={`text-sm ${idee.outcome === 'DROPPED' ? 'text-ghost line-through' : 'text-ink-soft'}`}>
                      {idee.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Etiquette texte={l.texte} ton={l.ton} />
                      <span className="text-[11px] text-ghost">
                        garee le {new Date(idee.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ArbitrageIdee id={idee.id} issue={idee.outcome} />
                    <SuppressionIdee id={idee.id} />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Vide texte="Aucune idee garee pour l'instant." />
        )}
      </Carte>

      {cycles.length > 0 ? (
        cycles.map((cycle) => {
          const debut = new Date(cycle.startDate)
          const fin = new Date(cycle.endDate)
          const caRealise = client.transactions
            .filter((t) => {
              const d = new Date(t.transactionDate)
              return d >= debut && d <= fin
            })
            .reduce((s, t) => s + t.amountHt, 0)

          const objectif90 = cycle.caTargetMonthly * 3
          const atteinte = objectif90 > 0 ? Math.round((caRealise / objectif90) * 100) : 0
          const revues = cycle.weeks.filter((w) => w.review)

          return (
            <Carte
              key={cycle.id}
              titre={`Cycle ${cycle.cycleNumber}${cycle.name ? ` · ${cycle.name}` : ''}`}
              sousTitre={`Du ${debut.toLocaleDateString('fr-FR')} au ${fin.toLocaleDateString('fr-FR')}`}
              action={<Etiquette texte={`${atteinte} % de l'objectif`} ton={atteinte >= 80 ? 'succes' : atteinte >= 50 ? 'attente' : 'alerte'} />}
            >
              <p className="text-sm font-semibold text-ink-soft mb-4">{cycle.mainObjective}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                <div className="rounded-xl bg-surface-muted p-3.5">
                  <p className="text-lg font-extrabold text-ink-soft">{euros(objectif90)}</p>
                  <p className="text-xs text-ghost mt-0.5">Objectif sur 90 jours</p>
                </div>
                <div className="rounded-xl bg-surface-muted p-3.5">
                  <p className="text-lg font-extrabold text-positive">{euros(caRealise)}</p>
                  <p className="text-xs text-ghost mt-0.5">Realise</p>
                </div>
                <div className="rounded-xl bg-surface-muted p-3.5">
                  <p className="text-lg font-extrabold text-accent-ink">{revues.length} / 12</p>
                  <p className="text-xs text-ghost mt-0.5">Revues hebdomadaires tenues</p>
                </div>
              </div>

              {cycle.objectives.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-muted mb-2">Les priorites, et ou elles se sont arretees</p>
                  <div className="space-y-2">
                    {cycle.objectives.map((o) => (
                      <div key={o.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-ink-soft">{o.title}</span>
                          <span className="text-muted font-semibold">{o.progressPct} %</span>
                        </div>
                        <div className="h-1.5 bg-surface-muted rounded-full">
                          <div
                            className="h-1.5 bg-gradient-to-r from-accent to-accent-alt rounded-full"
                            style={{ width: `${o.progressPct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cycle.closingNote && (
                <div className="rounded-xl bg-accent-soft border border-accent px-4 py-3 mb-5">
                  <p className="text-xs font-bold text-accent-ink mb-1">Ce que j&apos;en retiens</p>
                  <p className="text-sm text-ink-soft leading-relaxed">{cycle.closingNote}</p>
                </div>
              )}

              {revues.length > 0 && (
                <details className="group">
                  <summary className="cursor-pointer text-xs font-bold text-muted hover:text-ink-soft">
                    Voir les {revues.length} revue{revues.length > 1 ? 's' : ''} hebdomadaire{revues.length > 1 ? 's' : ''}
                  </summary>
                  <div className="mt-3 space-y-2">
                    {revues.map((w) => (
                      <div key={w.id} className="rounded-xl border border-subtle px-4 py-3">
                        <p className="text-xs font-bold text-muted mb-2">Semaine {w.weekNumber}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-[11px] font-semibold text-positive mb-0.5">Ce qui marche</p>
                            <p className="text-muted">{w.review?.whatWorks || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-negative mb-0.5">Ce qui bloque</p>
                            <p className="text-muted">{w.review?.whatBlocks || '—'}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-accent-ink mb-0.5">Mes ajustements</p>
                            <p className="text-muted">{w.review?.adjustments || '—'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </Carte>
          )
        })
      ) : (
        <Carte titre="Aucun cycle cloture">
          <Vide
            texte={
              recherche
                ? `Aucun cycle ne correspond a « ${recherche} ».`
                : 'Vos cycles termines apparaitront ici, avec leurs resultats et leurs apprentissages.'
            }
          />
        </Carte>
      )}
    </div>
  )
}
