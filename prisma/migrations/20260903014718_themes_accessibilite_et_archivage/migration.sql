-- CreateEnum
CREATE TYPE "EtatClient" AS ENUM ('INVITE', 'ACTIF', 'ARCHIVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Theme" ADD VALUE 'SOMBRE';
ALTER TYPE "Theme" ADD VALUE 'CONTRASTE';
ALTER TYPE "Theme" ADD VALUE 'DALTONIEN';

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "archiveLe" TIMESTAMP(3),
ADD COLUMN     "etat" "EtatClient" NOT NULL DEFAULT 'ACTIF';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "echelleTexte" INTEGER NOT NULL DEFAULT 100;
