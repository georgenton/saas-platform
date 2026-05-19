CREATE TABLE "WebhookEventEnvelope" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "eventKey" TEXT NOT NULL,
    "payloadHash" TEXT NOT NULL,
    "signatureHeader" TEXT,
    "objectType" TEXT,
    "externalAccountId" TEXT,
    "externalPhoneNumberId" TEXT,
    "status" TEXT NOT NULL,
    "processedInboundMessages" INTEGER NOT NULL DEFAULT 0,
    "processedDeliveryEvents" INTEGER NOT NULL DEFAULT 0,
    "failureReason" TEXT,
    "payloadJson" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookEventEnvelope_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WebhookEventEnvelope_tenantId_provider_eventKey_key"
ON "WebhookEventEnvelope"("tenantId", "provider", "eventKey");

CREATE INDEX "WebhookEventEnvelope_tenantId_channel_receivedAt_idx"
ON "WebhookEventEnvelope"("tenantId", "channel", "receivedAt");

CREATE INDEX "WebhookEventEnvelope_tenantId_status_receivedAt_idx"
ON "WebhookEventEnvelope"("tenantId", "status", "receivedAt");

ALTER TABLE "WebhookEventEnvelope"
ADD CONSTRAINT "WebhookEventEnvelope_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
