-- AlterTable
ALTER TABLE "EcommerceOrderOperationalEvent" ADD COLUMN "dedupeKey" TEXT;

-- Backfill deterministic keys for existing operational events.
UPDATE "EcommerceOrderOperationalEvent"
SET "dedupeKey" =
  "tenantSlug" || ':' ||
  "productEntityId" || ':' ||
  "orderDraftId" || ':' ||
  "eventType" || ':' ||
  "sourceWorkspace" || ':' ||
  "status";

-- Keep the latest event when earlier refreshes created duplicate operational snapshots.
DELETE FROM "EcommerceOrderOperationalEvent"
WHERE "id" IN (
  SELECT "id"
  FROM (
    SELECT
      "id",
      ROW_NUMBER() OVER (
        PARTITION BY "dedupeKey"
        ORDER BY "occurredAt" DESC, "createdAt" DESC
      ) AS duplicate_rank
    FROM "EcommerceOrderOperationalEvent"
  ) ranked_events
  WHERE duplicate_rank > 1
);

-- AlterTable
ALTER TABLE "EcommerceOrderOperationalEvent" ALTER COLUMN "dedupeKey" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EcommerceOrderOperationalEvent_dedupeKey_key" ON "EcommerceOrderOperationalEvent"("dedupeKey");

-- CreateIndex
CREATE INDEX "EcommerceOrderOperationalEvent_order_event_type_idx" ON "EcommerceOrderOperationalEvent"("tenantSlug", "productEntityId", "orderDraftId", "eventType");
