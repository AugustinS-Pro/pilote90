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
  const carteTresorerie = page.getByText(/^tresorerie$/i).locator('..')
  const avant = await carteTresorerie.innerText()

  const montant = 1234
  const libelle = `Test de parcours ${Date.now()}`

  await page.goto('/axe2')
  // Le titre « Enregistrer un revenu » est un <h2> place AVANT le <form>, donc
  // hors de lui : filtrer le formulaire sur ce texte ne trouve rien. On le
  // designe par son champ cache `type`, qui est ce qui le distingue vraiment
  // de celui des charges, et qui ne bougera pas si le libelle change.
  const formulaire = page.locator('form')
    .filter({ has: page.locator('input[name="type"][value="REVENUE"]') })
    .first()
  await formulaire.getByLabel(/client/i).fill(libelle)
  await formulaire.getByLabel(/montant hors taxes/i).fill(String(montant))
  await formulaire.getByRole('button', { name: /enregistrer/i }).click()

  await expect(page.getByRole('status')).toContainText(/enregistre/i)
  await expect(page.getByText(libelle)).toBeVisible()

  // La propagation : le tableau de bord n'a pas ete recharge a la main.
  await page.goto('/dashboard')
  const apres = await page.getByText(/^tresorerie$/i).locator('..').innerText()
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
  const formulaire = page.locator('form')
    .filter({ has: page.locator('input[name="type"][value="EXPENSE"]') })
    .first()
  await formulaire.getByLabel(/fournisseur/i).fill(libelle)
  await formulaire.getByLabel(/montant hors taxes/i).fill('100')
  await formulaire.getByRole('button', { name: /enregistrer/i }).click()
  await expect(page.getByText(libelle)).toBeVisible()

  // Le crayon porte le libelle dans son nom accessible, donc il est unique
  // dans la page : inutile de passer par la ligne qui le contient, et c'est
  // plus sur — `locator('div').last()` tombait sur le bloc interne du
  // libelle, qui ne contient justement pas le bouton.
  // Il est en `opacity-0` hors survol, ce qui ne le rend pas invisible au
  // sens de Playwright : le clic passe sans avoir a survoler.
  await page.getByRole('button', { name: `Modifier ${libelle}`, exact: true }).click()

  const corrige = `${libelle} corrige`
  await page.getByLabel(/^libelle$/i).fill(corrige)
  await page.getByRole('button', { name: /^enregistrer$/i }).click()

  // Deux temps distincts, et c'est de les avoir confondus que venait
  // l'instabilite : ce test passait une execution sur deux.
  //
  // 1. Le succes de l'action referme le formulaire cote client. Immediat.
  await expect(page.getByRole('button', { name: /^annuler$/i })).toHaveCount(0)
  // 2. La ligne ne porte le nouveau libelle qu'une fois la revalidation du
  //    cache serveur revenue, puisqu'elle est rendue depuis les donnees du
  //    serveur. Ce trajet a depasse les huit secondes du delai par defaut :
  //    il lui faut le sien.
  await expect(page.getByText(corrige)).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText(libelle, { exact: true })).toHaveCount(0)
})
