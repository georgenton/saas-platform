-- CreateTable
CREATE TABLE "AccountingPeriodControl" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actionByUserId" TEXT,
    "actionByEmail" TEXT,
    "actionAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "evidenceReference" TEXT,
    "blockersJson" TEXT NOT NULL,
    "snapshotJson" TEXT NOT NULL,
    "impactChecklistJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingPeriodControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountingPeriodControl_period_idx" ON "AccountingPeriodControl"("tenantId", "period", "actionAt");

-- CreateIndex
CREATE INDEX "AccountingPeriodControl_slug_period_idx" ON "AccountingPeriodControl"("tenantSlug", "period", "actionAt");

-- CreateIndex
CREATE INDEX "AccountingPeriodControl_status_idx" ON "AccountingPeriodControl"("tenantId", "status", "actionAt");

-- AddForeignKey
ALTER TABLE "AccountingPeriodControl" ADD CONSTRAINT "AccountingPeriodControl_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
