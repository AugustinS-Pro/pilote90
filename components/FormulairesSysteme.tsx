'use client'

import { useActionState } from 'react'
import {
  Champ, ZoneTexte, Liste, BoutonSoumettre, BoutonSuppression,
  Retour, PanneauAjout, ETAT_INITIAL,
} from '@/components/ui'
import {
  creerDecision, supprimerDecision,
  creerIdee, arbitrerIdee, supprimerIdee,
  creerRessource, supprimerRessource,
} from '@/lib/actions-systeme'
import { CATEGORIES_DECISION, TYPES_RESSOURCE } from '@/lib/listes'

export function FormulaireDecision() {
  const [etat, action] = useActionState(creerDecision, ETAT_INITIAL)
  const aujourdhui = new Date().toISOString().slice(0, 10)

  return (
    <PanneauAjout intitule="Consigner une decision" etat={etat}>
      <form action={action} className="space-y-3">
        <Champ nom="title" libelle="La decision" required maxLength={200}
               placeholder="Arreter l'offre a 490 € pour concentrer sur l'accompagnement"
               erreur={etat.erreurs?.title} />
        <div className="grid grid-cols-2 gap-3">
          <Liste nom="category" libelle="Categorie" options={CATEGORIES_DECISION} defaultValue="STRATEGIE" />
          <Champ nom="decidedAt" libelle="Date" type="date" defaultValue={aujourdhui} />
        </div>
        <ZoneTexte nom="context" libelle="Le contexte : pourquoi cette decision, maintenant ?" maxLength={1000} />
        <BoutonSoumettre>Consigner</BoutonSoumettre>
        <Retour etat={etat} />
      </form>
    </PanneauAjout>
  )
}

export function SuppressionDecision({ id, titre }: { id: string; titre: string }) {
  return <BoutonSuppression action={supprimerDecision} id={id} intitule={`Supprimer : ${titre}`} />
}

// --------------------------------------------------------------- parking d'idees

export function FormulaireIdee() {
  const [etat, action] = useActionState(creerIdee, ETAT_INITIAL)

  return (
    <form action={action} className="flex items-end gap-2">
      <div className="flex-1">
        <Champ nom="content" required maxLength={500}
               placeholder="Une idee qui vous traverse, a relire a la cloture du cycle"
               erreur={etat.erreurs?.content} />
      </div>
      {/* « Garer » filait la metaphore du parking, mais un bouton doit dire
          l'action, pas le decor : on lit d'abord le verbe, et « garer » ne dit
          pas ce qu'il advient de l'idee. */}
      <BoutonSoumettre enCours="Ajout...">Mettre de côté</BoutonSoumettre>
      {etat.message && !etat.ok && <Retour etat={etat} />}
    </form>
  )
}

const ISSUES = [
  { valeur: 'KEPT', libelle: 'Je garde' },
  { valeur: 'POSTPONED', libelle: 'Je reporte' },
  { valeur: 'DROPPED', libelle: "J'abandonne" },
]

export function ArbitrageIdee({ id, issue }: { id: string; issue: string }) {
  return (
    <form action={arbitrerIdee}>
      <input type="hidden" name="id" value={id} />
      <select
        name="outcome" defaultValue={issue}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        aria-label="Arbitrage de l'idee"
        className="text-[11px] px-1.5 py-1 rounded border border-subtle bg-surface
                   focus:outline-none focus:border-accent"
      >
        <option value="PARKED">En attente</option>
        {ISSUES.map((i) => <option key={i.valeur} value={i.valeur}>{i.libelle}</option>)}
      </select>
    </form>
  )
}

export function SuppressionIdee({ id }: { id: string }) {
  return <BoutonSuppression action={supprimerIdee} id={id} intitule="Supprimer cette idee" />
}

// ------------------------------------------------------------- bibliotheque

export function FormulaireRessource() {
  const [etat, action] = useActionState(creerRessource, ETAT_INITIAL)

  return (
    <PanneauAjout intitule="Ajouter une ressource" etat={etat}>
      <form action={action} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Champ nom="title" libelle="Titre" required maxLength={160} erreur={etat.erreurs?.title} />
          </div>
          <Liste nom="type" libelle="Type" options={TYPES_RESSOURCE} defaultValue="GUIDE" />
        </div>
        <ZoneTexte nom="description" libelle="Description" rows={2} maxLength={600} />
        <Champ nom="url" libelle="Lien (facultatif)" maxLength={500} placeholder="https://" />
        <BoutonSoumettre>Ajouter</BoutonSoumettre>
        <Retour etat={etat} />
      </form>
    </PanneauAjout>
  )
}

export function SuppressionRessource({ id, titre }: { id: string; titre: string }) {
  return <BoutonSuppression action={supprimerRessource} id={id} intitule={`Supprimer : ${titre}`} />
}
