import { PrismaClient } from '../app/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
const JOUR = 86400000

/** Dates glissantes : le jeu de demonstration reste coherent quelle que soit la date. */
function ilYA(jours: number): Date {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  return new Date(d.getTime() - jours * JOUR)
}
const dans = (jours: number) => ilYA(-jours)

async function main() {
  console.log('Seed en cours...')

  // === Comptes ==============================================================

  // Les formules disent ce que chacun a ACHETE, les capacites ce qui lui est
  // DELEGUE. Alexis vend de l'accompagnement adosse au module d'audit, Sandrine
  // vend l'autonomie sur les cinq axes. Les deux consultent leur portefeuille,
  // sans jamais voir celui de l'autre.
  const CONSULTANT = ['PORTEFEUILLE_CONSULTER', 'COMPTES_ADMINISTRER'] as const

  const alexis = await prisma.user.upsert({
    where: { email: 'alexis@pilote90.fr' },
    update: { formule: 'ACCOMPAGNEMENT', capacites: [...CONSULTANT] },
    create: {
      email: 'alexis@pilote90.fr', name: 'Alexis Charlet', role: 'ADMIN',
      password: await bcrypt.hash('pilote90', 10),
      formule: 'ACCOMPAGNEMENT', capacites: [...CONSULTANT],
    },
  })

  const marieUser = await prisma.user.upsert({
    where: { email: 'marie@demo.fr' },
    update: { formule: 'COMPLETE' },
    create: {
      email: 'marie@demo.fr', name: 'Marie Fontaine', role: 'CLIENT',
      password: await bcrypt.hash('marie2026', 10),
      formule: 'COMPLETE',
    },
  })

  const thomasUser = await prisma.user.upsert({
    where: { email: 'thomas@demo.fr' },
    update: { formule: 'ACCOMPAGNEMENT' },
    create: {
      email: 'thomas@demo.fr', name: 'Thomas Martin', role: 'CLIENT',
      password: await bcrypt.hash('thomas2026', 10),
      formule: 'ACCOMPAGNEMENT',
    },
  })

  const marie = await prisma.client.upsert({
    where: { userId: marieUser.id },
    update: { adminId: alexis.id },
    create: {
      userId: marieUser.id, adminId: alexis.id,
      companyName: 'Marie & Co', sector: 'Conseil', status: 'SASU',
    },
  })

  const thomas = await prisma.client.upsert({
    where: { userId: thomasUser.id },
    update: { adminId: alexis.id },
    create: {
      userId: thomasUser.id, adminId: alexis.id,
      companyName: 'Thomas Consulting', sector: 'Consulting digital', status: 'Micro-entreprise',
    },
  })

  // === Axe 5 : cycle actif de Marie, semaine 6 sur 12 =======================

  const debut = ilYA(35)
  const fin = dans(55)

  const cycle = await prisma.cycle.upsert({
    where: { id: 'cycle-marie-1' },
    update: {
      startDate: debut, endDate: fin, status: 'ACTIVE',
      mainObjective: 'Atteindre 5 000 € de CA mensuel recurrent',
      caTargetMonthly: 500000, name: 'Structurer et vendre',
    },
    create: {
      id: 'cycle-marie-1', clientId: marie.id, cycleNumber: 1,
      name: 'Structurer et vendre',
      mainObjective: 'Atteindre 5 000 € de CA mensuel recurrent',
      startDate: debut, endDate: fin, caTargetMonthly: 500000, status: 'ACTIVE',
    },
  })

  const focus: Record<number, string> = {
    3: 'Finaliser la page de vente',
    5: 'Relancer les cinq prospects tiedes',
    6: 'Boucler la refonte de l offre socle',
  }

  /** Numero de semaine vers l'identifiant reellement en base. */
  const idSemaine = new Map<number, string>()

  for (let i = 0; i < 12; i++) {
    const id = `week-marie-1-${i + 1}`
    const donnees = {
      weekNumber: i + 1,
      startDate: new Date(debut.getTime() + i * 7 * JOUR),
      focusTitle: focus[i + 1] ?? null,
    }
    // On cible la contrainte d'unicite metier, pas l'identifiant technique :
    // des semaines creees lors d'un seed precedent portent un autre `id` mais
    // le meme couple (cycle, numero), et l'upsert par `id` tenterait alors une
    // creation qui viole la contrainte.
    const semaine = await prisma.week.upsert({
      where: { cycleId_weekNumber: { cycleId: cycle.id, weekNumber: i + 1 } },
      update: donnees,
      create: { id, cycleId: cycle.id, ...donnees },
    })
    // On retient l'identifiant REEL : une semaine creee par un seed anterieur
    // porte un cuid, pas l'identifiant lisible construit ci-dessus.
    idSemaine.set(i + 1, semaine.id)
  }

  const revues = [
    { semaine: 4, works: 'Les appels de decouverte se remplissent tout seuls', blocks: 'Trop de temps sur la mise en forme des propositions', adjust: 'Creer un modele de proposition reutilisable' },
    { semaine: 5, works: 'Le modele de proposition fait gagner une heure par dossier', blocks: 'Deux relances oubliees', adjust: 'Bloquer 20 minutes de relance le vendredi matin' },
  ]
  for (const r of revues) {
    const weekId = idSemaine.get(r.semaine)
    if (!weekId) continue
    await prisma.weekReview.upsert({
      where: { weekId },
      update: { whatWorks: r.works, whatBlocks: r.blocks, adjustments: r.adjust },
      create: { weekId, whatWorks: r.works, whatBlocks: r.blocks, adjustments: r.adjust },
    })
  }

  const plans = [
    { monthNumber: 1, theme: 'Clarifier l offre', caTargetHt: 300000, notes: 'Retravailler la promesse et le prix' },
    { monthNumber: 2, theme: 'Remplir le pipeline', caTargetHt: 500000, notes: 'Vingt conversations de decouverte' },
    { monthNumber: 3, theme: 'Installer le recurrent', caTargetHt: 700000, notes: 'Convertir trois accompagnements en mensuel' },
  ]
  for (const p of plans) {
    await prisma.monthlyPlan.upsert({
      where: { cycleId_monthNumber: { cycleId: cycle.id, monthNumber: p.monthNumber } },
      update: p, create: { cycleId: cycle.id, ...p },
    })
  }

  const objectifs = [
    { id: 'obj-marie-1', rank: 1, title: 'Atteindre 5 000 € de CA mensuel', description: 'Objectif financier principal du cycle', progressPct: 78 },
    { id: 'obj-marie-2', rank: 2, title: 'Signer 3 nouveaux clients', description: 'Via prospection LinkedIn et reseau', progressPct: 33 },
    { id: 'obj-marie-3', rank: 3, title: "Lancer l'offre Pilote90", description: 'Page de vente et sequence email', progressPct: 15 },
  ]
  for (const o of objectifs) {
    const { id, ...donnees } = o
    await prisma.objective.upsert({
      where: { id }, update: { ...donnees, status: 'IN_PROGRESS' },
      create: { id, cycleId: cycle.id, status: 'IN_PROGRESS', ...donnees },
    })
  }

  const taches = [
    { id: 'task-1', label: 'Appeler Sophie pour la reconduction', tag: 'VENTE' as const, objectiveId: 'obj-marie-1', done: true, jours: 0 },
    { id: 'task-2', label: 'Publier le retour d experience de Nathalie', tag: 'COMMUNICATION' as const, objectiveId: 'obj-marie-2', done: false, jours: 0 },
    { id: 'task-3', label: 'Finaliser la page de vente de l offre socle', tag: 'OFFRE' as const, objectiveId: 'obj-marie-3', done: false, jours: 0 },
    { id: 'task-4', label: 'Rapprocher les charges URSSAF du trimestre', tag: 'FINANCE' as const, objectiveId: null, done: false, jours: 1 },
    { id: 'task-5', label: 'Relancer les deux propositions en attente', tag: 'VENTE' as const, objectiveId: 'obj-marie-2', done: false, jours: 2 },
  ]
  for (const t of taches) {
    const { id, jours, ...donnees } = t
    const enregistrement = { ...donnees, cycleId: cycle.id, dueDate: dans(jours) }
    await prisma.task.upsert({
      where: { id }, update: enregistrement, create: { id, clientId: marie.id, ...enregistrement },
    })
  }

  // === Axe 1 : les quatre piliers ==========================================

  const piliers = [
    { cle: 'VISION' as const, synthese: "Un cabinet de conseil a taille humaine, qui accompagne quinze dirigeantes par an sans que je travaille le week-end." },
    { cle: 'MISSION' as const, synthese: "J'aide les dirigeantes de TPE a piloter leur activite par cycles de 90 jours, pour obtenir de la clarte et du temps, grace a un accompagnement structure." },
    { cle: 'GRAND_POURQUOI' as const, synthese: "Parce que j'ai vu trop de bonnes entrepreneuses s'epuiser faute d'un cap, pas faute de talent." },
    { cle: 'OBJECTIF_ANNUEL' as const, synthese: "60 000 € de chiffre d'affaires, dont la moitie en recurrent, avec douze clientes accompagnees." },
  ]
  for (const p of piliers) {
    await prisma.strategyEntry.upsert({
      where: { clientId_key: { clientId: marie.id, key: p.cle } },
      update: { synthesis: p.synthese },
      create: { clientId: marie.id, key: p.cle, synthesis: p.synthese },
    })
  }

  const idees = [
    { id: 'idea-1', content: 'Un atelier collectif trimestriel pour les anciennes clientes' },
    { id: 'idea-2', content: 'Une newsletter mensuelle avec un indicateur commente' },
    { id: 'idea-3', content: 'Tester un tarif d entree a 490 € pour la premiere seance' },
  ]
  for (const i of idees) {
    await prisma.idea.upsert({
      where: { id: i.id }, update: { content: i.content },
      create: { id: i.id, clientId: marie.id, cycleId: cycle.id, content: i.content },
    })
  }

  const decisions = [
    { id: 'dec-1', title: "Arreter l'offre a la carte pour ne garder que l'accompagnement 90 jours", category: 'OFFRE' as const, context: 'Trop de temps de vente pour un panier faible. On concentre sur ce qui transforme.', jours: 28 },
    { id: 'dec-2', title: 'Passer la prospection sur LinkedIn uniquement', category: 'COMMUNICATION' as const, context: 'Les trois dernieres clientes viennent toutes de la meme source.', jours: 14 },
    { id: 'dec-3', title: 'Provisionner 25 % de chaque encaissement pour les charges', category: 'FINANCE' as const, context: 'Deux echeances URSSAF ont ete difficiles a absorber.', jours: 5 },
  ]
  for (const d of decisions) {
    const { id, jours, ...donnees } = d
    await prisma.decision.upsert({
      where: { id }, update: { ...donnees, decidedAt: ilYA(jours) },
      create: { id, clientId: marie.id, cycleId: cycle.id, decidedAt: ilYA(jours), ...donnees },
    })
  }

  // === Axe 2 : structure, charges, echeances, transactions ==================

  await prisma.adminProfile.upsert({
    where: { clientId: marie.id }, update: {},
    create: {
      clientId: marie.id, legalStatus: 'SASU', proBankAccount: true,
      invoicingTool: 'Indy', accountingTool: 'Expert-comptable', proInsurance: true,
      vatRegime: 'Franchise en base', siret: '84212345600018', siren: '842123456',
    },
  })

  await prisma.chargeRate.upsert({
    where: { clientId: marie.id }, update: {},
    create: {
      clientId: marie.id, socialContributionPct: 21.2, incomeTaxPct: 2.2,
      trainingPct: 0.2, category: 'BNC',
    },
  })

  await prisma.revenueGoal.upsert({
    where: { id: 'goal-marie-1' }, update: {},
    create: {
      id: 'goal-marie-1', clientId: marie.id,
      offerName: 'Accompagnement 90 jours', netTargetHt: 350000, offerPriceHt: 150000,
    },
  })

  const echeances = [
    { id: 'dl-1', label: 'Declaration URSSAF trimestrielle', jours: 12, recurrence: 'Trimestrielle' },
    { id: 'dl-2', label: 'Acompte impot sur le revenu', jours: 40, recurrence: 'Trimestrielle' },
    { id: 'dl-3', label: 'Renouvellement assurance professionnelle', jours: 70, recurrence: 'Annuelle' },
  ]
  for (const e of echeances) {
    const { id, jours, ...donnees } = e
    await prisma.adminDeadline.upsert({
      where: { id }, update: { ...donnees, dueDate: dans(jours) },
      create: { id, clientId: marie.id, dueDate: dans(jours), ...donnees },
    })
  }

  const transactions = [
    { id: 'tr-01', type: 'REVENUE' as const, amountHt: 150000, label: 'Nathalie Roy, Accompagnement', category: 'CLIENT_PAYMENT', recurrence: 'ONE_TIME', jours: 84 },
    { id: 'tr-02', type: 'EXPENSE' as const, amountHt: 56700, label: 'URSSAF', category: 'CONTRIBUTION', recurrence: 'MONTHLY', jours: 80 },
    { id: 'tr-03', type: 'REVENUE' as const, amountHt: 80000, label: 'Sophie Mercier, Mois 1', category: 'CLIENT_PAYMENT', recurrence: 'MONTHLY', jours: 66 },
    { id: 'tr-04', type: 'EXPENSE' as const, amountHt: 2800, label: 'Outils SaaS', category: 'SAAS_TOOL', recurrence: 'MONTHLY', jours: 62 },
    { id: 'tr-05', type: 'REVENUE' as const, amountHt: 120000, label: 'Atelier collectif, printemps', category: 'CLIENT_PAYMENT', recurrence: 'ONE_TIME', jours: 52 },
    { id: 'tr-06', type: 'EXPENSE' as const, amountHt: 56700, label: 'URSSAF', category: 'CONTRIBUTION', recurrence: 'MONTHLY', jours: 50 },
    { id: 'tr-07', type: 'REVENUE' as const, amountHt: 80000, label: 'Sophie Mercier, Mois 2', category: 'CLIENT_PAYMENT', recurrence: 'MONTHLY', jours: 36 },
    { id: 'tr-08', type: 'EXPENSE' as const, amountHt: 2800, label: 'Outils SaaS', category: 'SAAS_TOOL', recurrence: 'MONTHLY', jours: 32 },
    { id: 'tr-09', type: 'REVENUE' as const, amountHt: 35000, label: 'Session flash, Carole', category: 'CLIENT_PAYMENT', recurrence: 'ONE_TIME', jours: 20 },
    { id: 'tr-10', type: 'REVENUE' as const, amountHt: 150000, label: 'Claire Besson, Accompagnement', category: 'CLIENT_PAYMENT', recurrence: 'ONE_TIME', jours: 12 },
    { id: 'tr-11', type: 'EXPENSE' as const, amountHt: 8900, label: 'Hebergement et outils', category: 'SAAS_TOOL', recurrence: 'MONTHLY', jours: 6 },
    { id: 'tr-12', type: 'REVENUE' as const, amountHt: 80000, label: 'Sophie Mercier, Mois 3', category: 'CLIENT_PAYMENT', recurrence: 'MONTHLY', jours: 3 },
  ]
  for (const t of transactions) {
    const { id, jours, ...donnees } = t
    const enregistrement = { ...donnees, transactionDate: ilYA(jours) }
    await prisma.transaction.upsert({
      where: { id }, update: enregistrement, create: { id, clientId: marie.id, ...enregistrement },
    })
  }

  // Quelques mouvements chez Thomas, pour que le portefeuille d'Alexis vive.
  const trThomas = [
    { id: 'tr-th-1', type: 'REVENUE' as const, amountHt: 240000, label: 'Refonte site, Acme', jours: 40 },
    { id: 'tr-th-2', type: 'EXPENSE' as const, amountHt: 180000, label: 'Sous-traitance design', jours: 38 },
    { id: 'tr-th-3', type: 'EXPENSE' as const, amountHt: 92000, label: 'URSSAF', jours: 10 },
    { id: 'tr-th-4', type: 'REVENUE' as const, amountHt: 60000, label: 'Maintenance mensuelle', jours: 5 },
  ]
  for (const t of trThomas) {
    const { id, jours, ...donnees } = t
    const enregistrement = { ...donnees, transactionDate: ilYA(jours) }
    await prisma.transaction.upsert({
      where: { id }, update: enregistrement, create: { id, clientId: thomas.id, ...enregistrement },
    })
  }

  // === Axe 3 : persona, offres, clients, retours ============================

  const persona = await prisma.persona.upsert({
    where: { id: 'persona-1' }, update: {},
    create: {
      id: 'persona-1', clientId: marie.id, name: 'Camille, dirigeante de TPE',
      dailyLife: 'Trois ans d activite, deux salaries, elle fait tout elle-meme et court apres le temps.',
      frustrations: 'Elle ne sait jamais si le mois sera bon avant la fin du mois.',
      desires: 'Une vision claire de ses chiffres et un plan qui tient sur trois mois.',
      objections: "Elle a deja essaye des outils qu'elle n'a jamais remplis.",
      transformation: 'De la navigation a vue a un pilotage par cycles de 90 jours.',
      magicSentence: "J'aide les dirigeantes de TPE a reprendre la main sur leur activite en 90 jours.",
    },
  })

  const offres = [
    { id: 'off-1', name: 'Accompagnement Pilotage 90 jours', promise: 'Un cap clair et un plan tenu sur douze semaines', priceHt: 150000, format: 'COACHING' as const, status: 'ACTIF' as const },
    { id: 'off-2', name: 'Audit financier TPE', promise: 'Comprendre ou part l argent en une seance', priceHt: 80000, format: 'SERVICE' as const, status: 'ACTIF' as const },
    { id: 'off-3', name: 'Atelier collectif Vision CEO', promise: 'Une demi-journee pour poser sa vision a trois ans', priceHt: 35000, format: 'ATELIER' as const, status: 'EN_TEST' as const },
    { id: 'off-4', name: 'Abonnement suivi mensuel', promise: 'Un point mensuel et un tableau de bord tenu a jour', priceHt: 29000, format: 'PROGRAMME' as const, status: 'IDEE' as const },
  ]
  for (const o of offres) {
    const { id, ...donnees } = o
    await prisma.offer.upsert({
      where: { id }, update: donnees,
      create: { id, clientId: marie.id, personaId: persona.id, ...donnees },
    })
  }

  const niveaux = [
    { id: 'lvl-1', level: 'Entree', offerName: 'Atelier collectif Vision CEO', price: '350 €', goal: 'Faire decouvrir la methode', position: 0 },
    { id: 'lvl-2', level: 'Coeur de gamme', offerName: 'Accompagnement Pilotage 90 jours', price: '1 500 €', goal: 'La transformation principale', position: 1 },
    { id: 'lvl-3', level: 'Premium', offerName: 'Accompagnement annuel', price: '4 800 €', goal: 'Installer le pilotage dans la duree', position: 2 },
  ]
  for (const n of niveaux) {
    const { id, ...donnees } = n
    await prisma.offerLevel.upsert({ where: { id }, update: donnees, create: { id, clientId: marie.id, ...donnees } })
  }

  const fiches = [
    { id: 'crm-1', companyName: 'Sophie Mercier', contactName: 'Sophie Mercier', email: 'sophie@exemple.fr', status: 'ACTIF' as const, notes: 'Accompagnement mensuel, tres reguliere. Reconduction a preparer.' },
    { id: 'crm-2', companyName: 'Nathalie Roy', contactName: 'Nathalie Roy', email: 'nathalie@exemple.fr', status: 'TERMINE' as const, notes: 'Cycle termine, retour tres positif. Candidate a l offre annuelle.' },
    { id: 'crm-3', companyName: 'Claire Besson', contactName: 'Claire Besson', email: 'claire@exemple.fr', status: 'ACTIF' as const, notes: 'Demarrage recent, premiere seance faite.' },
    { id: 'crm-4', companyName: 'Carole Vidal', contactName: 'Carole Vidal', status: 'INACTIF' as const, notes: 'Session flash uniquement.' },
  ]
  for (const f of fiches) {
    const { id, ...donnees } = f
    await prisma.crmClient.upsert({ where: { id }, update: donnees, create: { id, clientId: marie.id, ...donnees } })
  }

  const achats = [
    { id: 'ach-1', crmClientId: 'crm-2', offerId: 'off-1', amountHt: 150000, jours: 84 },
    { id: 'ach-2', crmClientId: 'crm-1', offerId: 'off-1', amountHt: 80000, jours: 66 },
    { id: 'ach-3', crmClientId: 'crm-4', offerId: 'off-3', amountHt: 35000, jours: 20 },
    { id: 'ach-4', crmClientId: 'crm-3', offerId: 'off-1', amountHt: 150000, jours: 12 },
    { id: 'ach-5', crmClientId: 'crm-1', offerId: 'off-2', amountHt: 80000, jours: 3 },
  ]
  for (const a of achats) {
    const { id, jours, ...donnees } = a
    const enregistrement = { ...donnees, purchasedAt: ilYA(jours) }
    await prisma.purchase.upsert({ where: { id }, update: enregistrement, create: { id, clientId: marie.id, ...enregistrement } })
  }

  const retours = [
    { id: 'fb-1', crmClientId: 'crm-2', offerId: 'off-1', rating: 5, comment: 'Pour la premiere fois je sais ou je vais. Le decoupage en 90 jours a tout change.' },
    { id: 'fb-2', crmClientId: 'crm-1', offerId: 'off-1', rating: 5, comment: 'Le point mensuel est devenu mon rendez-vous le plus utile.' },
    { id: 'fb-3', crmClientId: 'crm-4', offerId: 'off-3', rating: 4, comment: "Tres bien, j'aurais aime une demi-journee de plus." },
  ]
  for (const r of retours) {
    const { id, ...donnees } = r
    await prisma.feedback.upsert({ where: { id }, update: donnees, create: { id, clientId: marie.id, ...donnees } })
  }

  // === Axe 4 : contenus et pipeline ========================================

  const problemes = [
    { id: 'pb-1', problem: 'Je ne sais pas si mon mois sera bon', question: 'Comment anticiper mon chiffre ?', understanding: 'Ce qui fait varier son CA', topic: 'Le previsionnel a trois scenarios', angle: 'Le calcul en cinq minutes', position: 0 },
    { id: 'pb-2', problem: 'Je travaille beaucoup et je gagne peu', question: 'Ou part mon temps ?', understanding: 'La rentabilite par offre', topic: 'Calculer le CA genere par offre', angle: "L'offre qui rapporte le moins est souvent la preferee", position: 1 },
  ]
  for (const p of problemes) {
    const { id, ...donnees } = p
    await prisma.clientProblem.upsert({ where: { id }, update: donnees, create: { id, clientId: marie.id, ...donnees } })
  }

  const thematiques = [
    { id: 'th-1', label: 'Pilotage financier', whyImportant: 'C est la premiere source d angoisse des dirigeantes', linkToOffer: 'Audit financier TPE', position: 0 },
    { id: 'th-2', label: 'Methode des 90 jours', whyImportant: 'Le cadre qui rend un objectif annuel atteignable', linkToOffer: 'Accompagnement Pilotage 90 jours', position: 1 },
    { id: 'th-3', label: 'Posture de dirigeante', whyImportant: 'Sortir de l execution pour decider', linkToOffer: 'Atelier collectif Vision CEO', position: 2 },
  ]
  for (const t of thematiques) {
    const { id, ...donnees } = t
    await prisma.contentTheme.upsert({ where: { id }, update: donnees, create: { id, clientId: marie.id, ...donnees } })
  }

  const contenus = [
    { id: 'ct-1', subject: 'Les 3 chiffres a regarder chaque lundi matin', themeId: 'th-1', contentType: 'EDUCATION' as const, format: 'CARROUSEL' as const, platform: 'LinkedIn', marketingGoal: 'ATTIRER' as const, weekNumber: 1, status: 'PUBLIE' as const },
    { id: 'ct-2', subject: 'Pourquoi un objectif annuel ne se realise jamais', themeId: 'th-2', contentType: 'EDUCATION' as const, format: 'POST' as const, platform: 'LinkedIn', marketingGoal: 'ATTIRER' as const, weekNumber: 2, status: 'PUBLIE' as const },
    { id: 'ct-3', subject: 'Le retour de Nathalie apres 90 jours', themeId: 'th-2', contentType: 'PREUVE' as const, format: 'VIDEO' as const, platform: 'LinkedIn', marketingGoal: 'NOURRIR' as const, weekNumber: 3, status: 'A_CREER' as const },
    { id: 'ct-4', subject: "Ouverture des inscriptions a l'atelier Vision", themeId: 'th-3', contentType: 'VENTE' as const, format: 'EMAIL' as const, platform: 'Newsletter', marketingGoal: 'VENDRE' as const, weekNumber: 4, status: 'A_CREER' as const },
    { id: 'ct-5', subject: 'Ce que je fais quand un mois est mauvais', themeId: 'th-3', contentType: 'CONNEXION' as const, format: 'POST' as const, platform: 'LinkedIn', marketingGoal: 'NOURRIR' as const, weekNumber: null, status: 'IDEE' as const },
  ]
  for (const c of contenus) {
    const { id, ...donnees } = c
    await prisma.contentIdea.upsert({ where: { id }, update: donnees, create: { id, clientId: marie.id, ...donnees } })
  }

  const prospects = [
    { id: 'pr-1', companyName: 'Studio Lumen', contactName: 'Lea Fontaine', estimatedHt: 150000, source: 'LinkedIn', stage: 'DECOUVERTE' as const, jours: 25 },
    { id: 'pr-2', companyName: 'Atelier Bois & Cie', contactName: 'Marc Bernard', estimatedHt: 80000, source: 'Recommandation', stage: 'QUALIFICATION' as const, jours: 18 },
    { id: 'pr-3', companyName: 'Cabinet Renaud', contactName: 'Pierre Renaud', estimatedHt: 480000, source: 'Reseau', stage: 'PROPOSITION' as const, jours: 10 },
    { id: 'pr-4', companyName: 'Fleurs & Sens', contactName: 'Aline Petit', estimatedHt: 35000, source: 'Site web', stage: 'PROPOSITION' as const, jours: 7 },
    { id: 'pr-5', companyName: 'Claire Besson', contactName: 'Claire Besson', estimatedHt: 150000, source: 'LinkedIn', stage: 'SIGNE' as const, jours: 0 },
  ]
  for (const p of prospects) {
    const { id, jours, ...donnees } = p
    const enregistrement = { ...donnees, expectedCloseDate: dans(jours) }
    await prisma.prospect.upsert({ where: { id }, update: enregistrement, create: { id, clientId: marie.id, ...enregistrement } })
  }

  // === Les trois portefeuilles ==============================================
  //
  // Sandrine et Alexis n'accompagnent pas les memes entreprises, et c'est deja
  // vrai dans le schema : chaque fiche porte son `adminId`, et le portefeuille
  // ne remonte que les clients du consultant connecte. Ce jeu de donnees rend
  // ce cloisonnement DEMONTRABLE : on se connecte avec l'un, puis avec l'autre,
  // et les listes n'ont aucune entreprise en commun.
  //
  // Les adresses sont volontairement en @pilote90.fr : ce fichier est commite
  // dans un depot public, aucune adresse personnelle n'y a sa place. Les vrais
  // comptes se creent depuis l'interface ou avec scripts/comptes.mjs.

  const sandrine = await prisma.user.upsert({
    where: { email: 'sandrine@pilote90.fr' },
    update: { formule: 'AUTONOMIE', capacites: [...CONSULTANT] },
    create: {
      email: 'sandrine@pilote90.fr', name: 'Sandrine Seiter', role: 'ADMIN',
      password: await bcrypt.hash('sandrine2026', 10),
      formule: 'AUTONOMIE', capacites: [...CONSULTANT],
    },
  })

  const augustin = await prisma.user.upsert({
    where: { email: 'augustin@pilote90.fr' },
    update: { formule: 'COMPLETE', capacites: [...CONSULTANT] },
    create: {
      email: 'augustin@pilote90.fr', name: 'Augustin Seiter', role: 'ADMIN',
      password: await bcrypt.hash('augustin2026', 10),
      formule: 'COMPLETE', capacites: [...CONSULTANT],
    },
  })

  // === Bibliotheque commune, deposee par chaque consultant =================
  //
  // Une ressource commune porte desormais l'`adminId` de celui qui l'a
  // deposee. Sans lui, elle n'appartenait a personne : elle etait lue par
  // tous les locataires de l'instance et supprimable par n'importe quel
  // consultant. Chaque consultant a donc sa propre bibliotheque, et le
  // cloisonnement se montre en deux connexions.

  const RESSOURCES = [
    { cle: 'res-1', title: 'Bien demarrer son premier cycle de 90 jours', type: 'GUIDE' as const, description: 'Les six etapes de la mise en route, a lire avant la premiere seance.' },
    { cle: 'res-2', title: 'Le point du lundi matin', type: 'RITUEL' as const, description: 'Quinze minutes chaque lundi : trois chiffres, trois priorites, une decision.' },
    { cle: 'res-3', title: 'Modele de cycle, lancement d une nouvelle offre', type: 'MODELE' as const, description: 'Un decoupage en douze semaines deja rempli, a adapter.' },
  ]

  for (const [suffixe, consultant] of [['alexis', alexis], ['sandrine', sandrine], ['augustin', augustin]] as const) {
    for (const r of RESSOURCES) {
      const { cle, ...donnees } = r
      // `res-1` reste l'identifiant d'Alexis : les lignes deja en base gardent
      // leur identite et recoivent simplement leur proprietaire.
      const id = suffixe === 'alexis' ? cle : `${cle}-${suffixe}`
      const enregistrement = { ...donnees, clientId: null, adminId: consultant.id }
      await prisma.resource.upsert({ where: { id }, update: enregistrement, create: { id, ...enregistrement } })
    }
  }

  /**
   * Profils de situation financiere.
   *
   * Chacun declenche volontairement un constat different de `auditerFinances`,
   * pour que le portefeuille montre les trois niveaux d'un seul coup d'oeil et
   * que le tri par urgence ait quelque chose a trier.
   *
   * `joursDepuisDerniereSaisie` agit sur `createdAt`, la date de la SAISIE, pas
   * sur `transactionDate` : c'est elle que lit l'indicateur de fraicheur.
   */
  const PROFILS = {
    sain: { caMensuel: 620000, ratioCharges: 0.28, joursDepuisDerniereSaisie: 2 },
    tendu: { caMensuel: 310000, ratioCharges: 0.68, joursDepuisDerniereSaisie: 5 },
    decroche: { caMensuel: 450000, ratioCharges: 0.34, joursDepuisDerniereSaisie: 52 },
  } as const

  type CleProfil = keyof typeof PROFILS

  async function portefeuille(
    adminId: string,
    fiches: {
      email: string; nom: string; entreprise: string; secteur: string; statut: string
      profil: CleProfil; formule: 'AUTONOMIE' | 'ACCOMPAGNEMENT' | 'COMPLETE'
    }[],
  ) {
    for (const fiche of fiches) {
      const compte = await prisma.user.upsert({
        where: { email: fiche.email },
        update: { formule: fiche.formule },
        create: {
          email: fiche.email, name: fiche.nom, role: 'CLIENT',
          password: await bcrypt.hash('demo2026', 10),
          formule: fiche.formule,
        },
      })

      const dossier = await prisma.client.upsert({
        where: { userId: compte.id },
        update: { adminId },
        create: {
          userId: compte.id, adminId,
          companyName: fiche.entreprise, sector: fiche.secteur, status: fiche.statut,
        },
      })

      const p = PROFILS[fiche.profil]

      await prisma.cycle.upsert({
        where: { id: `cycle-${dossier.id}` },
        update: {},
        create: {
          id: `cycle-${dossier.id}`,
          clientId: dossier.id,
          cycleNumber: 1,
          name: 'Structurer et vendre',
          mainObjective: 'Structurer et vendre',
          startDate: ilYA(35),
          endDate: dans(55),
          status: 'ACTIVE',
          caTargetMonthly: Math.round(p.caMensuel * 1.2),
        },
      })

      // Six mois d'historique, un revenu et une charge par mois.
      for (let recul = 5; recul >= 0; recul--) {
        const mois = ilYA(recul * 30 + 6)
        const variation = 1 + ((recul % 3) - 1) * 0.12
        const saisiLe = recul === 0 ? ilYA(p.joursDepuisDerniereSaisie) : ilYA(recul * 30 + 4)

        await prisma.transaction.upsert({
          where: { id: `tr-${dossier.id}-r${recul}` },
          update: {},
          create: {
            id: `tr-${dossier.id}-r${recul}`,
            clientId: dossier.id,
            type: 'REVENUE',
            amountHt: Math.round(p.caMensuel * variation),
            transactionDate: mois,
            label: 'Prestation d accompagnement',
            category: 'Prestation',
            createdAt: saisiLe,
          },
        })

        await prisma.transaction.upsert({
          where: { id: `tr-${dossier.id}-c${recul}` },
          update: {},
          create: {
            id: `tr-${dossier.id}-c${recul}`,
            clientId: dossier.id,
            type: 'EXPENSE',
            amountHt: Math.round(p.caMensuel * variation * p.ratioCharges),
            transactionDate: mois,
            label: 'Charges du mois',
            category: 'Frais generaux',
            createdAt: saisiLe,
          },
        })
      }
    }
  }

  await portefeuille(sandrine.id, [
    { email: 'lea@demo.fr', nom: 'Lea Mercier', entreprise: 'Atelier Lumiere', secteur: 'Artisanat d art', statut: 'EURL', profil: 'sain', formule: 'AUTONOMIE' },
    { email: 'karim@demo.fr', nom: 'Karim Benali', entreprise: 'Studio Bergamote', secteur: 'Design graphique', statut: 'SASU', profil: 'tendu', formule: 'AUTONOMIE' },
    { email: 'julie@demo.fr', nom: 'Julie Nguyen', entreprise: 'La Fabrique Verte', secteur: 'Cosmetique', statut: 'Micro-entreprise', profil: 'decroche', formule: 'AUTONOMIE' },
  ])

  await portefeuille(augustin.id, [
    { email: 'paul@demo.fr', nom: 'Paul Ferrand', entreprise: 'Ferrand Menuiserie', secteur: 'Artisanat', statut: 'EURL', profil: 'sain', formule: 'COMPLETE' },
  ])

  console.log('Seed termine.')
  console.log('')
  console.log('  Consultants')
  console.log('    alexis@pilote90.fr   / pilote90       -> Marie & Co, Thomas Consulting')
  console.log('    sandrine@pilote90.fr / sandrine2026   -> Atelier Lumiere, Studio Bergamote, La Fabrique Verte')
  console.log('    augustin@pilote90.fr / augustin2026   -> Ferrand Menuiserie')
  console.log('')
  console.log('  Entrepreneurs')
  console.log('    marie@demo.fr / marie2026, thomas@demo.fr / thomas2026')
  console.log('    lea@demo.fr, karim@demo.fr, julie@demo.fr, paul@demo.fr  -> tous en demo2026')
  console.log(`  Cycle 1 : ${debut.toLocaleDateString('fr-FR')} -> ${fin.toLocaleDateString('fr-FR')} (semaine 6 sur 12)`)
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
