-- CreateTable
CREATE TABLE "donate_config" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL DEFAULT 'Loyihani qo''llab-quvvatlang',
    "description" TEXT NOT NULL DEFAULT '',
    "cardNumber" TEXT,
    "cardHolder" TEXT,
    "links" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donate_config_pkey" PRIMARY KEY ("id")
);
