-- CreateTable
CREATE TABLE "TaxCompliancePurchaseExpenseEvidence" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "supplierPartyId" TEXT,
    "supplierName" TEXT NOT NULL,
    "supplierTaxpayerId" TEXT,
    "documentNumber" TEXT,
    "documentCode" TEXT,
    "issuedAt" TIMESTAMP(3),
    "category" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "subtotalInCents" INTEGER NOT NULL,
    "vatInCents" INTEGER NOT NULL,
    "totalInCents" INTEGER NOT NULL,
    "deductible" BOOLEAN,
    "supportReference" TEXT,
    "status" TEXT NOT NULL,
    "readinessStatus" TEXT NOT NULL,
    "blockersJson" TEXT NOT NULL,
    "reviewNotesJson" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxCompliancePurchaseExpenseEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaxCompliancePurchaseExpenseEvidence_period_idx" ON "TaxCompliancePurchaseExpenseEvidence"("tenantId", "period", "createdAt");

-- CreateIndex
CREATE INDEX "TaxCompliancePurchaseExpenseEvidence_slug_period_idx" ON "TaxCompliancePurchaseExpenseEvidence"("tenantSlug", "period", "createdAt");

-- CreateIndex
CREATE INDEX "TaxCompliancePurchaseExpenseEvidence_supplier_idx" ON "TaxCompliancePurchaseExpenseEvidence"("tenantId", "supplierTaxpayerId", "period");

-- AddForeignKey
ALTER TABLE "TaxCompliancePurchaseExpenseEvidence" ADD CONSTRAINT "TaxCompliancePurchaseExpenseEvidence_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
