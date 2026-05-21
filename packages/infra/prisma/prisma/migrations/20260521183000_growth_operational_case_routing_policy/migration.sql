ALTER TABLE "GrowthOperationalCase"
ADD COLUMN "routingPolicyKey" TEXT NOT NULL DEFAULT 'growth_ops';

CREATE INDEX "GrowthOperationalCase_tenantId_routingPolicyKey_status_updatedAt_idx"
ON "GrowthOperationalCase"("tenantId", "routingPolicyKey", "status", "updatedAt");
