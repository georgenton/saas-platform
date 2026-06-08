INSERT INTO "Product" ("id", "key", "name", "description", "isActive", "createdAt", "updatedAt")
VALUES
  (
    'product_medical_clinics',
    'medical-clinics',
    'Medical Clinics',
    'Operaciones de clinicas medicas: perfil, intake de pacientes, agenda, recordatorios y puente fiscal.',
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
    'module_medical_clinics_clinic_ops',
    'product_medical_clinics',
    'clinic-ops',
    'Clinic Ops',
    'Perfil de clinica, sedes, profesionales y catalogo de servicios.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_medical_clinics_patient_intake',
    'product_medical_clinics',
    'patient-intake',
    'Patient Intake',
    'Directorio inicial, consentimiento y cola de admision del paciente.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_medical_clinics_appointments',
    'product_medical_clinics',
    'appointments',
    'Appointments',
    'Agenda, disponibilidad, reservas, cancelaciones y no-show operativo.',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_medical_clinics_growth_bridge',
    'product_medical_clinics',
    'growth-bridge',
    'Growth Bridge',
    'Recordatorios y follow-up sobre canales conversacionales existentes.',
    false,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'module_medical_clinics_billing_tax_bridge',
    'product_medical_clinics',
    'billing-tax-bridge',
    'Billing and Tax Bridge',
    'Preparacion de cobros, invoice drafts y evidencia para Tax Compliance EC.',
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
    'permission_medical_clinics_read',
    'medical-clinics.read',
    'Allows reading Medical Clinics operational workspaces.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'permission_medical_clinics_manage',
    'medical-clinics.manage',
    'Allows managing Medical Clinics operational settings and handoff packets.',
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
    'role_permission_owner_medical_clinics_read',
    'role_tenant_owner',
    'permission_medical_clinics_read',
    CURRENT_TIMESTAMP
  ),
  (
    'role_permission_owner_medical_clinics_manage',
    'role_tenant_owner',
    'permission_medical_clinics_manage',
    CURRENT_TIMESTAMP
  )
ON CONFLICT ("roleId", "permissionId") DO NOTHING;

UPDATE "PlanEntitlement"
SET
  "value" =
    CASE
      WHEN NOT ("value" ? 'medical-clinics')
        THEN "value" || '["medical-clinics"]'::jsonb
      ELSE "value"
    END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "key" = 'products'
  AND "planId" = 'plan_enterprise_monthly';
