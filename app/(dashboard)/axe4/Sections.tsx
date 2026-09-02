'use client'

import { useActionState } from 'react'
import {
  Carte, Vide, Etiquette, Champ, ZoneTexte, Liste, BoutonSoumettre, BoutonSuppression, TexteEditable, Retour, PanneauAjout, ETAT_INITIAL,
} from '@/components/ui'
import { euros } from '@/lib/format'
import {
  creerProbleme, supprimerProbleme, modifierProbleme,
  creerThematique, supprimerThematique, modifierThematique,
  creerIdeeContenu, changerStatutContenu, supprimerIdeeContenu, modifierIdeeContenu,
  modifierProspect,
  creerProspect, deplacerProspect, supprimerProspect,
} from './actions'

// --- Listes de valeurs, reprises de la version Notion ----------------------

export const TYPES_CONTENU = [
  { valeur: 'EDUCATION', libelle: 'Education' },
  { valeur: 'CONNEXION', libelle: 'Connexion' },
  { valeur: 'PREUVE', libelle: 'Preuve' },
  { valeur: 'CONVERSION', libelle: 'Conversion' },
  { valeur: 'VENTE', libelle: 'Vente' },
]

export const FORMATS_CONTENU = [
  { valeur: 'POST', libelle: 'Post' },
  { valeur: 'CARROUSEL', libelle: 'Carrousel' },
  { valeur: 'REEL', libelle: 'Reel' },
  { valeur: 'STORY', libelle: 'Story' },
  { valeur: 'VIDEO', libelle: 'Video' },
  { valeur: 'EMAIL', libelle: 'Email' },
  { valeur: 'PODCAST', libelle: 'Podcast' },
  { valeur: 'WEBINAIRE', libelle: 'Webinaire' },
]

export const OBJECTIFS = [
  { valeur: 'ATTIRER', libelle: 'Attirer' },
  { valeur: 'NOURRIR', libelle: 'Nourrir' },
  { valeur: 'VENDRE', libelle: 'Vendre' },
]

export const STATUTS_CONTENU = [
  { valeur: 'IDEE', libelle: 'Idee' },
  { valeur: 'A_CREER', libelle: 'A creer' },
  { valeur: 'PUBLIE', libelle: 'Publie' },
]

/** Le pipeline compte quatre etapes, conformement au dossier professionnel. */
export const ETAPES = [
  { valeur: 'DECOUVERTE', libelle: 'Decouverte', teinte: 'border-firm', fond: 'bg-surface-muted' },
  { valeur: 'QUALIFICATION', libelle: 'Qualification', teinte: 'border-accent', fond: 'bg-accent-soft' },
  { valeur: 'PROPOSITION', libelle: 'Proposition', teinte: 'border-warning', fond: 'bg-warning-soft/60' },
  { valeur: 'SIGNE', libelle: 'Signe', teinte: 'border-positive', fond: 'bg-positive-soft/60' },
] as const

const libelleDe = (liste: { valeur: string; libelle: string }[], v: string) =>
  liste.find((o) => o.valeur === v)?.libelle ?? v

// --- Types transmis par la page serveur ------------------------------------

export type ProblemeVue = {
  id: string
  problem: string
  question: string | null
  understanding: string | null
  topic: string | null
  angle: string | null
}

export type ThematiqueVue = {
  id: string
  label: string
  whyImportant: string | null
  linkToOffer: string | null
  nombreIdees: number
}

export type IdeeVue = {
  id: string
  subject: string
  themeLabel: string | null
  contentType: string
  format: string
  platform: string | null
  marketingGoal: string
  weekNumber: number | null
  status: string
}

export type ProspectVue = {
  id: string
  companyName: string
  contactName: string | null
  estimatedHt: number
  source: string | null
  stage: string
  echeance: string | null
  notes: string | null
}

// ===========================================================================
// 1. Ce qui interesse vraiment mon client
// ===========================================================================

export function SectionProblemes({ problemes }: { problemes: ProblemeVue[] }) {
  const [etat, action] = useActionState(creerProbleme, ETAT_INITIAL)

  return (
    <Carte
      titre="Ce qui interesse vraiment mon client"
      sousTitre="Du probleme vecu jusqu'a l'angle de contenu — c'est la matiere premiere de tout le reste"
    >
      {problemes.length > 0 ? (
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-muted border-b border-subtle">
                <th className="pb-2 pr-3">Probleme vecu</th>
                <th className="pb-2 pr-3">Question qu&apos;il se pose</th>
                <th className="pb-2 pr-3">Ce qu&apos;il cherche a comprendre</th>
                <th className="pb-2 pr-3">Sujet</th>
                <th className="pb-2 pr-3">Angle</th>
                <th className="pb-2 w-8" />
              </tr>
            </thead>
            <tbody>
              {problemes.map((p) => (
                <tr key={p.id} className="group border-b border-faint last:border-0 align-top">
                  <td className="py-2.5 pr-3 text-ink-soft font-medium">
                    <TexteEditable
                      action={modifierProbleme}
                      id={p.id}
                      valeur={p.problem}
                      intitule="Modifier ce probleme client"
                    />
                  </td>
                  <td className="py-2.5 pr-3 text-muted">{p.question ?? '—'}</td>
                  <td className="py-2.5 pr-3 text-muted">{p.understanding ?? '—'}</td>
                  <td className="py-2.5 pr-3 text-muted">{p.topic ?? '—'}</td>
                  <td className="py-2.5 pr-3 text-muted">{p.angle ?? '—'}</td>
                  <td className="py-2.5">
                    <BoutonSuppression action={supprimerProbleme} id={p.id} intitule="Supprimer cette ligne" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Vide texte="Aucune ligne. Partez d'un probleme reel entendu chez un client." />
      )}

      <PanneauAjout intitule="Ajouter une ligne" etat={etat}>
        <form action={action} className="space-y-3">
          <Champ nom="problem" libelle="Probleme vecu par mon client" required maxLength={240}
                 erreur={etat.erreurs?.problem} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Champ nom="question" libelle="Question qu'il se pose" maxLength={240} />
            <Champ nom="understanding" libelle="Ce qu'il cherche a comprendre" maxLength={240} />
            <Champ nom="topic" libelle="Sujet de contenu" maxLength={240} />
            <Champ nom="angle" libelle="Angle" maxLength={240} />
          </div>
          <BoutonSoumettre>Ajouter</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </PanneauAjout>
    </Carte>
  )
}

// ===========================================================================
// 2. Thematiques
// ===========================================================================

export function SectionThematiques({ thematiques }: { thematiques: ThematiqueVue[] }) {
  const [etat, action] = useActionState(creerThematique, ETAT_INITIAL)

  return (
    <Carte
      titre="Mes grandes thematiques"
      sousTitre="Trois a cinq, pas davantage — au-dela le message se dilue"
    >
      {thematiques.length > 0 ? (
        <div className="space-y-2 mb-4">
          {thematiques.map((t) => (
            <div key={t.id} className="group rounded-xl border border-subtle px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-soft">
                    <TexteEditable
                      action={modifierThematique}
                      id={t.id}
                      valeur={t.label}
                      intitule="Modifier le nom de la thematique"
                    />
                  </div>
                  {t.whyImportant && (
                    <p className="text-xs text-muted mt-1">
                      <span className="text-ghost">Pourquoi c&apos;est important : </span>
                      {t.whyImportant}
                    </p>
                  )}
                  {t.linkToOffer && (
                    <p className="text-xs text-muted mt-0.5">
                      <span className="text-ghost">Lien avec l&apos;offre : </span>
                      {t.linkToOffer}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Etiquette texte={`${t.nombreIdees} contenu${t.nombreIdees > 1 ? 's' : ''}`} ton="info" />
                  <BoutonSuppression action={supprimerThematique} id={t.id} intitule={`Supprimer ${t.label}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Vide texte="Aucune thematique definie." />
      )}

      {thematiques.length < 5 && (
        <PanneauAjout intitule="Ajouter une thematique" etat={etat}>
          <form action={action} className="space-y-3">
            <Champ nom="label" libelle="Thematique principale" required maxLength={120}
                   erreur={etat.erreurs?.label} />
            <Champ nom="whyImportant" libelle="Pourquoi ce sujet est important pour mon client" maxLength={300} />
            <Champ nom="linkToOffer" libelle="Lien avec mon offre" maxLength={300} />
            <BoutonSoumettre>Ajouter</BoutonSoumettre>
            <Retour etat={etat} />
          </form>
        </PanneauAjout>
      )}
    </Carte>
  )
}

// ===========================================================================
// 3. Calendrier editorial
// ===========================================================================

/** Le statut se lit d'un coup d'oeil sur le liseret gauche de la carte. */
const LISERET_STATUT: Record<string, string> = {
  PUBLIE: 'border-l-teal-400',
  A_CREER: 'border-l-amber-400',
  IDEE: 'border-l-slate-300',
}

function CarteIdee({ idee }: { idee: IdeeVue }) {
  return (
    <div
      className={`group rounded-lg border border-subtle border-l-[3px] bg-surface px-3 py-2.5 ${
        LISERET_STATUT[idee.status] ?? LISERET_STATUT.IDEE
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm font-medium text-ink-soft leading-snug min-w-0">
          <TexteEditable
            action={modifierIdeeContenu}
            id={idee.id}
            valeur={idee.subject}
            intitule="Modifier le sujet du contenu"
          />
        </div>
        <BoutonSuppression action={supprimerIdeeContenu} id={idee.id} intitule="Supprimer ce contenu" />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        <Etiquette texte={libelleDe(FORMATS_CONTENU, idee.format)} ton="neutre" />
        <Etiquette texte={libelleDe(OBJECTIFS, idee.marketingGoal)} ton="info" />
        {idee.platform && <span className="text-[11px] text-ghost">{idee.platform}</span>}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-faint">
        <span className="text-[11px] text-ghost">
          {libelleDe(TYPES_CONTENU, idee.contentType)}
          {idee.themeLabel && ` · ${idee.themeLabel}`}
        </span>
        <form action={changerStatutContenu}>
          <input type="hidden" name="id" value={idee.id} />
          <select
            name="status" defaultValue={idee.status}
            onChange={(e) => e.currentTarget.form?.requestSubmit()}
            aria-label={`Statut de ${idee.subject}`}
            className="text-[11px] px-1.5 py-0.5 rounded border border-subtle bg-surface
                       focus:outline-none focus:border-accent"
          >
            {STATUTS_CONTENU.map((s) => (
              <option key={s.valeur} value={s.valeur}>{s.libelle}</option>
            ))}
          </select>
        </form>
      </div>
    </div>
  )
}

export function SectionCalendrier({
  idees,
  thematiques,
}: {
  idees: IdeeVue[]
  thematiques: ThematiqueVue[]
}) {
  const [etat, action] = useActionState(creerIdeeContenu, ETAT_INITIAL)
  const nonPlanifiees = idees.filter((i) => !i.weekNumber)

  return (
    <Carte
      titre="Calendrier editorial"
      sousTitre="Les quatre semaines du mois, plus les idees en attente de creneau"
      action={<Etiquette texte={`${idees.filter((i) => i.status === 'PUBLIE').length} publie(s)`} ton="succes" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {[1, 2, 3, 4].map((semaine) => {
          const duCreneau = idees.filter((i) => i.weekNumber === semaine)
          return (
            <div key={semaine} className="rounded-xl bg-surface-muted border border-subtle p-3">
              <p className="text-xs font-bold text-muted mb-2.5">Semaine {semaine}</p>
              <div className="space-y-2">
                {duCreneau.length > 0
                  ? duCreneau.map((i) => <CarteIdee key={i.id} idee={i} />)
                  : <p className="text-xs text-disabled text-center py-4">Vide</p>}
              </div>
            </div>
          )
        })}
      </div>

      {nonPlanifiees.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-bold text-muted mb-2">Sans creneau</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
            {nonPlanifiees.map((i) => <CarteIdee key={i.id} idee={i} />)}
          </div>
        </div>
      )}

      <PanneauAjout intitule="Ajouter une idee de contenu" etat={etat}>
        <form action={action} className="space-y-3">
          <Champ nom="subject" libelle="Sujet de contenu" required maxLength={200}
                 placeholder="Les 3 erreurs de pilotage financier en TPE" erreur={etat.erreurs?.subject} />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Liste nom="contentType" libelle="Type" options={TYPES_CONTENU} defaultValue="EDUCATION" />
            <Liste nom="format" libelle="Format" options={FORMATS_CONTENU} defaultValue="POST" />
            <Liste nom="marketingGoal" libelle="Objectif" options={OBJECTIFS} defaultValue="ATTIRER" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Champ nom="platform" libelle="Plateforme" maxLength={60} placeholder="LinkedIn" />
            <Liste
              nom="themeId" libelle="Thematique"
              options={[{ valeur: '', libelle: '— aucune —' },
                        ...thematiques.map((t) => ({ valeur: t.id, libelle: t.label }))]}
            />
            <Liste
              nom="weekNumber" libelle="Semaine"
              options={[{ valeur: '', libelle: '— sans creneau —' },
                        ...[1, 2, 3, 4].map((n) => ({ valeur: String(n), libelle: `Semaine ${n}` }))]}
            />
            <Liste nom="status" libelle="Statut" options={STATUTS_CONTENU} defaultValue="IDEE" />
          </div>
          <BoutonSoumettre>Ajouter au calendrier</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </PanneauAjout>
    </Carte>
  )
}

// ===========================================================================
// 4. Pipeline commercial
// ===========================================================================

export function SectionPipeline({ prospects }: { prospects: ProspectVue[] }) {
  const [etat, action] = useActionState(creerProspect, ETAT_INITIAL)

  return (
    <Carte
      titre="Pipeline commercial"
      sousTitre="Quatre etapes. Deplacez une carte en changeant son etape."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {ETAPES.map((etape) => {
          const colonne = prospects.filter((p) => p.stage === etape.valeur)
          const total = colonne.reduce((s, p) => s + p.estimatedHt, 0)

          return (
            <div key={etape.valeur} className={`rounded-xl border ${etape.teinte} ${etape.fond} p-3`}>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold text-muted">{etape.libelle}</p>
                <span className="text-[11px] font-semibold text-muted">{colonne.length}</span>
              </div>

              <div className="space-y-2">
                {colonne.length > 0 ? (
                  colonne.map((p) => (
                    <div key={p.id} className="group rounded-lg bg-surface border border-subtle px-3 py-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-ink-soft">
                            <TexteEditable
                              action={modifierProspect}
                              id={p.id}
                              valeur={p.companyName}
                              intitule="Modifier le nom du prospect"
                            />
                          </div>
                          {p.contactName && <p className="text-xs text-muted">{p.contactName}</p>}
                        </div>
                        <BoutonSuppression action={supprimerProspect} id={p.id} intitule={`Supprimer ${p.companyName}`} />
                      </div>

                      <p className="text-base font-extrabold text-ink-soft mt-1.5">{euros(p.estimatedHt)}</p>

                      <div className="flex items-center justify-between gap-2 mt-2">
                        {p.source && <span className="text-[11px] text-ghost truncate">{p.source}</span>}
                        {p.echeance && <span className="text-[11px] text-ghost">{p.echeance}</span>}
                      </div>

                      <form action={deplacerProspect} className="mt-2">
                        <input type="hidden" name="id" value={p.id} />
                        <select
                          name="stage" defaultValue={p.stage}
                          onChange={(e) => e.currentTarget.form?.requestSubmit()}
                          aria-label={`Etape de ${p.companyName}`}
                          className="w-full text-[11px] px-1.5 py-1 rounded border border-subtle bg-surface
                                     focus:outline-none focus:border-accent"
                        >
                          {ETAPES.map((e) => (
                            <option key={e.valeur} value={e.valeur}>{e.libelle}</option>
                          ))}
                        </select>
                      </form>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-disabled text-center py-4">Vide</p>
                )}
              </div>

              {total > 0 && (
                <p className="text-[11px] font-semibold text-muted mt-2.5 pt-2 border-t border-subtle">
                  {euros(total)}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <PanneauAjout intitule="Ajouter un prospect" etat={etat}>
        <form action={action} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Champ nom="companyName" libelle="Entreprise" required maxLength={120}
                   erreur={etat.erreurs?.companyName} />
            <Champ nom="contactName" libelle="Contact" maxLength={80} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Champ nom="estimated" libelle="Montant estime HT (€)" inputMode="decimal" required
                   erreur={etat.erreurs?.estimated} />
            <Champ nom="source" libelle="Source" maxLength={60} placeholder="LinkedIn, recommandation..." />
            <Liste nom="stage" libelle="Etape" options={ETAPES.map((e) => ({ valeur: e.valeur, libelle: e.libelle }))}
                   defaultValue="DECOUVERTE" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Champ nom="expectedCloseDate" libelle="Echeance esperee" type="date" />
            <ZoneTexte nom="notes" libelle="Notes" maxLength={600} rows={2} />
          </div>
          <BoutonSoumettre>Ajouter au pipeline</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </PanneauAjout>
    </Carte>
  )
}
