import {
  PsychologyClinicProfileSnapshot,
  TenantPsychologyClinicPatientRecord,
  TenantPsychologyClinicSessionRecord,
} from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';

export function psychologyGuardrails(): string[] {
  return [
    'Workspace psicologico operativo; no constituye historia clinica legal firmada.',
    'No diagnostica, no clasifica riesgo automaticamente y no reemplaza criterio terapeutico.',
    'Notas, seguimiento y revisiones de riesgo son drafts revisables por terapeuta.',
    'Teleconsulta y mensajeria requieren consentimiento y controles de privacidad.',
  ];
}

export function defaultProfile(): PsychologyClinicProfileSnapshot {
  return {
    workspaceStatus: 'needs_review',
    clinicProfile: {
      legalName: 'Consulta Psicologica Demo',
      tradeName: 'Psicologia Demo',
      operatingMode: 'solo_practice',
      privacyReviewStatus: 'needs_review',
    },
    therapists: [
      {
        id: 'therapist_demo_001',
        displayName: 'Ps. Ana Morales',
        approach: 'Cognitivo conductual',
        licenseStatus: 'pending_review',
        scheduleStatus: 'needs_review',
      },
    ],
    serviceCatalog: [
      {
        id: 'service_individual_session',
        name: 'Sesion individual',
        modality: 'in_person',
        defaultDurationMinutes: 50,
        billingMode: 'invoiceable_service',
        status: 'ready',
      },
      {
        id: 'service_teletherapy_session',
        name: 'Teleconsulta psicologica',
        modality: 'teletherapy_review_required',
        defaultDurationMinutes: 50,
        billingMode: 'invoiceable_service',
        status: 'needs_review',
      },
    ],
    blockers: ['Validar licencia profesional y controles de privacidad.'],
    guardrails: psychologyGuardrails(),
  };
}

export async function findPatient(
  operationsRepository: PsychologyClinicOperationsRepository | undefined,
  tenantSlug: string,
  patientId: string,
): Promise<TenantPsychologyClinicPatientRecord | null> {
  const patients = await operationsRepository?.listPatients(tenantSlug);

  return patients?.find((patient) => patient.id === patientId) ?? null;
}

export async function findSession(
  operationsRepository: PsychologyClinicOperationsRepository | undefined,
  tenantSlug: string,
  sessionId: string,
): Promise<TenantPsychologyClinicSessionRecord | null> {
  const sessions = await operationsRepository?.listSessions(tenantSlug);

  return sessions?.find((session) => session.id === sessionId) ?? null;
}

export function defaultSession(
  tenantSlug: string,
  sessionId: string,
): TenantPsychologyClinicSessionRecord {
  const now = new Date('2026-06-08T14:00:00.000Z');

  return {
    id: sessionId,
    tenantSlug,
    patientId: 'psychology_patient_demo',
    patientDisplayName: 'Paciente Demo',
    serviceName: 'Sesion individual',
    therapistId: 'therapist_demo_001',
    therapistName: 'Ps. Ana Morales',
    modality: 'in_person',
    startsAt: now,
    status: 'confirmed',
    reminderStatus: 'needs_review',
    billingStatus: 'needs_review',
    blockers: ['Usando sesion demo; confirmar sesion persistida.'],
    createdAt: now,
    updatedAt: now,
  };
}
