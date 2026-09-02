'use client'

import { useActionState, useState } from 'react'
import { Champ, BoutonSoumettre, Retour } from '@/components/ui'
import { creerClient, type EtatCreation } from './actions'

const ETAT_INITIAL: EtatCreation = { ok: false }

/**
 * Entree d'un nouveau client dans le portefeuille.
 *
 * Le consultant saisit ce qu'il tient de la vente. Le reste, ce que lui seul
 * sait, sera complete par le client a sa premiere connexion.
 *
 * Le mot de passe provisoire s'affiche une seule fois, apres la creation.
 * C'est une etape intermediaire assumee : la version cible envoie un jeton
 * d'invitation a usage unique et laisse le client choisir son mot de passe,
 * parce qu'un mot de passe transmis par un tiers est compromis des sa
 * creation. Voir Conception/13-modele-habilitations.md.
 */
export function NouveauClient() {
  const [etat, action] = useActionState(creerClient, ETAT_INITIAL)
  const [ouvert, setOuvert] = useState(false)

  if (!ouvert) {
    return (
      <button
        onClick={() => setOuvert(true)}
        className="w-full rounded-xl border border-dashed border-firm py-3 text-sm
                   text-muted hover:border-accent hover:text-accent-ink transition-colors"
      >
        + Faire entrer un nouveau client
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-accent bg-accent-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-ink-soft">Nouveau client</h3>
          <p className="text-xs text-muted mt-0.5">
            Les informations recueillies a la vente. Le client completera son dossier
            a sa premiere connexion.
          </p>
        </div>
        <button
          onClick={() => setOuvert(false)}
          className="text-xs text-muted hover:text-ink-soft shrink-0"
        >
          Fermer
        </button>
      </div>

      {etat.motDePasseProvisoire ? (
        <div className="rounded-xl border border-warning bg-warning-soft px-4 py-3 space-y-2">
          <p className="text-sm font-semibold text-warning-ink">{etat.message}</p>
          <p className="text-xs text-warning-ink opacity-90">
            Transmettez ce mot de passe provisoire au client. Il ne sera plus jamais
            affiche : seule son empreinte est conservee.
          </p>
          <p className="font-mono text-base font-bold text-ink bg-surface rounded-lg px-3 py-2
                        border border-subtle select-all tracking-wide">
            {etat.motDePasseProvisoire}
          </p>
          <p className="text-[11px] text-warning-ink opacity-80">
            Demandez-lui de le changer des sa premiere connexion.
          </p>
        </div>
      ) : (
        <form action={action} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Champ
              nom="companyName"
              libelle="Raison sociale"
              placeholder="Atelier Durand"
              erreur={etat.erreurs?.companyName}
              required
            />
            <Champ
              nom="sector"
              libelle="Secteur (facultatif)"
              placeholder="Artisanat"
              erreur={etat.erreurs?.sector}
            />
            <Champ
              nom="contactName"
              libelle="Nom du contact"
              placeholder="Claire Durand"
              erreur={etat.erreurs?.contactName}
              required
            />
            <Champ
              nom="email"
              type="email"
              libelle="Adresse electronique"
              placeholder="claire@atelier-durand.fr"
              erreur={etat.erreurs?.email}
              required
            />
          </div>

          {!etat.ok && <Retour etat={etat} />}

          <div className="flex justify-end">
            <BoutonSoumettre enCours="Creation...">Creer le compte</BoutonSoumettre>
          </div>
        </form>
      )}
    </div>
  )
}
