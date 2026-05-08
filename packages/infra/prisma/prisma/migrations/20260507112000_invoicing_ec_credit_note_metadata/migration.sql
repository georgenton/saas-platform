ALTER TABLE "Invoice"
ADD COLUMN "modifiedDocumentId" TEXT,
ADD COLUMN "modifiedDocumentNumber" TEXT,
ADD COLUMN "modifiedDocumentIssuedAt" TIMESTAMP(3),
ADD COLUMN "modificationReason" TEXT;
