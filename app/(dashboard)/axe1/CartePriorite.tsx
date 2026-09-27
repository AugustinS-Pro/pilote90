'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { majPriorite, proposerActions, supprimerPriorite, type EtatAction } from './actions'
import { BoutonSuppression } from '@/components/ui'

const ETAT_INITIAL: EtatAction = { ok: false }

export type TacheRattachee = {
  id: string
  label: string
  done: boolean
}

export type Priorite = {
  id: string
  title: string
  description: string | null
  progressPct: number
  status: string
  /** Taches rattachees. Des qu'il y en a une, la progression est deduite. */
  taches: readonly TacheRattachee[]
}

const STATUTS: Record<string, { libelle: string; classe: string }> = {
  COMPLETED: { libelle: 'Terminé', classe: 'bg-positive-soft text-positive-ink' },
  LATE: { libelle: 'En retard', classe: 'bg-negative-soft text-negative-ink' },
  IN_PROGRESS: { libelle: 'En cours', classe: 'bg-warning-soft text-warning-ink' },
}

function BoutonProposer() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-subtle
                 bg-surface text-muted hover:bg-surface-muted disabled:opacity-60
                 transition-colors"
    >
      {pending ? 'Ajout...' : 'Proposer des actions'}
    </button>
  )
}

/**
 * Proposition d'actions, offerte tant que la priorite n'en porte aucune.
 *
 * Passe la premiere action, la priorite a son cockpit et le bouton n'a plus
 * lieu d'etre : c'est au dirigeant d'ecrire la suite, pas a un modele.
 */
function Proposition({ id }: { id: string }) {
  const [etat, action] = useActionState(proposerActions, ETAT_INITIAL)

  return (
    <form action={action} className="mt-3 pt-3 border-t border-subtle">
      <input type="hidden" name="id" value={id} />
      <p className="text-[11px] text-ghost mb-2 leading-snug">
        Aucune action rattachée. Partir d’une proposition est souvent plus facile
        que partir d’une page blanche.
      </p>
      <BoutonProposer />
      {etat.message && (
        <p
          role="status"
          className={`text-[11px] mt-2 ${etat.ok ? 'text-positive-ink' : 'text-negative-ink'}`}
        >
          {etat.message}
        </p>
      )}
    </form>
  )
}

/**
 * Les actions rattachees a la priorite, cochables depuis le cockpit.
 *
 * La carte affichait la progression deduite sans montrer ce dont elle est
 * deduite : le dirigeant lisait « calculee a partir de 4 taches » sans savoir
 * lesquelles ni ou les trouver. On les nomme, et le lien va la ou on les coche.
 */
function Actions({ taches }: { taches: readonly TacheRattachee[] }) {
  const faites = taches.filter((t) => t.done).length

  return (
    <div className="mt-3 pt-3 border-t border-subtle">
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-wide">
          Actions rattachées
        </p>
        <span className="text-[11px] text-ghost">{faites} / {taches.length}</span>
      </div>
      <ul className="space-y-1">
        {taches.map((tache) => (
          <li key={tache.id} className="flex items-start gap-2 text-[11px] leading-snug">
            <span aria-hidden className={tache.done ? 'text-positive-ink' : 'text-ghost'}>
              {tache.done ? '✓' : '•'}
            </span>
            <span className={tache.done ? 'text-ghost line-through' : 'text-ink-soft'}>
              {tache.label}
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/axe5"
        className="inline-block mt-2 text-[11px] font-semibold text-accent-ink hover:underline"
      >
        Les cocher dans Pilote 90 jours
      </Link>
    </div>
  )
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

  // Une priorite qui porte des taches n'a pas de progression saisissable : le
  // serveur refuse la valeur, l'interface ne la propose donc pas.
  const deduite = priorite.taches.length > 0
  const modifie = (!deduite && pct !== priorite.progressPct) || statut !== priorite.status
  const badge = STATUTS[statut] ?? STATUTS.IN_PROGRESS

  return (
    <div className="group bg-surface rounded-2xl border border-subtle shadow-sm p-5
                    hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span aria-hidden className="text-2xl">{icone}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge.classe}`}>
            {badge.libelle}
          </span>
          <BoutonSuppression
            action={supprimerPriorite}
            id={priorite.id}
            intitule={`Supprimer la priorité ${priorite.title}`}
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
          {deduite ? (
            <span className="text-ghost">Progression calculée</span>
          ) : (
            <label htmlFor={`pct-${priorite.id}`} className="text-ghost">Progression</label>
          )}
          <span className="font-semibold text-ink-soft">{pct}%</span>
        </div>

        {deduite ? (
          <p className="text-[11px] text-ghost leading-snug">
            Calculée à partir des {priorite.taches.length} actions rattachées. Cochez-les dans
            Pilote 90 jours, la progression suit.
          </p>
        ) : (
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
        )}

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
            aria-label="Statut de la priorité"
            className="flex-1 text-xs px-2 py-1.5 rounded-lg border border-subtle
                       bg-canvas focus:outline-none focus:border-accent focus:bg-surface"
          >
            <option value="IN_PROGRESS">En cours</option>
            <option value="COMPLETED">Terminé</option>
            <option value="LATE">En retard</option>
          </select>
          <BoutonMaj modifie={modifie} />
        </div>

        {etat.message && (
          <p className={`text-xs ${etat.ok ? 'text-positive-ink' : 'text-negative-ink'}`}>{etat.message}</p>
        )}
      </form>

      {deduite ? <Actions taches={priorite.taches} /> : <Proposition id={priorite.id} />}
    </div>
  )
}
