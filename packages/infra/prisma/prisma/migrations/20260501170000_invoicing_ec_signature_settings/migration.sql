CREATE TABLE "ElectronicSignatureSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "certificateLabel" TEXT NOT NULL,
    "certificateFingerprint" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectronicSignatureSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ElectronicSignatureSettings_tenantId_key" ON "ElectronicSignatureSettings"("tenantId");

ALTER TABLE "ElectronicSignatureSettings"
ADD CONSTRAINT "ElectronicSignatureSettings_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
