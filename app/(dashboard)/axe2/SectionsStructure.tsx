'use client'

import { useActionState } from 'react'
import {
  Carte, Vide, Etiquette, Champ, Liste,
  BoutonSoumettre, BoutonSuppression, Retour, PanneauAjout, ETAT_INITIAL,
} from '@/components/ui'
import { euros } from '@/lib/format'
import {
  enregistrerStructure, enregistrerTaux,
  enregistrerObjectifRevenu, supprimerObjectifRevenu,
  creerEcheance, basculerEcheance, supprimerEcheance,
} from './actions'

export type StructureVue = {
  legalStatus: string | null
  proBankAccount: boolean
  invoicingTool: string | null
  accountingTool: string | null
  proInsurance: boolean
  vatRegime: string | null
  siret: string | null
  siren: string | null
}

export type TauxVue = {
  socialContributionPct: number
  incomeTaxPct: number
  trainingPct: number
  category: string
  total: number
}

export type ObjectifVue = {
  id: string
  offerName: string
  netTargetHt: number
  offerPriceHt: number
  caNecessaire: number | null
  clientsNecessaires: number | null
}

export type EcheanceVue = {
  id: string
  label: string
  echeance: string
  jours: number
  done: boolean
  recurrence: string | null
}

// ===========================================================================
// Ma structure administrative
// ===========================================================================

export function SectionStructure({ structure }: { structure: StructureVue | null }) {
  const [etat, action] = useActionState(enregistrerStructure, ETAT_INITIAL)

  const lignes = [
    { libelle: 'Statut juridique', valeur: structure?.legalStatus },
    { libelle: 'Compte bancaire professionnel', valeur: structure?.proBankAccount ? 'Oui' : 'Non' },
    { libelle: 'Outil de facturation', valeur: structure?.invoicingTool },
    { libelle: 'Suivi comptable', valeur: structure?.accountingTool },
    { libelle: 'Assurance professionnelle', valeur: structure?.proInsurance ? 'Oui' : 'Non' },
    { libelle: 'Regime de TVA', valeur: structure?.vatRegime },
    { libelle: 'SIRET', valeur: structure?.siret },
    { libelle: 'SIREN', valeur: structure?.siren },
  ]

  return (
    <Carte titre="Ma structure administrative" sousTitre="Se renseigne une fois, se relit chaque annee">
      <div className="divide-y divide-slate-100 mb-4">
        {lignes.map((l) => (
          <div key={l.libelle} className="flex justify-between items-center py-2 text-sm">
            <span className="text-slate-500">{l.libelle}</span>
            <span className={l.valeur ? 'text-slate-800 font-medium' : 'text-slate-300'}>
              {l.valeur || 'Non renseigne'}
            </span>
          </div>
        ))}
      </div>

      <details>
        <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-slate-700">
          Modifier
        </summary>
        <form action={action} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Champ nom="legalStatus" libelle="Statut juridique" maxLength={60}
                   defaultValue={structure?.legalStatus ?? ''} placeholder="Micro-entreprise, SASU..." />
            <Champ nom="vatRegime" libelle="Regime de TVA" maxLength={60}
                   defaultValue={structure?.vatRegime ?? ''} placeholder="Franchise en base" />
            <Champ nom="invoicingTool" libelle="Outil de facturation" maxLength={60}
                   defaultValue={structure?.invoicingTool ?? ''} />
            <Champ nom="accountingTool" libelle="Suivi comptable" maxLength={60}
                   defaultValue={structure?.accountingTool ?? ''} />
            <Champ nom="siret" libelle="SIRET" maxLength={20} defaultValue={structure?.siret ?? ''} />
            <Champ nom="siren" libelle="SIREN" maxLength={20} defaultValue={structure?.siren ?? ''} />
          </div>

          <div className="flex flex-wrap gap-5 pt-1">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="proBankAccount" defaultChecked={structure?.proBankAccount}
                     className="w-4 h-4 accent-indigo-500" />
              Compte bancaire professionnel
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" name="proInsurance" defaultChecked={structure?.proInsurance}
                     className="w-4 h-4 accent-indigo-500" />
              Assurance professionnelle
            </label>
          </div>

          <BoutonSoumettre>Enregistrer</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </details>
    </Carte>
  )
}

// ===========================================================================
// Mes taux de charges
// ===========================================================================

export function SectionTaux({ taux }: { taux: TauxVue }) {
  const [etat, action] = useActionState(enregistrerTaux, ETAT_INITIAL)

  return (
    <Carte
      titre="Mes taux de charges"
      sousTitre="Le total ne se saisit pas : il s'additionne"
      action={
        <div className="text-right">
          <p className="text-2xl font-extrabold text-red-500">{taux.total} %</p>
          <p className="text-[11px] text-slate-400">total des charges</p>
        </div>
      }
    >
      <div className="divide-y divide-slate-100 mb-4">
        {[
          { l: 'Cotisations sociales', v: taux.socialContributionPct },
          { l: 'Impot (versement liberatoire)', v: taux.incomeTaxPct },
          { l: 'Contribution a la formation professionnelle', v: taux.trainingPct },
        ].map((x) => (
          <div key={x.l} className="flex justify-between items-center py-2 text-sm">
            <span className="text-slate-500">{x.l}</span>
            <span className="text-slate-800 font-medium">{x.v} %</span>
          </div>
        ))}
        <div className="flex justify-between items-center py-2 text-sm">
          <span className="text-slate-500">Categorie</span>
          <Etiquette texte={taux.category} ton="info" />
        </div>
      </div>

      <details>
        <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-slate-700">
          Modifier mes taux
        </summary>
        <form action={action} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Champ nom="socialContributionPct" libelle="Cotisations (%)" inputMode="decimal"
                   defaultValue={String(taux.socialContributionPct)} />
            <Champ nom="incomeTaxPct" libelle="Impot (%)" inputMode="decimal"
                   defaultValue={String(taux.incomeTaxPct)} />
            <Champ nom="trainingPct" libelle="Formation (%)" inputMode="decimal"
                   defaultValue={String(taux.trainingPct)} />
            <Liste nom="category" libelle="Categorie" defaultValue={taux.category}
                   options={[{ valeur: 'BIC', libelle: 'BIC' }, { valeur: 'BNC', libelle: 'BNC' }]} />
          </div>
          <BoutonSoumettre>Enregistrer</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </details>
    </Carte>
  )
}

// ===========================================================================
// Combien dois-je generer pour vivre ?
// ===========================================================================

export function SectionObjectifRevenu({
  objectifs,
  total,
}: {
  objectifs: ObjectifVue[]
  total: number
}) {
  const [etat, action] = useActionState(enregistrerObjectifRevenu, ETAT_INITIAL)

  return (
    <Carte
      titre="Combien dois-je generer pour vivre ?"
      sousTitre={`CA necessaire = revenu net vise / (1 − ${total} %) · clients = CA necessaire / prix de l'offre`}
    >
      {objectifs.length > 0 ? (
        <div className="space-y-3 mb-4">
          {objectifs.map((o) => (
            <div key={o.id} className="group rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <p className="text-sm font-semibold text-slate-800">{o.offerName}</p>
                <BoutonSuppression action={supprimerObjectifRevenu} id={o.id} intitule="Supprimer cet objectif" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-lg font-bold text-slate-700">{euros(o.netTargetHt)}</p>
                  <p className="text-[11px] text-slate-400">revenu net vise</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-700">{euros(o.offerPriceHt)}</p>
                  <p className="text-[11px] text-slate-400">prix de l&apos;offre</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-indigo-600">
                    {o.caNecessaire !== null ? euros(o.caNecessaire) : '—'}
                  </p>
                  <p className="text-[11px] text-indigo-400">CA necessaire · calcule</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-teal-600">
                    {o.clientsNecessaires !== null ? o.clientsNecessaires : '—'}
                  </p>
                  <p className="text-[11px] text-teal-500">clients necessaires · calcule</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Vide texte="Aucun objectif de revenu defini." />
      )}

      <PanneauAjout intitule="Ajouter un objectif" etat={etat}>
        <form action={action} className="space-y-3">
          <Champ nom="offerName" libelle="Offre concernee" required maxLength={120}
                 erreur={etat.erreurs?.offerName} />
          <div className="grid grid-cols-2 gap-3">
            <Champ nom="netTarget" libelle="Revenu net vise par mois (€)" inputMode="decimal" required
                   erreur={etat.erreurs?.netTarget} />
            <Champ nom="offerPrice" libelle="Prix de l'offre (€)" inputMode="decimal" required
                   erreur={etat.erreurs?.offerPrice} />
          </div>
          <BoutonSoumettre>Calculer et enregistrer</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </PanneauAjout>
    </Carte>
  )
}

// ===========================================================================
// Echeances administratives
// ===========================================================================

export function SectionEcheances({ echeances }: { echeances: EcheanceVue[] }) {
  const [etat, action] = useActionState(creerEcheance, ETAT_INITIAL)
  const aujourdhui = new Date().toISOString().slice(0, 10)

  const ton = (e: EcheanceVue) => {
    if (e.done) return 'succes' as const
    if (e.jours < 0) return 'alerte' as const
    if (e.jours <= 15) return 'attente' as const
    return 'neutre' as const
  }

  const mention = (e: EcheanceVue) => {
    if (e.done) return 'Fait'
    if (e.jours < 0) return `En retard de ${Math.abs(e.jours)} j`
    if (e.jours === 0) return "Aujourd'hui"
    return `Dans ${e.jours} j`
  }

  return (
    <Carte
      titre="Mes echeances administratives"
      sousTitre="Alerte a quinze jours, signalement au-dela de la date"
    >
      {echeances.length > 0 ? (
        <div className="space-y-2 mb-4">
          {echeances.map((e) => (
            <div key={e.id} className="group flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
              <form action={basculerEcheance}>
                <input type="hidden" name="id" value={e.id} />
                <button
                  type="submit"
                  aria-label={e.done ? `Rouvrir ${e.label}` : `Marquer ${e.label} comme fait`}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    e.done ? 'bg-teal-500 border-teal-500 text-white' : 'border-slate-300 hover:border-teal-400'
                  }`}
                >
                  {e.done && <span className="text-[11px] leading-none">✓</span>}
                </button>
              </form>

              <div className="flex-1 min-w-0">
                <p className={`text-sm ${e.done ? 'text-slate-400 line-through' : 'text-slate-800 font-medium'}`}>
                  {e.label}
                </p>
                <p className="text-[11px] text-slate-400">
                  {e.echeance}{e.recurrence && ` · ${e.recurrence}`}
                </p>
              </div>

              <Etiquette texte={mention(e)} ton={ton(e)} />
              <BoutonSuppression action={supprimerEcheance} id={e.id} intitule={`Supprimer ${e.label}`} />
            </div>
          ))}
        </div>
      ) : (
        <Vide texte="Aucune echeance enregistree." />
      )}

      <PanneauAjout intitule="Ajouter une echeance" etat={etat}>
        <form action={action} className="space-y-3">
          <Champ nom="label" libelle="Intitule" required maxLength={120}
                 placeholder="Declaration URSSAF trimestrielle" erreur={etat.erreurs?.label} />
          <div className="grid grid-cols-2 gap-3">
            <Champ nom="dueDate" libelle="Echeance" type="date" defaultValue={aujourdhui} required />
            <Champ nom="recurrence" libelle="Recurrence" maxLength={40} placeholder="Trimestrielle" />
          </div>
          <BoutonSoumettre>Ajouter</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </PanneauAjout>
    </Carte>
  )
}

// ===========================================================================
// Suivi mensuel : le tableau que le Notion fait remplir a la main
// ===========================================================================

export function SectionSuiviMensuel({
  lignes,
  total,
}: {
  lignes: { mois: string; ca: number; charges: number; net: number }[]
  total: number
}) {
  return (
    <Carte
      titre="Suivi mensuel"
      sousTitre={`Charges estimees = CA × ${total} % · revenu net = CA − charges estimees. Aucune de ces colonnes ne se saisit.`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-500 border-b border-slate-200">
              <th className="pb-2">Mois</th>
              <th className="pb-2 text-right">Chiffre d&apos;affaires</th>
              <th className="pb-2 text-right">Charges estimees</th>
              <th className="pb-2 text-right">Revenu net</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.mois} className="border-b border-slate-100 last:border-0">
                <td className="py-2 text-slate-700">{l.mois}</td>
                <td className="py-2 text-right font-medium text-teal-600">{euros(l.ca)}</td>
                <td className="py-2 text-right text-red-500">{euros(l.charges)}</td>
                <td className="py-2 text-right font-bold text-indigo-600">{euros(l.net)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Carte>
  )
}
