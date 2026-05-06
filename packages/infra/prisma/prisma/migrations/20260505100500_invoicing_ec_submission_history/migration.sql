-- CreateTable
CREATE TABLE "public"."InvoiceElectronicEvent" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerStatus" TEXT NOT NULL,
    "endpoint" TEXT,
    "soapAction" TEXT,
    "message" TEXT NOT NULL,
    "requestPayload" TEXT,
    "responsePayload" TEXT,
    "submissionReference" TEXT,
    "authorizationNumber" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvoiceElectronicEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InvoiceElectronicEvent_tenantId_invoiceId_occurredAt_idx" ON "public"."InvoiceElectronicEvent"("tenantId", "invoiceId", "occurredAt");

-- CreateIndex
CREATE INDEX "InvoiceElectronicEvent_invoiceId_eventType_occurredAt_idx" ON "public"."InvoiceElectronicEvent"("invoiceId", "eventType", "occurredAt");

-- AddForeignKey
ALTER TABLE "public"."InvoiceElectronicEvent" ADD CONSTRAINT "InvoiceElectronicEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InvoiceElectronicEvent" ADD CONSTRAINT "InvoiceElectronicEvent_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "public"."Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
