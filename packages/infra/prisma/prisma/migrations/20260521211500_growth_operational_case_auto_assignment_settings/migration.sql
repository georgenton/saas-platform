CREATE TABLE "GrowthOperationalCaseAutoAssignmentSettings" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "defaultPolicyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrowthOperationalCaseAutoAssignmentSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GrowthOperationalCaseAutoAssignmentSettings_tenantId_key"
ON "GrowthOperationalCaseAutoAssignmentSettings"("tenantId");

ALTER TABLE "GrowthOperationalCaseAutoAssignmentSettings"
ADD CONSTRAINT "GrowthOperationalCaseAutoAssignmentSettings_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
