import {
  PsychologyClinicProfileSnapshot,
  PsychologyClinicReadinessStatus,
  PsychologyClinicSessionStatus,
  TenantPsychologyClinicOperationalEventRecord,
  TenantPsychologyClinicPatientRecord,
  TenantPsychologyClinicSessionRecord,
} from '@saas-platform/psychology-clinics-domain';

export interface PsychologyClinicOperationsRepository {
  getTenantIdBySlug(tenantSlug: string): Promise<string | null>;
  getProfile(
    tenantSlug: string,
  ): Promise<PsychologyClinicProfileSnapshot | null>;
  upsertProfile(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    snapshot: PsychologyClinicProfileSnapshot;
  }): Promise<PsychologyClinicProfileSnapshot>;
  listPatients(
    tenantSlug: string,
  ): Promise<TenantPsychologyClinicPatientRecord[]>;
  savePatient(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    patientDisplayName: string;
    identificationStatus: PsychologyClinicReadinessStatus;
    contactStatus: PsychologyClinicReadinessStatus;
    therapyConsentStatus: PsychologyClinicReadinessStatus;
    messagingOptInStatus: PsychologyClinicReadinessStatus;
    initialRiskReviewStatus: PsychologyClinicReadinessStatus;
    presentingConcern: string;
    contact: TenantPsychologyClinicPatientRecord['contact'];
    emergencyContact: TenantPsychologyClinicPatientRecord['emergencyContact'];
    blockers: string[];
  }): Promise<TenantPsychologyClinicPatientRecord>;
  listSessions(
    tenantSlug: string,
  ): Promise<TenantPsychologyClinicSessionRecord[]>;
  saveSession(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    patientId: string;
    serviceName: string;
    therapistId: string;
    therapistName: string;
    modality: TenantPsychologyClinicSessionRecord['modality'];
    startsAt: Date;
    status: PsychologyClinicSessionStatus;
    reminderStatus: PsychologyClinicReadinessStatus;
    billingStatus: PsychologyClinicReadinessStatus;
    blockers: string[];
  }): Promise<TenantPsychologyClinicSessionRecord>;
  transitionSession(command: {
    tenantSlug: string;
    sessionId: string;
    status: PsychologyClinicSessionStatus;
    blockers?: string[];
  }): Promise<TenantPsychologyClinicSessionRecord | null>;
  recordEvent(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    sessionId: string | null;
    eventType: string;
    source: string;
    status: PsychologyClinicReadinessStatus;
    payload: Record<string, unknown>;
    occurredAt: Date;
  }): Promise<TenantPsychologyClinicOperationalEventRecord>;
  listEvents(
    tenantSlug: string,
  ): Promise<TenantPsychologyClinicOperationalEventRecord[]>;
}
