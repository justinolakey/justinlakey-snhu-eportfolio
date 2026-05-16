-- CreateEnum
CREATE TYPE "HomeStatus" AS ENUM ('AVAILABLE', 'SOLD_OUT', 'COMING_SOON');

-- CreateTable
CREATE TABLE "Community" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "builder" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Home" (
    "id" SERIAL NOT NULL,
    "communityId" INTEGER NOT NULL,
    "modelName" TEXT NOT NULL,
    "priceMin" INTEGER NOT NULL,
    "priceMax" INTEGER,
    "sqft" INTEGER NOT NULL,
    "lotSizeSqft" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" DOUBLE PRECISION NOT NULL,
    "status" "HomeStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Home_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Home" ADD CONSTRAINT "Home_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
