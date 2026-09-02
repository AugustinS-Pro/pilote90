'use server'

import { randomBytes } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { peut } from '@/lib/habilitations'

export type EtatCreation = {
  ok: boolean
  message?: string
  erreurs?: Record<string, string>
  /**
   * Mot de passe provisoire, renvoye une seule fois pour etre transmis au
   * client. Il n'est jamais relu ensuite : seule son empreinte est stockee.
   */
  motDePasseProvisoire?: string
}

const nouveauClient = z.object({
  companyName: z.string().trim().min(2, 'Raison sociale trop courte').max(120),
  sector: z.string().trim().max(80).optional().or(z.literal('')),
  contactName: z.string().trim().min(2, 'Nom du contact requis').max(120),
  email: z.string().trim().toLowerCase().email('Adresse electronique invalide'),
})

/**
 * Mot de passe provisoire lisible mais imprevisible.
 *
 * Tire de `randomBytes`, jamais de `Math.random` : le second est previsible et
 * n'a rien a faire dans la chaine d'authentification. L'alphabet ecarte les
 * caracteres qui se confondent a l'oral et a la lecture (0, O, 1, l, I).
 */
function motDePasseProvisoire(longueur = 14): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  const octets = randomBytes(longueur)
  let sortie = ''
  for (let i = 0; i < longueur; i++) sortie += alphabet[octets[i] % alphabet.length]
  return sortie
}

/**
 * Fait entrer un nouveau client dans le portefeuille du consultant connecte.
 *
 * Trois garde-fous, dans cet ordre :
 *   1. l'habilitation `COMPTES_ADMINISTRER`, refus par defaut ;
 *   2. l'unicite de l'adresse, verifiee avant l'ecriture ;
 *   3. le rattachement `adminId`, pris dans la SESSION et jamais dans le
 *      formulaire, sans quoi n'importe qui pourrait s'attribuer un client.
 *
 * Le compte et la fiche sont crees dans une seule transaction : un utilisateur
 * sans fiche client serait un compte orphelin, impossible a rattraper depuis
 * l'interface.
 */
export async function creerClient(
  _precedent: EtatCreation,
  formData: FormData,
): Promise<EtatCreation> {
  const utilisateur = await getCurrentUser()
  if (!peut(utilisateur, 'COMPTES_ADMINISTRER')) {
    return { ok: false, message: 'Vous n avez pas l habilitation pour creer un compte.' }
  }

  const parsed = nouveauClient.safeParse({
    companyName: formData.get('companyName'),
    sector: formData.get('sector') ?? '',
    contactName: formData.get('contactName'),
    email: formData.get('email'),
  })

  if (!parsed.success) {
    const erreurs: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      erreurs[String(issue.path[0] ?? 'global')] = issue.message
    }
    return { ok: false, message: 'Verifiez les champs signales.', erreurs }
  }

  const { companyName, sector, contactName, email } = parsed.data

  const existant = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existant) {
    return {
      ok: false,
      message: 'Un compte existe deja avec cette adresse.',
      erreurs: { email: 'Adresse deja utilisee' },
    }
  }

  const provisoire = motDePasseProvisoire()
  const empreinte = await bcrypt.hash(provisoire, 10)

  await prisma.$transaction(async (tx) => {
    const compte = await tx.user.create({
      data: { email, name: contactName, password: empreinte, role: 'CLIENT' },
    })
    await tx.client.create({
      data: {
        userId: compte.id,
        adminId: utilisateur!.id,
        companyName,
        sector: sector || null,
        status: 'INVITE',
      },
    })
  })

  revalidatePath('/clients')

  return {
    ok: true,
    message: `${companyName} rejoint votre portefeuille.`,
    motDePasseProvisoire: provisoire,
  }
}
