/*
  Warnings:

  - The primary key for the `Rent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[activeRentId]` on the table `Scooter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeRentId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Scooter" DROP CONSTRAINT "Scooter_activeRentId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_activeRentId_fkey";

-- AlterTable
ALTER TABLE "Rent" DROP CONSTRAINT "Rent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Rent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Rent_id_seq";

-- AlterTable
ALTER TABLE "Scooter" ALTER COLUMN "activeRentId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "activeRentId" SET DATA TYPE TEXT;

-- CreateIndex
DROP INDEX "Scooter_activeRentId_key";
CREATE UNIQUE INDEX "Scooter_activeRentId_key" ON "Scooter"("activeRentId") WHERE "activeRentId" IS NOT NULL;

-- CreateIndex
DROP INDEX "User_activeRentId_key";
CREATE UNIQUE INDEX "User_activeRentId_key" ON "User"("activeRentId") WHERE "activeRentId" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeRentId_fkey" FOREIGN KEY ("activeRentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scooter" ADD CONSTRAINT "Scooter_activeRentId_fkey" FOREIGN KEY ("activeRentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
