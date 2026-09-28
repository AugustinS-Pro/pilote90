-- Le « Mentor » de la version Notion : chaque axe s'ouvre sur un cours a lire
-- avant de remplir les blocs. C'est la demande d'Alexis du 19 septembre, un lien
-- vers le cours de la bibliotheque sur chaque page d'axe.
--
-- Plutot qu'une table de plus, une ressource existante se rattache a un axe. Une
-- ressource sans axe reste une ressource de bibliotheque ordinaire, ce qui est
-- le cas de toutes celles deja en base : la colonne est nullable et rien n'est
-- a reprendre. Le type COURS distingue le cours du guide et du modele.

-- AlterEnum
ALTER TYPE "ResourceType" ADD VALUE 'COURS';

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN "axe" "AxeCoffre";

-- CreateIndex
CREATE INDEX "Resource_axe_idx" ON "Resource"("axe");
