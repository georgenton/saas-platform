CREATE TABLE "AiApprovalRequest" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "agentKey" TEXT NOT NULL,
  "policyKey" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "suggestionRunId" TEXT NOT NULL,
  "requestedByUserId" TEXT NOT NULL,
  "requestedByEmail" TEXT,
  "rationale" TEXT,
  "summary" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "reviewedAt" TIMESTAMP(3),
  "reviewedByUserId" TEXT,
  "reviewedByEmail" TEXT,
  "reviewNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "AiApprovalRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiApprovalRequest_tenantId_agentKey_createdAt_idx"
ON "AiApprovalRequest"("tenantId", "agentKey", "createdAt");

CREATE INDEX "AiApprovalRequest_tenantId_status_createdAt_idx"
ON "AiApprovalRequest"("tenantId", "status", "createdAt");

CREATE INDEX "AiApprovalRequest_suggestionRunId_createdAt_idx"
ON "AiApprovalRequest"("suggestionRunId", "createdAt");

ALTER TABLE "AiApprovalRequest"
ADD CONSTRAINT "AiApprovalRequest_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AiApprovalRequest"
ADD CONSTRAINT "AiApprovalRequest_suggestionRunId_fkey"
FOREIGN KEY ("suggestionRunId") REFERENCES "AiSuggestionRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
