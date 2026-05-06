CREATE TABLE "ElectronicSubmissionSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "transmissionMode" TEXT NOT NULL,
    "receptionUrl" TEXT,
    "authorizationUrl" TEXT,
    "credentialsSecretRef" TEXT,
    "timeoutMs" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectronicSubmissionSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ElectronicSubmissionSettings_tenantId_key" ON "ElectronicSubmissionSettings"("tenantId");

ALTER TABLE "ElectronicSubmissionSettings"
ADD CONSTRAINT "ElectronicSubmissionSettings_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
