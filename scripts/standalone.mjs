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
import { cpSync, existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { join } from 'node:path'

const racine = process.cwd()
const autonome = join(racine, '.next', 'standalone')

if (!existsSync(autonome)) {
  console.error("Serveur autonome introuvable. Lancez d'abord : npm run build")
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
