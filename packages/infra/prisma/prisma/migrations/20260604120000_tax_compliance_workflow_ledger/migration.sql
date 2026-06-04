-- CreateTable
CREATE TABLE "TaxComplianceEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "eventType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "payloadJson" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxComplianceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxComplianceAccountantReview" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "requestedByUserId" TEXT,
    "requestedByEmail" TEXT,
    "summary" TEXT NOT NULL,
    "questionsJson" TEXT NOT NULL,
    "evidenceSummaryJson" TEXT NOT NULL,
    "transitionHistoryJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxComplianceAccountantReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaxComplianceEvent_period_idx" ON "TaxComplianceEvent"("tenantId", "period", "occurredAt");

-- CreateIndex
CREATE INDEX "TaxComplianceEvent_slug_period_idx" ON "TaxComplianceEvent"("tenantSlug", "period", "occurredAt");

-- CreateIndex
CREATE INDEX "TaxComplianceEvent_event_type_idx" ON "TaxComplianceEvent"("tenantId", "eventType", "occurredAt");

-- CreateIndex
CREATE INDEX "TaxComplianceAccountantReview_period_idx" ON "TaxComplianceAccountantReview"("tenantId", "period", "updatedAt");

-- CreateIndex
CREATE INDEX "TaxComplianceAccountantReview_slug_period_idx" ON "TaxComplianceAccountantReview"("tenantSlug", "period", "updatedAt");

-- CreateIndex
CREATE INDEX "TaxComplianceAccountantReview_status_idx" ON "TaxComplianceAccountantReview"("tenantId", "status", "updatedAt");

-- AddForeignKey
ALTER TABLE "TaxComplianceEvent" ADD CONSTRAINT "TaxComplianceEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxComplianceAccountantReview" ADD CONSTRAINT "TaxComplianceAccountantReview_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
