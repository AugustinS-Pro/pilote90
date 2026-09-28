import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, getCurrentClient } from '@/lib/session'
import { peut } from '@/lib/habilitations'
import { ACCROCHES, appartenancesRessources } from '@/lib/mentor'
import type { AxeCoffre } from '@/lib/coffre'

/**
 * Le cours de l'axe, en tete de page.
 *
 * Il charge ses propres donnees, comme le coffre en pied de page : chaque page
 * d'axe a deja sa requete, et lui en greffer une branche rendrait cinq pages
 * solidaires d'un detail qui ne les regarde pas.
 *
 * Quand aucun cours n'est rattache a l'axe, le bloc le dit au lieu de
 * disparaitre. Un espace vide laisse croire que la fonctionnalite n'existe pas ;
 * une phrase explique que le cours est a deposer, et par qui.
 */
export async function Mentor({ axe }: { axe: AxeCoffre }) {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) return null

  const client = await getCurrentClient()

  const appartenances = appartenancesRessources({
    clientId: client?.id ?? null,
    adminDuClient: client?.adminId ?? null,
    utilisateurEstConsultant: peut(utilisateur, 'COMPTES_ADMINISTRER'),
    utilisateurId: utilisateur.id,
  })
  if (appartenances.length === 0) return null

  const cours = await prisma.resource.findFirst({
    where: { axe, OR: appartenances },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, description: true, url: true },
  })

  return (
    <div className="rounded-2xl border border-subtle bg-surface-muted px-5 py-4">
      <div className="flex items-start gap-3">
        <span aria-hidden className="text-lg shrink-0 mt-0.5">📖</span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-1">
            Le cours de cet axe
          </p>

          {cours ? (
            <>
              <p className="text-sm font-semibold text-ink-soft leading-snug">
                {cours.url ? (
                  <a
                    href={cours.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-ink hover:underline"
                  >
                    {cours.title}
                  </a>
                ) : (
                  cours.title
                )}
              </p>
              {cours.description && (
                <p className="text-xs text-muted mt-1 leading-relaxed">{cours.description}</p>
              )}
              <p className="text-[11px] text-ghost mt-2 leading-snug">{ACCROCHES[axe]}</p>
            </>
          ) : (
            <>
              <p className="text-xs text-muted leading-relaxed">
                Aucun cours n’est encore rattaché à cet axe. Il se dépose depuis la{' '}
                <Link href="/bibliotheque" className="text-accent-ink hover:underline">
                  bibliothèque stratégique
                </Link>
                , en choisissant le type « Cours » et cet axe.
              </p>
              <p className="text-[11px] text-ghost mt-2 leading-snug">{ACCROCHES[axe]}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
