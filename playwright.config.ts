import { defineConfig, devices } from '@playwright/test'

/**
 * Tests de parcours.
 *
 * Les 71 tests unitaires verifient des CALCULS isoles. Ceux-ci verifient que
 * l'application tient debout : que les pages s'affichent, que les formulaires
 * ecrivent, et que la saisie se propage. C'est ce qui attrape les pannes
 * qu'aucun test unitaire ne voit, comme l'appel d'une fonction de module
 * client depuis un composant serveur.
 *
 * Ils tournent contre le BUILD DE PRODUCTION, pas le serveur de developpement :
 * c'est la version qui sera deployee, et elle se comporte differemment.
 */
export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: false, // Les parcours ecrivent en base : on les serialise.
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  expect: { timeout: 8_000 },

  use: {
    baseURL: process.env.URL_TEST ?? 'http://127.0.0.1:3000',
    locale: 'fr-FR',
    timezoneId: 'Europe/Paris',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://127.0.0.1:3000/login',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
