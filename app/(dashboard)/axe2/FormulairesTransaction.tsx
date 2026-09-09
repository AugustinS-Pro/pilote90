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
      className={`w-full ${couleur} disabled:opacity-60 text-on-accent font-semibold
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
    'w-full px-3 py-2 rounded-lg border border-subtle bg-canvas text-sm ' +
    'focus:outline-none focus:border-accent focus:bg-surface'

  return (
    <div className="bg-surface rounded-2xl border border-subtle shadow-sm p-5">
      <h2 className="text-sm font-bold text-ink-soft mb-4 flex items-center gap-2">
        <span aria-hidden className={`w-2 h-2 ${pastille} rounded-full`} />
        {titre}
      </h2>

      <form ref={ref} action={action} className="space-y-3">
        <input type="hidden" name="type" value={type} />

        <div>
          <input type="date" name="transactionDate" defaultValue={aujourdhui} required className={champ}
                 aria-label="Date de l'operation" />
          {etat.erreurs?.transactionDate && (
            <p className="text-xs text-negative-ink mt-1">{etat.erreurs.transactionDate}</p>
          )}
        </div>

        <div>
          <input type="text" name="label" placeholder={placeholderTiers} required maxLength={120} className={champ}
                 aria-label={placeholderTiers} />
          {etat.erreurs?.label && <p className="text-xs text-negative-ink mt-1">{etat.erreurs.label}</p>}
        </div>

        <div>
          <input
            type="text"
            inputMode="decimal"
            name="amount"
            placeholder="Montant HT (€)"
            required
            className={champ}
            aria-label="Montant hors taxes en euros"
          />
          {etat.erreurs?.amount && <p className="text-xs text-negative-ink mt-1">{etat.erreurs.amount}</p>}
        </div>

        <BoutonEnvoi libelle={libelleBouton} couleur={couleurBouton} />

        {etat.message && (
          <p
            role="status"
            className={`text-xs rounded-lg px-3 py-2 ${
              etat.ok
                ? 'text-positive-ink bg-positive-soft border border-positive'
                : 'text-negative-ink bg-negative-soft border border-negative'
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
        pastille="bg-positive"
        placeholderTiers="Client"
        libelleBouton="Enregistrer le revenu"
        couleurBouton="bg-positive hover:bg-positive"
      />
      <Formulaire
        type="EXPENSE"
        titre="Enregistrer une charge"
        pastille="bg-negative"
        placeholderTiers="Fournisseur"
        libelleBouton="Enregistrer la charge"
        couleurBouton="bg-negative hover:bg-negative"
      />
    </div>
  )
}
