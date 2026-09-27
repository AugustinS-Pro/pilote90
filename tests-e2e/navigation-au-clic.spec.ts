import { test, expect } from '@playwright/test'
import { COMPTES } from './comptes'
import { seConnecter } from './connexion'

/**
 * Un parcours qui CLIQUE.
 *
 * Le 19 septembre, cliquer sur un client n'ouvrait pas sa fiche : en sortie
 * autonome mal demarree, les fichiers statiques ne sont pas servis et
 * l'hydratation echoue. Les parcours existants ne l'ont pas vu parce qu'ils
 * naviguent par adresse au lieu de cliquer.
 *
 * Deux chemins ici : le geste, et la cause racine.
 */

test('cliquer sur une ligne du portefeuille ouvre la fiche du client', async ({ page }) => {
  await seConnecter(page, COMPTES.alexis)
  await page.goto('/clients')

  // La liste, et pas le premier lien de la page : la carte des signaux pointe
  // elle aussi vers des fiches, et elle s'affiche au-dessus.
  const liste = page.locator('[data-liste="portefeuille"]')
  const premiereFiche = liste.locator('a[href^="/clients/"]').first()
  await expect(premiereFiche).toBeVisible()

  // Le nom lu AVANT le clic sert de temoin : c'est lui qui doit apparaitre en
  // titre de la fiche. Sans ce temoin, le test passerait sur n'importe quelle
  // page qui repond.
  const nomAttendu = (await premiereFiche.innerText()).split('\n')[0].trim()

  // Le geste. Pas de page.goto ici : c'est tout l'objet du test.
  await premiereFiche.click()

  await expect(page).toHaveURL(/\/clients\/[^/]+$/, { timeout: 15_000 })
  await expect(page.getByRole('heading', { level: 1 })).toContainText(nomAttendu)
})

test('aucune ressource statique ne manque sur le portefeuille', async ({ page }) => {
  // La cause racine du defaut du 19 septembre, prise de front : en sortie
  // autonome mal demarree, les fichiers de `.next/static` repondent 404 et
  // l'hydratation echoue sans que la page ait l'air cassee.
  const manquantes: string[] = []
  page.on('response', (reponse) => {
    const url = reponse.url()
    if (url.includes('/_next/') && reponse.status() >= 400) {
      manquantes.push(`${reponse.status()} ${url}`)
    }
  })

  await seConnecter(page, COMPTES.alexis)
  await page.goto('/clients')

  // Attendre un element de la page plutot que networkidle : l'attente reseau
  // ne se termine jamais franchement et laisse le parcours tourner jusqu'au
  // delai maximal quand une requete traine.
  await expect(page.getByRole('heading', { name: /portefeuille/i })).toBeVisible()
  await expect(
    page.locator('[data-liste="portefeuille"] a[href^="/clients/"]').first(),
  ).toBeVisible()

  expect(manquantes, `Ressources manquantes :\n${manquantes.join('\n')}`).toEqual([])
})

test('la navigation par la barre laterale repond au clic', async ({ page }) => {
  await seConnecter(page, COMPTES.marie)
  await page.goto('/dashboard')

  // Marie a la formule complete : les cinq axes et le suivi d'activite.
  await page.getByRole('link', { name: /Pilotage 90j/i }).click()
  await expect(page).toHaveURL(/\/axe5/, { timeout: 15_000 })

  await page.getByRole('link', { name: /Vision CEO/i }).click()
  await expect(page).toHaveURL(/\/axe1/, { timeout: 15_000 })

  await page.getByRole('link', { name: /Tableau de bord/i }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 })
})
