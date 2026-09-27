/**
 * Demarrage du serveur autonome produit par `next build`.
 *
 * Le projet est configure en `output: 'standalone'` pour l'image Docker.
 * Dans ce mode, `next start` affiche un avertissement et ne sert pas les
 * fichiers statiques : les scripts du navigateur manquent, l'hydratation
 * echoue, et les liens de navigation ne repondent plus au clic alors que
 * les pages s'affichent normalement. Le defaut est invisible au premier
 * regard, et c'est exactement ce qu'un utilisateur a rencontre en recette.
 *
 * Next attend que `public/` et `.next/static` soient recopies a cote du
 * serveur autonome. Ce script le fait, puis lance le serveur.
 */
import { cpSync, existsSync, readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { join } from 'node:path'

const racine = process.cwd()
const autonome = join(racine, '.next', 'standalone')

if (!existsSync(autonome)) {
  console.error("Serveur autonome introuvable. Lancez d'abord : npm run build")
  process.exit(1)
}

/**
 * Le serveur autonome ne lit aucun fichier d'environnement.
 *
 * `next start` charge .env.local tout seul ; le serveur produit dans
 * .next/standalone, non. En production ce n'est pas un probleme, les variables
 * viennent de l'environnement du conteneur. En local, elles manquent, et
 * NextAuth s'arrete sur NO_SECRET a chaque requete.
 *
 * Ce qui est deja dans l'environnement l'emporte : on ne fait que combler.
 */
function chargerEnv(fichier) {
  const chemin = join(racine, fichier)
  if (!existsSync(chemin)) return
  for (const ligne of readFileSync(chemin, 'utf8').split(/\r?\n/)) {
    const m = ligne.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!m) continue
    const [, cle, brut] = m
    if (process.env[cle] !== undefined) continue
    process.env[cle] = brut.trim().replace(/^(['"])(.*)\1$/s, '$2')
  }
}

chargerEnv('.env.local')
chargerEnv('.env')

// Mieux vaut un message clair maintenant que cent quatre-vingts secondes de
// traces identiques parce que le serveur refuse chaque requete.
const manquantes = ['DATABASE_URL', 'NEXTAUTH_SECRET'].filter((c) => !process.env[c])
if (manquantes.length > 0) {
  console.error(
    `Variables absentes : ${manquantes.join(', ')}.\n` +
      'Renseignez-les dans .env.local, ou dans l\'environnement avant de lancer.',
  )
  process.exit(1)
}

if (existsSync(join(racine, 'public'))) {
  cpSync(join(racine, 'public'), join(autonome, 'public'), { recursive: true })
}
cpSync(join(racine, '.next', 'static'), join(autonome, '.next', 'static'), { recursive: true })

const port = process.env.PORT ?? '3000'
console.log(`Serveur autonome sur http://127.0.0.1:${port}`)

const serveur = spawn(process.execPath, [join(autonome, 'server.js')], {
  stdio: 'inherit',
  env: { ...process.env, PORT: port, HOSTNAME: process.env.HOSTNAME ?? '127.0.0.1' },
})

serveur.on('exit', (code) => process.exit(code ?? 0))
