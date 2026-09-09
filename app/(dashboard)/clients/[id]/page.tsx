import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut, pageAccueil } from '@/lib/habilitations'
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
import { evaluerFraicheur, TON_FRAICHEUR } from '@/lib/fraicheur'
import { archiverClient, reactiverClient } from '../actions'
import { BoutonSoumettre } from '@/components/ui'

const STYLE = {
  ALERTE: { fond: 'bg-negative-soft border-negative', texte: 'text-negative-ink', libelle: 'Alerte' },
  ATTENTION: { fond: 'bg-warning-soft border-warning', texte: 'text-warning-ink', libelle: 'Attention' },
  ANALYSE: { fond: 'bg-accent-soft border-accent', texte: 'text-accent-ink', libelle: 'Analyse' },
} as const

export default async function FicheClientPage({ params }: { params: Promise<{ id: string }> }) {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')
  if (!peut(utilisateur, 'PORTEFEUILLE_CONSULTER')) redirect(pageAccueil(utilisateur))

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
  const fraicheur = evaluerFraicheur(client.transactions)
  const archive = client.etat === 'ARCHIVE'

  const bandeau =
    situation.ton === 'ALERTE' ? 'bg-negative-soft border-negative text-negative-ink'
    : situation.ton === 'ATTENTION' ? 'bg-warning-soft border-warning text-warning-ink'
    : 'bg-positive-soft border-positive text-positive-ink'

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
        <Link href="/clients" className="text-xs text-muted hover:text-ink-soft">
          ← Retour au portefeuille
        </Link>
        <h1 className="text-2xl font-extrabold text-ink mt-2">{nom}</h1>
        <p className="text-muted text-sm mt-1">
          {[client.sector, client.status].filter(Boolean).join(' · ') || 'Fiche client'}
          {cycle && ` · Cycle ${cycle.cycleNumber}, ${cycle.mainObjective}`}
        </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={`/clients/${client.id}/rapport`}
            className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-transparent
                       bg-inverse text-on-inverse hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Rapport comptable (PDF)
          </a>

          {/*
            Aucune suppression n'est proposee, et ce n'est pas un oubli :
            effacer une fiche detruirait des annees de transactions et de
            decisions. Un accompagnement qui se termine s'archive.
          */}
          {peut(utilisateur, 'COMPTES_ADMINISTRER') && (
            <form action={archive ? reactiverClient : archiverClient}>
              <input type="hidden" name="id" value={client.id} />
              <BoutonSoumettre variante="discret" enCours="...">
                {archive ? 'Reprendre l accompagnement' : 'Archiver'}
              </BoutonSoumettre>
            </form>
          )}
        </div>
      </div>

      {archive && (
        <div className="rounded-2xl border border-firm bg-surface-muted px-5 py-4">
          <p className="text-sm font-semibold text-ink-soft">Accompagnement archive</p>
          <p className="text-xs text-muted mt-0.5">
            Cette fiche ne figure plus dans le portefeuille. Rien n&apos;a ete supprime,
            et l&apos;accompagnement peut reprendre a tout moment.
          </p>
        </div>
      )}

      <div className={`rounded-2xl border px-5 py-4 ${bandeau}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-sm">{situation.texte}</p>
          <Etiquette texte={fraicheur.libelle} ton={TON_FRAICHEUR[fraicheur.niveau]} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <p className={`text-sm font-semibold ${s.texte} mt-0.5`}>{c.titre} · {c.valeur}</p>
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
