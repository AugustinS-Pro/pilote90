import { prisma } from '@/lib/prisma'
import { getCurrentClient } from '@/lib/session'
import { Carte, Vide } from '@/components/ui'
import { fusionner, completude, type AxeCoffre } from '@/lib/coffre'
import { FormulaireCoffre } from './FormulaireCoffre'

/**
 * Le coffre d'un axe, en pied de page.
 *
 * Il charge ses propres donnees plutot que de les recevoir : chaque page d'axe
 * a deja sa requete, et lui en ajouter une branche rendrait cinq pages
 * solidaires d'un detail qui ne les regarde pas.
 */
export async function Coffre({ axe }: { axe: AxeCoffre }) {
  const client = await getCurrentClient()
  if (!client) return null

  const entrees = await prisma.coffreEntree.findMany({
    where: { clientId: client.id, axe },
    select: { cle: true, valeur: true },
  })

  const lignes = fusionner(axe, entrees)
  const part = completude(lignes)

  return (
    <Carte
      titre="Mon coffre stratégique"
      sousTitre="Les réponses de cet axe que le tableau de bord relit"
      action={
        <span className="text-xs font-semibold text-muted">
          {part} % renseigné
        </span>
      }
    >
      {lignes.length > 0 ? (
        <FormulaireCoffre axe={axe} lignes={lignes} />
      ) : (
        <Vide texte="Aucune ligne définie pour cet axe." />
      )}
    </Carte>
  )
}
