ALTER TABLE "Payment"
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'posted',
ADD COLUMN "reversedAt" TIMESTAMP(3),
ADD COLUMN "reversalReason" TEXT;

UPDATE "Payment"
SET "status" = 'posted'
WHERE "status" IS NULL;
