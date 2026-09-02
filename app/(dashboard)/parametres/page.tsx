import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/session'
import { Carte, Etiquette } from '@/components/ui'
import { THEMES, themeActif, changerTheme } from '@/lib/theme'

export const metadata = { title: 'Paramètres — Pilote90' }

export default async function ParametresPage() {
  const utilisateur = await getCurrentUser()
  if (!utilisateur) redirect('/login')

  const actif = await themeActif()

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Paramètres</h1>
        <p className="text-muted text-sm mt-1">Votre compte et l&apos;apparence de l&apos;application</p>
      </div>

      <Carte
        titre="Thème"
        sousTitre="L'interface n'utilise aucune couleur écrite en dur : changer de thème redéfinit une couche de variables, rien d'autre."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {THEMES.map((theme) => {
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

        <p className="text-xs text-ghost mt-4 leading-relaxed">
          Le thème est résolu côté serveur et mémorisé pour un an : la page arrive
          directement dans les bonnes couleurs, sans clignotement au chargement.
        </p>
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
          Pour modifier votre mot de passe ou vos informations, adressez-vous à votre accompagnant.
        </p>
      </Carte>

      <Carte titre="Vos données">
        <p className="text-sm text-muted leading-relaxed mb-3">
          Vos informations financières sont cloisonnées : chaque requête part de votre session,
          jamais d&apos;un identifiant transmis par le navigateur.
        </p>
        <Link href="/mentions-legales" className="text-sm font-semibold text-accent-ink hover:underline">
          Mentions légales et protection des données →
        </Link>
      </Carte>
    </div>
  )
}
