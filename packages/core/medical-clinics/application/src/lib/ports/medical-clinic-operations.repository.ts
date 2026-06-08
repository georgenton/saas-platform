import {
  MedicalClinicAppointmentStatus,
  MedicalClinicProfileSnapshot,
  MedicalClinicReadinessStatus,
  TenantMedicalClinicAppointmentRecord,
  TenantMedicalClinicOperationalEventRecord,
  TenantMedicalClinicPatientRecord,
} from '@saas-platform/medical-clinics-domain';

export interface MedicalClinicOperationsRepository {
  getTenantIdBySlug(tenantSlug: string): Promise<string | null>;
  getProfile(tenantSlug: string): Promise<MedicalClinicProfileSnapshot | null>;
  upsertProfile(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    snapshot: MedicalClinicProfileSnapshot;
  }): Promise<MedicalClinicProfileSnapshot>;
  listPatients(tenantSlug: string): Promise<TenantMedicalClinicPatientRecord[]>;
  savePatient(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    patientDisplayName: string;
    identificationStatus: MedicalClinicReadinessStatus;
    contactStatus: MedicalClinicReadinessStatus;
    consentStatus: MedicalClinicReadinessStatus;
    messagingOptInStatus: MedicalClinicReadinessStatus;
    triageReason: string;
    contact: TenantMedicalClinicPatientRecord['contact'];
    representative: TenantMedicalClinicPatientRecord['representative'];
    blockers: string[];
  }): Promise<TenantMedicalClinicPatientRecord>;
  listAppointments(
    tenantSlug: string,
  ): Promise<TenantMedicalClinicAppointmentRecord[]>;
  saveAppointment(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    patientId: string;
    serviceName: string;
    professionalId: string;
    professionalName: string;
    startsAt: Date;
    status: MedicalClinicAppointmentStatus;
    reminderStatus: MedicalClinicReadinessStatus;
    billingStatus: MedicalClinicReadinessStatus;
    amountInCents: number | null;
    currency: 'USD' | null;
    blockers: string[];
  }): Promise<TenantMedicalClinicAppointmentRecord>;
  transitionAppointment(command: {
    tenantSlug: string;
    appointmentId: string;
    status: MedicalClinicAppointmentStatus;
    reminderStatus?: MedicalClinicReadinessStatus;
    billingStatus?: MedicalClinicReadinessStatus;
    blockers?: string[];
  }): Promise<TenantMedicalClinicAppointmentRecord | null>;
  recordEvent(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    appointmentId: string | null;
    eventType: string;
    source: string;
    status: MedicalClinicReadinessStatus;
    payload: Record<string, unknown>;
    occurredAt: Date;
  }): Promise<TenantMedicalClinicOperationalEventRecord>;
  listEvents(
    tenantSlug: string,
  ): Promise<TenantMedicalClinicOperationalEventRecord[]>;
}
