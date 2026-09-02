-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('CLAIR', 'PILOTE90');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'CLAIR';
