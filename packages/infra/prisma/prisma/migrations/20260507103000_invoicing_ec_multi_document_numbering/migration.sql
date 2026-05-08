DROP INDEX "InvoiceNumberingSettings_tenantId_key";

CREATE UNIQUE INDEX "InvoiceNumberingSettings_tenantId_documentCode_key"
ON "InvoiceNumberingSettings"("tenantId", "documentCode");
