CREATE TABLE "AccountingCorrection" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "recommendedAction" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "ownerEmail" TEXT,
    "evidenceReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingCorrection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AccountingEvidenceAttachment" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "attachmentType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "ownerUserId" TEXT,
    "ownerEmail" TEXT,
    "status" TEXT NOT NULL,
    "hash" TEXT,
    "metadataJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingEvidenceAttachment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AccountingCorrection_period_idx" ON "AccountingCorrection"("tenantId", "period", "updatedAt");
CREATE INDEX "AccountingCorrection_slug_period_idx" ON "AccountingCorrection"("tenantSlug", "period", "updatedAt");
CREATE INDEX "AccountingCorrection_status_idx" ON "AccountingCorrection"("tenantId", "status", "updatedAt");
CREATE INDEX "AccountingCorrection_source_idx" ON "AccountingCorrection"("tenantId", "source", "updatedAt");

CREATE INDEX "AccountingEvidenceAttachment_period_idx" ON "AccountingEvidenceAttachment"("tenantId", "period", "updatedAt");
CREATE INDEX "AccountingEvidenceAttachment_slug_period_idx" ON "AccountingEvidenceAttachment"("tenantSlug", "period", "updatedAt");
CREATE INDEX "AccountingEvidenceAttachment_status_idx" ON "AccountingEvidenceAttachment"("tenantId", "status", "updatedAt");
CREATE INDEX "AccountingEvidenceAttachment_type_idx" ON "AccountingEvidenceAttachment"("tenantId", "attachmentType", "updatedAt");

ALTER TABLE "AccountingCorrection" ADD CONSTRAINT "AccountingCorrection_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccountingEvidenceAttachment" ADD CONSTRAINT "AccountingEvidenceAttachment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
