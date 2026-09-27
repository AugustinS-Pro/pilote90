/**
 * Verification des regles de cycle, en ligne de commande.
 *
 *   node --env-file=.env scripts/priorites.mjs
 *       etat des lieux : priorites par cycle actif, rangs, doublons d'intitule
 *
 *   node --env-file=.env scripts/priorites.mjs --rangs
 *       renumerote les rangs de 1 a n dans chaque cycle, par date de creation
 *
 *   node --env-file=.env scripts/priorites.mjs --supprimer <id> [<id>...]
 *       supprime les priorites nommees ; leurs actions ne sont pas supprimees,
 *       elles perdent seulement leur rattachement et restent dans le cockpit
 *
 * Deux regles sont annoncees a l'ecran mais n'etaient tenues qu'a la creation :
 * trois priorites par cycle, cinq thematiques par client. Une base remplie par
 * plusieurs generations de jeu de demonstration peut donc les enfreindre sans
 * qu'aucun message ne le dise. Cet outil montre l'ecart et permet de le
 * refermer, base par base, sans toucher au reste du contenu.
 */

import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { PrismaClient } = require('../app/generated/prisma')

const prisma = new PrismaClient()

/** Comparaison d'intitules insensible a la casse et aux accents. */
function normalise(texte) {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

async function etatDesLieux() {
  const clients = await prisma.client.findMany({
    include: {
      user: { select: { email: true } },
      _count: { select: { contentThemes: true } },
      cycles: {
        where: { status: 'ACTIVE' },
        include: {
          objectives: {
            orderBy: { createdAt: 'asc' },
            include: { _count: { select: { tasks: true } } },
          },
        },
      },
    },
  })

  let ecarts = 0

  for (const client of clients) {
    console.log(`\n${client.companyName ?? client.user.email}`)

    if (client.cycles.length > 1) {
      ecarts++
      console.log(`  ! ${client.cycles.length} cycles actifs, un seul est attendu`)
    }
    if (client._count.contentThemes > 5) {
      ecarts++
      console.log(`  ! ${client._count.contentThemes} thematiques, cinq au maximum`)
    }
    if (client.cycles.length === 0) {
      console.log('  aucun cycle actif')
      continue
    }

    for (const cycle of client.cycles) {
      const p = cycle.objectives
      const marque = p.length > 3 ? '!' : ' '
      console.log(`  ${marque} cycle ${cycle.cycleNumber} : ${p.length} priorite(s), trois au maximum`)
      if (p.length > 3) ecarts++

      const parIntitule = new Map()
      for (const o of p) {
        const cle = normalise(o.title)
        parIntitule.set(cle, (parIntitule.get(cle) ?? 0) + 1)
      }

      for (const o of p) {
        const doublon = parIntitule.get(normalise(o.title)) > 1 ? ' <- doublon d\'intitule' : ''
        console.log(
          `      rang ${o.rank}  ${o.progressPct.toString().padStart(3)} %  ` +
          `${o._count.tasks} action(s)  ${o.id}  ${o.title}${doublon}`,
        )
      }

      const rangs = new Set(p.map((o) => o.rank))
      if (rangs.size < p.length) {
        ecarts++
        console.log('      ! plusieurs priorites partagent un rang : l\'ordre affiche est arbitraire')
      }
    }
  }

  console.log(`\n${ecarts} ecart(s) releve(s).`)
  if (ecarts > 0) {
    console.log('Renumeroter les rangs : --rangs')
    console.log('Supprimer une priorite : --supprimer <id>')
  }
}

async function renumeroterLesRangs() {
  const cycles = await prisma.cycle.findMany({
    include: { objectives: { orderBy: { createdAt: 'asc' }, select: { id: true, rank: true } } },
  })

  let touchees = 0
  for (const cycle of cycles) {
    for (const [index, objectif] of cycle.objectives.entries()) {
      const rang = index + 1
      if (objectif.rank === rang) continue
      await prisma.objective.update({ where: { id: objectif.id }, data: { rank: rang } })
      touchees++
    }
  }
  console.log(`${touchees} priorite(s) renumerotee(s).`)
}

async function supprimer(ids) {
  for (const id of ids) {
    const objectif = await prisma.objective.findUnique({
      where: { id },
      select: { title: true, _count: { select: { tasks: true } } },
    })
    if (!objectif) {
      console.log(`${id} : introuvable`)
      continue
    }
    await prisma.objective.delete({ where: { id } })
    console.log(
      `${id} supprime : ${objectif.title}` +
      (objectif._count.tasks > 0 ? ` (${objectif._count.tasks} action(s) detachee(s))` : ''),
    )
  }
}

const args = process.argv.slice(2)

try {
  if (args[0] === '--rangs') {
    await renumeroterLesRangs()
  } else if (args[0] === '--supprimer') {
    const ids = args.slice(1)
    if (ids.length === 0) {
      console.error('Aucun identifiant fourni.')
      process.exit(1)
    }
    await supprimer(ids)
  } else {
    await etatDesLieux()
  }
} finally {
  await prisma.$disconnect()
}
