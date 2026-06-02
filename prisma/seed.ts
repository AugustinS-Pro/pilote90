import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  // Alexis — Admin
  const alexis = await prisma.user.upsert({
    where:  { email: 'alexis@pilote90.fr' },
    update: {},
    create: {
      email:    'alexis@pilote90.fr',
      name:     'Alexis Charlet',
      role:     'ADMIN',
      password: await bcrypt.hash('pilote90', 10),
    }
  })

  // Marie — Cliente
  const marieUser = await prisma.user.upsert({
    where:  { email: 'marie@demo.fr' },
    update: {},
    create: {
      email:    'marie@demo.fr',
      name:     'Marie Fontaine',
      role:     'CLIENT',
      password: await bcrypt.hash('marie2026', 10),
    }
  })

  const marie = await prisma.client.upsert({
    where:  { userId: marieUser.id },
    update: {},
    create: {
      userId:      marieUser.id,
      adminId:     alexis.id,
      companyName: 'Marie & Co',
      sector:      'Conseil',
      status:      'SASU',
    }
  })

  // Thomas — Client
  const thomasUser = await prisma.user.upsert({
    where:  { email: 'thomas@demo.fr' },
    update: {},
    create: {
      email:    'thomas@demo.fr',
      name:     'Thomas Martin',
      role:     'CLIENT',
      password: await bcrypt.hash('thomas2026', 10),
    }
  })

  const thomas = await prisma.client.upsert({
    where:  { userId: thomasUser.id },
    update: {},
    create: {
      userId:      thomasUser.id,
      adminId:     alexis.id,
      companyName: 'Thomas Consulting',
      sector:      'Consulting digital',
      status:      'Micro-entreprise',
    }
  })

  // Cycle actif pour Marie
  const startDate = new Date('2026-01-13')
  const endDate   = new Date('2026-04-12')

  const cycle = await prisma.cycle.upsert({
    where:  { id: 'cycle-marie-1' },
    update: {},
    create: {
      id:              'cycle-marie-1',
      clientId:        marie.id,
      cycleNumber:     1,
      mainObjective:   'Atteindre 5 000 € de CA mensuel récurrent',
      startDate,
      endDate,
      caTargetMonthly: 500000, // 5 000 € en centimes
      status:          'ACTIVE',
      weeks: {
        create: Array.from({ length: 12 }, (_, i) => ({
          weekNumber: i + 1,
          startDate:  new Date(startDate.getTime() + i * 7 * 86400000),
          focusTitle: i === 2 ? 'Finaliser la page de vente' : null,
        }))
      }
    }
  })

  // Quelques transactions pour Marie
  await prisma.transaction.createMany({
    skipDuplicates: true,
    data: [
      { clientId: marie.id, type: 'REVENUE',  amountHt: 80000,  label: 'Sophie Mercier — Mois 2', category: 'CLIENT_PAYMENT', recurrence: 'MONTHLY',  transactionDate: new Date('2026-02-17') },
      { clientId: marie.id, type: 'REVENUE',  amountHt: 35000,  label: 'Session Flash — Carole',  category: 'CLIENT_PAYMENT', recurrence: 'ONE_TIME', transactionDate: new Date('2026-02-15') },
      { clientId: marie.id, type: 'EXPENSE',  amountHt: 1600,   label: 'Notion Pro',              category: 'SAAS_TOOL',      recurrence: 'MONTHLY',  transactionDate: new Date('2026-02-01') },
      { clientId: marie.id, type: 'EXPENSE',  amountHt: 1200,   label: 'Calendly Pro',            category: 'SAAS_TOOL',      recurrence: 'MONTHLY',  transactionDate: new Date('2026-02-01') },
      { clientId: marie.id, type: 'EXPENSE',  amountHt: 56700,  label: 'URSSAF Janvier',          category: 'CONTRIBUTION',   recurrence: 'MONTHLY',  transactionDate: new Date('2026-02-05') },
      { clientId: marie.id, type: 'REVENUE',  amountHt: 120000, label: 'Nathalie Roy — Démarrage',category: 'CLIENT_PAYMENT', recurrence: 'ONE_TIME', transactionDate: new Date('2026-02-01') },
    ]
  })

  // Priorités CEO pour Marie
  await prisma.objective.createMany({
    skipDuplicates: true,
    data: [
      { cycleId: cycle.id, title: 'Atteindre 5 000 € de CA mensuel', progressPct: 78, status: 'IN_PROGRESS', description: 'Objectif financier principal du Cycle 1' },
      { cycleId: cycle.id, title: 'Signer 3 nouveaux clients',       progressPct: 33, status: 'IN_PROGRESS', description: 'Via prospection LinkedIn et réseau' },
      { cycleId: cycle.id, title: 'Lancer l\'offre Pilote90',        progressPct: 15, status: 'IN_PROGRESS', description: 'Page de vente + séquence email' },
    ]
  })

  console.log('✅ Seed terminé !')
  console.log('  👤 Admin     : alexis@pilote90.fr / pilote90')
  console.log('  👤 Cliente   : marie@demo.fr / marie2026')
  console.log('  👤 Client    : thomas@demo.fr / thomas2026')
}

main().catch(console.error).finally(() => prisma.$disconnect())