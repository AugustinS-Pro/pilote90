import { test, expect } from '@playwright/test'
import { COMPTES } from './comptes'
import { seConnecter, seDeconnecter } from './connexion'

/**
 * Le cloisonnement multi-tenant, exerce de bout en bout.
 *
 * C'est la propriete de securite centrale du produit, et jusqu'ici elle n'etait
 * verifiee qu'a la lecture du code. Ces trois tests la mettent a l'epreuve par
 * le seul chemin qui compte : celui d'un navigateur qui essaie.
 */

test('deux consultants ne voient pas les memes entreprises', async ({ page }) => {
  await seConnecter(page, COMPTES.alexis)
  await page.goto('/clients')
  const chezAlexis = await page.locator('main').innerText()
  expect(chezAlexis).toContain('Marie & Co')

  await seDeconnecter(page)

  await seConnecter(page, COMPTES.sandrine)
  await page.goto('/clients')
  const chezSandrine = await page.locator('main').innerText()
  expect(chezSandrine).toContain('Atelier Lumiere')
  // Aucune entreprise en commun : c'est `adminId` qui fait le travail.
  expect(chezSandrine).not.toContain('Marie & Co')
})

test("un consultant ne peut pas ouvrir la fiche d'un client qui n'est pas le sien", async ({ page }) => {
  await seConnecter(page, COMPTES.alexis)
  await page.goto('/clients')
  const lien = await page.locator('a[href^="/clients/"]').first().getAttribute('href')
  expect(lien).toBeTruthy()

  await seDeconnecter(page)
  await seConnecter(page, COMPTES.sandrine)

  // Meme identifiant, autre session : la page doit repondre introuvable, et non
  // afficher la fiche ni une page d'erreur qui confirmerait son existence.
  const reponse = await page.goto(lien!)
  expect(reponse?.status()).toBe(404)
})

test("un compte accompagne n'atteint pas les axes qu'il n'a pas achetes", async ({ page }) => {
  await seConnecter(page, COMPTES.thomas)

  // Thomas est en formule Accompagnement : l'audit, pas les axes.
  await expect(page).toHaveURL(/\/audit/)

  const menu = await page.getByRole('navigation').innerText()
  expect(menu).not.toContain('Vision CEO')

  // Et l'URL saisie a la main le ramene chez lui, au lieu d'une page vide.
  await page.goto('/axe1')
  await expect(page).toHaveURL(/\/audit/)
})
