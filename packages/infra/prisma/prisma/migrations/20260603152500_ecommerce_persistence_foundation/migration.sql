-- CreateTable
CREATE TABLE "EcommerceProductDraft" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "sourceDraftId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "suggestedChannelsJson" TEXT NOT NULL,
    "briefingStatus" TEXT,
    "briefSummary" TEXT,
    "briefRequiredInputsJson" TEXT NOT NULL,
    "briefGuardrailsJson" TEXT NOT NULL,
    "refinementStatus" TEXT,
    "refinementSummary" TEXT,
    "pricingBand" TEXT,
    "offerAngle" TEXT,
    "primaryCta" TEXT,
    "channelSequenceJson" TEXT NOT NULL,
    "refinementGuardrailsJson" TEXT NOT NULL,
    "promotedToWorkspaceAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EcommerceProductDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EcommerceOrderDraft" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "productEntityId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "orderLabel" TEXT NOT NULL,
    "offerTitle" TEXT NOT NULL,
    "pricingSnapshot" TEXT NOT NULL,
    "primaryCta" TEXT NOT NULL,
    "closingChannel" TEXT NOT NULL,
    "captureStatus" TEXT NOT NULL,
    "invoicingReadinessStatus" TEXT NOT NULL,
    "customerProfileJson" TEXT NOT NULL,
    "requiredFieldsJson" TEXT NOT NULL,
    "optionalFieldsJson" TEXT NOT NULL,
    "operatorPromptsJson" TEXT NOT NULL,
    "missingFieldsJson" TEXT NOT NULL,
    "blockedByJson" TEXT NOT NULL,
    "guardrailsJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EcommerceOrderDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EcommerceProductSetup" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "savedDraftId" TEXT NOT NULL,
    "sourceDraftId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pricingBand" TEXT,
    "offerAngle" TEXT,
    "primaryCta" TEXT,
    "suggestedChannelsJson" TEXT NOT NULL,
    "channelSequenceJson" TEXT NOT NULL,
    "promotedFromWorkspaceAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EcommerceProductSetup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EcommerceProductEntity" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "productSetupId" TEXT NOT NULL,
    "savedDraftId" TEXT NOT NULL,
    "sourceDraftId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "pricingBand" TEXT,
    "offerAngle" TEXT,
    "primaryCta" TEXT,
    "suggestedChannelsJson" TEXT NOT NULL,
    "channelSequenceJson" TEXT NOT NULL,
    "promotedFromSetupAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EcommerceProductEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EcommerceProductEntityChannelDraft" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "productEntityId" TEXT NOT NULL,
    "channelKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "preparationStatus" TEXT NOT NULL,
    "handoffOwner" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "draftBlueprintJson" TEXT NOT NULL,
    "publishChecklistJson" TEXT NOT NULL,
    "recommendedArtifactsJson" TEXT NOT NULL,
    "nextMilestone" TEXT NOT NULL,
    "blockedByJson" TEXT NOT NULL,
    "guardrailsJson" TEXT NOT NULL,
    "promotedToAssetWorkspaceAt" TIMESTAMP(3),
    "promotedToAssetEntityAt" TIMESTAMP(3),
    "promotedToReleaseCandidateAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EcommerceProductEntityChannelDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EcommerceProductDraft_tenantSlug_sourceDraftId_idx" ON "EcommerceProductDraft"("tenantSlug", "sourceDraftId");

-- CreateIndex
CREATE INDEX "EcommerceProductDraft_tenantId_createdAt_idx" ON "EcommerceProductDraft"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EcommerceProductDraft_tenantId_sourceDraftId_key" ON "EcommerceProductDraft"("tenantId", "sourceDraftId");

-- CreateIndex
CREATE INDEX "EcommerceOrderDraft_tenantSlug_productEntityId_idx" ON "EcommerceOrderDraft"("tenantSlug", "productEntityId");

-- CreateIndex
CREATE INDEX "EcommerceOrderDraft_tenantId_createdAt_idx" ON "EcommerceOrderDraft"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EcommerceOrderDraft_tenantId_productEntityId_key" ON "EcommerceOrderDraft"("tenantId", "productEntityId");

-- CreateIndex
CREATE INDEX "EcommerceProductSetup_tenantSlug_savedDraftId_idx" ON "EcommerceProductSetup"("tenantSlug", "savedDraftId");

-- CreateIndex
CREATE INDEX "EcommerceProductSetup_tenantId_createdAt_idx" ON "EcommerceProductSetup"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EcommerceProductSetup_tenantId_savedDraftId_key" ON "EcommerceProductSetup"("tenantId", "savedDraftId");

-- CreateIndex
CREATE INDEX "EcommerceProductEntity_tenantSlug_productSetupId_idx" ON "EcommerceProductEntity"("tenantSlug", "productSetupId");

-- CreateIndex
CREATE INDEX "EcommerceProductEntity_tenantId_createdAt_idx" ON "EcommerceProductEntity"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EcommerceProductEntity_tenantId_productSetupId_key" ON "EcommerceProductEntity"("tenantId", "productSetupId");

-- CreateIndex
CREATE INDEX "EcommerceProductEntityChannelDraft_tenantSlug_productEntity_idx" ON "EcommerceProductEntityChannelDraft"("tenantSlug", "productEntityId");

-- CreateIndex
CREATE INDEX "EcommerceProductEntityChannelDraft_tenantId_createdAt_idx" ON "EcommerceProductEntityChannelDraft"("tenantId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EcommerceProductEntityChannelDraft_tenantId_productEntityId_key" ON "EcommerceProductEntityChannelDraft"("tenantId", "productEntityId", "channelKey");

-- AddForeignKey
ALTER TABLE "EcommerceProductDraft" ADD CONSTRAINT "EcommerceProductDraft_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcommerceOrderDraft" ADD CONSTRAINT "EcommerceOrderDraft_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcommerceProductSetup" ADD CONSTRAINT "EcommerceProductSetup_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcommerceProductEntity" ADD CONSTRAINT "EcommerceProductEntity_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcommerceProductEntityChannelDraft" ADD CONSTRAINT "EcommerceProductEntityChannelDraft_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
