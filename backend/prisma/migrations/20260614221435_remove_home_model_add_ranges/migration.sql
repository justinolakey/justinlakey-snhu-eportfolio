/*
  Warnings:

  - You are about to drop the `Home` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bathroomsMax` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bathroomsMin` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedroomsMax` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bedroomsMin` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotSizeSqftMax` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lotSizeSqftMin` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceMax` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceMin` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sqftMax` to the `Community` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sqftMin` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CommunityStatus" AS ENUM ('AVAILABLE', 'SOLD_OUT', 'COMING_SOON');

-- DropForeignKey
ALTER TABLE "Home" DROP CONSTRAINT "Home_communityId_fkey";

-- AlterTable
ALTER TABLE "Community" ADD COLUMN     "bathroomsMax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bathroomsMin" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "bedroomsMax" INTEGER NOT NULL,
ADD COLUMN     "bedroomsMin" INTEGER NOT NULL,
ADD COLUMN     "lotSizeSqftMax" INTEGER NOT NULL,
ADD COLUMN     "lotSizeSqftMin" INTEGER NOT NULL,
ADD COLUMN     "priceMax" INTEGER NOT NULL,
ADD COLUMN     "priceMin" INTEGER NOT NULL,
ADD COLUMN     "sqftMax" INTEGER NOT NULL,
ADD COLUMN     "sqftMin" INTEGER NOT NULL,
ADD COLUMN     "status" "CommunityStatus" NOT NULL DEFAULT 'AVAILABLE';

-- DropTable
DROP TABLE "Home";

-- DropEnum
DROP TYPE "HomeStatus";
