-- AlterTable
ALTER TABLE "users" ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xpLevel" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "daily_lessons" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "modes" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER NOT NULL DEFAULT 0,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weakness_stats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "letterCode" TEXT NOT NULL,
    "totalErrors" INTEGER NOT NULL DEFAULT 0,
    "totalSeen" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastSeen" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),

    CONSTRAINT "weakness_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "event" TEXT NOT NULL,
    "data" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_lessons_userId_date_key" ON "daily_lessons"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "weakness_stats_userId_letterCode_key" ON "weakness_stats"("userId", "letterCode");

-- CreateIndex
CREATE INDEX "analytics_events_event_idx" ON "analytics_events"("event");

-- CreateIndex
CREATE INDEX "analytics_events_userId_idx" ON "analytics_events"("userId");

-- AddForeignKey
ALTER TABLE "daily_lessons" ADD CONSTRAINT "daily_lessons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weakness_stats" ADD CONSTRAINT "weakness_stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
