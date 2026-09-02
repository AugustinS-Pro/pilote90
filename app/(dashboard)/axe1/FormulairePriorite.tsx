'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { creerPriorite, type EtatAction } from './actions'

const ETAT_INITIAL: EtatAction = { ok: false }

function BoutonAjout() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs bg-accent hover:bg-accent-strong disabled:opacity-60 text-on-accent
                 font-semibold px-3 py-1.5 rounded-lg transition-colors"
    >
      {pending ? 'Ajout...' : 'Ajouter la priorite'}
    </button>
  )
}

export function FormulairePriorite({ cycleActif }: { cycleActif: boolean }) {
  const [etat, action] = useActionState(creerPriorite, ETAT_INITIAL)
  const [ouvert, setOuvert] = useState(false)
  const [dernierEtat, setDernierEtat] = useState<EtatAction>(ETAT_INITIAL)

  // Ajustement d'etat pendant le rendu plutot que dans un effet :
  // le formulaire se referme des que la creation a reussi.
  if (etat !== dernierEtat) {
    setDernierEtat(etat)
    if (etat.ok) setOuvert(false)
  }

  const champ =
    'w-full px-3 py-2 rounded-lg border border-subtle bg-canvas text-sm ' +
    'focus:outline-none focus:border-accent focus:bg-surface'

  if (!cycleActif) {
    return (
      <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5 text-center">
        <p className="text-sm text-ghost">
          Aucun cycle actif. Creez un cycle de 90 jours pour definir vos priorites.
        </p>
      </div>
    )
  }

  if (!ouvert) {
    return (
      <button
        onClick={() => setOuvert(true)}
        className="w-full bg-surface rounded-2xl border border-dashed border-firm
                   shadow-sm p-5 text-sm text-muted hover:border-accent
                   hover:text-accent-ink transition-colors"
      >
        + Ajouter une priorite
      </button>
    )
  }

  return (
    <div className="bg-surface rounded-2xl border border-accent shadow-sm p-5">
      <h3 className="text-sm font-bold text-ink-soft mb-3">Nouvelle priorite du cycle</h3>
      <form action={action} className="space-y-3">
        <div>
          <input name="title" placeholder="Ce que je veux atteindre" required maxLength={120} className={champ} />
          {etat.erreurs?.title && <p className="text-xs text-negative-ink mt-1">{etat.erreurs.title}</p>}
        </div>
        <div>
          <input name="description" placeholder="Precision (facultatif)" maxLength={300} className={champ} />
          {etat.erreurs?.description && (
            <p className="text-xs text-negative-ink mt-1">{etat.erreurs.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <BoutonAjout />
          <button
            type="button"
            onClick={() => setOuvert(false)}
            className="text-xs text-muted hover:text-ink-soft px-3 py-1.5"
          >
            Annuler
          </button>
        </div>
        {etat.message && !etat.ok && <p className="text-xs text-negative-ink">{etat.message}</p>}
      </form>
    </div>
  )
}
