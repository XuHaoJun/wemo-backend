-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "activeRentId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scooter" (
    "id" SERIAL NOT NULL,
    "rentAble" BOOLEAN NOT NULL,
    "activeRentId" INTEGER,

    CONSTRAINT "Scooter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rent" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "scooterId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "Rent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_activeRentId_key" ON "User"("activeRentId");

-- CreateIndex
CREATE UNIQUE INDEX "Scooter_activeRentId_key" ON "Scooter"("activeRentId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeRentId_fkey" FOREIGN KEY ("activeRentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scooter" ADD CONSTRAINT "Scooter_activeRentId_fkey" FOREIGN KEY ("activeRentId") REFERENCES "Rent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rent" ADD CONSTRAINT "Rent_scooterId_fkey" FOREIGN KEY ("scooterId") REFERENCES "Scooter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
