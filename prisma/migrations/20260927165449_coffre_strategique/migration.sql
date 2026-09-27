-- CreateEnum
CREATE TYPE "AxeCoffre" AS ENUM ('VISION', 'CHIFFRES', 'OFFRES', 'COMMUNICATION', 'PILOTAGE');

-- CreateTable
CREATE TABLE "CoffreEntree" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "axe" "AxeCoffre" NOT NULL,
    "cle" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "valeur" TEXT,
    "rang" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoffreEntree_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoffreEntree_clientId_axe_idx" ON "CoffreEntree"("clientId", "axe");

-- CreateIndex
CREATE UNIQUE INDEX "CoffreEntree_clientId_axe_cle_key" ON "CoffreEntree"("clientId", "axe", "cle");

-- AddForeignKey
ALTER TABLE "CoffreEntree" ADD CONSTRAINT "CoffreEntree_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
