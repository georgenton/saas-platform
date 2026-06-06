-- CreateTable
CREATE TABLE "AccountingExternalCloseoutRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "accountantName" TEXT NOT NULL,
    "accountantEmail" TEXT,
    "confirmedByUserId" TEXT,
    "confirmedByEmail" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "evidenceReference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingExternalCloseoutRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountingExternalCloseoutRecord_period_idx" ON "AccountingExternalCloseoutRecord"("tenantId", "period", "updatedAt");

-- CreateIndex
CREATE INDEX "AccountingExternalCloseoutRecord_slug_period_idx" ON "AccountingExternalCloseoutRecord"("tenantSlug", "period", "updatedAt");

-- CreateIndex
CREATE INDEX "AccountingExternalCloseoutRecord_status_idx" ON "AccountingExternalCloseoutRecord"("tenantId", "status", "updatedAt");

-- AddForeignKey
ALTER TABLE "AccountingExternalCloseoutRecord" ADD CONSTRAINT "AccountingExternalCloseoutRecord_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
