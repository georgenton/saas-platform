ALTER TABLE "WebhookEventEnvelope"
ADD COLUMN "providerEventId" TEXT,
ADD COLUMN "replayCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastReplayedAt" TIMESTAMP(3);

CREATE INDEX "WebhookEventEnvelope_tenantId_providerEventId_idx"
ON "WebhookEventEnvelope"("tenantId", "providerEventId");
