'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { majPriorite, supprimerPriorite, type EtatAction } from './actions'
import { BoutonSuppression } from '@/components/ui'

const ETAT_INITIAL: EtatAction = { ok: false }

export type Priorite = {
  id: string
  title: string
  description: string | null
  progressPct: number
  status: string
}

const STATUTS: Record<string, { libelle: string; classe: string }> = {
  COMPLETED: { libelle: 'Termine', classe: 'bg-positive-soft text-positive-ink' },
  LATE: { libelle: 'En retard', classe: 'bg-negative-soft text-negative-ink' },
  IN_PROGRESS: { libelle: 'En cours', classe: 'bg-warning-soft text-warning-ink' },
}

function BoutonMaj({ modifie }: { modifie: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || !modifie}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
                 bg-accent text-on-accent hover:bg-accent-strong
                 disabled:bg-surface-muted disabled:text-ghost"
    >
      {pending ? 'Enregistrement...' : modifie ? 'Enregistrer' : 'A jour'}
    </button>
  )
}

export function CartePriorite({ priorite, icone }: { priorite: Priorite; icone: string }) {
  const [etat, action] = useActionState(majPriorite, ETAT_INITIAL)
  const [pct, setPct] = useState(priorite.progressPct)
  const [statut, setStatut] = useState(priorite.status)

  const modifie = pct !== priorite.progressPct || statut !== priorite.status
  const badge = STATUTS[statut] ?? STATUTS.IN_PROGRESS

  return (
    <div className="group bg-surface rounded-2xl border border-subtle shadow-sm p-5
                    hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icone}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.classe}`}>
            {badge.libelle}
          </span>
          <BoutonSuppression
            action={supprimerPriorite}
            id={priorite.id}
            intitule={`Supprimer la priorite ${priorite.title}`}
          />
        </div>
      </div>

      <h3 className="font-bold text-ink text-sm mb-1.5 leading-snug">{priorite.title}</h3>
      {priorite.description && (
        <p className="text-xs text-muted mb-4 leading-relaxed">{priorite.description}</p>
      )}

      <form action={action} className="space-y-2.5">
        <input type="hidden" name="id" value={priorite.id} />
        <input type="hidden" name="progressPct" value={pct} />
        <input type="hidden" name="status" value={statut} />

        <div className="flex justify-between text-xs">
          <label htmlFor={`pct-${priorite.id}`} className="text-ghost">Progression</label>
          <span className="font-semibold text-ink-soft">{pct}%</span>
        </div>

        <input
          id={`pct-${priorite.id}`}
          type="range"
          min={0}
          max={100}
          step={5}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className="w-full accent-accent"
        />

        <div className="h-1.5 bg-surface-muted rounded-full">
          <div
            className="h-1.5 bg-gradient-to-r from-accent to-accent-alt rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            aria-label="Statut de la priorite"
            className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-subtle
                       bg-canvas focus:outline-none focus:border-accent focus:bg-surface"
          >
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Termine</option>
            <option value="LATE">En retard</option>
          </select>
          <BoutonMaj modifie={modifie} />
        </div>

        {etat.message && (
          <p className={`text-xs ${etat.ok ? 'text-positive-ink' : 'text-negative-ink'}`}>{etat.message}</p>
        )}
      </form>
    </div>
  )
}
