-- AlterTable
ALTER TABLE "ElectronicSignatureSettings" ALTER COLUMN "storageMode" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InvoiceItem" ALTER COLUMN "lineTaxInCents" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT;
