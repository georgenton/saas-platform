CREATE TABLE "ConversationThread" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leadId" TEXT,
    "subject" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "latestMessagePreview" TEXT,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "openedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "lastActivityAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationThread_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConversationMessage" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "externalMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ConversationThread_tenantId_createdAt_idx" ON "ConversationThread"("tenantId", "createdAt");
CREATE INDEX "ConversationThread_tenantId_lastActivityAt_idx" ON "ConversationThread"("tenantId", "lastActivityAt");
CREATE INDEX "ConversationThread_tenantId_leadId_idx" ON "ConversationThread"("tenantId", "leadId");
CREATE INDEX "ConversationMessage_tenantId_threadId_createdAt_idx" ON "ConversationMessage"("tenantId", "threadId", "createdAt");

ALTER TABLE "ConversationThread"
ADD CONSTRAINT "ConversationThread_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConversationThread"
ADD CONSTRAINT "ConversationThread_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ConversationMessage"
ADD CONSTRAINT "ConversationMessage_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConversationMessage"
ADD CONSTRAINT "ConversationMessage_threadId_fkey"
FOREIGN KEY ("threadId") REFERENCES "ConversationThread"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (
    'permission_growth_conversations_read',
    'growth.conversations.read',
    'Allows reading tenant conversation threads and messages for the shared growth slice.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_growth_conversations_manage',
    'growth.conversations.manage',
    'Allows creating and updating tenant conversation threads and messages for the shared growth slice.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  (
    'role_permission_owner_growth_conversations_read',
    'role_tenant_owner',
    'permission_growth_conversations_read',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_growth_conversations_manage',
    'role_tenant_owner',
    'permission_growth_conversations_manage',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
