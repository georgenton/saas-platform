ALTER TABLE "Invoice"
ADD COLUMN "shipmentReason" TEXT,
ADD COLUMN "shipmentStartAt" TIMESTAMP(3),
ADD COLUMN "shipmentEndAt" TIMESTAMP(3),
ADD COLUMN "departureAddress" TEXT,
ADD COLUMN "arrivalAddress" TEXT,
ADD COLUMN "carrierName" TEXT,
ADD COLUMN "carrierIdentificationType" TEXT,
ADD COLUMN "carrierIdentification" TEXT,
ADD COLUMN "vehiclePlate" TEXT,
ADD COLUMN "destinationRoute" TEXT;
