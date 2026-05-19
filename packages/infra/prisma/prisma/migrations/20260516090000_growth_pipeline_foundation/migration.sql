CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "leadId" TEXT,
    "threadId" TEXT,
    "title" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "amountInCents" INTEGER,
    "currency" TEXT,
    "notes" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Opportunity_tenantId_createdAt_idx" ON "Opportunity"("tenantId", "createdAt");
CREATE INDEX "Opportunity_tenantId_stage_updatedAt_idx" ON "Opportunity"("tenantId", "stage", "updatedAt");
CREATE INDEX "Opportunity_tenantId_leadId_idx" ON "Opportunity"("tenantId", "leadId");
CREATE INDEX "Opportunity_tenantId_threadId_idx" ON "Opportunity"("tenantId", "threadId");

ALTER TABLE "Opportunity"
ADD CONSTRAINT "Opportunity_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Opportunity"
ADD CONSTRAINT "Opportunity_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Opportunity"
ADD CONSTRAINT "Opportunity_threadId_fkey"
FOREIGN KEY ("threadId") REFERENCES "ConversationThread"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (
    'permission_growth_opportunities_read',
    'growth.opportunities.read',
    'Allows reading tenant opportunities for the shared growth pipeline foundation.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_growth_opportunities_manage',
    'growth.opportunities.manage',
    'Allows creating and updating tenant opportunities for the shared growth pipeline foundation.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  (
    'role_permission_owner_growth_opportunities_read',
    'role_tenant_owner',
    'permission_growth_opportunities_read',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_growth_opportunities_manage',
    'role_tenant_owner',
    'permission_growth_opportunities_manage',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
