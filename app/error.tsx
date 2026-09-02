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
    <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 text-2xl
                        flex items-center justify-center mx-auto mb-5">
          !
        </div>
        <h1 className="text-lg font-extrabold text-slate-900 mb-2">
          Quelque chose s&apos;est mal passé
        </h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          L&apos;action n&apos;a pas abouti. Vos données ne sont pas perdues :
          rien n&apos;est enregistré tant qu&apos;une opération n&apos;a pas réussi.
        </p>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={reset}
            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold
                       px-4 py-2.5 rounded-xl transition-colors"
          >
            Réessayer
          </button>
          <a
            href="/dashboard"
            className="text-sm font-semibold text-slate-600 hover:text-slate-800 px-4 py-2.5"
          >
            Tableau de bord
          </a>
        </div>

        {error.digest && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600">
              Détail technique
            </summary>
            <p className="text-xs text-slate-400 mt-2 font-mono break-all">
              Référence : {error.digest}
            </p>
          </details>
        )}
      </div>
    </main>
  )
}
