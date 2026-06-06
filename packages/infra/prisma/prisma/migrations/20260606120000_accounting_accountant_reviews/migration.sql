CREATE TABLE "AccountingAccountantReview" (
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
    "riskFlagsJson" TEXT NOT NULL,
    "evidenceReferencesJson" TEXT NOT NULL,
    "transitionHistoryJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingAccountantReview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AccountingAccountantReview_period_idx" ON "AccountingAccountantReview"("tenantId", "period", "updatedAt");

CREATE INDEX "AccountingAccountantReview_slug_period_idx" ON "AccountingAccountantReview"("tenantSlug", "period", "updatedAt");

CREATE INDEX "AccountingAccountantReview_status_idx" ON "AccountingAccountantReview"("tenantId", "status", "updatedAt");

ALTER TABLE "AccountingAccountantReview" ADD CONSTRAINT "AccountingAccountantReview_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
