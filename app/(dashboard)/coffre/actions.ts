'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentClientAutorise } from '@/lib/session'
import type { Acces } from '@/lib/habilitations'
import { AXES, CHEMINS_AXES, lignesDefinies, type AxeCoffre } from '@/lib/coffre'

export type EtatAction = { ok: boolean; message?: string }

/** Le coffre d'un axe suit l'habilitation de cet axe, pas une regle a part. */
const ACCES_PAR_AXE: Record<AxeCoffre, Acces> = {
  VISION: 'AXE_VISION',
  CHIFFRES: 'AXE_CHIFFRES',
  OFFRES: 'AXE_OFFRES',
  COMMUNICATION: 'AXE_COMMUNICATION',
  PILOTAGE: 'AXE_PILOTAGE',
}

/** Une synthese tient en quelques lignes : au-dela, ce n'est plus une synthese. */
const LONGUEUR_MAX = 600

function estAxe(valeur: string): valeur is AxeCoffre {
  return (AXES as readonly string[]).includes(valeur)
}

/**
 * Enregistre les lignes du coffre d'un axe, en une seule transaction.
 *
 * La definition commande : on n'ecrit que les cles qu'elle connait, donc un
 * champ ajoute au formulaire par le navigateur ne cree rien.
 */
export async function enregistrerCoffre(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const axe = String(formData.get('axe') ?? '')
  if (!estAxe(axe)) return { ok: false, message: 'Axe inconnu.' }

  const client = await getCurrentClientAutorise([ACCES_PAR_AXE[axe]])
  if (!client) return { ok: false, message: 'Session expirée ou compte non client.' }

  const ecritures = lignesDefinies(axe).map((ligne, rang) => {
    const saisie = String(formData.get(`ligne-${ligne.cle}`) ?? '').trim().slice(0, LONGUEUR_MAX)
    const valeur = saisie || null

    return prisma.coffreEntree.upsert({
      where: { clientId_axe_cle: { clientId: client.id, axe, cle: ligne.cle } },
      update: { valeur, libelle: ligne.libelle, rang },
      create: { clientId: client.id, axe, cle: ligne.cle, libelle: ligne.libelle, valeur, rang },
    })
  })

  await prisma.$transaction(ecritures)

  revalidatePath(CHEMINS_AXES[axe])
  revalidatePath('/dashboard')

  return { ok: true, message: 'Coffre enregistré.' }
}
