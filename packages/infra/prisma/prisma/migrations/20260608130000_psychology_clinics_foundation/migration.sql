INSERT INTO "Product" ("id", "key", "name", "description", "isActive", "createdAt", "updatedAt")
VALUES
  (
    'product_psychology_clinics',
    'psychology-clinics',
    'Psychology Clinics',
    'Operaciones de consultas psicologicas: terapeutas, pacientes, sesiones, notas draft y seguimiento revisable.',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "PlatformModule" ("id", "productId", "key", "name", "description", "isCore", "isActive", "createdAt", "updatedAt")
VALUES
  (
    'module_psychology_clinics_therapists',
    'product_psychology_clinics',
    'therapists',
    'Therapists',
    'Terapeutas, enfoques, privacidad y licencia profesional.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_psychology_clinics_patients',
    'product_psychology_clinics',
    'patients',
    'Patients',
    'Intake, consentimiento terapeutico, contacto y revision inicial.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_psychology_clinics_sessions',
    'product_psychology_clinics',
    'sessions',
    'Sessions',
    'Agenda, modalidad, ciclo de sesiones, reminders y billing readiness.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_psychology_clinics_session_notes',
    'product_psychology_clinics',
    'session-notes',
    'Session Notes',
    'Notas estructuradas draft con revision obligatoria del terapeuta.',
    false,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_psychology_clinics_treatment_tracking',
    'product_psychology_clinics',
    'treatment-tracking',
    'Treatment Tracking',
    'Seguimiento de objetivos terapeuticos futuro y revisable.',
    false,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_psychology_clinics_reminders',
    'product_psychology_clinics',
    'reminders',
    'Reminders',
    'Recordatorios y follow-up sobre Growth con consentimiento.',
    false,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("productId", "key") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "isCore" = EXCLUDED."isCore",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (
    'permission_psychology_clinics_read',
    'psychology-clinics.read',
    'Allows reading Psychology Clinics operational workspaces.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_psychology_clinics_manage',
    'psychology-clinics.manage',
    'Allows managing Psychology Clinics operational settings and review packets.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("key") DO UPDATE
SET
  "description" = EXCLUDED."description",
  "updatedAt" = CURRENT_TIMESTAMP;

INSERT INTO "RolePermission" ("id", "roleId", "permissionId", "createdAt")
VALUES
  (
    'role_permission_owner_psychology_clinics_read',
    'role_tenant_owner',
    'permission_psychology_clinics_read',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_psychology_clinics_manage',
    'role_tenant_owner',
    'permission_psychology_clinics_manage',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

UPDATE "PlanEntitlement"
SET
  "value" =
    CASE
      WHEN NOT ("value" ? 'psychology-clinics')
        THEN "value" || '["psychology-clinics"]'::jsonb
      ELSE "value"
    END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" = 'products'
  AND "planId" = 'plan_enterprise_monthly';

CREATE TABLE IF NOT EXISTS "PsychologyClinicProfile" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "readinessStatus" TEXT NOT NULL,
  "clinicProfileJson" TEXT NOT NULL,
  "therapistsJson" TEXT NOT NULL,
  "serviceCatalogJson" TEXT NOT NULL,
  "blockersJson" TEXT NOT NULL,
  "guardrailsJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PsychologyClinicProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PsychologyClinicPatient" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "patientDisplayName" TEXT NOT NULL,
  "identificationStatus" TEXT NOT NULL,
  "contactStatus" TEXT NOT NULL,
  "therapyConsentStatus" TEXT NOT NULL,
  "messagingOptInStatus" TEXT NOT NULL,
  "initialRiskReviewStatus" TEXT NOT NULL,
  "presentingConcern" TEXT NOT NULL,
  "contactJson" TEXT NOT NULL,
  "emergencyContactJson" TEXT NOT NULL,
  "blockersJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PsychologyClinicPatient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PsychologyClinicSession" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "serviceName" TEXT NOT NULL,
  "therapistId" TEXT NOT NULL,
  "therapistName" TEXT NOT NULL,
  "modality" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL,
  "reminderStatus" TEXT NOT NULL,
  "billingStatus" TEXT NOT NULL,
  "blockersJson" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PsychologyClinicSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PsychologyClinicOperationalEvent" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "tenantSlug" TEXT NOT NULL,
  "sessionId" TEXT,
  "eventType" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "payloadJson" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PsychologyClinicOperationalEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PsychologyClinicProfile_tenantId_key" ON "PsychologyClinicProfile"("tenantId");
CREATE INDEX IF NOT EXISTS "PsychologyClinicProfile_tenantSlug_idx" ON "PsychologyClinicProfile"("tenantSlug");
CREATE INDEX IF NOT EXISTS "PsychologyClinicPatient_tenantSlug_createdAt_idx" ON "PsychologyClinicPatient"("tenantSlug", "createdAt");
CREATE INDEX IF NOT EXISTS "PsychologyClinicPatient_consent_idx" ON "PsychologyClinicPatient"("tenantId", "therapyConsentStatus", "createdAt");
CREATE INDEX IF NOT EXISTS "PsychologyClinicSession_tenantSlug_startsAt_idx" ON "PsychologyClinicSession"("tenantSlug", "startsAt");
CREATE INDEX IF NOT EXISTS "PsychologyClinicSession_tenantId_status_startsAt_idx" ON "PsychologyClinicSession"("tenantId", "status", "startsAt");
CREATE INDEX IF NOT EXISTS "PsychologyClinicSession_tenantId_patientId_idx" ON "PsychologyClinicSession"("tenantId", "patientId");
CREATE INDEX IF NOT EXISTS "PsychologyClinicOperationalEvent_tenantSlug_occurredAt_idx" ON "PsychologyClinicOperationalEvent"("tenantSlug", "occurredAt");
CREATE INDEX IF NOT EXISTS "PsychologyClinicOperationalEvent_tenantId_eventType_occurredAt_idx" ON "PsychologyClinicOperationalEvent"("tenantId", "eventType", "occurredAt");
CREATE INDEX IF NOT EXISTS "PsychologyClinicOperationalEvent_tenantId_sessionId_occurredAt_idx" ON "PsychologyClinicOperationalEvent"("tenantId", "sessionId", "occurredAt");

ALTER TABLE "PsychologyClinicProfile"
  ADD CONSTRAINT "PsychologyClinicProfile_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PsychologyClinicPatient"
  ADD CONSTRAINT "PsychologyClinicPatient_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PsychologyClinicSession"
  ADD CONSTRAINT "PsychologyClinicSession_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PsychologyClinicSession"
  ADD CONSTRAINT "PsychologyClinicSession_patientId_fkey"
  FOREIGN KEY ("patientId") REFERENCES "PsychologyClinicPatient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PsychologyClinicOperationalEvent"
  ADD CONSTRAINT "PsychologyClinicOperationalEvent_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PsychologyClinicOperationalEvent"
  ADD CONSTRAINT "PsychologyClinicOperationalEvent_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "PsychologyClinicSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
