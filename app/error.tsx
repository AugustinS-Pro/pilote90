'use client'

import { useEffect } from 'react'

/**
 * Filet de securite : une erreur inattendue n'affiche jamais une page blanche.
 * L'utilisateur garde une action possible, et le detail technique reste
 * consultable sans polluer l'ecran.
 */
export default function Erreur({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Pilote90]', error)
  }, [error])

  return (
    <main className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-surface rounded-2xl border border-subtle shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-negative-soft text-negative text-2xl
                        flex items-center justify-center mx-auto mb-5">
          !
        </div>
        <h1 className="text-lg font-extrabold text-ink mb-2">
          Quelque chose s&apos;est mal passé
        </h1>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          L&apos;action n&apos;a pas abouti. Vos données ne sont pas perdues :
          rien n&apos;est enregistré tant qu&apos;une opération n&apos;a pas réussi.
        </p>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={reset}
            className="bg-accent hover:bg-accent-strong text-on-accent text-sm font-semibold
                       px-4 py-2.5 rounded-xl transition-colors"
          >
            Réessayer
          </button>
          <a
            href="/dashboard"
            className="text-sm font-semibold text-muted hover:text-ink-soft px-4 py-2.5"
          >
            Tableau de bord
          </a>
        </div>

        {error.digest && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-xs text-ghost hover:text-muted">
              Détail technique
            </summary>
            <p className="text-xs text-ghost mt-2 font-mono break-all">
              Référence : {error.digest}
            </p>
          </details>
        )}
      </div>
    </main>
  )
}
