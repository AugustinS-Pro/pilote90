'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  lireFactureRecue, enregistrerFactureLue,
  type EtatAction, type EtatFacture, type FactureProposee,
} from './actions'
import { euros } from '@/lib/format'

const LECTURE_INITIALE: EtatFacture = { ok: false }
const ECRITURE_INITIALE: EtatAction = { ok: false }

function BoutonLecture() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-semibold px-3 py-2 rounded-lg border border-subtle
                 bg-surface text-muted hover:bg-surface-muted disabled:opacity-60
                 transition-colors shrink-0"
    >
      {pending ? 'Lecture...' : 'Lire la facture'}
    </button>
  )
}

function BoutonEnregistrer() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
                 bg-accent text-on-accent hover:bg-accent-strong disabled:opacity-60"
    >
      {pending ? 'Enregistrement...' : 'Enregistrer cette écriture'}
    </button>
  )
}

function Ligne({ intitule, valeur }: { intitule: string; valeur: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className="text-ghost shrink-0">{intitule}</span>
      <span className="text-ink-soft font-medium text-right">{valeur}</span>
    </div>
  )
}

/**
 * Ce que l'application a lu, avant d'ecrire quoi que ce soit.
 *
 * Le dirigeant voit les montants tels qu'ils sont ecrits dans le fichier de
 * donnees, pas tels que l'application les aurait devines. Il ne reste a decider
 * que ce que le document ne dit pas : de quel cote de son compte cette facture
 * tombe, et sous quel libelle il veut la retrouver.
 */
function Proposition({ facture }: { facture: FactureProposee }) {
  const [etat, action] = useActionState(enregistrerFactureLue, ECRITURE_INITIALE)

  if (etat.ok) {
    return (
      <p role="status" className="text-xs text-positive-ink mt-3">
        {etat.message}
      </p>
    )
  }

  const jour = new Date(facture.dateEmission).toLocaleDateString('fr-FR')
  const libelleParDefaut = facture.vendeur
    ? `${facture.vendeur} — ${facture.numero}`
    : `Facture ${facture.numero}`

  return (
    <form action={action} className="mt-3 rounded-xl border border-subtle bg-canvas p-4 space-y-3">
      <input type="hidden" name="numero" value={facture.numero} />
      <input type="hidden" name="montantHt" value={facture.montantHt} />
      <input type="hidden" name="dateEmission" value={facture.dateEmission} />
      <input type="hidden" name="deduction" value={facture.deduction ? 'oui' : 'non'} />

      <div className="space-y-1.5">
        <Ligne intitule="Document" valeur={`${facture.typeDocument} ${facture.numero}`} />
        <Ligne intitule="Émise le" valeur={jour} />
        {facture.vendeur && <Ligne intitule="Émetteur" valeur={facture.vendeur} />}
        {facture.acheteur && <Ligne intitule="Destinataire" valeur={facture.acheteur} />}
        <Ligne intitule="Montant HT" valeur={euros(facture.montantHt, 2)} />
        {facture.montantTtc !== null && (
          <Ligne intitule="Montant TTC" valeur={euros(facture.montantTtc, 2)} />
        )}
      </div>

      {facture.devise !== 'EUR' && (
        <p className="text-[11px] text-warning-ink leading-snug">
          Facture libellée en {facture.devise}. Le montant est enregistré tel quel, sans conversion.
        </p>
      )}

      {facture.deduction && (
        <p className="text-[11px] text-warning-ink leading-snug">
          C’est un avoir : il vient en déduction. Le sens choisi ci-dessous sera inversé.
        </p>
      )}

      <div className="space-y-2 pt-1">
        <label htmlFor="libelle-facture" className="block text-[11px] text-ghost">
          Libellé de l’écriture
        </label>
        <input
          id="libelle-facture"
          name="label"
          defaultValue={libelleParDefaut}
          maxLength={160}
          className="w-full text-xs px-2.5 py-2 rounded-lg border border-subtle
                     bg-surface focus:outline-none focus:border-accent"
        />

        <fieldset className="pt-1">
          <legend className="text-[11px] text-ghost mb-1.5">
            Cette facture est, pour vous :
          </legend>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-1.5 text-xs text-ink-soft">
              <input type="radio" name="type" value="EXPENSE" defaultChecked className="accent-accent" />
              une dépense reçue
            </label>
            <label className="flex items-center gap-1.5 text-xs text-ink-soft">
              <input type="radio" name="type" value="REVENUE" className="accent-accent" />
              une vente émise
            </label>
          </div>
        </fieldset>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <BoutonEnregistrer />
        {etat.message && (
          <p role="status" className="text-[11px] text-negative-ink">{etat.message}</p>
        )}
      </div>
    </form>
  )
}

/**
 * Lecture d'une facture electronique.
 *
 * Une facture Factur-X embarque ses montants sous forme de donnees : il n'y a
 * rien a reconnaitre, donc rien a corriger apres coup. Un PDF imprime ou scanne
 * n'en a pas, et la difference est dite a l'ecran plutot que devinee.
 */
export function LectureFacture() {
  const [etat, action] = useActionState(lireFactureRecue, LECTURE_INITIALE)

  return (
    <div className="mt-4 pt-4 border-t border-subtle">
      <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-2">
        Facture électronique
      </p>

      <form action={action} className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          name="fichier"
          accept=".pdf,application/pdf"
          aria-label="Facture au format PDF"
          className="flex-1 min-w-0 text-xs text-muted file:mr-3 file:py-1.5 file:px-3
                     file:rounded-lg file:border file:border-subtle file:text-xs
                     file:font-semibold file:bg-surface file:text-muted"
        />
        <BoutonLecture />
      </form>

      <p className="text-[11px] text-ghost mt-2 leading-snug">
        Les montants sont lus dans les données de la facture, pas reconnus à l’image.
        Rien n’est enregistré avant votre validation, et le PDF n’est pas conservé.
      </p>

      {etat.message && (
        <p
          role="status"
          className={`text-xs mt-2 leading-snug ${etat.ok ? 'text-positive-ink' : 'text-negative-ink'}`}
        >
          {etat.message}
        </p>
      )}

      {etat.ok && etat.facture && <Proposition facture={etat.facture} />}
    </div>
  )
}
