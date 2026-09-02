import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import {
  Carte, Vide, Etiquette,
} from '@/components/ui'
import { euros } from '@/lib/format'
import {
  calculerIndicateurs, serieDouzeMois, calculerPrevisionnel,
  auditerFinances, messageDeSituation,
} from '@/lib/finance'
import { GrapheCaCharges, GraphePrevisionnel } from '../../audit/Graphes'
import { estConfidentiel, masquer } from '@/lib/confidentialite'

const STYLE = {
  ALERTE: { fond: 'bg-negative-soft border-negative', texte: 'text-negative-ink', libelle: 'Alerte' },
  ATTENTION: { fond: 'bg-warning-soft border-warning', texte: 'text-warning-ink', libelle: 'Attention' },
  ANALYSE: { fond: 'bg-accent-soft border-accent', texte: 'text-accent-ink', libelle: 'Analyse' },
} as const

export default async function FicheClientPage({ params }: { params: Promise<{ id: string }> }) {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')
  if (utilisateur.role !== 'ADMIN') redirect('/dashboard')

  const { id } = await params
  const confidentiel = await estConfidentiel()

  // Cloisonnement : le consultant n'accede qu'aux clients de son portefeuille.
  const client = await prisma.client.findFirst({
    where: { id, adminId: utilisateur.id },
    include: {
      user: { select: { name: true, email: true } },
      transactions: { orderBy: { transactionDate: 'desc' } },
      cycles: { where: { status: 'ACTIVE' }, take: 1, include: { objectives: { orderBy: { rank: 'asc' } } } },
    },
  })
  if (!client) notFound()

  const cycle = client.cycles[0]
  const indicateurs = calculerIndicateurs(client.transactions, cycle?.caTargetMonthly ?? 0)
  const historique = serieDouzeMois(client.transactions)
  const previsionnel = calculerPrevisionnel(client.transactions)
  const constats = auditerFinances(indicateurs, previsionnel, client.transactions.length)
  const situation = messageDeSituation(constats)

  const nom = masquer(client.companyName, confidentiel)

  const bandeau =
    situation.ton === 'ALERTE' ? 'bg-negative-soft border-negative text-negative-ink'
    : situation.ton === 'ATTENTION' ? 'bg-warning-soft border-warning text-warning-ink'
    : 'bg-positive-soft border-positive text-positive-ink'

  return (
    <div className="p-8 w-full space-y-6">
      <div>
        <Link href="/clients" className="text-xs text-muted hover:text-ink-soft">
          ← Retour au portefeuille
        </Link>
        <h1 className="text-2xl font-extrabold text-ink mt-2">{nom}</h1>
        <p className="text-muted text-sm mt-1">
          {[client.sector, client.status].filter(Boolean).join(' · ') || 'Fiche client'}
          {cycle && ` · Cycle ${cycle.cycleNumber}, ${cycle.mainObjective}`}
        </p>
      </div>

      <div className={`rounded-2xl border px-5 py-4 ${bandeau}`}>
        <p className="font-semibold text-sm">{situation.texte}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { t: 'Tresorerie', v: euros(indicateurs.tresorerie), c: indicateurs.tresorerie >= 0 ? 'text-positive' : 'text-negative' },
          { t: 'CA du mois', v: euros(indicateurs.caDuMois), c: 'text-positive' },
          { t: 'Charges du mois', v: euros(indicateurs.chargesDuMois), c: 'text-negative' },
          { t: 'Resultat net', v: euros(indicateurs.resultatNet), c: indicateurs.resultatNet >= 0 ? 'text-accent-ink' : 'text-negative' },
        ].map((k) => (
          <div key={k.t} className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
            <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">{k.t}</p>
            <p className={`text-2xl font-extrabold ${k.c}`}>{k.v}</p>
          </div>
        ))}
      </div>

      <GrapheCaCharges points={historique} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <Carte titre="Audit financier automatique" sousTitre="Support de la seance d'accompagnement">
          {constats.length > 0 ? (
            <div className="space-y-2.5">
              {constats.map((c, i) => {
                const s = STYLE[c.niveau]
                return (
                  <div key={i} className={`rounded-xl border ${s.fond} px-4 py-3`}>
                    <p className={`text-[11px] font-bold uppercase tracking-wide ${s.texte}`}>{s.libelle}</p>
                    <p className={`text-sm font-semibold ${s.texte} mt-0.5`}>{c.titre} — {c.valeur}</p>
                    <p className="text-[11px] text-muted mt-1.5">{c.regle}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <Vide texte="Aucun signal particulier." />
          )}
        </Carte>

        <Carte titre="Les priorites du cycle">
          {cycle && cycle.objectives.length > 0 ? (
            <div className="space-y-3">
              {cycle.objectives.map((o) => (
                <div key={o.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-soft">{o.title}</span>
                    <span className="text-muted font-semibold">{o.progressPct} %</span>
                  </div>
                  <div className="h-1.5 bg-surface-muted rounded-full">
                    <div className="h-1.5 bg-gradient-to-r from-accent to-accent-alt rounded-full"
                         style={{ width: `${o.progressPct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Vide texte="Aucune priorite definie sur le cycle en cours." />
          )}
        </Carte>
      </div>

      <GraphePrevisionnel
        points={previsionnel.points}
        totaux={previsionnel.totaux}
        baseCa={previsionnel.baseCa}
        baseCharges={previsionnel.baseCharges}
      />

      <Carte titre="Dernieres transactions">
        {client.transactions.length > 0 ? (
          <div className="space-y-1.5">
            {client.transactions.slice(0, 10).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-muted">
                <div>
                  <p className="text-sm text-ink-soft">{t.label ?? (t.type === 'REVENUE' ? 'Revenu' : 'Charge')}</p>
                  <p className="text-xs text-ghost">{new Date(t.transactionDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className={`text-sm font-bold ${t.type === 'REVENUE' ? 'text-positive' : 'text-negative'}`}>
                  {t.type === 'REVENUE' ? '+' : '-'}{euros(t.amountHt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Vide texte="Aucune transaction." />
        )}
      </Carte>

      <p className="text-xs text-ghost">
        <Etiquette texte="Lecture seule" ton="neutre" /> Le consultant consulte, il ne saisit pas a la place du client.
      </p>
    </div>
  )
}
