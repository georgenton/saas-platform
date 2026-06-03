-- CreateTable
CREATE TABLE "EcommerceOrderOperationalEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "tenantSlug" TEXT NOT NULL,
    "productEntityId" TEXT NOT NULL,
    "orderDraftId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "sourceWorkspace" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "payloadJson" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EcommerceOrderOperationalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EcommerceOrderOperationalEvent_order_lookup_idx" ON "EcommerceOrderOperationalEvent"("tenantSlug", "productEntityId", "orderDraftId", "occurredAt");

-- CreateIndex
CREATE INDEX "EcommerceOrderOperationalEvent_event_type_idx" ON "EcommerceOrderOperationalEvent"("tenantId", "eventType", "occurredAt");

-- CreateIndex
CREATE INDEX "EcommerceOrderOperationalEvent_order_draft_idx" ON "EcommerceOrderOperationalEvent"("tenantId", "orderDraftId", "occurredAt");

-- AddForeignKey
ALTER TABLE "EcommerceOrderOperationalEvent" ADD CONSTRAINT "EcommerceOrderOperationalEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EcommerceOrderOperationalEvent" ADD CONSTRAINT "EcommerceOrderOperationalEvent_orderDraftId_fkey" FOREIGN KEY ("orderDraftId") REFERENCES "EcommerceOrderDraft"("id") ON DELETE CASCADE ON UPDATE CASCADE;
