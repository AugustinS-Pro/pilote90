import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { Carte, Vide, Etiquette } from '@/components/ui'
import { FormulaireRessource, SuppressionRessource } from '@/components/FormulairesSysteme'
import { TYPES_RESSOURCE } from '@/lib/listes'
import { Recherche } from '@/components/ui'
import { correspond } from '@/lib/recherche'

export default async function BibliothequePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>
}) {
  const parametres = await searchParams
  const recherche = (parametres.q ?? '').trim()
  const typeFiltre = TYPES_RESSOURCE.some((t) => t.valeur === parametres.type)
    ? parametres.type
    : undefined

  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  const client = await prisma.client.findUnique({
    where: { userId: utilisateur.id },
    select: { id: true },
  })

  // Les ressources communes (clientId nul) sont visibles par tout le monde ;
  // s'y ajoutent les ressources propres au client connecte.
  const ressources = await prisma.resource.findMany({
    where: { OR: [{ clientId: null }, ...(client ? [{ clientId: client.id }] : [])] },
    orderBy: [{ type: 'asc' }, { createdAt: 'desc' }],
  })

  const retenues = ressources.filter(
    (r) =>
      (!typeFiltre || r.type === typeFiltre) &&
      correspond([r.title, r.description], recherche),
  )

  const groupes = TYPES_RESSOURCE.map((t) => ({
    type: t.valeur,
    libelle: t.libelle,
    items: retenues.filter((r) => r.type === t.valeur),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
        <h1 className="text-2xl font-extrabold text-ink">Bibliotheque strategique</h1>
        <p className="text-muted text-sm mt-1">
          Guides de demarrage, rituels et modeles de cycle partages par votre accompagnant
        </p>
        </div>

        <Recherche action="/bibliotheque" valeur={recherche} placeholder="Titre ou description">
          {typeFiltre ? <input type="hidden" name="type" value={typeFiltre} /> : null}
        </Recherche>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <a
          href={recherche ? `/bibliotheque?q=${encodeURIComponent(recherche)}` : '/bibliotheque'}
          className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
            typeFiltre
              ? 'bg-surface text-muted border-subtle hover:bg-surface-muted'
              : 'bg-inverse text-on-inverse border-inverse'
          }`}
        >
          Tous
        </a>
        {TYPES_RESSOURCE.map((t) => {
          const lien = new URLSearchParams({ type: t.valeur })
          if (recherche) lien.set('q', recherche)
          return (
            <a
              key={t.valeur}
              href={`/bibliotheque?${lien.toString()}`}
              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                typeFiltre === t.valeur
                  ? 'bg-inverse text-on-inverse border-inverse'
                  : 'bg-surface text-muted border-subtle hover:bg-surface-muted'
              }`}
            >
              {t.libelle}
            </a>
          )
        })}
      </div>

      {groupes.length > 0 ? (
        groupes.map((g) => (
          <Carte key={g.type} titre={g.libelle}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {g.items.map((r) => (
                <div key={r.id} className="group rounded-xl border border-subtle px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-soft">{r.title}</p>
                      {r.description && (
                        <p className="text-xs text-muted mt-1 leading-relaxed">{r.description}</p>
                      )}
                      {r.url && (
                        <a
                          href={r.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-accent-ink hover:underline mt-1.5 inline-block"
                        >
                          Ouvrir la ressource
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {r.clientId === null && <Etiquette texte="Commune" ton="info" />}
                      <SuppressionRessource id={r.id} titre={r.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Carte>
        ))
      ) : (
        <Carte>
          <Vide
            texte={
              recherche || typeFiltre
                ? 'Aucune ressource ne correspond a cette recherche.'
                : "La bibliotheque est vide pour l'instant."
            }
          />
        </Carte>
      )}

      <Carte titre="Ajouter" sousTitre={client ? 'Visible par vous seul' : 'Deposee comme ressource commune, visible par tous vos clients'}>
        <FormulaireRessource />
      </Carte>
    </div>
  )
}
