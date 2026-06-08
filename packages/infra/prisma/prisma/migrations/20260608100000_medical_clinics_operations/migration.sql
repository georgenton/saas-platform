CREATE TABLE "MedicalClinicProfile" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "readinessStatus" TEXT NOT NULL,
  "clinicProfileJson" TEXT NOT NULL,
  "careLocationsJson" TEXT NOT NULL,
  "professionalsJson" TEXT NOT NULL,
  "serviceCatalogJson" TEXT NOT NULL,
  "blockersJson" TEXT NOT NULL,
  "guardrailsJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MedicalClinicProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MedicalClinicPatient" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "patientDisplayName" TEXT NOT NULL,
  "identificationStatus" TEXT NOT NULL,
  "contactStatus" TEXT NOT NULL,
  "consentStatus" TEXT NOT NULL,
  "messagingOptInStatus" TEXT NOT NULL,
  "triageReason" TEXT NOT NULL,
  "contactJson" TEXT NOT NULL,
  "representativeJson" TEXT NOT NULL,
  "blockersJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MedicalClinicPatient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MedicalClinicAppointment" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "serviceName" TEXT NOT NULL,
  "professionalId" TEXT NOT NULL,
  "professionalName" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL,
  "reminderStatus" TEXT NOT NULL,
  "billingStatus" TEXT NOT NULL,
  "amountInCents" INTEGER,
  "currency" TEXT,
  "blockersJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MedicalClinicAppointment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MedicalClinicOperationalEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "appointmentId" TEXT,
  "eventType" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payloadJson" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MedicalClinicOperationalEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MedicalClinicProfile_tenantId_key" ON "MedicalClinicProfile"("tenantId");
CREATE INDEX "MedicalClinicProfile_tenantSlug_idx" ON "MedicalClinicProfile"("tenantSlug");
CREATE INDEX "MedicalClinicPatient_tenantSlug_createdAt_idx" ON "MedicalClinicPatient"("tenantSlug", "createdAt");
CREATE INDEX "MedicalClinicPatient_tenantId_consentStatus_createdAt_idx" ON "MedicalClinicPatient"("tenantId", "consentStatus", "createdAt");
CREATE INDEX "MedicalClinicAppointment_tenantSlug_startsAt_idx" ON "MedicalClinicAppointment"("tenantSlug", "startsAt");
CREATE INDEX "MedicalClinicAppointment_tenantId_status_startsAt_idx" ON "MedicalClinicAppointment"("tenantId", "status", "startsAt");
CREATE INDEX "MedicalClinicAppointment_tenantId_patientId_idx" ON "MedicalClinicAppointment"("tenantId", "patientId");
CREATE INDEX "MedicalClinicOperationalEvent_tenantSlug_occurredAt_idx" ON "MedicalClinicOperationalEvent"("tenantSlug", "occurredAt");
CREATE INDEX "MedicalClinicOperationalEvent_tenantId_eventType_occurredAt_idx" ON "MedicalClinicOperationalEvent"("tenantId", "eventType", "occurredAt");
CREATE INDEX "MedicalClinicOperationalEvent_tenantId_appointmentId_occurredAt_idx" ON "MedicalClinicOperationalEvent"("tenantId", "appointmentId", "occurredAt");

ALTER TABLE "MedicalClinicProfile" ADD CONSTRAINT "MedicalClinicProfile_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MedicalClinicPatient" ADD CONSTRAINT "MedicalClinicPatient_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MedicalClinicAppointment" ADD CONSTRAINT "MedicalClinicAppointment_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MedicalClinicAppointment" ADD CONSTRAINT "MedicalClinicAppointment_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "MedicalClinicPatient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MedicalClinicOperationalEvent" ADD CONSTRAINT "MedicalClinicOperationalEvent_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MedicalClinicOperationalEvent" ADD CONSTRAINT "MedicalClinicOperationalEvent_appointmentId_fkey"
  FOREIGN KEY ("appointmentId") REFERENCES "MedicalClinicAppointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
