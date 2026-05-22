CREATE TABLE "AiSuggestionRun" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "agentKey" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "surfaceKey" TEXT NOT NULL,
  "sourceContractKey" TEXT NOT NULL,
  "sourceGeneratedAt" TIMESTAMP(3) NOT NULL,
  "promptPackKey" TEXT NOT NULL,
  "promptPackVersion" TEXT NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL,
  "requestedByUserId" TEXT NOT NULL,
  "requestedByEmail" TEXT,
  "summary" TEXT NOT NULL,
  "suggestedOutputKeysJson" TEXT NOT NULL,
  "envelopeJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiSuggestionRun_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiSuggestionRun_tenantId_agentKey_createdAt_idx"
ON "AiSuggestionRun"("tenantId", "agentKey", "createdAt");

CREATE INDEX "AiSuggestionRun_tenantId_surfaceKey_createdAt_idx"
ON "AiSuggestionRun"("tenantId", "surfaceKey", "createdAt");

ALTER TABLE "AiSuggestionRun"
ADD CONSTRAINT "AiSuggestionRun_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
