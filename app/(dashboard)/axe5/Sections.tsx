'use client'

import { useActionState } from 'react'
import {
  Carte, Vide, Etiquette, Champ, ZoneTexte, Liste, BoutonSoumettre, BoutonSuppression, TexteEditable, Retour, PanneauAjout, ETAT_INITIAL,
} from '@/components/ui'
import { euros } from '@/lib/format'
import {
  creerCycle, cloturerCycle, enregistrerPlanMensuel,
  enregistrerFocusSemaine, enregistrerRevue,
  creerTache, basculerTache, supprimerTache, modifierTache,
} from './actions'

export const ETIQUETTES_TACHE = [
  { valeur: 'VENTE', libelle: 'Vente' },
  { valeur: 'OFFRE', libelle: 'Offre' },
  { valeur: 'FINANCE', libelle: 'Finance' },
  { valeur: 'COMMUNICATION', libelle: 'Communication' },
  { valeur: 'ORGANISATION', libelle: 'Organisation' },
  { valeur: 'DIVERS', libelle: 'Divers' },
]

const TON_TAG: Record<string, 'succes' | 'attente' | 'alerte' | 'info' | 'neutre'> = {
  VENTE: 'attente',
  OFFRE: 'info',
  FINANCE: 'succes',
  COMMUNICATION: 'info',
  ORGANISATION: 'neutre',
  DIVERS: 'neutre',
}

const libelleDe = (liste: { valeur: string; libelle: string }[], v: string) =>
  liste.find((o) => o.valeur === v)?.libelle ?? v

// --- Types ------------------------------------------------------------------

export type PrioriteVue = { id: string; title: string; progressPct: number; rank: number }

export type CycleVue = {
  id: string
  cycleNumber: number
  name: string | null
  mainObjective: string
  caTargetMonthly: number
  caRealise: number
  debut: string
  fin: string
  semaineCourante: number
  status: string
}

export type PlanMoisVue = { monthNumber: number; theme: string | null; caTargetHt: number; notes: string | null }

export type SemaineVue = {
  id: string
  weekNumber: number
  debut: string | null
  focusTitle: string | null
  revue: { whatWorks: string | null; whatBlocks: string | null; adjustments: string | null } | null
  estCourante: boolean
}

export type TacheVue = {
  id: string
  label: string
  tag: string
  done: boolean
  echeance: string | null
  prioriteTitre: string | null
}

// ===========================================================================
// 1. Le cycle en cours
// ===========================================================================

export function SectionCycle({ cycle }: { cycle: CycleVue | null }) {
  const [etatCreation, actionCreation] = useActionState(creerCycle, ETAT_INITIAL)
  const [etatCloture, actionCloture] = useActionState(cloturerCycle, ETAT_INITIAL)
  const aujourdhui = new Date().toISOString().slice(0, 10)

  if (!cycle) {
    return (
      <Carte titre="Aucun cycle en cours" sousTitre="Un cycle de 90 jours structure tout le reste de l'application">
        <form action={actionCreation} className="space-y-3">
          <Champ nom="mainObjective" libelle="Objectif principal du cycle" required maxLength={240}
                 placeholder="Atteindre 5 000 € de CA mensuel recurrent" erreur={etatCreation.erreurs?.mainObjective} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Champ nom="name" libelle="Nom (facultatif)" maxLength={80} placeholder="Lancement" />
            <Champ nom="caTarget" libelle="Objectif de CA mensuel (€)" inputMode="decimal" required
                   placeholder="5000" erreur={etatCreation.erreurs?.caTarget} />
            <Champ nom="startDate" libelle="Date de debut" type="date" defaultValue={aujourdhui} required
                   erreur={etatCreation.erreurs?.startDate} />
          </div>
          <BoutonSoumettre>Ouvrir un cycle de 90 jours</BoutonSoumettre>
          <Retour etat={etatCreation} />
          <p className="text-xs text-ghost">
            Les douze semaines et les trois plans mensuels sont crees automatiquement.
          </p>
        </form>
      </Carte>
    )
  }

  const progression = cycle.caTargetMonthly > 0
    ? Math.round((cycle.caRealise / (cycle.caTargetMonthly * 3)) * 100)
    : 0

  return (
    <div className="bg-inverse rounded-2xl p-6 text-on-inverse">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs text-ghost uppercase tracking-wider mb-1">
            Cycle {cycle.cycleNumber}
            {cycle.name && ` — ${cycle.name}`} · semaine {cycle.semaineCourante} sur 12
          </p>
          <p className="font-bold text-xl">{cycle.mainObjective}</p>
          <p className="text-xs text-ghost mt-1">
            Du {cycle.debut} au {cycle.fin}
          </p>
        </div>
        <span className="flex items-center gap-1.5 bg-positive/20 text-positive text-xs font-semibold px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-positive rounded-full animate-pulse" />
          En cours
        </span>
      </div>

      <div className="flex gap-1 mb-1.5">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i + 1 < cycle.semaineCourante ? 'bg-accent'
              : i + 1 === cycle.semaineCourante ? 'bg-positive'
              : 'bg-inverse-soft'
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted mb-5">
        <span>Demarrage</span><span>Mois 1</span><span>Mois 2</span><span>Fin</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        <div className="bg-surface/5 rounded-xl p-3.5">
          <p className="text-xl font-extrabold">{euros(cycle.caTargetMonthly)}</p>
          <p className="text-xs text-ghost mt-0.5">Objectif mensuel</p>
        </div>
        <div className="bg-surface/5 rounded-xl p-3.5">
          <p className="text-xl font-extrabold text-positive">{euros(cycle.caRealise)}</p>
          <p className="text-xs text-ghost mt-0.5">Realise sur le cycle</p>
        </div>
        <div className="bg-surface/5 rounded-xl p-3.5">
          <p className="text-xl font-extrabold">{progression} %</p>
          <p className="text-xs text-ghost mt-0.5">De l&apos;objectif 90 jours</p>
        </div>
      </div>

      <details className="group">
        <summary className="cursor-pointer text-xs text-ghost hover:text-on-inverse">
          Cloturer ce cycle
        </summary>
        <form action={actionCloture} className="mt-3 space-y-2">
          <input type="hidden" name="id" value={cycle.id} />
          <textarea
            name="closingNote" rows={2} maxLength={600}
            placeholder="Ce que je retiens de ces 90 jours"
            className="w-full px-3 py-2 rounded-lg bg-surface/10 border border-white/20 text-sm
                       text-on-inverse placeholder:text-muted focus:outline-none focus:border-positive"
          />
          <BoutonSoumettre variante="discret">Cloturer le cycle</BoutonSoumettre>
          <Retour etat={etatCloture} />
        </form>
      </details>
    </div>
  )
}

// ===========================================================================
// 2. Plan mensuel
// ===========================================================================

function FormulaireMois({ cycleId, plan }: { cycleId: string; plan: PlanMoisVue }) {
  const [etat, action] = useActionState(enregistrerPlanMensuel, ETAT_INITIAL)

  return (
    <form action={action} className="rounded-xl border border-subtle p-4 space-y-2.5">
      <input type="hidden" name="cycleId" value={cycleId} />
      <input type="hidden" name="monthNumber" value={plan.monthNumber} />
      <p className="text-xs font-bold text-muted">Mois {plan.monthNumber}</p>
      <Champ nom="theme" idUnique={`theme-${plan.monthNumber}`} libelle="Theme du mois" maxLength={120}
             defaultValue={plan.theme ?? ''} placeholder="Structurer l'offre" />
      <Champ nom="caTarget" idUnique={`caTarget-${plan.monthNumber}`} libelle="CA vise (€)" inputMode="decimal"
             defaultValue={plan.caTargetHt ? String(plan.caTargetHt / 100) : ''} />
      <ZoneTexte nom="notes" idUnique={`notes-${plan.monthNumber}`} libelle="Notes" rows={2} maxLength={600}
                 defaultValue={plan.notes ?? ''} />
      <BoutonSoumettre variante="discret">Enregistrer</BoutonSoumettre>
      <Retour etat={etat} />
    </form>
  )
}

export function SectionPlanMensuel({ cycleId, plans }: { cycleId: string; plans: PlanMoisVue[] }) {
  return (
    <Carte titre="Plan mensuel" sousTitre="Les trois mois du cycle, cote a cote">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {plans.map((p) => (
          <FormulaireMois key={p.monthNumber} cycleId={cycleId} plan={p} />
        ))}
      </div>
    </Carte>
  )
}

// ===========================================================================
// 3. Semaines et revue
// ===========================================================================

function LigneSemaine({ semaine }: { semaine: SemaineVue }) {
  const [etatFocus, actionFocus] = useActionState(enregistrerFocusSemaine, ETAT_INITIAL)
  const [etatRevue, actionRevue] = useActionState(enregistrerRevue, ETAT_INITIAL)

  return (
    <details className={`rounded-xl border ${semaine.estCourante ? 'border-positive bg-positive-soft/40' : 'border-subtle'}`}>
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-muted rounded-xl">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-xs font-bold w-16 shrink-0 ${semaine.estCourante ? 'text-positive-ink' : 'text-muted'}`}>
            Sem. {semaine.weekNumber}
          </span>
          <span className="text-sm text-ink-soft truncate">
            {semaine.focusTitle || <span className="text-disabled">Aucun focus defini</span>}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {semaine.revue && <Etiquette texte="Revue faite" ton="succes" />}
          {semaine.debut && <span className="text-xs text-ghost">{semaine.debut}</span>}
        </div>
      </summary>

      <div className="px-4 pb-4 pt-1 space-y-3 border-t border-faint">
        <form action={actionFocus} className="flex items-end gap-2">
          <input type="hidden" name="weekId" value={semaine.id} />
          <div className="flex-1">
            <Champ nom="focusTitle" idUnique={`focus-${semaine.id}`} libelle="Focus de la semaine"
                   maxLength={160} defaultValue={semaine.focusTitle ?? ''} />
          </div>
          <BoutonSoumettre variante="discret">Enregistrer</BoutonSoumettre>
        </form>
        <Retour etat={etatFocus} />

        <form action={actionRevue} className="space-y-2.5 pt-2 border-t border-faint">
          <input type="hidden" name="weekId" value={semaine.id} />
          <p className="text-xs font-bold text-muted">Revue de la semaine</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ZoneTexte nom="whatWorks" idUnique={`works-${semaine.id}`} libelle="Ce qui marche" rows={2}
                       maxLength={600} defaultValue={semaine.revue?.whatWorks ?? ''} />
            <ZoneTexte nom="whatBlocks" idUnique={`blocks-${semaine.id}`} libelle="Ce qui bloque" rows={2}
                       maxLength={600} defaultValue={semaine.revue?.whatBlocks ?? ''} />
            <ZoneTexte nom="adjustments" idUnique={`adjust-${semaine.id}`} libelle="Mes ajustements" rows={2}
                       maxLength={600} defaultValue={semaine.revue?.adjustments ?? ''} />
          </div>
          <BoutonSoumettre variante="discret">Enregistrer la revue</BoutonSoumettre>
          <Retour etat={etatRevue} />
        </form>
      </div>
    </details>
  )
}

export function SectionSemaines({ semaines }: { semaines: SemaineVue[] }) {
  return (
    <Carte titre="Plan hebdomadaire" sousTitre="Douze semaines, un focus et une revue chacune">
      <div className="space-y-2">
        {semaines.map((s) => <LigneSemaine key={s.id} semaine={s} />)}
      </div>
    </Carte>
  )
}

// ===========================================================================
// 4. Le cockpit du jour
// ===========================================================================

export function SectionTaches({
  taches,
  priorites,
}: {
  taches: TacheVue[]
  priorites: PrioriteVue[]
}) {
  const [etat, action] = useActionState(creerTache, ETAT_INITIAL)
  const aujourdhui = new Date().toISOString().slice(0, 10)

  const aFaire = taches.filter((t) => !t.done)
  const faites = taches.filter((t) => t.done)
  const pct = taches.length > 0 ? Math.round((faites.length / taches.length) * 100) : 0

  const Ligne = ({ t }: { t: TacheVue }) => (
    <div className="group flex items-center gap-3 rounded-xl border border-subtle px-4 py-3">
      <form action={basculerTache}>
        <input type="hidden" name="id" value={t.id} />
        <button
          type="submit"
          aria-label={t.done ? `Rouvrir ${t.label}` : `Terminer ${t.label}`}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            t.done ? 'bg-accent border-accent text-on-accent' : 'border-firm hover:border-accent'
          }`}
        >
          {t.done && <span className="text-[11px] leading-none">✓</span>}
        </button>
      </form>

      <div className="flex-1 min-w-0">
        <div className={`text-sm ${t.done ? 'text-ghost line-through' : 'text-ink-soft font-medium'}`}>
          <TexteEditable
            action={modifierTache}
            id={t.id}
            valeur={t.label}
            intitule="Modifier le libelle de la tache"
          />
        </div>
        {t.prioriteTitre && (
          <p className="text-xs text-accent mt-0.5">↳ {t.prioriteTitre}</p>
        )}
      </div>

      {t.echeance && <span className="text-xs text-ghost shrink-0">{t.echeance}</span>}
      <Etiquette texte={libelleDe(ETIQUETTES_TACHE, t.tag)} ton={TON_TAG[t.tag] ?? 'neutre'} />
      <BoutonSuppression action={supprimerTache} id={t.id} intitule={`Supprimer ${t.label}`} />
    </div>
  )

  return (
    <Carte
      titre="Mon cockpit du jour"
      sousTitre="Chaque tache peut se rattacher a une priorite du cycle — c'est le pont entre la strategie et le quotidien"
      action={
        taches.length > 0 ? (
          <div className="text-right">
            <p className="text-2xl font-extrabold text-accent-ink">{pct} %</p>
            <p className="text-[11px] text-ghost">{faites.length} sur {taches.length}</p>
          </div>
        ) : undefined
      }
    >
      {taches.length > 0 ? (
        <div className="space-y-2 mb-4">
          {aFaire.map((t) => <Ligne key={t.id} t={t} />)}
          {faites.length > 0 && (
            <>
              <p className="text-xs font-bold text-ghost pt-2">Terminees</p>
              {faites.map((t) => <Ligne key={t.id} t={t} />)}
            </>
          )}
        </div>
      ) : (
        <Vide texte="Aucune tache. Commencez par celle qui fait avancer une priorite du cycle." />
      )}

      <PanneauAjout intitule="Ajouter une tache" etat={etat}>
        <form action={action} className="space-y-3">
          <Champ nom="label" libelle="Que voulez-vous accomplir ?" required maxLength={200}
                 erreur={etat.erreurs?.label} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Liste nom="tag" libelle="Categorie" options={ETIQUETTES_TACHE} defaultValue="DIVERS" />
            <Liste
              nom="objectiveId" libelle="Rattacher a une priorite"
              options={[
                { valeur: '', libelle: '— tache libre —' },
                ...priorites.map((p) => ({ valeur: p.id, libelle: p.title })),
              ]}
            />
            <Champ nom="dueDate" libelle="Echeance" type="date" defaultValue={aujourdhui} />
          </div>
          <BoutonSoumettre>Ajouter</BoutonSoumettre>
          <Retour etat={etat} />
          <p className="text-xs text-ghost">
            Une tache rattachee a une priorite fait avancer sa progression automatiquement.
          </p>
        </form>
      </PanneauAjout>
    </Carte>
  )
}
