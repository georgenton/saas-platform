CREATE TABLE "Payment" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL,
  "amountInCents" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "method" TEXT NOT NULL,
  "reference" TEXT,
  "paidAt" TIMESTAMP(3) NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Payment_tenantId_invoiceId_paidAt_idx" ON "Payment"("tenantId", "invoiceId", "paidAt");

ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Payment"
ADD CONSTRAINT "Payment_invoiceId_fkey"
FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (
    'permission_invoicing_payments_read',
    'invoicing.payments.read',
    'Read invoice payments and balances.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_invoicing_payments_manage',
    'invoicing.payments.manage',
    'Create invoice payments and manage invoice balances.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  (
    'role_permission_owner_invoicing_payments_read',
    'role_tenant_owner',
    'permission_invoicing_payments_read',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_invoicing_payments_manage',
    'role_tenant_owner',
    'permission_invoicing_payments_manage',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
