import { defineConfig, devices } from '@playwright/test'

/**
 * Tests de parcours.
 *
 * Les 79 tests unitaires verifient des CALCULS isoles. Ceux-ci verifient que
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
    // E01 : le projet est configure en sortie autonome pour l'image Docker, et
    // dans ce mode `next start` ne sert pas les fichiers statiques - c'est le
    // defaut rencontre en revue le 19 septembre. Les parcours doivent exercer
    // l'application comme elle est deployee, sinon ils valident un mode que
    // personne n'utilise en production.
    command: 'npm run build && npm run start:standalone',
    url: 'http://127.0.0.1:3000/login',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
