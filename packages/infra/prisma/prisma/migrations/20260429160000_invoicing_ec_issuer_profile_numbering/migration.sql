ALTER TABLE "Invoice"
ADD COLUMN "documentCode" TEXT,
ADD COLUMN "emissionPointCode" TEXT,
ADD COLUMN "establishmentCode" TEXT,
ADD COLUMN "sequenceNumber" INTEGER;

CREATE TABLE "IssuerProfile" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "commercialName" TEXT,
    "taxId" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "emissionType" TEXT NOT NULL,
    "accountingObligated" BOOLEAN NOT NULL,
    "specialTaxpayerCode" TEXT,
    "rimpeTaxpayerType" TEXT,
    "matrixAddress" TEXT NOT NULL,
    "establishmentAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IssuerProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InvoiceNumberingSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "documentCode" TEXT NOT NULL,
    "establishmentCode" TEXT NOT NULL,
    "emissionPointCode" TEXT NOT NULL,
    "nextSequenceNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceNumberingSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "IssuerProfile_tenantId_key" ON "IssuerProfile"("tenantId");
CREATE UNIQUE INDEX "InvoiceNumberingSettings_tenantId_key" ON "InvoiceNumberingSettings"("tenantId");

ALTER TABLE "IssuerProfile"
ADD CONSTRAINT "IssuerProfile_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InvoiceNumberingSettings"
ADD CONSTRAINT "InvoiceNumberingSettings_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
