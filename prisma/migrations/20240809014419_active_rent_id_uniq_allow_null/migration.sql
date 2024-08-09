DROP INDEX "User_activeRentId_key";

CREATE UNIQUE INDEX "User_activeRentId_key" ON "User"("activeRentId")
WHERE
  "activeRentId" IS NOT NULL;

DROP INDEX "Scooter_activeRentId_key";

CREATE UNIQUE INDEX "Scooter_activeRentId_key" ON "Scooter"("activeRentId")
WHERE
  "activeRentId" IS NOT NULL;