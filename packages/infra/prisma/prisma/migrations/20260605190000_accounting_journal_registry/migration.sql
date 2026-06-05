-- CreateTable
CREATE TABLE "AccountingJournalEntry" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "linesJson" TEXT NOT NULL,
    "approvalStatus" TEXT NOT NULL,
    "approvedByUserId" TEXT,
    "approvedByEmail" TEXT,
    "approvedAt" TIMESTAMP(3),
    "sourceDraftEntryKey" TEXT,
    "sourceApprovalPacketKey" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountingJournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountingJournalEntry_period_status_idx" ON "AccountingJournalEntry"("tenantId", "period", "status");

-- CreateIndex
CREATE INDEX "AccountingJournalEntry_slug_period_idx" ON "AccountingJournalEntry"("tenantSlug", "period", "createdAt");

-- CreateIndex
CREATE INDEX "AccountingJournalEntry_year_idx" ON "AccountingJournalEntry"("tenantId", "year", "createdAt");

-- AddForeignKey
ALTER TABLE "AccountingJournalEntry" ADD CONSTRAINT "AccountingJournalEntry_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (
    'permission_accounting_manage',
    'accounting.manage',
    'Allows managing Accounting mappings, approval packets, and internal journal registries.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO UPDATE
SET
  "description" = EXCLUDED."description",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  (
    'role_permission_owner_accounting_manage',
    'role_tenant_owner',
    'permission_accounting_manage',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
