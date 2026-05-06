-- AlterTable
ALTER TABLE "Invoice"
ADD COLUMN     "electronicStatus" TEXT,
ADD COLUMN     "accessKey" TEXT,
ADD COLUMN     "authorizationNumber" TEXT,
ADD COLUMN     "authorizedAt" TIMESTAMP(3),
ADD COLUMN     "electronicStatusMessage" TEXT;
