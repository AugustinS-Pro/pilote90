'use client'

import { useActionState } from 'react'
import {
  Carte, Vide, Etiquette, Champ, ZoneTexte, Liste, BoutonSoumettre, BoutonSuppression, TexteEditable, Retour, PanneauAjout, ETAT_INITIAL,
} from '@/components/ui'
import { euros } from '@/lib/format'
import {
  enregistrerPersona, supprimerPersona,
  creerOffre, changerStatutOffre, supprimerOffre, modifierOffre,
  creerNiveauOffre, supprimerNiveauOffre,
  enregistrerFicheClient, supprimerFicheClient,
  enregistrerAchat, enregistrerRetour, supprimerRetour,
} from './actions'

// --- Listes de valeurs, reprises telles quelles de la version Notion --------

export const FORMATS = [
  { valeur: 'SERVICE', libelle: 'Service' },
  { valeur: 'ATELIER', libelle: 'Atelier' },
  { valeur: 'PRODUIT_DIGITAL', libelle: 'Produit digital' },
  { valeur: 'COACHING', libelle: 'Coaching' },
  { valeur: 'PROGRAMME', libelle: 'Programme' },
]

export const STATUTS_OFFRE = [
  { valeur: 'IDEE', libelle: 'Idee' },
  { valeur: 'EN_TEST', libelle: 'En test' },
  { valeur: 'ACTIF', libelle: 'Actif' },
  { valeur: 'A_AMELIORER', libelle: 'A ameliorer' },
  { valeur: 'ABANDONNE', libelle: 'Abandonne' },
]

const TON_STATUT: Record<string, 'succes' | 'attente' | 'alerte' | 'info' | 'neutre'> = {
  ACTIF: 'succes',
  EN_TEST: 'attente',
  A_AMELIORER: 'attente',
  ABANDONNE: 'neutre',
  IDEE: 'info',
}

export const STATUTS_CLIENT = [
  { valeur: 'PROSPECT', libelle: 'Prospect' },
  { valeur: 'ACTIF', libelle: 'Client actif' },
  { valeur: 'TERMINE', libelle: 'Mission terminee' },
  { valeur: 'INACTIF', libelle: 'Inactif' },
]

const libelleDe = (liste: { valeur: string; libelle: string }[], valeur: string) =>
  liste.find((o) => o.valeur === valeur)?.libelle ?? valeur

// --- Types transmis par la page serveur ------------------------------------

export type PersonaVue = {
  id: string
  name: string
  dailyLife: string | null
  frustrations: string | null
  desires: string | null
  objections: string | null
  transformation: string | null
  magicSentence: string | null
}

export type OffreVue = {
  id: string
  name: string
  promise: string | null
  priceHt: number
  format: string
  status: string
  personaNom: string | null
  ventes: number
  caGenere: number
}

export type NiveauVue = { id: string; level: string; offerName: string; price: string | null; goal: string | null }

export type FicheVue = {
  id: string
  companyName: string
  contactName: string | null
  email: string | null
  phone: string | null
  status: string
  notes: string | null
  totalAchats: number
  nombreAchats: number
  dernierAchat: string | null
}

export type RetourVue = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  clientNom: string | null
  offreNom: string | null
}

// ===========================================================================
// 1. Mon client ideal
// ===========================================================================

function FormulairePersona({ persona, onFini }: { persona?: PersonaVue; onFini?: () => void }) {
  const [etat, action] = useActionState(enregistrerPersona, ETAT_INITIAL)
  if (etat.ok && onFini) onFini()

  return (
    <form action={action} className="space-y-3">
      {persona && <input type="hidden" name="id" value={persona.id} />}
      <Champ nom="name" libelle="Nom du persona" defaultValue={persona?.name} required maxLength={80}
             placeholder="Marie, dirigeante de TPE" erreur={etat.erreurs?.name} />
      <ZoneTexte nom="dailyLife" libelle="Qui est-elle aujourd'hui ?" defaultValue={persona?.dailyLife ?? ''}
                 placeholder="Que fait-elle, quelle est sa situation, a quoi ressemble son quotidien ?" />
      <ZoneTexte nom="frustrations" libelle="Ses frustrations" defaultValue={persona?.frustrations ?? ''}
                 placeholder="Qu'est-ce qui la bloque, la fatigue, ne fonctionne pas ?" />
      <ZoneTexte nom="desires" libelle="Ses desirs" defaultValue={persona?.desires ?? ''}
                 placeholder="Qu'est-ce qu'elle veut vraiment ? A quoi ressemblerait sa reussite ?" />
      <ZoneTexte nom="objections" libelle="Ses objections" defaultValue={persona?.objections ?? ''}
                 placeholder="Pourquoi ne passe-t-elle pas a l'action ? Qu'est-ce qui la freine ?" />
      <ZoneTexte nom="transformation" libelle="La transformation" defaultValue={persona?.transformation ?? ''}
                 placeholder="Ou est-elle aujourd'hui, ou sera-t-elle apres votre aide ?" />
      <Champ nom="magicSentence" libelle="Ma phrase magique" defaultValue={persona?.magicSentence ?? ''}
             placeholder="J'aide ................ a ................" maxLength={240} />
      <div className="flex items-center gap-2">
        <BoutonSoumettre>{persona ? 'Mettre a jour' : 'Enregistrer le persona'}</BoutonSoumettre>
      </div>
      <Retour etat={etat} />
    </form>
  )
}

export function SectionPersona({ personas }: { personas: PersonaVue[] }) {
  const [etat] = useActionState(enregistrerPersona, ETAT_INITIAL)

  return (
    <Carte titre="Mon client ideal" sousTitre="Le persona guide toutes les decisions d'offre et de contenu">
      {personas.length > 0 ? (
        <div className="space-y-3 mb-4">
          {personas.map((p) => (
            <details key={p.id} className="group rounded-xl border border-subtle overflow-hidden">
              <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-muted">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-soft">{p.name}</p>
                  {p.magicSentence && (
                    <p className="text-xs text-muted mt-0.5 truncate">{p.magicSentence}</p>
                  )}
                </div>
                <BoutonSuppression action={supprimerPersona} id={p.id} intitule={`Supprimer ${p.name}`} />
              </summary>
              <div className="px-4 pb-4 pt-1 border-t border-faint bg-surface-muted">
                <FormulairePersona persona={p} />
              </div>
            </details>
          ))}
        </div>
      ) : (
        <Vide texte="Aucun persona defini. Commencez par decrire la personne que vous aidez." />
      )}

      <PanneauAjout intitule="Ajouter un persona" etat={etat}>
        <FormulairePersona />
      </PanneauAjout>
    </Carte>
  )
}

// ===========================================================================
// 2. Catalogue d'offres
// ===========================================================================

export function SectionOffres({ offres, personas }: { offres: OffreVue[]; personas: PersonaVue[] }) {
  const [etat, action] = useActionState(creerOffre, ETAT_INITIAL)

  return (
    <Carte titre="Mes offres" sousTitre="Le catalogue de ce que vous vendez, et ce que chaque offre a rapporte">
      {offres.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {offres.map((o) => (
            <div key={o.id} className="group rounded-xl border border-subtle p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-ink-soft">
                    <TexteEditable
                      action={modifierOffre}
                      id={o.id}
                      valeur={o.name}
                      intitule="Modifier le nom de l offre"
                    />
                  </div>
                  <p className="text-xs text-ghost mt-0.5">
                    {libelleDe(FORMATS, o.format)}
                    {o.personaNom && ` · pour ${o.personaNom}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Etiquette texte={libelleDe(STATUTS_OFFRE, o.status)} ton={TON_STATUT[o.status] ?? 'neutre'} />
                  <BoutonSuppression action={supprimerOffre} id={o.id} intitule={`Supprimer ${o.name}`} />
                </div>
              </div>

              {o.promise && <p className="text-xs text-muted mb-3 leading-relaxed">{o.promise}</p>}

              <p className="text-xl font-extrabold text-accent-ink">{euros(o.priceHt)}</p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-faint">
                <p className="text-xs text-muted">
                  {o.ventes} vente{o.ventes > 1 ? 's' : ''} ·{' '}
                  <span className="font-semibold text-ink-soft">{euros(o.caGenere)}</span> genere
                </p>
                <form action={changerStatutOffre}>
                  <input type="hidden" name="id" value={o.id} />
                  <select
                    name="status" defaultValue={o.status}
                    onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    aria-label={`Statut de ${o.name}`}
                    className="text-xs px-2 py-1 rounded-md border border-subtle bg-surface
                               focus:outline-none focus:border-accent"
                  >
                    {STATUTS_OFFRE.map((s) => (
                      <option key={s.valeur} value={s.valeur}>{s.libelle}</option>
                    ))}
                  </select>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Vide texte="Aucune offre au catalogue." />
      )}

      <PanneauAjout intitule="Ajouter une offre" etat={etat}>
        <form action={action} className="space-y-3">
          <Champ nom="name" libelle="Offre" required maxLength={120} placeholder="Accompagnement Pilotage 90 jours"
                 erreur={etat.erreurs?.name} />
          <Champ nom="promise" libelle="Promesse" maxLength={300} placeholder="Ce que le client obtient concretement" />
          <div className="grid grid-cols-2 gap-3">
            <Champ nom="price" libelle="Prix HT (€)" inputMode="decimal" required placeholder="1500"
                   erreur={etat.erreurs?.price} />
            <Liste nom="format" libelle="Format" options={FORMATS} defaultValue="SERVICE" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Liste nom="status" libelle="Statut" options={STATUTS_OFFRE} defaultValue="IDEE" />
            <Liste
              nom="personaId" libelle="Pour quel persona ?"
              options={[{ valeur: '', libelle: '— aucun —' },
                        ...personas.map((p) => ({ valeur: p.id, libelle: p.name }))]}
            />
          </div>
          <BoutonSoumettre>Ajouter au catalogue</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </PanneauAjout>
    </Carte>
  )
}

// ===========================================================================
// 3. Architecture de gamme
// ===========================================================================

export function SectionArchitecture({ niveaux }: { niveaux: NiveauVue[] }) {
  const [etat, action] = useActionState(creerNiveauOffre, ETAT_INITIAL)

  return (
    <Carte titre="Architecture de mes offres" sousTitre="Du produit d'appel a l'offre premium">
      {niveaux.length > 0 ? (
        <div className="space-y-2 mb-4">
          {niveaux.map((n) => (
            <div key={n.id} className="group flex items-center justify-between gap-3 rounded-xl border border-subtle px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Etiquette texte={n.level} ton="info" />
                  <p className="text-sm font-semibold text-ink-soft truncate">{n.offerName}</p>
                </div>
                {n.goal && <p className="text-xs text-muted mt-1">{n.goal}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {n.price && <span className="text-sm font-bold text-ink-soft">{n.price}</span>}
                <BoutonSuppression action={supprimerNiveauOffre} id={n.id} intitule="Supprimer ce niveau" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Vide texte="Aucun niveau defini." />
      )}

      <PanneauAjout intitule="Ajouter un niveau" etat={etat}>
        <form action={action} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Champ nom="level" libelle="Niveau" required maxLength={40} placeholder="Entree de gamme"
                   erreur={etat.erreurs?.level} />
            <Champ nom="price" libelle="Prix affiche" maxLength={40} placeholder="490 € ou 49 €/mois" />
          </div>
          <Champ nom="offerName" libelle="Nom de l'offre" required maxLength={120} erreur={etat.erreurs?.offerName} />
          <Champ nom="goal" libelle="Objectif de cette offre" maxLength={240}
                 placeholder="Faire entrer un nouveau client dans l'univers" />
          <BoutonSoumettre>Ajouter</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </PanneauAjout>
    </Carte>
  )
}

// ===========================================================================
// 4. Mini-CRM
// ===========================================================================

export function SectionClients({ fiches, offres }: { fiches: FicheVue[]; offres: OffreVue[] }) {
  const [etatFiche, actionFiche] = useActionState(enregistrerFicheClient, ETAT_INITIAL)
  const [etatAchat, actionAchat] = useActionState(enregistrerAchat, ETAT_INITIAL)
  const aujourdhui = new Date().toISOString().slice(0, 10)

  return (
    <Carte titre="Mes clients" sousTitre="Fiches, historique d'achats et suivi — la partie que le Notion n'a pas">
      {fiches.length > 0 ? (
        <div className="space-y-2 mb-4">
          {fiches.map((f) => (
            <div key={f.id} className="group rounded-xl border border-subtle px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-ink-soft">{f.companyName}</p>
                    <Etiquette
                      texte={libelleDe(STATUTS_CLIENT, f.status)}
                      ton={f.status === 'ACTIF' ? 'succes' : f.status === 'PROSPECT' ? 'info' : 'neutre'}
                    />
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    {[f.contactName, f.email, f.phone].filter(Boolean).join(' · ') || 'Aucun contact renseigne'}
                  </p>
                  {f.notes && <p className="text-xs text-ghost mt-1.5 leading-relaxed">{f.notes}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-positive">{euros(f.totalAchats)}</p>
                  <p className="text-[11px] text-ghost">
                    {f.nombreAchats} achat{f.nombreAchats > 1 ? 's' : ''}
                    {f.dernierAchat && ` · ${f.dernierAchat}`}
                  </p>
                  <div className="flex justify-end mt-1">
                    <BoutonSuppression action={supprimerFicheClient} id={f.id} intitule={`Supprimer ${f.companyName}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Vide texte="Aucune fiche client." />
      )}

      <div className="space-y-3">
        <PanneauAjout intitule="Ajouter un client" etat={etatFiche}>
          <form action={actionFiche} className="space-y-3">
            <Champ nom="companyName" libelle="Nom / entreprise" required maxLength={120}
                   erreur={etatFiche.erreurs?.companyName} />
            <div className="grid grid-cols-2 gap-3">
              <Champ nom="contactName" libelle="Contact" maxLength={80} />
              <Liste nom="status" libelle="Statut" options={STATUTS_CLIENT} defaultValue="PROSPECT" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Champ nom="email" libelle="Email" type="email" maxLength={160} />
              <Champ nom="phone" libelle="Telephone" maxLength={40} />
            </div>
            <ZoneTexte nom="notes" libelle="Notes de suivi" maxLength={1000} />
            <BoutonSoumettre>Enregistrer la fiche</BoutonSoumettre>
            <Retour etat={etatFiche} />
          </form>
        </PanneauAjout>

        {fiches.length > 0 && (
          <PanneauAjout intitule="Enregistrer un achat" etat={etatAchat}>
            <form action={actionAchat} className="space-y-3">
              <Liste nom="crmClientId" libelle="Client" required
                     options={fiches.map((f) => ({ valeur: f.id, libelle: f.companyName }))} />
              <Liste nom="offerId" libelle="Offre"
                     options={[{ valeur: '', libelle: '— non rattachee —' },
                               ...offres.map((o) => ({ valeur: o.id, libelle: o.name }))]} />
              <div className="grid grid-cols-2 gap-3">
                <Champ nom="amount" libelle="Montant HT (€)" inputMode="decimal" required
                       erreur={etatAchat.erreurs?.amount} />
                <Champ nom="purchasedAt" libelle="Date" type="date" defaultValue={aujourdhui} required />
              </div>
              <BoutonSoumettre>Enregistrer l&apos;achat</BoutonSoumettre>
              <Retour etat={etatAchat} />
            </form>
          </PanneauAjout>
        )}
      </div>
    </Carte>
  )
}

// ===========================================================================
// 5. Retours clients
// ===========================================================================

export function SectionRetours({
  retours,
  fiches,
  offres,
  moyenne,
}: {
  retours: RetourVue[]
  fiches: FicheVue[]
  offres: OffreVue[]
  moyenne: number | null
}) {
  const [etat, action] = useActionState(enregistrerRetour, ETAT_INITIAL)

  return (
    <Carte
      titre="Retours clients"
      sousTitre="La satisfaction apres chaque prestation"
      action={
        moyenne !== null ? (
          <div className="text-right">
            <p className="text-2xl font-extrabold text-warning">{moyenne.toFixed(1)}</p>
            <p className="text-[11px] text-ghost">sur 5 en moyenne</p>
          </div>
        ) : undefined
      }
    >
      {retours.length > 0 ? (
        <div className="space-y-2 mb-4">
          {retours.map((r) => (
            <div key={r.id} className="group flex items-start justify-between gap-3 rounded-xl border border-subtle px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-warning text-sm" aria-label={`${r.rating} sur 5`}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                  <span className="text-xs text-ghost">
                    {[r.clientNom, r.offreNom].filter(Boolean).join(' · ')}
                  </span>
                </div>
                {r.comment && <p className="text-sm text-muted mt-1.5 leading-relaxed">{r.comment}</p>}
                <p className="text-[11px] text-ghost mt-1">{r.createdAt}</p>
              </div>
              <BoutonSuppression action={supprimerRetour} id={r.id} intitule="Supprimer ce retour" />
            </div>
          ))}
        </div>
      ) : (
        <Vide texte="Aucun retour enregistre." />
      )}

      <PanneauAjout intitule="Ajouter un retour" etat={etat}>
        <form action={action} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Liste nom="crmClientId" libelle="Client"
                   options={[{ valeur: '', libelle: '— anonyme —' },
                             ...fiches.map((f) => ({ valeur: f.id, libelle: f.companyName }))]} />
            <Liste nom="offerId" libelle="Offre"
                   options={[{ valeur: '', libelle: '— toutes —' },
                             ...offres.map((o) => ({ valeur: o.id, libelle: o.name }))]} />
          </div>
          <Liste nom="rating" libelle="Note" defaultValue="5"
                 options={[5, 4, 3, 2, 1].map((n) => ({ valeur: String(n), libelle: `${n} / 5` }))} />
          <ZoneTexte nom="comment" libelle="Commentaire" maxLength={600} />
          <BoutonSoumettre>Enregistrer le retour</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </PanneauAjout>
    </Carte>
  )
}

