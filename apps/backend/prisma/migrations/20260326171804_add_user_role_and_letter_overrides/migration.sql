-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE "letter_overrides" (
    "letterCode" TEXT NOT NULL,
    "nameRu" TEXT,
    "nameUz" TEXT,
    "nameEn" TEXT,
    "associationRu" TEXT,
    "associationUz" TEXT,
    "associationEn" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "letter_overrides_pkey" PRIMARY KEY ("letterCode")
);
