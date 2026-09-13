import { expect, type Page } from '@playwright/test'

/** Connecte un compte et attend l'atterrissage decide par ses habilitations. */
export async function seConnecter(
  page: Page,
  compte: { email: string; motDePasse: string },
): Promise<void> {
  await page.goto('/login')
  await page.getByLabel(/adresse/i).fill(compte.email)
  await page.getByLabel(/mot de passe/i).fill(compte.motDePasse)
  await page.getByRole('button', { name: /connexion|se connecter/i }).click()
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 })
}

export async function seDeconnecter(page: Page): Promise<void> {
  // Le nom accessible du bouton est accentue (« Deconnexion » avec un e
  // accent aigu). Un motif sans accent ne le trouverait pas : la classe de
  // caracteres couvre les deux orthographes, au cas ou le libelle rebouge.
  await page.getByRole('button', { name: /d[eé]connexion/i }).click()
  await expect(page).toHaveURL(/\/login/)
}
