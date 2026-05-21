CREATE TABLE "WhatsappAutomationExecution" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "threadId" TEXT NOT NULL,
  "ruleId" TEXT NOT NULL,
  "triggerEvent" TEXT NOT NULL,
  "triggerMessageId" TEXT,
  "triggerExternalMessageId" TEXT,
  "triggerDeliveryStatus" TEXT,
  "executionKey" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "reason" TEXT,
  "outputMessageId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WhatsappAutomationExecution_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WhatsappAutomationExecution_tenantId_executionKey_key"
ON "WhatsappAutomationExecution"("tenantId", "executionKey");

CREATE INDEX "WhatsappAutomationExecution_tenantId_threadId_createdAt_idx"
ON "WhatsappAutomationExecution"("tenantId", "threadId", "createdAt");

CREATE INDEX "WhatsappAutomationExecution_tenantId_ruleId_createdAt_idx"
ON "WhatsappAutomationExecution"("tenantId", "ruleId", "createdAt");

ALTER TABLE "WhatsappAutomationExecution"
ADD CONSTRAINT "WhatsappAutomationExecution_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WhatsappAutomationExecution"
ADD CONSTRAINT "WhatsappAutomationExecution_threadId_fkey"
FOREIGN KEY ("threadId") REFERENCES "ConversationThread"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WhatsappAutomationExecution"
ADD CONSTRAINT "WhatsappAutomationExecution_ruleId_fkey"
FOREIGN KEY ("ruleId") REFERENCES "WhatsappAutomationRule"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WhatsappAutomationExecution"
ADD CONSTRAINT "WhatsappAutomationExecution_outputMessageId_fkey"
FOREIGN KEY ("outputMessageId") REFERENCES "ConversationMessage"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
