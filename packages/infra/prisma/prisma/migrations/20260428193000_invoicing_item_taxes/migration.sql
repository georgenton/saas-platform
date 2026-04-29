-- CreateTable
CREATE TABLE "TaxRate" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxRate_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "InvoiceItem"
ADD COLUMN "taxRateId" TEXT,
ADD COLUMN "taxRateName" TEXT,
ADD COLUMN "taxRatePercentage" DOUBLE PRECISION,
ADD COLUMN "lineTaxInCents" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "TaxRate_tenantId_createdAt_idx" ON "TaxRate"("tenantId", "createdAt");
CREATE INDEX "InvoiceItem_tenantId_taxRateId_idx" ON "InvoiceItem"("tenantId", "taxRateId");

-- AddForeignKey
ALTER TABLE "TaxRate"
ADD CONSTRAINT "TaxRate_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Seed invoicing tax permissions
INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (
    'permission_invoicing_taxes_read',
    'invoicing.taxes.read',
    'Allows reading invoicing tax rates for a tenant.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_invoicing_taxes_manage',
    'invoicing.taxes.manage',
    'Allows creating and managing invoicing tax rates for a tenant.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  (
    'role_permission_owner_invoicing_taxes_read',
    'role_tenant_owner',
    'permission_invoicing_taxes_read',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_invoicing_taxes_manage',
    'role_tenant_owner',
    'permission_invoicing_taxes_manage',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
