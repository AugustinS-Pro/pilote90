import { z } from 'zod'

/** Saisie d'une transaction financiere (axe 2). Montants saisis en euros. */
export const transactionInput = z.object({
  type: z.enum(['REVENUE', 'EXPENSE']),
  transactionDate: z.string().min(1, 'La date est obligatoire'),
  label: z.string().trim().min(1, 'Le libelle est obligatoire').max(120, 'Libelle trop long'),
  amount: z.string().min(1, 'Le montant est obligatoire'),
  category: z.string().trim().max(60).optional(),
})

export type TransactionInput = z.infer<typeof transactionInput>

/** Convertit une saisie utilisateur en euros vers des centimes entiers. */
export function eurosVersCentimes(saisie: string): number | null {
  const normalise = saisie.replace(/\s/g, '').replace(',', '.')
  const valeur = Number(normalise)
  if (!Number.isFinite(valeur) || valeur <= 0 || valeur > 10000000) return null
  return Math.round(valeur * 100)
}

/** Saisie d'une priorite de cycle (axe 1). */
export const prioriteInput = z.object({
  title: z.string().trim().min(1, 'Le titre est obligatoire').max(120, 'Titre trop long'),
  description: z.string().trim().max(300, 'Description trop longue').optional(),
})

/** Mise a jour de la progression d'une priorite. */
export const progressionInput = z.object({
  id: z.string().min(1),
  progressPct: z.string().min(1),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'LATE']),
})

/** Convertit une saisie de pourcentage en entier borne 0-100. */
export function versPourcentage(saisie: string): number | null {
  const valeur = Number(saisie.replace(',', '.'))
  if (!Number.isFinite(valeur)) return null
  return Math.min(100, Math.max(0, Math.round(valeur)))
}

// ---------------------------------------------------------------------------
// Axe 3 - Offres & Clients
// ---------------------------------------------------------------------------

/** Client ideal. Vocabulaire repris de la version Notion. */
export const personaInput = z.object({
  name: z.string().trim().min(1, 'Donnez un nom a ce persona').max(80),
  dailyLife: z.string().trim().max(600).optional(),
  frustrations: z.string().trim().max(600).optional(),
  desires: z.string().trim().max(600).optional(),
  objections: z.string().trim().max(600).optional(),
  transformation: z.string().trim().max(600).optional(),
  magicSentence: z.string().trim().max(240).optional(),
})

export const offerInput = z.object({
  name: z.string().trim().min(1, "Le nom de l'offre est obligatoire").max(120),
  promise: z.string().trim().max(300).optional(),
  price: z.string().min(1, 'Le prix est obligatoire'),
  format: z.enum(['SERVICE', 'ATELIER', 'PRODUIT_DIGITAL', 'COACHING', 'PROGRAMME']),
  status: z.enum(['IDEE', 'EN_TEST', 'ACTIF', 'A_AMELIORER', 'ABANDONNE']),
  personaId: z.string().optional(),
})

export const offerLevelInput = z.object({
  level: z.string().trim().min(1, 'Le niveau est obligatoire').max(40),
  offerName: z.string().trim().min(1, "Le nom de l'offre est obligatoire").max(120),
  price: z.string().trim().max(40).optional(),
  goal: z.string().trim().max(240).optional(),
})

export const crmClientInput = z.object({
  companyName: z.string().trim().min(1, 'Le nom est obligatoire').max(120),
  contactName: z.string().trim().max(80).optional(),
  email: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  status: z.enum(['PROSPECT', 'ACTIF', 'TERMINE', 'INACTIF']),
  notes: z.string().trim().max(1000).optional(),
})

export const purchaseInput = z.object({
  crmClientId: z.string().min(1, 'Choisissez un client'),
  offerId: z.string().optional(),
  amount: z.string().min(1, 'Le montant est obligatoire'),
  purchasedAt: z.string().min(1, 'La date est obligatoire'),
})

export const feedbackInput = z.object({
  crmClientId: z.string().optional(),
  offerId: z.string().optional(),
  rating: z.string().min(1),
  comment: z.string().trim().max(600).optional(),
})

// ---------------------------------------------------------------------------
// Axe 4 - Communication & Ventes
// ---------------------------------------------------------------------------

export const clientProblemInput = z.object({
  problem: z.string().trim().min(1, 'Le probleme est obligatoire').max(240),
  question: z.string().trim().max(240).optional(),
  understanding: z.string().trim().max(240).optional(),
  topic: z.string().trim().max(240).optional(),
  angle: z.string().trim().max(240).optional(),
})

export const contentThemeInput = z.object({
  label: z.string().trim().min(1, 'La thematique est obligatoire').max(120),
  whyImportant: z.string().trim().max(300).optional(),
  linkToOffer: z.string().trim().max(300).optional(),
})

export const contentIdeaInput = z.object({
  subject: z.string().trim().min(1, 'Le sujet est obligatoire').max(200),
  themeId: z.string().optional(),
  contentType: z.enum(['EDUCATION', 'CONNEXION', 'PREUVE', 'CONVERSION', 'VENTE']),
  format: z.enum(['POST', 'CARROUSEL', 'REEL', 'STORY', 'VIDEO', 'EMAIL', 'PODCAST', 'WEBINAIRE']),
  platform: z.string().trim().max(60).optional(),
  marketingGoal: z.enum(['ATTIRER', 'NOURRIR', 'VENDRE']),
  weekNumber: z.string().optional(),
  status: z.enum(['IDEE', 'A_CREER', 'PUBLIE']),
})

export const prospectInput = z.object({
  companyName: z.string().trim().min(1, 'Le nom est obligatoire').max(120),
  contactName: z.string().trim().max(80).optional(),
  estimated: z.string().min(1, 'Le montant estime est obligatoire'),
  source: z.string().trim().max(60).optional(),
  stage: z.enum(['DECOUVERTE', 'QUALIFICATION', 'PROPOSITION', 'SIGNE']),
  expectedCloseDate: z.string().optional(),
  notes: z.string().trim().max(600).optional(),
})

// ---------------------------------------------------------------------------
// Axe 5 - Pilotage 90 jours
// ---------------------------------------------------------------------------

export const cycleInput = z.object({
  name: z.string().trim().max(80).optional(),
  mainObjective: z.string().trim().min(1, "L'objectif principal est obligatoire").max(240),
  caTarget: z.string().min(1, 'L objectif de CA mensuel est obligatoire'),
  startDate: z.string().min(1, 'La date de debut est obligatoire'),
})

export const monthlyPlanInput = z.object({
  monthNumber: z.string().min(1),
  theme: z.string().trim().max(120).optional(),
  caTarget: z.string().optional(),
  notes: z.string().trim().max(600).optional(),
})

export const weekInput = z.object({
  weekId: z.string().min(1),
  focusTitle: z.string().trim().max(160).optional(),
})

export const weekReviewInput = z.object({
  weekId: z.string().min(1),
  whatWorks: z.string().trim().max(600).optional(),
  whatBlocks: z.string().trim().max(600).optional(),
  adjustments: z.string().trim().max(600).optional(),
})

export const taskInput = z.object({
  label: z.string().trim().min(1, "L'intitule est obligatoire").max(200),
  tag: z.enum(['VENTE', 'OFFRE', 'FINANCE', 'COMMUNICATION', 'ORGANISATION', 'DIVERS']),
  objectiveId: z.string().optional(),
  dueDate: z.string().optional(),
})

// ---------------------------------------------------------------------------
// Pages systeme
// ---------------------------------------------------------------------------

export const decisionInput = z.object({
  title: z.string().trim().min(1, 'La decision est obligatoire').max(200),
  category: z.enum(['STRATEGIE', 'OFFRE', 'FINANCE', 'COMMUNICATION', 'ORGANISATION', 'AUTRE']),
  context: z.string().trim().max(1000).optional(),
  decidedAt: z.string().optional(),
})

export const ideaInput = z.object({
  content: z.string().trim().min(1, "L'idee est obligatoire").max(500),
})

export const resourceInput = z.object({
  title: z.string().trim().min(1, 'Le titre est obligatoire').max(160),
  type: z.enum(['GUIDE', 'RITUEL', 'MODELE', 'LIEN']),
  description: z.string().trim().max(600).optional(),
  url: z.string().trim().max(500).optional(),
})

// ---------------------------------------------------------------------------
// Axe 2 - Structure, charges et objectif de revenu
// ---------------------------------------------------------------------------

export const adminProfileInput = z.object({
  legalStatus: z.string().trim().max(60).optional(),
  proBankAccount: z.string().optional(),
  invoicingTool: z.string().trim().max(60).optional(),
  accountingTool: z.string().trim().max(60).optional(),
  proInsurance: z.string().optional(),
  vatRegime: z.string().trim().max(60).optional(),
  siret: z.string().trim().max(20).optional(),
  siren: z.string().trim().max(20).optional(),
})

export const chargeRateInput = z.object({
  socialContributionPct: z.string().optional(),
  incomeTaxPct: z.string().optional(),
  trainingPct: z.string().optional(),
  category: z.enum(['BIC', 'BNC']),
})

export const revenueGoalInput = z.object({
  offerName: z.string().trim().min(1, "Le nom de l'offre est obligatoire").max(120),
  netTarget: z.string().min(1, 'Le revenu net vise est obligatoire'),
  offerPrice: z.string().min(1, "Le prix de l'offre est obligatoire"),
})

export const deadlineInput = z.object({
  label: z.string().trim().min(1, "L'intitule est obligatoire").max(120),
  dueDate: z.string().min(1, 'La date est obligatoire'),
  recurrence: z.string().trim().max(40).optional(),
})

/** Convertit une saisie de pourcentage en nombre borne 0-100. */
export function versTaux(saisie: string | undefined): number {
  if (!saisie) return 0
  const valeur = Number(saisie.replace(',', '.'))
  if (!Number.isFinite(valeur)) return 0
  return Math.min(100, Math.max(0, valeur))
}
