'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { creerTransaction, type EtatAction } from './actions'

const ETAT_INITIAL: EtatAction = { ok: false }

function BoutonEnvoi({ libelle, couleur }: { libelle: string; couleur: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full ${couleur} disabled:opacity-60 text-white font-semibold
                  py-2.5 rounded-lg text-sm transition-colors`}
    >
      {pending ? 'Enregistrement...' : libelle}
    </button>
  )
}

function Formulaire({
  type,
  titre,
  pastille,
  placeholderTiers,
  libelleBouton,
  couleurBouton,
}: {
  type: 'REVENUE' | 'EXPENSE'
  titre: string
  pastille: string
  placeholderTiers: string
  libelleBouton: string
  couleurBouton: string
}) {
  const [etat, action] = useActionState(creerTransaction, ETAT_INITIAL)
  const ref = useRef<HTMLFormElement>(null)
  const aujourdhui = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (etat.ok) ref.current?.reset()
  }, [etat])

  const champ =
    'w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#FAF9F6] text-sm ' +
    'focus:outline-none focus:border-indigo-400 focus:bg-white'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
        <span className={`w-2 h-2 ${pastille} rounded-full`} />
        {titre}
      </h2>

      <form ref={ref} action={action} className="space-y-3">
        <input type="hidden" name="type" value={type} />

        <div>
          <input type="date" name="transactionDate" defaultValue={aujourdhui} required className={champ} />
          {etat.erreurs?.transactionDate && (
            <p className="text-xs text-red-600 mt-1">{etat.erreurs.transactionDate}</p>
          )}
        </div>

        <div>
          <input type="text" name="label" placeholder={placeholderTiers} required maxLength={120} className={champ} />
          {etat.erreurs?.label && <p className="text-xs text-red-600 mt-1">{etat.erreurs.label}</p>}
        </div>

        <div>
          <input
            type="text"
            inputMode="decimal"
            name="amount"
            placeholder="Montant HT (€)"
            required
            className={champ}
          />
          {etat.erreurs?.amount && <p className="text-xs text-red-600 mt-1">{etat.erreurs.amount}</p>}
        </div>

        <BoutonEnvoi libelle={libelleBouton} couleur={couleurBouton} />

        {etat.message && (
          <p
            role="status"
            className={`text-xs rounded-lg px-3 py-2 ${
              etat.ok
                ? 'text-teal-700 bg-teal-50 border border-teal-200'
                : 'text-red-700 bg-red-50 border border-red-200'
            }`}
          >
            {etat.message}
          </p>
        )}
      </form>
    </div>
  )
}

export function FormulairesTransaction() {
  return (
    <div className="space-y-4">
      <Formulaire
        type="REVENUE"
        titre="Enregistrer un revenu"
        pastille="bg-teal-500"
        placeholderTiers="Client"
        libelleBouton="Enregistrer le revenu"
        couleurBouton="bg-teal-500 hover:bg-teal-600"
      />
      <Formulaire
        type="EXPENSE"
        titre="Enregistrer une charge"
        pastille="bg-red-500"
        placeholderTiers="Fournisseur"
        libelleBouton="Enregistrer la charge"
        couleurBouton="bg-red-500 hover:bg-red-600"
      />
    </div>
  )
}
