-- CreateTable
CREATE TABLE "AiMemoryRecord" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "domainKey" TEXT,
    "agentKey" TEXT,
    "sourceKind" TEXT NOT NULL,
    "freshness" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "tagsJson" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdByUserId" TEXT,
    "createdByEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiMemoryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiMemoryRecord_tenantId_scope_updatedAt_idx"
ON "AiMemoryRecord"("tenantId", "scope", "updatedAt");

-- CreateIndex
CREATE INDEX "AiMemoryRecord_tenantId_domainKey_updatedAt_idx"
ON "AiMemoryRecord"("tenantId", "domainKey", "updatedAt");

-- CreateIndex
CREATE INDEX "AiMemoryRecord_tenantId_agentKey_updatedAt_idx"
ON "AiMemoryRecord"("tenantId", "agentKey", "updatedAt");

-- AddForeignKey
ALTER TABLE "AiMemoryRecord"
ADD CONSTRAINT "AiMemoryRecord_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
