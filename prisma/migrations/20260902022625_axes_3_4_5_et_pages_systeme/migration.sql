/*
  Warnings:

  - A unique constraint covering the columns `[cycleId,weekNumber]` on the table `Week` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StrategyKey" AS ENUM ('VISION', 'MISSION', 'GRAND_POURQUOI', 'OBJECTIF_ANNUEL');

-- CreateEnum
CREATE TYPE "IdeaOutcome" AS ENUM ('PARKED', 'KEPT', 'POSTPONED', 'DROPPED');

-- CreateEnum
CREATE TYPE "DecisionCategory" AS ENUM ('STRATEGIE', 'OFFRE', 'FINANCE', 'COMMUNICATION', 'ORGANISATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "TaxCategory" AS ENUM ('BIC', 'BNC');

-- CreateEnum
CREATE TYPE "OfferFormat" AS ENUM ('SERVICE', 'ATELIER', 'PRODUIT_DIGITAL', 'COACHING', 'PROGRAMME');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('IDEE', 'EN_TEST', 'ACTIF', 'A_AMELIORER', 'ABANDONNE');

-- CreateEnum
CREATE TYPE "CrmStatus" AS ENUM ('PROSPECT', 'ACTIF', 'TERMINE', 'INACTIF');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('EDUCATION', 'CONNEXION', 'PREUVE', 'CONVERSION', 'VENTE');

-- CreateEnum
CREATE TYPE "ContentFormat" AS ENUM ('POST', 'CARROUSEL', 'REEL', 'STORY', 'VIDEO', 'EMAIL', 'PODCAST', 'WEBINAIRE');

-- CreateEnum
CREATE TYPE "MarketingGoal" AS ENUM ('ATTIRER', 'NOURRIR', 'VENDRE');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('IDEE', 'A_CREER', 'PUBLIE');

-- CreateEnum
CREATE TYPE "ProspectStage" AS ENUM ('DECOUVERTE', 'QUALIFICATION', 'PROPOSITION', 'SIGNE');

-- CreateEnum
CREATE TYPE "TaskTag" AS ENUM ('VENTE', 'OFFRE', 'FINANCE', 'COMMUNICATION', 'ORGANISATION', 'DIVERS');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('GUIDE', 'RITUEL', 'MODELE', 'LIEN');

-- AlterEnum
ALTER TYPE "CycleStatus" ADD VALUE 'A_VENIR';

-- DropForeignKey
ALTER TABLE "Objective" DROP CONSTRAINT "Objective_cycleId_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Cycle" ADD COLUMN     "closingNote" TEXT,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "Objective" ADD COLUMN     "rank" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "WeekReview" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "whatWorks" TEXT,
    "whatBlocks" TEXT,
    "adjustments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeekReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyPlan" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "monthNumber" INTEGER NOT NULL,
    "theme" TEXT,
    "caTargetHt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "cycleId" TEXT,
    "weekId" TEXT,
    "objectiveId" TEXT,
    "label" TEXT NOT NULL,
    "tag" "TaskTag" NOT NULL DEFAULT 'DIVERS',
    "done" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyEntry" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "key" "StrategyKey" NOT NULL,
    "synthesis" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrategyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyNote" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StrategyNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "cycleId" TEXT,
    "content" TEXT NOT NULL,
    "outcome" "IdeaOutcome" NOT NULL DEFAULT 'PARKED',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "cycleId" TEXT,
    "title" TEXT NOT NULL,
    "category" "DecisionCategory" NOT NULL DEFAULT 'AUTRE',
    "context" TEXT,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "legalStatus" TEXT,
    "proBankAccount" BOOLEAN NOT NULL DEFAULT false,
    "invoicingTool" TEXT,
    "accountingTool" TEXT,
    "proInsurance" BOOLEAN NOT NULL DEFAULT false,
    "vatRegime" TEXT,
    "siret" TEXT,
    "siren" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChargeRate" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "socialContributionPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "incomeTaxPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trainingPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "category" "TaxCategory" NOT NULL DEFAULT 'BIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChargeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueGoal" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "offerName" TEXT NOT NULL,
    "netTargetHt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "offerPriceHt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenueGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminDeadline" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminDeadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dailyLife" TEXT,
    "frustrations" TEXT,
    "desires" TEXT,
    "objections" TEXT,
    "transformation" TEXT,
    "magicSentence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "personaId" TEXT,
    "name" TEXT NOT NULL,
    "promise" TEXT,
    "priceHt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "format" "OfferFormat" NOT NULL DEFAULT 'SERVICE',
    "status" "OfferStatus" NOT NULL DEFAULT 'IDEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferLevel" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "offerName" TEXT NOT NULL,
    "price" TEXT,
    "goal" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmClient" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "CrmStatus" NOT NULL DEFAULT 'ACTIF',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrmClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "crmClientId" TEXT NOT NULL,
    "offerId" TEXT,
    "amountHt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "crmClientId" TEXT,
    "offerId" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProblem" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "question" TEXT,
    "understanding" TEXT,
    "topic" TEXT,
    "angle" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentTheme" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "whyImportant" TEXT,
    "linkToOffer" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentIdea" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "themeId" TEXT,
    "subject" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL DEFAULT 'EDUCATION',
    "format" "ContentFormat" NOT NULL DEFAULT 'POST',
    "platform" TEXT,
    "marketingGoal" "MarketingGoal" NOT NULL DEFAULT 'ATTIRER',
    "weekNumber" INTEGER,
    "status" "ContentStatus" NOT NULL DEFAULT 'IDEE',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "estimatedHt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "source" TEXT,
    "stage" "ProspectStage" NOT NULL DEFAULT 'DECOUVERTE',
    "expectedCloseDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "clientId" TEXT,
    "title" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL DEFAULT 'GUIDE',
    "description" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeekReview_weekId_key" ON "WeekReview"("weekId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyPlan_cycleId_monthNumber_key" ON "MonthlyPlan"("cycleId", "monthNumber");

-- CreateIndex
CREATE INDEX "Task_clientId_done_dueDate_idx" ON "Task"("clientId", "done", "dueDate");

-- CreateIndex
CREATE INDEX "Task_objectiveId_idx" ON "Task"("objectiveId");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyEntry_clientId_key_key" ON "StrategyEntry"("clientId", "key");

-- CreateIndex
CREATE INDEX "StrategyNote_entryId_idx" ON "StrategyNote"("entryId");

-- CreateIndex
CREATE INDEX "Idea_clientId_outcome_idx" ON "Idea"("clientId", "outcome");

-- CreateIndex
CREATE INDEX "Decision_clientId_decidedAt_idx" ON "Decision"("clientId", "decidedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_clientId_key" ON "AdminProfile"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ChargeRate_clientId_key" ON "ChargeRate"("clientId");

-- CreateIndex
CREATE INDEX "RevenueGoal_clientId_idx" ON "RevenueGoal"("clientId");

-- CreateIndex
CREATE INDEX "AdminDeadline_clientId_dueDate_idx" ON "AdminDeadline"("clientId", "dueDate");

-- CreateIndex
CREATE INDEX "Persona_clientId_idx" ON "Persona"("clientId");

-- CreateIndex
CREATE INDEX "Offer_clientId_status_idx" ON "Offer"("clientId", "status");

-- CreateIndex
CREATE INDEX "OfferLevel_clientId_idx" ON "OfferLevel"("clientId");

-- CreateIndex
CREATE INDEX "CrmClient_clientId_status_idx" ON "CrmClient"("clientId", "status");

-- CreateIndex
CREATE INDEX "Purchase_clientId_purchasedAt_idx" ON "Purchase"("clientId", "purchasedAt");

-- CreateIndex
CREATE INDEX "Feedback_clientId_idx" ON "Feedback"("clientId");

-- CreateIndex
CREATE INDEX "ClientProblem_clientId_idx" ON "ClientProblem"("clientId");

-- CreateIndex
CREATE INDEX "ContentTheme_clientId_idx" ON "ContentTheme"("clientId");

-- CreateIndex
CREATE INDEX "ContentIdea_clientId_status_idx" ON "ContentIdea"("clientId", "status");

-- CreateIndex
CREATE INDEX "Prospect_clientId_stage_idx" ON "Prospect"("clientId", "stage");

-- CreateIndex
CREATE INDEX "Resource_clientId_idx" ON "Resource"("clientId");

-- CreateIndex
CREATE INDEX "Client_adminId_idx" ON "Client"("adminId");

-- CreateIndex
CREATE INDEX "Cycle_clientId_status_idx" ON "Cycle"("clientId", "status");

-- CreateIndex
CREATE INDEX "Objective_cycleId_idx" ON "Objective"("cycleId");

-- CreateIndex
CREATE INDEX "Transaction_clientId_transactionDate_idx" ON "Transaction"("clientId", "transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "Week_cycleId_weekNumber_key" ON "Week"("cycleId", "weekNumber");

-- AddForeignKey
ALTER TABLE "WeekReview" ADD CONSTRAINT "WeekReview_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyPlan" ADD CONSTRAINT "MonthlyPlan_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyEntry" ADD CONSTRAINT "StrategyEntry_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyNote" ADD CONSTRAINT "StrategyNote_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "StrategyEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Idea" ADD CONSTRAINT "Idea_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "Cycle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargeRate" ADD CONSTRAINT "ChargeRate_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevenueGoal" ADD CONSTRAINT "RevenueGoal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminDeadline" ADD CONSTRAINT "AdminDeadline_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferLevel" ADD CONSTRAINT "OfferLevel_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmClient" ADD CONSTRAINT "CrmClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_crmClientId_fkey" FOREIGN KEY ("crmClientId") REFERENCES "CrmClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_crmClientId_fkey" FOREIGN KEY ("crmClientId") REFERENCES "CrmClient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProblem" ADD CONSTRAINT "ClientProblem_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTheme" ADD CONSTRAINT "ContentTheme_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentIdea" ADD CONSTRAINT "ContentIdea_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentIdea" ADD CONSTRAINT "ContentIdea_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "ContentTheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
