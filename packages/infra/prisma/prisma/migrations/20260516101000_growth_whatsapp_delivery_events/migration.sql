ALTER TABLE "ConversationMessage"
ADD COLUMN "provider" TEXT,
ADD COLUMN "deliveryStatus" TEXT,
ADD COLUMN "failureReason" TEXT,
ADD COLUMN "deliveredAt" TIMESTAMP(3),
ADD COLUMN "readAt" TIMESTAMP(3);

CREATE INDEX "ConversationMessage_tenantId_externalMessageId_idx"
ON "ConversationMessage"("tenantId", "externalMessageId");
