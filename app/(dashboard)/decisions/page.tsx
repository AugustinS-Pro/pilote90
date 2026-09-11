import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut, pageAccueil } from '@/lib/habilitations'
import { Carte, Vide, Etiquette } from '@/components/ui'
import { FormulaireDecision, SuppressionDecision } from '@/components/FormulairesSysteme'
import { CATEGORIES_DECISION, libelleDe } from '@/lib/listes'

const TON: Record<string, 'succes' | 'attente' | 'alerte' | 'info' | 'neutre'> = {
  STRATEGIE: 'info', OFFRE: 'attente', FINANCE: 'succes',
  COMMUNICATION: 'info', ORGANISATION: 'neutre', AUTRE: 'neutre',
}

export default async function DecisionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categorie?: string }>
}) {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  // Garde de page, alignee sur /bibliotheque. Elle porte sur l'acces a la page
  // transverse, pas sur la possession d'un dossier : un consultant a bien le
  // droit d'ouvrir cette page, il n'a simplement rien a y voir. C'est pourquoi
  // le bloc explicatif plus bas est conserve au lieu d'une redirection, qui
  // boucleraient ici puisque pageAccueil renvoie vers /historique pour un
  // profil qui n'a que les acces communs.
  if (!peut(utilisateur, 'PAGES_TRANSVERSES')) redirect(pageAccueil(utilisateur))

  const { q, categorie: categorieBrute } = await searchParams

  // Valide comme /clients et /bibliotheque valident les leurs. Sans ce filtre,
  // /decisions?categorie=nimportequoi remontait une erreur Prisma jusqu'a la
  // page d'erreur.
  const categorie = CATEGORIES_DECISION.some((c) => c.valeur === categorieBrute)
    ? categorieBrute
    : undefined

  const client =
    peut(utilisateur, 'DOSSIER_PERSONNEL')
      ? await prisma.client.findUnique({ where: { userId: utilisateur.id }, select: { id: true } })
      : null

  if (!client) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-extrabold text-ink mb-2">Centre de decisions</h1>
        <p className="text-sm text-muted">Espace reserve aux entrepreneurs accompagnes.</p>
      </div>
    )
  }

  const decisions = await prisma.decision.findMany({
    where: {
      clientId: client.id,
      ...(categorie && categorie !== 'TOUTES'
        ? { category: categorie as 'STRATEGIE' | 'OFFRE' | 'FINANCE' | 'COMMUNICATION' | 'ORGANISATION' | 'AUTRE' }
        : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' as const } },
              { context: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    },
    orderBy: { decidedAt: 'desc' },
    include: { cycle: { select: { cycleNumber: true } } },
  })

  const libelle = (v: string) => libelleDe(CATEGORIES_DECISION, v)

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Centre de decisions</h1>
        <p className="text-muted text-sm mt-1">
          La memoire de vos arbitrages : ce que vous avez decide, quand, et pourquoi
        </p>
      </div>

      <Carte>
        <form className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="q" className="block text-xs font-semibold text-muted mb-1">Rechercher</label>
            <input
              id="q" name="q" defaultValue={q ?? ''} placeholder="Un mot dans la decision ou son contexte"
              className="w-full px-3 py-2 rounded-lg border border-subtle bg-canvas text-sm
                         focus:outline-none focus:border-accent focus:bg-surface"
            />
          </div>
          <div>
            <label htmlFor="categorie" className="block text-xs font-semibold text-muted mb-1">Categorie</label>
            <select
              id="categorie" name="categorie" defaultValue={categorie ?? 'TOUTES'}
              className="px-3 py-2 rounded-lg border border-subtle bg-canvas text-sm
                         focus:outline-none focus:border-accent focus:bg-surface"
            >
              <option value="TOUTES">Toutes</option>
              {CATEGORIES_DECISION.map((c) => (
                <option key={c.valeur} value={c.valeur}>{c.libelle}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-accent hover:bg-accent-strong text-on-accent text-xs font-semibold px-4 py-2.5 rounded-lg"
          >
            Filtrer
          </button>
        </form>
      </Carte>

      <Carte
        titre={`${decisions.length} decision${decisions.length > 1 ? 's' : ''}`}
        sousTitre={q || categorie ? 'Resultat filtre' : 'Toutes vos decisions, de la plus recente a la plus ancienne'}
      >
        {decisions.length > 0 ? (
          <div className="space-y-2 mb-4">
            {decisions.map((d) => (
              <div key={d.id} className="group rounded-xl border border-subtle px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Etiquette texte={libelle(d.category)} ton={TON[d.category] ?? 'neutre'} />
                      <span className="text-xs text-ghost">
                        {new Date(d.decidedAt).toLocaleDateString('fr-FR')}
                        {d.cycle && ` · cycle ${d.cycle.cycleNumber}`}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-ink-soft">{d.title}</p>
                    {d.context && (
                      <p className="text-sm text-muted mt-1 leading-relaxed">{d.context}</p>
                    )}
                  </div>
                  <SuppressionDecision id={d.id} titre={d.title} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Vide texte={q || categorie ? 'Aucune decision ne correspond a ce filtre.' : 'Aucune decision consignee.'} />
        )}

        <FormulaireDecision />
      </Carte>
    </div>
  )
}
