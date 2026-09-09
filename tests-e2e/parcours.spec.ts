import { test, expect } from '@playwright/test'
import { COMPTES } from './comptes'
import { seConnecter } from './connexion'

/**
 * Parcours 1 : la promesse centrale du dossier.
 *
 * « L'enregistrement d'une transaction met a jour en temps reel la progression
 * du tableau de bord. » C'est la phrase que ce test transforme en fait
 * verifiable, et c'est le seul endroit du projet ou la chaine complete est
 * exercee : formulaire, action serveur, validation Zod, ecriture en base,
 * revalidation du cache, et recalcul de l'indicateur sur une autre page.
 */
test('une transaction saisie remonte au tableau de bord', async ({ page }) => {
  await seConnecter(page, COMPTES.marie)

  await page.goto('/dashboard')
  const avant = await page.getByText(/tresorerie/i).locator('..').innerText()

  const montant = 1234
  const libelle = `Test de parcours ${Date.now()}`

  await page.goto('/axe2')
  const formulaire = page.locator('form').filter({ hasText: /enregistrer un revenu/i }).first()
  await formulaire.getByLabel(/client/i).fill(libelle)
  await formulaire.getByLabel(/montant hors taxes/i).fill(String(montant))
  await formulaire.getByRole('button', { name: /enregistrer/i }).click()

  await expect(page.getByRole('status')).toContainText(/enregistre/i)
  await expect(page.getByText(libelle)).toBeVisible()

  // La propagation : le tableau de bord n'a pas ete recharge a la main.
  await page.goto('/dashboard')
  const apres = await page.getByText(/tresorerie/i).locator('..').innerText()
  expect(apres).not.toBe(avant)
})

/**
 * Parcours 2 : la correction en place.
 *
 * Le defaut le plus visible du produit jusqu'au 2 septembre etait qu'on ne
 * pouvait rien corriger. Ce test verifie que la correction fonctionne, et
 * surtout qu'elle ne cree pas de doublon.
 */
test('une transaction se corrige sans etre recreee', async ({ page }) => {
  await seConnecter(page, COMPTES.marie)
  await page.goto('/axe2')

  const libelle = `A corriger ${Date.now()}`
  const formulaire = page.locator('form').filter({ hasText: /enregistrer une charge/i }).first()
  await formulaire.getByLabel(/fournisseur|libelle|charge/i).first().fill(libelle)
  await formulaire.getByLabel(/montant hors taxes/i).fill('100')
  await formulaire.getByRole('button', { name: /enregistrer/i }).click()
  await expect(page.getByText(libelle)).toBeVisible()

  const ligne = page.locator('div').filter({ hasText: libelle }).last()
  await ligne.getByRole('button', { name: new RegExp(`modifier ${libelle}`, 'i') }).click()

  const corrige = `${libelle} corrige`
  await page.getByLabel(/^libelle$/i).fill(corrige)
  await page.getByRole('button', { name: /^enregistrer$/i }).click()

  await expect(page.getByText(corrige)).toBeVisible()
  await expect(page.getByText(libelle, { exact: true })).toHaveCount(0)
})
