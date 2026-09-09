import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/session'
import { Carte, Etiquette } from '@/components/ui'
import { THEMES, ECHELLES, affichageActif, changerTheme, changerEchelle } from '@/lib/theme'

export const metadata = { title: 'Paramètres · Pilote90' }

export default async function ParametresPage() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  const { theme: actif, echelle: echelleActive } = await affichageActif()

  const palettes = THEMES.filter((t) => t.famille === 'Palettes')
  const accessibilite = THEMES.filter((t) => t.famille === 'Accessibilite')

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Paramètres</h1>
        <p className="text-muted text-sm mt-1">Votre compte et l&apos;apparence de l&apos;application</p>
      </div>

      <Carte
        titre="Thème"
        sousTitre="L'apparence de l'application"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {palettes.map((theme) => {
            const choisi = theme.cle === actif
            return (
              <form key={theme.cle} action={changerTheme}>
                <input type="hidden" name="theme" value={theme.cle} />
                <button
                  type="submit"
                  aria-pressed={choisi}
                  className={`w-full text-left rounded-2xl border p-5 transition-all ${
                    choisi
                      ? 'border-accent ring-2 ring-accent/30 bg-accent-soft'
                      : 'border-subtle bg-surface hover:border-firm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-bold text-ink">{theme.nom}</p>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{theme.description}</p>
                    </div>
                    {choisi && <Etiquette texte="Actif" ton="info" />}
                  </div>

                  <div className="flex gap-1.5">
                    {theme.apercu.map((couleur) => (
                      <span
                        key={couleur}
                        className="w-8 h-8 rounded-lg border border-subtle"
                        style={{ background: couleur }}
                      />
                    ))}
                  </div>
                </button>
              </form>
            )
          })}
        </div>
      </Carte>

      <Carte
        titre="Accessibilité"
        sousTitre="Confort visuel et lisibilité"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accessibilite.map((theme) => {
            const choisi = theme.cle === actif
            return (
              <form key={theme.cle} action={changerTheme}>
                <input type="hidden" name="theme" value={theme.cle} />
                <button
                  type="submit"
                  aria-pressed={choisi}
                  className={`w-full text-left rounded-2xl border p-5 transition-all ${
                    choisi
                      ? 'border-accent ring-2 ring-accent/30 bg-accent-soft'
                      : 'border-subtle bg-surface hover:border-firm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-bold text-ink">{theme.nom}</p>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{theme.description}</p>
                    </div>
                    {choisi && <Etiquette texte="Actif" ton="info" />}
                  </div>

                  <div className="flex gap-1.5">
                    {theme.apercu.map((couleur) => (
                      <span
                        key={couleur}
                        className="w-8 h-8 rounded-lg border border-subtle"
                        style={{ background: couleur }}
                      />
                    ))}
                  </div>
                </button>
              </form>
            )
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-faint">
          <p className="text-sm font-bold text-ink-soft mb-1">Confort de lecture</p>
          <p className="text-xs text-muted mb-4 leading-relaxed">
            La taille de tous les textes de l&apos;application, sans déformer les mises en page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ECHELLES.map((option) => {
              const choisie = option.valeur === echelleActive
              return (
                <form key={option.valeur} action={changerEchelle}>
                  <input type="hidden" name="echelle" value={option.valeur} />
                  <button
                    type="submit"
                    aria-pressed={choisie}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                      choisie
                        ? 'border-accent ring-2 ring-accent/30 bg-accent-soft'
                        : 'border-subtle bg-surface hover:border-firm'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        aria-hidden
                        className="font-bold text-ink"
                        style={{ fontSize: `${option.valeur / 100}rem` }}
                      >
                        {option.apercu}
                      </span>
                      <span className="text-xs font-semibold text-ink-soft">{option.nom}</span>
                    </div>
                    <p className="text-[11px] text-muted mt-1 leading-snug">{option.description}</p>
                  </button>
                </form>
              )
            })}
          </div>
        </div>
      </Carte>

      <Carte titre="Mon compte">
        <div className="divide-y divide-faint">
          <div className="flex justify-between items-center py-2.5 text-sm">
            <span className="text-muted">Nom</span>
            <span className="text-ink-soft font-medium">{utilisateur.name ?? '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 text-sm">
            <span className="text-muted">Adresse électronique</span>
            <span className="text-ink-soft font-medium">{utilisateur.email ?? '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2.5 text-sm">
            <span className="text-muted">Rôle</span>
            <Etiquette
              texte={utilisateur.role === 'ADMIN' ? 'Consultant' : 'Entrepreneur accompagné'}
              ton={utilisateur.role === 'ADMIN' ? 'info' : 'succes'}
            />
          </div>
        </div>
        <p className="text-xs text-ghost mt-4">
          Pour modifier votre mot de passe, adressez-vous à votre accompagnant.
        </p>
      </Carte>

      <Carte titre="Vos données">
        <p className="text-sm text-muted leading-relaxed mb-3">
          Vos informations financières ne sont visibles que par vous et par le consultant
          qui vous accompagne.
        </p>
        <Link href="/mentions-legales" className="text-sm font-semibold text-accent-ink hover:underline">
          Mentions légales et protection des données →
        </Link>
      </Carte>
    </div>
  )
}
