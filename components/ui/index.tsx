'use client'

import { useState, type ReactNode } from 'react'
import { useFormStatus } from 'react-dom'

/** Etat renvoye par toutes les Server Actions du projet. */
export type EtatAction = {
  ok: boolean
  message?: string
  erreurs?: Record<string, string>
}

export const ETAT_INITIAL: EtatAction = { ok: false }

export const CHAMP =
  'w-full px-3 py-2 rounded-lg border border-subtle bg-canvas text-sm text-ink-soft ' +
  'placeholder:text-ghost focus:outline-none focus:border-accent focus:bg-surface transition-colors'

// ---------------------------------------------------------------------------
// Blocs de mise en page
// ---------------------------------------------------------------------------

export function Carte({
  titre,
  sousTitre,
  action,
  children,
  className = '',
}: {
  titre?: string
  sousTitre?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`bg-surface rounded-2xl border border-subtle shadow-sm p-5 ${className}`}>
      {(titre || action) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {titre && <h2 className="text-sm font-bold text-ink-soft">{titre}</h2>}
            {sousTitre && <p className="text-xs text-ghost mt-0.5">{sousTitre}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Vide({ texte }: { texte: string }) {
  return <p className="text-sm text-ghost text-center py-8">{texte}</p>
}

export function Etiquette({
  texte,
  ton = 'neutre',
}: {
  texte: string
  ton?: 'neutre' | 'succes' | 'alerte' | 'attente' | 'info'
}) {
  const tons = {
    neutre: 'bg-surface-muted text-muted',
    succes: 'bg-positive-soft text-positive-ink',
    alerte: 'bg-negative-soft text-negative-ink',
    attente: 'bg-warning-soft text-warning-ink',
    info: 'bg-accent-soft text-accent-ink',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${tons[ton]}`}>
      {texte}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Champs
// ---------------------------------------------------------------------------

export function Champ({
  nom,
  libelle,
  erreur,
  idUnique,
  type = 'text',
  ...reste
}: {
  nom: string
  libelle?: string
  erreur?: string
  /** Identifiant DOM, quand le meme nom de champ apparait dans plusieurs formulaires. */
  idUnique?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = idUnique ?? nom
  return (
    <div>
      {libelle && (
        <label htmlFor={id} className="block text-xs font-semibold text-muted mb-1">
          {libelle}
        </label>
      )}
      <input id={id} name={nom} type={type} className={CHAMP} {...reste} />
      {erreur && <p className="text-xs text-negative-ink mt-1">{erreur}</p>}
    </div>
  )
}

export function ZoneTexte({
  nom,
  libelle,
  erreur,
  idUnique,
  ...reste
}: {
  nom: string
  libelle?: string
  erreur?: string
  idUnique?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = idUnique ?? nom
  return (
    <div>
      {libelle && (
        <label htmlFor={id} className="block text-xs font-semibold text-muted mb-1">
          {libelle}
        </label>
      )}
      <textarea id={id} name={nom} rows={3} className={`${CHAMP} resize-y`} {...reste} />
      {erreur && <p className="text-xs text-negative-ink mt-1">{erreur}</p>}
    </div>
  )
}

export function Liste({
  nom,
  libelle,
  options,
  erreur,
  ...reste
}: {
  nom: string
  libelle?: string
  options: { valeur: string; libelle: string }[]
  erreur?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {libelle && (
        <label htmlFor={nom} className="block text-xs font-semibold text-muted mb-1">
          {libelle}
        </label>
      )}
      <select id={nom} name={nom} className={CHAMP} {...reste}>
        {options.map((o) => (
          <option key={o.valeur} value={o.valeur}>
            {o.libelle}
          </option>
        ))}
      </select>
      {erreur && <p className="text-xs text-negative-ink mt-1">{erreur}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Boutons et retours
// ---------------------------------------------------------------------------

export function BoutonSoumettre({
  children,
  enCours = 'Enregistrement...',
  variante = 'primaire',
  desactive = false,
}: {
  children: ReactNode
  enCours?: string
  variante?: 'primaire' | 'discret' | 'danger'
  desactive?: boolean
}) {
  const { pending } = useFormStatus()
  const variantes = {
    primaire: 'bg-accent hover:bg-accent-strong text-on-accent',
    discret: 'bg-surface-muted hover:bg-surface-muted text-ink-soft',
    danger: 'bg-negative hover:bg-negative text-on-accent',
  }
  return (
    <button
      type="submit"
      disabled={pending || desactive}
      className={`${variantes[variante]} disabled:opacity-50 text-xs font-semibold
                  px-3.5 py-2 rounded-lg transition-colors`}
    >
      {pending ? enCours : children}
    </button>
  )
}

export function BoutonSuppression({
  action,
  id,
  intitule,
}: {
  action: (formData: FormData) => Promise<void>
  id: string
  intitule: string
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title={intitule}
        aria-label={intitule}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity
                   text-disabled hover:text-negative text-sm px-1"
      >
        ✕
      </button>
    </form>
  )
}

export function Retour({ etat }: { etat: EtatAction }) {
  if (!etat.message) return null
  return (
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
  )
}

// ---------------------------------------------------------------------------
// Panneau d'ajout repliable
// ---------------------------------------------------------------------------

/**
 * Se referme tout seul quand l'action a reussi.
 * L'ajustement d'etat se fait pendant le rendu, pas dans un effet.
 */
export function PanneauAjout({
  intitule,
  etat,
  children,
}: {
  intitule: string
  etat: EtatAction
  children: ReactNode
}) {
  const [ouvert, setOuvert] = useState(false)
  const [dernier, setDernier] = useState<EtatAction>(ETAT_INITIAL)

  if (etat !== dernier) {
    setDernier(etat)
    if (etat.ok) setOuvert(false)
  }

  if (!ouvert) {
    return (
      <button
        onClick={() => setOuvert(true)}
        className="w-full rounded-xl border border-dashed border-firm py-3 text-sm
                   text-muted hover:border-accent hover:text-accent-ink transition-colors"
      >
        + {intitule}
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-accent bg-accent-soft p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-ink-soft">{intitule}</h3>
        <button
          onClick={() => setOuvert(false)}
          className="text-xs text-muted hover:text-ink-soft"
        >
          Annuler
        </button>
      </div>
      {children}
    </div>
  )
}
