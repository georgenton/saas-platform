ALTER TABLE "Invoice"
ADD COLUMN "signedAt" TIMESTAMP(3),
ADD COLUMN "submittedAt" TIMESTAMP(3),
ADD COLUMN "submissionReference" TEXT;
