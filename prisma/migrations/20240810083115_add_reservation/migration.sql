/*
  Warnings:

  - A unique constraint covering the columns `[activeRentId]` on the table `Scooter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeReservationId]` on the table `Scooter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeRentId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeReservationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Scooter" ADD COLUMN     "activeReservationId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeReservationId" TEXT;

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "scooterId" INTEGER NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "rentId" TEXT,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scooter_activeReservationId_key" ON "Scooter"("activeReservationId") WHERE "activeReservationId" IS NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_activeReservationId_key" ON "User"("activeReservationId") WHERE "activeReservationId" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeReservationId_fkey" FOREIGN KEY ("activeReservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scooter" ADD CONSTRAINT "Scooter_activeReservationId_fkey" FOREIGN KEY ("activeReservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_scooterId_fkey" FOREIGN KEY ("scooterId") REFERENCES "Scooter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_rentId_fkey" FOREIGN KEY ("rentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
