'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { enregistrerCoffre, type EtatAction } from './actions'
import type { AxeCoffre, LigneCoffre } from '@/lib/coffre'

const ETAT_INITIAL: EtatAction = { ok: false }

function BoutonEnregistrer() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-accent text-on-accent
                 hover:bg-accent-strong disabled:opacity-60 transition-colors"
    >
      {pending ? 'Enregistrement...' : 'Enregistrer le coffre'}
    </button>
  )
}

export function FormulaireCoffre({
  axe,
  lignes,
}: {
  axe: AxeCoffre
  lignes: LigneCoffre[]
}) {
  const [etat, action] = useActionState(enregistrerCoffre, ETAT_INITIAL)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="axe" value={axe} />

      {lignes.map((ligne) => (
        <div key={ligne.cle}>
          <label
            htmlFor={`coffre-${axe}-${ligne.cle}`}
            className="block text-xs font-bold text-muted mb-1"
          >
            {ligne.libelle}
          </label>
          <textarea
            id={`coffre-${axe}-${ligne.cle}`}
            name={`ligne-${ligne.cle}`}
            defaultValue={ligne.valeur ?? ''}
            rows={2}
            maxLength={600}
            placeholder={ligne.intention}
            className="w-full text-sm px-3 py-2 rounded-lg border border-subtle bg-canvas
                       focus:outline-none focus:border-accent focus:bg-surface resize-y"
          />
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <BoutonEnregistrer />
        {etat.message && (
          <p
            role="status"
            className={`text-xs ${etat.ok ? 'text-positive-ink' : 'text-negative-ink'}`}
          >
            {etat.message}
          </p>
        )}
      </div>
    </form>
  )
}
