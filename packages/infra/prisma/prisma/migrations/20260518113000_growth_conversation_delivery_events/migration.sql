CREATE TABLE "ConversationDeliveryEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "messageId" TEXT,
  "provider" TEXT NOT NULL,
  "eventKey" TEXT NOT NULL,
  "providerEventId" TEXT,
  "externalMessageId" TEXT NOT NULL,
  "deliveryStatus" TEXT NOT NULL,
  "failureReason" TEXT,
  "payloadJson" TEXT,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ConversationDeliveryEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ConversationDeliveryEvent"
ADD CONSTRAINT "ConversationDeliveryEvent_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConversationDeliveryEvent"
ADD CONSTRAINT "ConversationDeliveryEvent_messageId_fkey"
FOREIGN KEY ("messageId") REFERENCES "ConversationMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "ConversationDeliveryEvent_tenantId_provider_eventKey_key"
ON "ConversationDeliveryEvent"("tenantId", "provider", "eventKey");

CREATE INDEX "ConversationDeliveryEvent_tenantId_providerEventId_idx"
ON "ConversationDeliveryEvent"("tenantId", "providerEventId");

CREATE INDEX "ConversationDeliveryEvent_tenantId_externalMessageId_occurredAt_idx"
ON "ConversationDeliveryEvent"("tenantId", "externalMessageId", "occurredAt");

CREATE INDEX "ConversationDeliveryEvent_tenantId_messageId_occurredAt_idx"
ON "ConversationDeliveryEvent"("tenantId", "messageId", "occurredAt");
