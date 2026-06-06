-- CreateTable
CREATE TABLE "AccountingBankReconciliationControl" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorEmail" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "evidenceReference" TEXT,
    "payloadJson" TEXT NOT NULL,
    "blockersJson" TEXT NOT NULL,
    "impactChecklistJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingBankReconciliationControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountingBankReconciliationControl_period_idx" ON "AccountingBankReconciliationControl"("tenantId", "period", "occurredAt");

-- CreateIndex
CREATE INDEX "AccountingBankReconciliationControl_slug_period_idx" ON "AccountingBankReconciliationControl"("tenantSlug", "period", "occurredAt");

-- CreateIndex
CREATE INDEX "AccountingBankReconciliationControl_event_idx" ON "AccountingBankReconciliationControl"("tenantId", "eventType", "occurredAt");

-- CreateIndex
CREATE INDEX "AccountingBankReconciliationControl_status_idx" ON "AccountingBankReconciliationControl"("tenantId", "status", "occurredAt");

-- AddForeignKey
ALTER TABLE "AccountingBankReconciliationControl" ADD CONSTRAINT "AccountingBankReconciliationControl_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
