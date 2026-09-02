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
  'w-full px-3 py-2 rounded-lg border border-slate-200 bg-[#FAF9F6] text-sm text-slate-800 ' +
  'placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors'

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
    <section className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-5 ${className}`}>
      {(titre || action) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {titre && <h2 className="text-sm font-bold text-slate-700">{titre}</h2>}
            {sousTitre && <p className="text-xs text-slate-400 mt-0.5">{sousTitre}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}

export function Vide({ texte }: { texte: string }) {
  return <p className="text-sm text-slate-400 text-center py-8">{texte}</p>
}

export function Etiquette({
  texte,
  ton = 'neutre',
}: {
  texte: string
  ton?: 'neutre' | 'succes' | 'alerte' | 'attente' | 'info'
}) {
  const tons = {
    neutre: 'bg-slate-100 text-slate-600',
    succes: 'bg-teal-50 text-teal-700',
    alerte: 'bg-red-50 text-red-700',
    attente: 'bg-amber-50 text-amber-700',
    info: 'bg-indigo-50 text-indigo-700',
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
        <label htmlFor={id} className="block text-xs font-semibold text-slate-500 mb-1">
          {libelle}
        </label>
      )}
      <input id={id} name={nom} type={type} className={CHAMP} {...reste} />
      {erreur && <p className="text-xs text-red-600 mt-1">{erreur}</p>}
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
        <label htmlFor={id} className="block text-xs font-semibold text-slate-500 mb-1">
          {libelle}
        </label>
      )}
      <textarea id={id} name={nom} rows={3} className={`${CHAMP} resize-y`} {...reste} />
      {erreur && <p className="text-xs text-red-600 mt-1">{erreur}</p>}
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
        <label htmlFor={nom} className="block text-xs font-semibold text-slate-500 mb-1">
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
      {erreur && <p className="text-xs text-red-600 mt-1">{erreur}</p>}
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
    primaire: 'bg-indigo-500 hover:bg-indigo-600 text-white',
    discret: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
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
                   text-slate-300 hover:text-red-500 text-sm px-1"
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
          ? 'text-teal-700 bg-teal-50 border border-teal-200'
          : 'text-red-700 bg-red-50 border border-red-200'
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
        className="w-full rounded-xl border border-dashed border-slate-300 py-3 text-sm
                   text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
      >
        + {intitule}
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-700">{intitule}</h3>
        <button
          onClick={() => setOuvert(false)}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          Annuler
        </button>
      </div>
      {children}
    </div>
  )
}
