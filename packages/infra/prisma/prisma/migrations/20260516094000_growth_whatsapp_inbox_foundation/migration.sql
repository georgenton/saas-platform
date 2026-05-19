ALTER TABLE "ConversationThread"
ADD COLUMN "externalConversationId" TEXT,
ADD COLUMN "participantDisplayName" TEXT,
ADD COLUMN "participantHandle" TEXT;

CREATE INDEX "ConversationThread_tenantId_channel_lastActivityAt_idx"
ON "ConversationThread"("tenantId", "channel", "lastActivityAt");

CREATE UNIQUE INDEX "ConversationThread_tenantId_channel_externalConversationId_key"
ON "ConversationThread"("tenantId", "channel", "externalConversationId")
WHERE "externalConversationId" IS NOT NULL;
