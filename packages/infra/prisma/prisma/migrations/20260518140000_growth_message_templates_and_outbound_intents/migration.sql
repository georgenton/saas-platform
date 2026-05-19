ALTER TABLE "ConversationMessage"
ADD COLUMN "templateId" TEXT,
ADD COLUMN "outboundIntentKey" TEXT;

CREATE TABLE "WhatsappMessageTemplate" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "languageCode" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "bodyTemplate" TEXT NOT NULL,
  "intentKey" TEXT,
  "providerTemplateName" TEXT,
  "providerApprovalStatus" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "WhatsappMessageTemplate_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WhatsappMessageTemplate_tenantId_key_key"
ON "WhatsappMessageTemplate"("tenantId", "key");

CREATE INDEX "WhatsappMessageTemplate_tenantId_createdAt_idx"
ON "WhatsappMessageTemplate"("tenantId", "createdAt");

CREATE INDEX "WhatsappMessageTemplate_tenantId_intentKey_idx"
ON "WhatsappMessageTemplate"("tenantId", "intentKey");

ALTER TABLE "ConversationMessage"
ADD CONSTRAINT "ConversationMessage_templateId_fkey"
FOREIGN KEY ("templateId") REFERENCES "WhatsappMessageTemplate"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "WhatsappMessageTemplate"
ADD CONSTRAINT "WhatsappMessageTemplate_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
