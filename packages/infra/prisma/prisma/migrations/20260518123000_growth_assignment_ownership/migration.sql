ALTER TABLE "ConversationThread"
ADD COLUMN "assigneeUserId" TEXT;

ALTER TABLE "Opportunity"
ADD COLUMN "assigneeUserId" TEXT;

CREATE INDEX "ConversationThread_tenantId_assigneeUserId_lastActivityAt_idx"
ON "ConversationThread"("tenantId", "assigneeUserId", "lastActivityAt");

CREATE INDEX "Opportunity_tenantId_assigneeUserId_updatedAt_idx"
ON "Opportunity"("tenantId", "assigneeUserId", "updatedAt");
