import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut, pageAccueil } from '@/lib/habilitations'
import {
  Carte, Vide, Etiquette,
} from '@/components/ui'
import { euros } from '@/lib/format'
import { PILIERS } from '@/lib/piliers'
import { BlocPilier, type ReponsesPilier } from './BlocPilier'
import { CartePriorite } from './CartePriorite'
import { FormulairePriorite } from './FormulairePriorite'
import { FormulaireIdee, ArbitrageIdee, SuppressionIdee } from '@/components/FormulairesSysteme'

export default async function Axe1Page() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')
  // Sans l'habilitation, l'URL n'est pas la sienne : on le ramene chez lui
  // plutot que de lui afficher une page vide.
  if (!peut(utilisateur, 'AXE_VISION')) redirect(pageAccueil(utilisateur))

  const client = await prisma.client.findUnique({
          where: { userId: utilisateur.id },
          include: {
            strategyEntries: { include: { notes: true } },
            cycles: {
              where: { status: 'ACTIVE' },
              take: 1,
              include: { objectives: { orderBy: { rank: 'asc' } } },
            },
            ideas: { where: { outcome: 'PARKED' }, orderBy: { createdAt: 'desc' } },
            decisions: { orderBy: { decidedAt: 'desc' }, take: 3 },
          },
        })

  if (!client) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Vision CEO</h1>
        <p className="text-sm text-muted">Espace reserve aux entrepreneurs accompagnes.</p>
      </div>
    )
  }

  const cycle = client.cycles[0]
  const objectives = cycle?.objectives ?? []

  const valeursParPilier = new Map<string, ReponsesPilier>()
  for (const p of PILIERS) {
    const entree = client.strategyEntries.find((e) => e.key === p.cle)
    const reponses: Record<string, string> = {}
    for (const n of entree?.notes ?? []) {
      if (n.answer) reponses[n.question] = n.answer
    }
    valeursParPilier.set(p.cle, { synthesis: entree?.synthesis ?? null, reponses })
  }

  const aujourdhui = new Date()
  const finCycle = cycle ? new Date(cycle.endDate) : null
  const joursRestants = finCycle
    ? Math.max(0, Math.floor((finCycle.getTime() - aujourdhui.getTime()) / 86400000))
    : 0

  const progressionMoyenne =
    objectives.length > 0
      ? Math.round(objectives.reduce((s, o) => s + o.progressPct, 0) / objectives.length)
      : 0

  const objectifAnnuel = valeursParPilier.get('OBJECTIF_ANNUEL')?.synthesis
  const vision = valeursParPilier.get('VISION')?.synthesis

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">

      <div className="bg-gradient-to-br from-accent to-accent-alt rounded-3xl p-8 text-on-accent">
        <p className="text-xs uppercase tracking-wider text-on-inverse font-semibold mb-2">
          Vision strategique
        </p>
        <h1 className="text-2xl md:text-3xl font-extrabold leading-snug mb-1 max-w-3xl">
          {vision ?? cycle?.mainObjective ?? 'Definissez le cap de votre activite'}
        </h1>
        <p className="text-on-inverse text-sm">
          {cycle ? `Cycle ${cycle.cycleNumber} · ${joursRestants} jours restants` : 'Aucun cycle en cours'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-surface/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-2xl font-extrabold">{euros(cycle?.caTargetMonthly ?? 0)}</p>
            <p className="text-xs text-on-inverse mt-1">Objectif de CA mensuel</p>
          </div>
          <div className="bg-surface/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-2xl font-extrabold">{progressionMoyenne} %</p>
            <p className="text-xs text-on-inverse mt-1">Progression moyenne</p>
          </div>
          <div className="bg-surface/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-2xl font-extrabold">{objectives.length} / 3</p>
            <p className="text-xs text-on-inverse mt-1">Priorites definies</p>
          </div>
          <div className="bg-surface/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-2xl font-extrabold">{client.ideas.length}</p>
            <p className="text-xs text-on-inverse mt-1">Idees garees</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {PILIERS.map((p) => (
          <BlocPilier
            key={p.cle}
            pilier={p}
            valeurs={valeursParPilier.get(p.cle) ?? { synthesis: null, reponses: {} }}
          />
        ))}
      </div>

      <Carte
        titre="Les priorites de ce cycle"
        sousTitre="Trois priorites au maximum par cycle"
      >
        <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {objectives.map((obj, i) => (
            <CartePriorite
              key={obj.id}
              icone={['🎯', '👥', '🚀'][i % 3]}
              priorite={{
                id: obj.id,
                title: obj.title,
                description: obj.description,
                progressPct: obj.progressPct,
                status: obj.status,
              }}
            />
          ))}
          {objectives.length < 3 && <FormulairePriorite cycleActif={Boolean(cycle)} />}
        </div>
      </Carte>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <Carte
          titre="Parking d'idees"
          sousTitre="Ces idees sont relues a la cloture du cycle, pas avant"
        >
          <div className="mb-4"><FormulaireIdee /></div>

          {client.ideas.length > 0 ? (
            <div className="space-y-2">
              {client.ideas.map((idee) => (
                <div key={idee.id} className="group flex items-start justify-between gap-3 rounded-xl border border-subtle px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm text-ink-soft">{idee.content}</p>
                    <p className="text-[11px] text-ghost mt-1">
                      {new Date(idee.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ArbitrageIdee id={idee.id} issue={idee.outcome} />
                    <SuppressionIdee id={idee.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Vide texte="Aucune idee garee. Notez-les ici plutot que de les suivre tout de suite." />
          )}
        </Carte>

        <Carte
          titre="Mes dernieres decisions"
          sousTitre="Extrait du centre de decisions"
          action={
            <Link href="/decisions" className="text-xs font-semibold text-accent-ink hover:underline">
              Tout voir
            </Link>
          }
        >
          {client.decisions.length > 0 ? (
            <div className="space-y-2">
              {client.decisions.map((d) => (
                <div key={d.id} className="rounded-xl border border-subtle px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Etiquette texte={d.category.toLowerCase()} ton="info" />
                    <span className="text-xs text-ghost">
                      {new Date(d.decidedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-ink-soft">{d.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <Vide texte="Aucune decision consignee." />
          )}
        </Carte>
      </div>

      {objectifAnnuel && (
        <Carte titre="Mon objectif annuel" sousTitre="Le cap dont chaque cycle de 90 jours est une etape">
          <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{objectifAnnuel}</p>
        </Carte>
      )}
    </div>
  )
}
