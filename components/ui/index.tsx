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

/**
 * Suppression en deux temps.
 *
 * La croix ne supprime plus rien : elle demande confirmation, en rappelant
 * l'intitule de l'element vise. Le point est concentre ici, donc les quatorze
 * suppressions de l'application sont protegees d'un seul coup, et le jour ou
 * la formulation change elle change partout.
 *
 * Pas de `window.confirm` : une boite de dialogue native bloque le fil, ne se
 * met pas au theme, et n'est pas la meme d'un navigateur a l'autre.
 */
export function BoutonSuppression({
  action,
  id,
  intitule,
}: {
  action: (formData: FormData) => Promise<void>
  id: string
  /** Formule complete, du type « Supprimer la fiche Durand ». */
  intitule: string
}) {
  const [confirmation, setConfirmation] = useState(false)

  if (!confirmation) {
    return (
      <button
        type="button"
        onClick={() => setConfirmation(true)}
        title={intitule}
        aria-label={intitule}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity
                   text-disabled hover:text-negative text-sm px-1"
      >
        ✕
      </button>
    )
  }

  return (
    <form action={action} className="flex items-center gap-1.5 whitespace-nowrap">
      <input type="hidden" name="id" value={id} />
      <span className="text-[11px] text-muted">{intitule} ?</span>
      <button
        type="submit"
        className="text-[11px] font-semibold px-2 py-1 rounded-md bg-negative text-on-accent
                   hover:opacity-90 transition-opacity"
      >
        Oui
      </button>
      <button
        type="button"
        onClick={() => setConfirmation(false)}
        className="text-[11px] font-semibold px-2 py-1 rounded-md border border-subtle
                   text-ink-soft hover:bg-surface-muted transition-colors"
      >
        Non
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

/**
 * Intitule modifiable sur place.
 *
 * Repare le defaut le plus visible a l'usage : jusqu'ici on creait et on
 * supprimait, on ne corrigeait pas. Une faute de frappe obligeait a effacer la
 * ligne et a la ressaisir, ce qui, sur une offre, faisait perdre son
 * historique d'achats.
 *
 * Le composant ne connait pas l'entite qu'il modifie : il recoit une action,
 * un identifiant et une valeur. Chaque action reste responsable de son propre
 * cloisonnement, comme les suppressions.
 */
export function TexteEditable({
  action,
  id,
  valeur,
  intitule,
  multiligne = false,
  className = '',
}: {
  action: (formData: FormData) => Promise<void>
  id: string
  valeur: string
  /** Formule complete, du type « Modifier le libelle de la tache ». */
  intitule: string
  multiligne?: boolean
  className?: string
}) {
  const [edition, setEdition] = useState(false)

  if (!edition) {
    return (
      <span className="inline-flex items-baseline gap-1.5 min-w-0">
        <span className={className}>{valeur}</span>
        <button
          type="button"
          onClick={() => setEdition(true)}
          title={intitule}
          aria-label={intitule}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity
                     text-disabled hover:text-accent text-xs shrink-0"
        >
          ✎
        </button>
      </span>
    )
  }

  return (
    <form
      action={async (formData) => {
        await action(formData)
        setEdition(false)
      }}
      className="flex items-start gap-1.5 w-full"
    >
      <input type="hidden" name="id" value={id} />
      {multiligne ? (
        <textarea
          name="valeur"
          defaultValue={valeur}
          rows={2}
          autoFocus
          required
          className={`${CHAMP} resize-y`}
        />
      ) : (
        <input
          name="valeur"
          defaultValue={valeur}
          autoFocus
          required
          className={CHAMP}
          onKeyDown={(evenement) => {
            // Echap annule : c'est le reflexe attendu d'une edition en place.
            if (evenement.key === 'Escape') setEdition(false)
          }}
        />
      )}
      <BoutonSoumettre enCours="...">OK</BoutonSoumettre>
      <button
        type="button"
        onClick={() => setEdition(false)}
        className="text-xs font-semibold px-2.5 py-2 rounded-lg border border-subtle
                   text-ink-soft hover:bg-surface-muted transition-colors"
      >
        Annuler
      </button>
    </form>
  )
}

/**
 * Champ de recherche, en formulaire GET.
 *
 * Aucun etat, aucun effet, aucune dependance a JavaScript : la soumission
 * navigue vers la meme page avec un parametre d'URL, et le rendu serveur filtre.
 * La recherche devient donc partageable par lien et memorisable par le
 * navigateur, ce qu'un filtre garde en memoire dans le composant ne permet pas.
 */
export function Recherche({
  action,
  valeur,
  placeholder = 'Rechercher...',
  children,
}: {
  /** Chemin de la page, vers lequel le formulaire soumet. */
  action: string
  valeur?: string
  placeholder?: string
  /** Filtres additionnels, a conserver dans l'URL lors d'une recherche. */
  children?: ReactNode
}) {
  return (
    <form action={action} className="flex items-center gap-2">
      {children}
      <input
        type="search"
        name="q"
        defaultValue={valeur ?? ''}
        placeholder={placeholder}
        aria-label={placeholder}
        className="px-3 py-1.5 rounded-lg border border-subtle bg-canvas text-xs text-ink-soft
                   placeholder:text-ghost focus:outline-none focus:border-accent focus:bg-surface
                   transition-colors w-44 sm:w-56"
      />
      <button
        type="submit"
        className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-subtle
                   bg-surface text-ink-soft hover:bg-surface-muted transition-colors"
      >
        Chercher
      </button>
      {valeur ? (
        <a
          href={action}
          className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg text-muted
                     hover:text-ink-soft transition-colors"
        >
          Effacer
        </a>
      ) : null}
    </form>
  )
}
