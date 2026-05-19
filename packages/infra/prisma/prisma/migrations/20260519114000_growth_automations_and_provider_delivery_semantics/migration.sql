-- CreateTable
CREATE TABLE "WhatsappAutomationRule" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "matchOutboundIntentKey" TEXT,
    "matchDeliveryStatus" TEXT,
    "matchAssigneeMode" TEXT NOT NULL,
    "templateId" TEXT,
    "actionType" TEXT NOT NULL,
    "actionOutboundIntentKey" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappAutomationRule_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "ConversationDeliveryEvent"
ADD COLUMN "providerStatusDetail" TEXT,
ADD COLUMN "providerConversationCategory" TEXT,
ADD COLUMN "providerPricingCategory" TEXT,
ADD COLUMN "providerErrorCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappAutomationRule_tenantId_key_key" ON "WhatsappAutomationRule"("tenantId", "key");

-- CreateIndex
CREATE INDEX "WhatsappAutomationRule_tenantId_createdAt_idx" ON "WhatsappAutomationRule"("tenantId", "createdAt");

-- CreateIndex
CREATE INDEX "WhatsappAutomationRule_tenantId_status_triggerEvent_idx" ON "WhatsappAutomationRule"("tenantId", "status", "triggerEvent");

-- AddForeignKey
ALTER TABLE "WhatsappAutomationRule" ADD CONSTRAINT "WhatsappAutomationRule_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsappAutomationRule" ADD CONSTRAINT "WhatsappAutomationRule_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "WhatsappMessageTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
