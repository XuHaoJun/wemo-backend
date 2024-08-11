/*
  Warnings:

  - A unique constraint covering the columns `[activeRentId]` on the table `Scooter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeReservationId]` on the table `Scooter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeRentId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activeReservationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- create postgis extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- AlterTable
ALTER TABLE "Scooter" ADD COLUMN     "coords" geometry(Point, 4326);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coords" geometry(Point, 4326);

-- CreateIndex
CREATE INDEX "Scooter_location_idx" ON "Scooter" USING GIST ("coords") WHERE "coords" IS NOT NULL;

-- CreateIndex
CREATE INDEX "User_location_idx" ON "User" USING GIST ("coords") WHERE "coords" IS NOT NULL;
