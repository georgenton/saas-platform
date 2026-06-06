-- CreateTable
CREATE TABLE "AccountingBankStatementBatch" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "importedByUserId" TEXT,
    "importedByEmail" TEXT,
    "importedAt" TIMESTAMP(3) NOT NULL,
    "originalFileName" TEXT,
    "notes" TEXT,
    "lineCount" INTEGER NOT NULL,
    "totalInflowInCents" INTEGER NOT NULL,
    "totalOutflowInCents" INTEGER NOT NULL,
    "blockersJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingBankStatementBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountingBankStatementLine" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "accountKey" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "amountInCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "externalLineId" TEXT,
    "rawJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingBankStatementLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountingBankStatementBatch_period_idx" ON "AccountingBankStatementBatch"("tenantId", "period", "importedAt");

-- CreateIndex
CREATE INDEX "AccountingBankStatementBatch_slug_period_idx" ON "AccountingBankStatementBatch"("tenantSlug", "period", "importedAt");

-- CreateIndex
CREATE INDEX "AccountingBankStatementBatch_status_idx" ON "AccountingBankStatementBatch"("tenantId", "status", "importedAt");

-- CreateIndex
CREATE INDEX "AccountingBankStatementLine_period_idx" ON "AccountingBankStatementLine"("tenantId", "period", "postedAt");

-- CreateIndex
CREATE INDEX "AccountingBankStatementLine_slug_period_idx" ON "AccountingBankStatementLine"("tenantSlug", "period", "postedAt");

-- CreateIndex
CREATE INDEX "AccountingBankStatementLine_account_idx" ON "AccountingBankStatementLine"("tenantId", "accountCode", "postedAt");

-- CreateIndex
CREATE INDEX "AccountingBankStatementLine_batch_idx" ON "AccountingBankStatementLine"("batchId", "postedAt");

-- AddForeignKey
ALTER TABLE "AccountingBankStatementBatch" ADD CONSTRAINT "AccountingBankStatementBatch_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountingBankStatementLine" ADD CONSTRAINT "AccountingBankStatementLine_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountingBankStatementLine" ADD CONSTRAINT "AccountingBankStatementLine_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "AccountingBankStatementBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
