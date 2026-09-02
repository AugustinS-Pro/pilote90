'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { majPriorite, supprimerPriorite, type EtatAction } from './actions'

const ETAT_INITIAL: EtatAction = { ok: false }

export type Priorite = {
  id: string
  title: string
  description: string | null
  progressPct: number
  status: string
}

const STATUTS: Record<string, { libelle: string; classe: string }> = {
  COMPLETED: { libelle: 'Termine', classe: 'bg-teal-50 text-teal-700' },
  LATE: { libelle: 'En retard', classe: 'bg-red-50 text-red-700' },
  IN_PROGRESS: { libelle: 'En cours', classe: 'bg-amber-50 text-amber-700' },
}

function BoutonMaj({ modifie }: { modifie: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || !modifie}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
                 bg-indigo-500 text-white hover:bg-indigo-600
                 disabled:bg-slate-100 disabled:text-slate-400"
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
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5
                    hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icone}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.classe}`}>
            {badge.libelle}
          </span>
          <form action={supprimerPriorite}>
            <input type="hidden" name="id" value={priorite.id} />
            <button
              type="submit"
              title="Supprimer cette priorite"
              aria-label={`Supprimer la priorite ${priorite.title}`}
              className="opacity-0 group-hover:opacity-100 transition-opacity
                         text-slate-300 hover:text-red-500 text-sm px-1"
            >
              ✕
            </button>
          </form>
        </div>
      </div>

      <h3 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">{priorite.title}</h3>
      {priorite.description && (
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">{priorite.description}</p>
      )}

      <form action={action} className="space-y-2.5">
        <input type="hidden" name="id" value={priorite.id} />
        <input type="hidden" name="progressPct" value={pct} />
        <input type="hidden" name="status" value={statut} />

        <div className="flex justify-between text-xs">
          <label htmlFor={`pct-${priorite.id}`} className="text-slate-400">Progression</label>
          <span className="font-semibold text-slate-700">{pct}%</span>
        </div>

        <input
          id={`pct-${priorite.id}`}
          type="range"
          min={0}
          max={100}
          step={5}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />

        <div className="h-1.5 bg-slate-100 rounded-full">
          <div
            className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            aria-label="Statut de la priorite"
            className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-slate-200
                       bg-[#FAF9F6] focus:outline-none focus:border-indigo-400 focus:bg-white"
          >
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Termine</option>
            <option value="LATE">En retard</option>
          </select>
          <BoutonMaj modifie={modifie} />
        </div>

        {etat.message && (
          <p className={`text-xs ${etat.ok ? 'text-teal-700' : 'text-red-700'}`}>{etat.message}</p>
        )}
      </form>
    </div>
  )
}
