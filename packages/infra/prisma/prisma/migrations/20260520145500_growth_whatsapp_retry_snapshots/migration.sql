ALTER TABLE "ConversationMessage"
ADD COLUMN "retryOfMessageId" TEXT,
ADD COLUMN "renderedTemplateSnapshotJson" TEXT;

CREATE INDEX "ConversationMessage_tenantId_retryOfMessageId_idx"
ON "ConversationMessage"("tenantId", "retryOfMessageId");
