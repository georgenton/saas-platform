CREATE TABLE "AiGuardedExecutionEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "agentKey" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "approvalRequestId" TEXT NOT NULL,
  "suggestionRunId" TEXT NOT NULL,
  "toolKey" TEXT NOT NULL,
  "caseId" TEXT NOT NULL,
  "safeFallbackMode" TEXT,
  "summary" TEXT NOT NULL,
  "detail" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "createdByUserId" TEXT,
  "createdByEmail" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AiGuardedExecutionEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AiGuardedExecutionEvent_tenantId_agentKey_occurredAt_idx"
ON "AiGuardedExecutionEvent"("tenantId", "agentKey", "occurredAt");

CREATE INDEX "AiGuardedExecutionEvent_tenantId_eventType_occurredAt_idx"
ON "AiGuardedExecutionEvent"("tenantId", "eventType", "occurredAt");

CREATE INDEX "AiGuardedExecutionEvent_approvalRequestId_occurredAt_idx"
ON "AiGuardedExecutionEvent"("approvalRequestId", "occurredAt");

ALTER TABLE "AiGuardedExecutionEvent"
ADD CONSTRAINT "AiGuardedExecutionEvent_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
