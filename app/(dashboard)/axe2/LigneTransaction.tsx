'use client'

import { useActionState, useState } from 'react'
import { BoutonSoumettre, BoutonSuppression, Retour, ETAT_INITIAL } from '@/components/ui'
import { euros } from '@/lib/format'
import { modifierTransaction, supprimerTransaction } from './actions'

export type TransactionVue = {
  id: string
  type: 'REVENUE' | 'EXPENSE'
  amountHt: number
  transactionDate: string
  label: string | null
  category: string | null
}

const CHAMP =
  'w-full px-2.5 py-1.5 rounded-lg border border-subtle bg-canvas text-sm text-ink-soft ' +
  'placeholder:text-ghost focus:outline-none focus:border-accent focus:bg-surface transition-colors'

/**
 * Une ecriture, consultable puis modifiable sur place.
 *
 * Contrairement aux entites dont seul l'intitule se corrige, une transaction
 * porte un montant, une date et un sens : il lui faut un vrai formulaire. C'est
 * aussi la correction la plus frequente, un montant mal saisi se remarquant
 * bien plus vite qu'un titre approximatif.
 *
 * Le montant est presente en euros et converti en centimes par l'action, comme
 * a la saisie : l'unite de stockage ne remonte jamais jusqu'a l'ecran.
 */
export function LigneTransaction({ transaction }: { transaction: TransactionVue }) {
  const [etat, action] = useActionState(modifierTransaction, ETAT_INITIAL)
  const [edition, setEdition] = useState(false)

  const revenu = transaction.type === 'REVENUE'
  const intitule = transaction.label ?? (revenu ? 'Revenu' : 'Charge')

  // L'action a reussi : on referme, sans effet, pendant le rendu.
  const [dernier, setDernier] = useState(etat)
  if (etat !== dernier) {
    setDernier(etat)
    if (etat.ok) setEdition(false)
  }

  if (!edition) {
    return (
      <div className="group flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-surface-muted">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-soft truncate">{intitule}</p>
          <p className="text-xs text-ghost">
            {new Date(transaction.transactionDate).toLocaleDateString('fr-FR')}
            {transaction.category && ` · ${transaction.category}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-sm font-bold ${revenu ? 'text-positive' : 'text-negative'}`}>
            {revenu ? '+' : '-'}{euros(transaction.amountHt)}
          </span>
          <button
            type="button"
            onClick={() => setEdition(true)}
            title={`Modifier ${intitule}`}
            aria-label={`Modifier ${intitule}`}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity
                       text-disabled hover:text-accent text-xs px-1"
          >
            ✎
          </button>
          <BoutonSuppression
            action={supprimerTransaction}
            id={transaction.id}
            intitule={`Supprimer ${intitule}`}
          />
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="rounded-xl border border-accent bg-accent-soft p-3 space-y-2">
      <input type="hidden" name="id" value={transaction.id} />

      <div className="grid grid-cols-2 gap-2">
        <select name="type" defaultValue={transaction.type} className={CHAMP} aria-label="Sens de l ecriture">
          <option value="REVENUE">Revenu</option>
          <option value="EXPENSE">Charge</option>
        </select>
        <input
          type="date"
          name="transactionDate"
          defaultValue={transaction.transactionDate.slice(0, 10)}
          required
          className={CHAMP}
          aria-label="Date de l operation"
        />
      </div>

      <input
        type="text"
        name="label"
        defaultValue={transaction.label ?? ''}
        placeholder="Libelle"
        required
        maxLength={120}
        className={CHAMP}
        aria-label="Libelle"
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="text"
          inputMode="decimal"
          name="amount"
          defaultValue={(transaction.amountHt / 100).toFixed(2).replace('.', ',')}
          placeholder="Montant HT"
          required
          className={CHAMP}
          aria-label="Montant hors taxes en euros"
        />
        <input
          type="text"
          name="category"
          defaultValue={transaction.category ?? ''}
          placeholder="Categorie"
          maxLength={80}
          className={CHAMP}
          aria-label="Categorie"
        />
      </div>

      {!etat.ok && <Retour etat={etat} />}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setEdition(false)}
          className="text-xs font-semibold px-3 py-2 rounded-lg border border-subtle
                     text-ink-soft hover:bg-surface-muted transition-colors"
        >
          Annuler
        </button>
        <BoutonSoumettre>Enregistrer</BoutonSoumettre>
      </div>
    </form>
  )
}
