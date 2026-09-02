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
      className="text-xs bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white
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
    'w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#FAF9F6] text-sm ' +
    'focus:outline-none focus:border-indigo-400 focus:bg-white'

  if (!cycleActif) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
        <p className="text-sm text-slate-400">
          Aucun cycle actif. Creez un cycle de 90 jours pour definir vos priorites.
        </p>
      </div>
    )
  }

  if (!ouvert) {
    return (
      <button
        onClick={() => setOuvert(true)}
        className="w-full bg-white rounded-2xl border border-dashed border-slate-300
                   shadow-sm p-5 text-sm text-slate-500 hover:border-indigo-400
                   hover:text-indigo-600 transition-colors"
      >
        + Ajouter une priorite
      </button>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-700 mb-3">Nouvelle priorite du cycle</h3>
      <form action={action} className="space-y-3">
        <div>
          <input name="title" placeholder="Ce que je veux atteindre" required maxLength={120} className={champ} />
          {etat.erreurs?.title && <p className="text-xs text-red-600 mt-1">{etat.erreurs.title}</p>}
        </div>
        <div>
          <input name="description" placeholder="Precision (facultatif)" maxLength={300} className={champ} />
          {etat.erreurs?.description && (
            <p className="text-xs text-red-600 mt-1">{etat.erreurs.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <BoutonAjout />
          <button
            type="button"
            onClick={() => setOuvert(false)}
            className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5"
          >
            Annuler
          </button>
        </div>
        {etat.message && !etat.ok && <p className="text-xs text-red-700">{etat.message}</p>}
      </form>
    </div>
  )
}
