-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "adminId" TEXT;

-- CreateIndex
CREATE INDEX "Resource_adminId_idx" ON "Resource"("adminId");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
