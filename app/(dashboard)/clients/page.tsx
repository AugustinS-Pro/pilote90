import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import {
  Carte, Vide, Etiquette,
} from '@/components/ui'
import { euros } from '@/lib/format'
import { calculerIndicateurs, calculerPrevisionnel, auditerFinances } from '@/lib/finance'
import { estConfidentiel, basculerConfidentialite, masquer } from '@/lib/confidentialite'

export default async function PortefeuillePage() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  if (utilisateur.role !== 'ADMIN') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Portefeuille</h1>
        <p className="text-sm text-muted">
          Cette page est reservee au compte consultant.
        </p>
      </div>
    )
  }

  const confidentiel = await estConfidentiel()

  const clients = await prisma.client.findMany({
    where: { adminId: utilisateur.id },
    orderBy: { companyName: 'asc' },
    include: {
      user: { select: { name: true, email: true } },
      cycles: { where: { status: 'ACTIVE' }, take: 1 },
      transactions: true,
    },
  })

  const fiches = clients.map((c) => {
    const cycle = c.cycles[0]
    const indicateurs = calculerIndicateurs(c.transactions, cycle?.caTargetMonthly ?? 0)
    const previsionnel = calculerPrevisionnel(c.transactions)
    const constats = auditerFinances(indicateurs, previsionnel, c.transactions.length)
    const alertes = constats.filter((x) => x.niveau === 'ALERTE')

    return {
      id: c.id,
      nom: masquer(c.companyName, confidentiel),
      contact: masquer(c.user.name ?? c.user.email ?? '', confidentiel),
      secteur: c.sector,
      statut: c.status,
      cycle: cycle ? `Cycle ${cycle.cycleNumber}` : null,
      objectif: cycle?.mainObjective ?? null,
      caDuMois: indicateurs.caDuMois,
      resultatNet: indicateurs.resultatNet,
      progression: indicateurs.progressionObjectif,
      alerte: alertes[0]?.titre ?? null,
    }
  })

  const caTotal = fiches.reduce((s, f) => s + f.caDuMois, 0)
  const enAlerte = fiches.filter((f) => f.alerte).length

  return (
    <div className="p-8 w-full space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Mon portefeuille</h1>
          <p className="text-muted text-sm mt-1">
            Les entreprises que vous accompagnez, et leur situation du moment
          </p>
        </div>

        <form action={basculerConfidentialite}>
          <button
            type="submit"
            className={`text-xs font-semibold px-3.5 py-2 rounded-lg border transition-colors ${
              confidentiel
                ? 'bg-inverse text-on-inverse border-inverse'
                : 'bg-surface text-ink-soft border-subtle hover:bg-surface-muted'
            }`}
          >
            {confidentiel ? 'Mode Confidentialite actif' : 'Activer le mode Confidentialite'}
          </button>
        </form>
      </div>

      {confidentiel && (
        <div className="rounded-2xl border border-firm bg-surface-muted px-5 py-3">
          <p className="text-sm text-ink-soft">
            Les noms des entreprises sont masques. Les chiffres restent visibles pour la demonstration.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">Clients suivis</p>
          <p className="text-2xl font-extrabold text-accent-ink">{fiches.length}</p>
        </div>
        <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">CA cumule du mois</p>
          <p className="text-2xl font-extrabold text-positive">{euros(caTotal)}</p>
        </div>
        <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">Clients en alerte</p>
          <p className={`text-2xl font-extrabold ${enAlerte > 0 ? 'text-negative' : 'text-ghost'}`}>{enAlerte}</p>
        </div>
      </div>

      <Carte titre="Les entreprises accompagnees">
        {fiches.length > 0 ? (
          <div className="space-y-2">
            {fiches.map((f) => (
              <Link
                key={f.id}
                href={`/clients/${f.id}`}
                className="block rounded-xl border border-subtle px-4 py-3 hover:border-accent hover:bg-surface-muted transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-ink-soft">{f.nom}</p>
                      {f.secteur && <Etiquette texte={f.secteur} ton="neutre" />}
                      {f.cycle && <Etiquette texte={f.cycle} ton="info" />}
                      {f.alerte && <Etiquette texte={f.alerte} ton="alerte" />}
                    </div>
                    <p className="text-xs text-muted mt-0.5">{f.contact}</p>
                    {f.objectif && <p className="text-xs text-ghost mt-1">{f.objectif}</p>}
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-positive">{euros(f.caDuMois)}</p>
                      <p className="text-[11px] text-ghost">CA du mois</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${f.resultatNet >= 0 ? 'text-accent-ink' : 'text-negative'}`}>
                        {euros(f.resultatNet)}
                      </p>
                      <p className="text-[11px] text-ghost">Resultat net</p>
                    </div>
                    <div className="text-right w-16">
                      <p className="text-sm font-bold text-ink-soft">{f.progression} %</p>
                      <p className="text-[11px] text-ghost">Objectif</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Vide texte="Aucune entreprise rattachee a votre compte." />
        )}
      </Carte>
    </div>
  )
}
