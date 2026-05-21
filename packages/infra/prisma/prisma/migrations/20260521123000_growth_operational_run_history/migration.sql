CREATE TABLE "WhatsappOperationalMonitorRun" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "triggerSource" TEXT NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL,
  "autoRunReadyRetriesEnabled" BOOLEAN NOT NULL,
  "overallStatus" TEXT NOT NULL,
  "totalAlertCount" INTEGER NOT NULL,
  "criticalAlertCount" INTEGER NOT NULL,
  "warningAlertCount" INTEGER NOT NULL,
  "operationalThresholdsJson" TEXT NOT NULL,
  "operationalDashboardJson" TEXT NOT NULL,
  "operationalAlertsJson" TEXT NOT NULL,
  "retryRunnerExecuted" BOOLEAN NOT NULL,
  "retryRunnerSummaryJson" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WhatsappOperationalMonitorRun_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WhatsappOperationalAlertAcknowledgement" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "alertKey" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "provider" TEXT,
  "failureClass" TEXT,
  "providerTaxonomyFamily" TEXT,
  "providerTaxonomyDetail" TEXT,
  "affectedMessageCount" INTEGER NOT NULL,
  "recommendedAction" TEXT NOT NULL,
  "lastSeenGeneratedAt" TIMESTAMP(3),
  "acknowledgedAt" TIMESTAMP(3) NOT NULL,
  "acknowledgedByUserId" TEXT NOT NULL,
  "acknowledgedByEmail" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "WhatsappOperationalAlertAcknowledgement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WhatsappOperationalAlertAcknowledgement_tenantId_alertKey_key"
ON "WhatsappOperationalAlertAcknowledgement"("tenantId", "alertKey");

CREATE INDEX "WhatsappOperationalMonitorRun_tenantId_generatedAt_idx"
ON "WhatsappOperationalMonitorRun"("tenantId", "generatedAt");

CREATE INDEX "WhatsappOperationalMonitorRun_tenantId_createdAt_idx"
ON "WhatsappOperationalMonitorRun"("tenantId", "createdAt");

CREATE INDEX "WhatsappOperationalAlertAcknowledgement_tenantId_acknowledgedAt_idx"
ON "WhatsappOperationalAlertAcknowledgement"("tenantId", "acknowledgedAt");

ALTER TABLE "WhatsappOperationalMonitorRun"
ADD CONSTRAINT "WhatsappOperationalMonitorRun_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WhatsappOperationalAlertAcknowledgement"
ADD CONSTRAINT "WhatsappOperationalAlertAcknowledgement_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
