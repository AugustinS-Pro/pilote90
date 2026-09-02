/**
 * Outil d'administration des comptes, en ligne de commande.
 *
 *   node --env-file=.env scripts/comptes.mjs
 *       liste les comptes et leur fiche client
 *
 *   node --env-file=.env scripts/comptes.mjs claire@atelier.fr
 *       tire un nouveau mot de passe et l'affiche une seule fois
 *
 *   node --env-file=.env scripts/comptes.mjs claire@atelier.fr MonMotDePasse
 *       impose un mot de passe choisi
 *
 * Un mot de passe existant ne se retrouve pas : la base ne stocke qu'une
 * empreinte bcrypt, qui ne se remonte pas. C'est la propriete recherchee, pas
 * une limite a contourner. On n'en lit pas un, on en pose un nouveau.
 *
 * Cet outil sert aussi a l'etape 1.5 de la mise en production, ou les mots de
 * passe du jeu de demonstration doivent imperativement etre remplaces.
 */

import { createRequire } from 'node:module'
import { randomBytes } from 'node:crypto'

const require = createRequire(import.meta.url)
const { PrismaClient } = require('../app/generated/prisma')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

/** Meme tirage que la creation de client : randomBytes, jamais Math.random. */
function motDePasseProvisoire(longueur = 14) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789'
  const octets = randomBytes(longueur)
  let sortie = ''
  for (let i = 0; i < longueur; i++) sortie += alphabet[octets[i] % alphabet.length]
  return sortie
}

async function lister() {
  const comptes = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      email: true,
      name: true,
      role: true,
      createdAt: true,
      client: { select: { companyName: true, status: true, adminId: true } },
    },
  })

  console.log(`\n${comptes.length} compte(s)\n`)
  for (const c of comptes) {
    const fiche = c.client
      ? `${c.client.companyName}${c.client.status ? ` [${c.client.status}]` : ''}${c.client.adminId ? '' : ' (sans consultant)'}`
      : 'aucune fiche client'
    console.log(`  ${c.email}`)
    console.log(`      ${c.name ?? 'sans nom'} · ${c.role} · cree le ${c.createdAt.toLocaleDateString('fr-FR')}`)
    console.log(`      ${fiche}\n`)
  }
  console.log('Pour reinitialiser : node --env-file=.env scripts/comptes.mjs <adresse>\n')
}

async function reinitialiser(email, impose) {
  const compte = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, email: true, name: true },
  })
  if (!compte) {
    console.error(`\nAucun compte avec l'adresse ${email}.\n`)
    process.exitCode = 1
    return
  }

  const nouveau = impose ?? motDePasseProvisoire()
  if (nouveau.length < 8) {
    console.error('\nMot de passe trop court : huit caracteres au minimum.\n')
    process.exitCode = 1
    return
  }

  await prisma.user.update({
    where: { id: compte.id },
    data: { password: await bcrypt.hash(nouveau, 10) },
  })

  console.log(`\nMot de passe remplace pour ${compte.email}${compte.name ? ` (${compte.name})` : ''}.`)
  console.log(`\n    ${nouveau}\n`)
  console.log('Il ne sera plus affiche : seule son empreinte est conservee.\n')
}

const [adresse, impose] = process.argv.slice(2)

try {
  if (adresse) await reinitialiser(adresse, impose)
  else await lister()
} finally {
  await prisma.$disconnect()
}
