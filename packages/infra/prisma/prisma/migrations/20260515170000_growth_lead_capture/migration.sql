CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phoneE164" TEXT,
    "whatsappE164" TEXT,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Lead_tenantId_createdAt_idx" ON "Lead"("tenantId", "createdAt");
CREATE INDEX "Lead_tenantId_status_createdAt_idx" ON "Lead"("tenantId", "status", "createdAt");

ALTER TABLE "Lead"
ADD CONSTRAINT "Lead_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (
    'permission_growth_leads_read',
    'growth.leads.read',
    'Allows reading tenant leads captured through the shared growth slice.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_growth_leads_manage',
    'growth.leads.manage',
    'Allows creating and updating tenant leads captured through the shared growth slice.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  (
    'role_permission_owner_growth_leads_read',
    'role_tenant_owner',
    'permission_growth_leads_read',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_growth_leads_manage',
    'role_tenant_owner',
    'permission_growth_leads_manage',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
