import { test, expect } from '@playwright/test'
import { COMPTES } from './comptes'
import { seConnecter } from './connexion'

/**
 * E02 du cahier des charges v2 : un parcours qui CLIQUE.
 *
 * Pourquoi ce fichier existe. Le 19 septembre 2026, pendant la revue produit,
 * cliquer sur un client n'ouvrait pas sa fiche et le changement de theme ne
 * s'appliquait qu'au rechargement. Un seul defaut expliquait les deux : le
 * projet est configure en sortie autonome pour l'image Docker, et dans ce mode
 * le serveur ne sert pas les fichiers statiques. Les pages s'affichaient - elles
 * sont rendues cote serveur - mais les scripts du navigateur manquaient.
 *
 * Aucun test ne l'a vu, et la raison est structurelle : les parcours existants
 * lisent l'adresse d'une fiche puis y naviguent directement. Ils ne cliquent
 * jamais. Un test qui ne fait pas ce que fait l'utilisateur ne teste pas
 * l'application.
 *
 * Ces trois tests ferment la porte par deux chemins : le geste lui-meme, et la
 * cause racine - une ressource statique qui manque.
 */

test('cliquer sur une ligne du portefeuille ouvre la fiche du client', async ({ page }) => {
  await seConnecter(page, COMPTES.alexis)
  await page.goto('/clients')

  const premiereFiche = page.locator('a[href^="/clients/"]').first()
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
  await page.waitForLoadState('networkidle')

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
