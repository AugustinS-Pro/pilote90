'use client'

import { useActionState } from 'react'
import { Carte, ZoneTexte, BoutonSoumettre, Retour, ETAT_INITIAL } from '@/components/ui'
import { enregistrerPilier } from '@/lib/actions-systeme'
import type { Pilier } from '@/lib/piliers'

export type ReponsesPilier = { synthesis: string | null; reponses: Record<string, string> }

export function BlocPilier({
  pilier,
  valeurs,
}: {
  pilier: Pilier
  valeurs: ReponsesPilier
}) {
  const [etat, action] = useActionState(enregistrerPilier, ETAT_INITIAL)
  const rempli = Boolean(valeurs.synthesis)

  return (
    <Carte
      titre={pilier.titre}
      sousTitre={pilier.sousTitre}
      action={
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
          rempli ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {rempli ? 'Renseigne' : 'A remplir'}
        </span>
      }
    >
      {valeurs.synthesis && (
        <blockquote className="rounded-xl bg-indigo-50/60 border-l-2 border-indigo-400 px-4 py-3 mb-4">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{valeurs.synthesis}</p>
        </blockquote>
      )}

      <details className="group">
        <summary className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-slate-700">
          {valeurs.synthesis ? 'Reprendre mes reponses' : 'Repondre aux questions'}
        </summary>

        <form action={action} className="mt-4 space-y-3">
          <input type="hidden" name="cle" value={pilier.cle} />

          {pilier.questions.map((question, i) => (
            <ZoneTexte
              key={question}
              nom={`question-${i}`}
              idUnique={`${pilier.cle}-q${i}`}
              libelle={question}
              rows={2}
              maxLength={600}
              defaultValue={valeurs.reponses[question] ?? ''}
            />
          ))}

          <ZoneTexte
            nom="synthesis"
            idUnique={`${pilier.cle}-synthese`}
            libelle="Ma synthese"
            rows={3}
            maxLength={1000}
            defaultValue={valeurs.synthesis ?? ''}
            placeholder={pilier.aideSynthese}
          />

          <BoutonSoumettre>Enregistrer</BoutonSoumettre>
          <Retour etat={etat} />
        </form>
      </details>
    </Carte>
  )
}
