import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import {
  Carte, Vide, Etiquette,
} from '@/components/ui'
import { euros } from '@/lib/format'
import { calculerIndicateurs } from '@/lib/finance'

export default async function DashboardPage() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')
  if (utilisateur.role === 'ADMIN') redirect('/clients')

  const client = await prisma.client.findUnique({
    where: { userId: utilisateur.id },
    include: {
      cycles: {
        where: { status: 'ACTIVE' }, take: 1,
        include: { objectives: { orderBy: { rank: 'asc' } } },
      },
      transactions: true,
      strategyEntries: true,
      offers: { where: { status: 'ACTIF' } },
      prospects: true,
      contentIdeas: true,
      tasks: { where: { done: false }, orderBy: { position: 'asc' }, take: 3, include: { objective: { select: { title: true } } } },
    },
  })

  if (!client) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Tableau de bord</h1>
        <p className="text-sm text-muted">Aucun dossier client rattache a ce compte.</p>
      </div>
    )
  }

  const cycle = client.cycles[0]
  const aujourdhui = new Date()
  const indicateurs = calculerIndicateurs(client.transactions, cycle?.caTargetMonthly ?? 0)

  const semaine = cycle
    ? Math.min(12, Math.max(1, Math.ceil((aujourdhui.getTime() - new Date(cycle.startDate).getTime()) / (7 * 86400000))))
    : 0

  const vision = client.strategyEntries.find((e) => e.key === 'VISION')?.synthesis
  const prospectsActifs = client.prospects.filter((p) => p.stage !== 'SIGNE').length
  const contenusAFaire = client.contentIdeas.filter((c) => c.status !== 'PUBLIE').length

  const axes = [
    { href: '/axe1', icone: '🧭', titre: 'Vision CEO', valeur: `${client.strategyEntries.filter((e) => e.synthesis).length} / 4`, detail: 'piliers renseignes' },
    { href: '/axe2', icone: '💶', titre: 'Chiffres & Admin', valeur: euros(indicateurs.resultatNet), detail: 'resultat net du mois' },
    { href: '/axe3', icone: '🎁', titre: 'Offres & Clients', valeur: String(client.offers.length), detail: 'offres actives' },
    { href: '/axe4', icone: '📣', titre: 'Com & Ventes', valeur: String(prospectsActifs), detail: `prospects · ${contenusAFaire} contenus a faire` },
  ]

  return (
    <div className="p-8 w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">
          Bonjour {utilisateur.name?.split(' ')[0] ?? ''}
        </h1>
        <p className="text-muted text-sm mt-1">
          {aujourdhui.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {cycle ? (
        <div className="bg-inverse rounded-2xl p-5 text-on-inverse">
          <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
            <div>
              <p className="text-xs text-ghost uppercase tracking-wider mb-1">
                Cycle {cycle.cycleNumber} — semaine {semaine} sur 12
              </p>
              <p className="font-bold text-lg">{cycle.mainObjective}</p>
              {vision && <p className="text-xs text-ghost mt-1.5 max-w-2xl">{vision}</p>}
            </div>
            <span className="flex items-center gap-1.5 bg-positive/20 text-positive text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse" />
              Actif
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${
                i + 1 < semaine ? 'bg-accent' : i + 1 === semaine ? 'bg-positive' : 'bg-inverse-soft'
              }`} />
            ))}
          </div>
        </div>
      ) : (
        <Carte titre="Aucun cycle en cours">
          <p className="text-sm text-muted mb-3">
            Tout part d&apos;un cycle de 90 jours : l&apos;objectif, les priorites, les semaines.
          </p>
          <Link href="/axe5" className="text-sm font-semibold text-accent-ink hover:underline">
            Ouvrir un cycle →
          </Link>
        </Carte>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {axes.map((a) => (
          <Link
            key={a.href} href={a.href}
            className="bg-surface rounded-2xl border border-subtle shadow-sm p-5
                       hover:border-accent hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{a.icone}</span>
              <p className="text-xs text-muted font-semibold uppercase tracking-wide">{a.titre}</p>
            </div>
            <p className="text-2xl font-extrabold text-ink-soft">{a.valeur}</p>
            <p className="text-[11px] text-ghost mt-1">{a.detail}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <Carte
          titre="Mon top du jour"
          sousTitre="Les trois prochaines actions, et la priorite qu'elles font avancer"
          action={<Link href="/axe5" className="text-xs font-semibold text-accent-ink hover:underline">Le cockpit</Link>}
        >
          {client.tasks.length > 0 ? (
            <div className="space-y-2">
              {client.tasks.map((t, i) => (
                <div key={t.id} className="flex items-start gap-3 rounded-xl border border-subtle px-4 py-3">
                  <span className="w-5 h-5 rounded-md bg-surface-muted text-accent-ink text-xs font-bold
                                   flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-soft">{t.label}</p>
                    {t.objective && <p className="text-xs text-accent mt-0.5">↳ {t.objective.title}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Vide texte="Aucune action en attente." />
          )}
        </Carte>

        <Carte
          titre="Les priorites du cycle"
          action={<Link href="/axe1" className="text-xs font-semibold text-accent-ink hover:underline">Vision CEO</Link>}
        >
          {cycle && cycle.objectives.length > 0 ? (
            <div className="space-y-4">
              {cycle.objectives.map((o) => (
                <div key={o.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-ink-soft">{o.title}</span>
                    <span className="text-muted font-semibold">{o.progressPct} %</span>
                  </div>
                  <div className="h-2 bg-surface-muted rounded-full">
                    <div className="h-2 bg-gradient-to-r from-accent to-accent-alt rounded-full transition-all"
                         style={{ width: `${o.progressPct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Vide texte="Aucune priorite definie." />
          )}
        </Carte>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { t: 'Tresorerie', v: euros(indicateurs.tresorerie), c: indicateurs.tresorerie >= 0 ? 'text-positive' : 'text-negative' },
          { t: 'CA du mois', v: euros(indicateurs.caDuMois), c: 'text-positive' },
          { t: 'Charges du mois', v: euros(indicateurs.chargesDuMois), c: 'text-negative' },
          { t: 'Objectif mensuel', v: `${indicateurs.progressionObjectif} %`, c: 'text-accent-ink' },
        ].map((k) => (
          <div key={k.t} className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
            <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">{k.t}</p>
            <p className={`text-2xl font-extrabold ${k.c}`}>{k.v}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Etiquette texte="Audit & Previsionnel" ton="info" />
        <Link href="/audit" className="text-sm text-muted hover:text-ink-soft">
          Voir le detail financier, le previsionnel et l&apos;audit automatique →
        </Link>
      </div>
    </div>
  )
}
