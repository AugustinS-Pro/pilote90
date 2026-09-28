-- La reference de la piece d'origine d'une ecriture : le numero d'une facture
-- Factur-X lue, quand l'ecriture ne vient pas d'une saisie. Unique par client,
-- ce qui fait porter a la base le refus d'un second import de la meme facture,
-- plutot qu'a un controle applicatif que deux envois simultanes contourneraient.
--
-- L'unicite tolere plusieurs valeurs nulles : les ecritures saisies a la main
-- n'ont pas de reference et ne se genent pas entre elles.

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "sourceRef" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_clientId_sourceRef_key" ON "Transaction"("clientId", "sourceRef");
