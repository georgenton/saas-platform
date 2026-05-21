-- CreateTable
CREATE TABLE "GrowthOperationalCase" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "sourceKey" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "nextAction" TEXT NOT NULL,
    "threadId" TEXT,
    "alertKey" TEXT,
    "dueAt" TIMESTAMP(3),
    "assignedUserId" TEXT,
    "assignedUserEmail" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "createdByEmail" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "resolvedByUserId" TEXT,
    "resolvedByEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GrowthOperationalCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GrowthOperationalCase_tenantId_sourceKey_key" ON "GrowthOperationalCase"("tenantId", "sourceKey");

-- CreateIndex
CREATE INDEX "GrowthOperationalCase_tenantId_status_priority_updatedAt_idx" ON "GrowthOperationalCase"("tenantId", "status", "priority", "updatedAt");

-- CreateIndex
CREATE INDEX "GrowthOperationalCase_tenantId_threadId_updatedAt_idx" ON "GrowthOperationalCase"("tenantId", "threadId", "updatedAt");

-- CreateIndex
CREATE INDEX "GrowthOperationalCase_tenantId_dueAt_idx" ON "GrowthOperationalCase"("tenantId", "dueAt");

-- AddForeignKey
ALTER TABLE "GrowthOperationalCase" ADD CONSTRAINT "GrowthOperationalCase_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
