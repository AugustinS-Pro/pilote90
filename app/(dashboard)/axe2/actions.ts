'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getCurrentClient } from '@/lib/session'
import { transactionInput, eurosVersCentimes } from '@/lib/validation'

export type EtatAction = {
  ok: boolean
  message?: string
  erreurs?: Record<string, string>
}

/** Cree une transaction pour le client connecte. */
export async function creerTransaction(
  _precedent: EtatAction,
  formData: FormData,
): Promise<EtatAction> {
  const client = await getCurrentClient()
  if (!client) return { ok: false, message: 'Session expiree ou compte non client.' }

  const parsed = transactionInput.safeParse({
    type: formData.get('type'),
    transactionDate: formData.get('transactionDate'),
    label: formData.get('label'),
    amount: formData.get('amount'),
    category: formData.get('category') ?? undefined,
  })

  if (!parsed.success) {
    const erreurs: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const champ = String(issue.path[0] ?? 'global')
      if (!erreurs[champ]) erreurs[champ] = issue.message
    }
    return { ok: false, message: 'Saisie incomplete.', erreurs }
  }

  const centimes = eurosVersCentimes(parsed.data.amount)
  if (centimes === null) {
    return { ok: false, message: 'Montant invalide.', erreurs: { amount: 'Montant invalide' } }
  }

  const date = new Date(parsed.data.transactionDate)
  if (Number.isNaN(date.getTime())) {
    return { ok: false, message: 'Date invalide.', erreurs: { transactionDate: 'Date invalide' } }
  }

  await prisma.transaction.create({
    data: {
      clientId: client.id,
      type: parsed.data.type,
      amountHt: centimes,
      transactionDate: date,
      label: parsed.data.label,
      category: parsed.data.category || null,
    },
  })

  revalidatePath('/axe2')
  revalidatePath('/audit')
  revalidatePath('/dashboard')

  return {
    ok: true,
    message: parsed.data.type === 'REVENUE' ? 'Revenu enregistre.' : 'Charge enregistree.',
  }
}

/** Supprime une transaction, apres verification qu'elle appartient bien au client connecte. */
export async function supprimerTransaction(formData: FormData): Promise<void> {
  const client = await getCurrentClient()
  if (!client) return

  const id = String(formData.get('id') ?? '')
  if (!id) return

  // Cloisonnement : le clientId de la session fait partie du filtre de suppression.
  await prisma.transaction.deleteMany({ where: { id, clientId: client.id } })

  revalidatePath('/axe2')
  revalidatePath('/audit')
  revalidatePath('/dashboard')
}
