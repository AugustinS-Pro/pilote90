'use client'

import { useActionState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { importerTransactions, type EtatAction } from './actions'

const ETAT_INITIAL: EtatAction = { ok: false }

function BoutonImport() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-semibold px-3 py-2 rounded-lg border border-subtle
                 bg-surface text-muted hover:bg-surface-muted disabled:opacity-60
                 transition-colors shrink-0"
    >
      {pending ? 'Lecture...' : 'Importer'}
    </button>
  )
}

/**
 * Reprise d'un fichier CSV au format de l'export.
 *
 * Volontairement discret : c'est un geste rare, qui ne doit pas prendre la
 * place de la saisie quotidienne juste a cote.
 */
export function ImportCsv() {
  const [etat, action] = useActionState(importerTransactions, ETAT_INITIAL)
  const champ = useRef<HTMLInputElement>(null)

  return (
    <div className="mt-4 pt-4 border-t border-subtle">
      <form action={action} className="flex flex-wrap items-center gap-2">
        <input
          ref={champ}
          type="file"
          name="fichier"
          accept=".csv,text/csv"
          aria-label="Fichier CSV de transactions"
          className="flex-1 min-w-0 text-xs text-muted file:mr-3 file:py-1.5 file:px-3
                     file:rounded-lg file:border file:border-subtle file:text-xs
                     file:font-semibold file:bg-surface file:text-muted"
        />
        <BoutonImport />
      </form>

      <p className="text-[11px] text-ghost mt-2">
        Colonnes attendues : Date, Type, Libellé, Catégorie, Montant — celles de l’export.
      </p>

      {etat.message && (
        <p
          role="status"
          className={`text-xs mt-2 ${etat.ok ? 'text-positive-ink' : 'text-negative-ink'}`}
        >
          {etat.message}
        </p>
      )}
    </div>
  )
}
