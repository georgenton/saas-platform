-- AlterTable
ALTER TABLE "Customer"
ADD COLUMN     "identificationType" TEXT,
ADD COLUMN     "identification" TEXT,
ADD COLUMN     "billingAddress" TEXT;

-- AlterTable
ALTER TABLE "Invoice"
ADD COLUMN     "buyerIdentificationType" TEXT,
ADD COLUMN     "buyerIdentification" TEXT,
ADD COLUMN     "buyerName" TEXT,
ADD COLUMN     "buyerAddress" TEXT;
