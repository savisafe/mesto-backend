-- AlterTable
ALTER TABLE "users" ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");
