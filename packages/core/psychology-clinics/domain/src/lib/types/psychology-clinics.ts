export type PsychologyClinicReadinessStatus =
  | 'ready'
  | 'needs_review'
  | 'blocked';

export type PsychologyClinicSessionStatus =
  | 'requested'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface PsychologyClinicProfileSnapshot {
  workspaceStatus: PsychologyClinicReadinessStatus;
  clinicProfile: {
    legalName: string;
    tradeName: string;
    operatingMode: 'solo_practice' | 'multi_therapist_ready';
    privacyReviewStatus: PsychologyClinicReadinessStatus;
  };
  therapists: Array<{
    id: string;
    displayName: string;
    approach: string;
    licenseStatus: 'pending_review' | 'ready';
    scheduleStatus: PsychologyClinicReadinessStatus;
  }>;
  serviceCatalog: Array<{
    id: string;
    name: string;
    modality: 'in_person' | 'teletherapy_review_required';
    defaultDurationMinutes: number;
    billingMode: 'invoiceable_service' | 'bundle_review_required';
    status: PsychologyClinicReadinessStatus;
  }>;
  blockers: string[];
  guardrails: string[];
}

export interface TenantPsychologyClinicPatientRecord {
  id: string;
  tenantSlug: string;
  patientDisplayName: string;
  identificationStatus: PsychologyClinicReadinessStatus;
  contactStatus: PsychologyClinicReadinessStatus;
  therapyConsentStatus: PsychologyClinicReadinessStatus;
  messagingOptInStatus: PsychologyClinicReadinessStatus;
  initialRiskReviewStatus: PsychologyClinicReadinessStatus;
  presentingConcern: string;
  contact: {
    email: string | null;
    phoneE164: string | null;
    whatsappE164: string | null;
  };
  emergencyContact: {
    displayName: string | null;
    relationship: string | null;
    phoneE164: string | null;
  };
  blockers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantPsychologyClinicSessionRecord {
  id: string;
  tenantSlug: string;
  patientId: string;
  patientDisplayName: string;
  serviceName: string;
  therapistId: string;
  therapistName: string;
  modality: 'in_person' | 'teletherapy_review_required';
  startsAt: Date;
  status: PsychologyClinicSessionStatus;
  reminderStatus: PsychologyClinicReadinessStatus;
  billingStatus: PsychologyClinicReadinessStatus;
  blockers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantPsychologyClinicOperationalEventRecord {
  id: string;
  tenantSlug: string;
  sessionId: string | null;
  eventType: string;
  source: string;
  status: PsychologyClinicReadinessStatus;
  payload: Record<string, unknown>;
  occurredAt: Date;
  createdAt: Date;
}

export interface TenantPsychologyClinicProductAnchorView {
  tenantSlug: string;
  generatedAt: Date;
  productKey: 'psychology-clinics';
  productName: string;
  anchorStatus: PsychologyClinicReadinessStatus;
  modules: Array<{
    key: string;
    name: string;
    description: string;
    isCore: boolean;
  }>;
  lanes: Array<{
    laneKey: string;
    label: string;
    status: PsychologyClinicReadinessStatus;
    blockerCount: number;
    primaryMetric: string;
    nextAction: string;
  }>;
  summary: {
    moduleCount: number;
    coreModuleCount: number;
    readyLaneCount: number;
    blockerCount: number;
  };
  guardrails: string[];
  nextStep: string;
}

export interface TenantPsychologyClinicProfileWorkspace
  extends PsychologyClinicProfileSnapshot {
  tenantSlug: string;
  generatedAt: Date;
  nextStep: string;
}

export interface TenantPsychologyClinicPatientIntakeWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  workspaceStatus: PsychologyClinicReadinessStatus;
  intakeQueue: Array<{
    id: string;
    patientDisplayName: string;
    therapyConsentStatus: PsychologyClinicReadinessStatus;
    initialRiskReviewStatus: PsychologyClinicReadinessStatus;
    presentingConcern: string;
    nextAction: string;
  }>;
  summary: {
    patientCount: number;
    readyPatientCount: number;
    pendingConsentCount: number;
    riskReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicSessionSchedulingWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  workspaceStatus: PsychologyClinicReadinessStatus;
  sessions: Array<{
    id: string;
    patientDisplayName: string;
    serviceName: string;
    therapistName: string;
    modality: TenantPsychologyClinicSessionRecord['modality'];
    startsAt: string;
    status: PsychologyClinicSessionStatus;
    reminderStatus: PsychologyClinicReadinessStatus;
    billingStatus: PsychologyClinicReadinessStatus;
  }>;
  summary: {
    sessionCount: number;
    confirmedCount: number;
    completedCount: number;
    needsReminderCount: number;
    billingReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicSessionNoteDraftPacket {
  tenantSlug: string;
  sessionId: string;
  generatedAt: Date;
  packetStatus: PsychologyClinicReadinessStatus;
  draftSections: {
    presentingConcern: string;
    sessionThemes: string[];
    interventions: string[];
    homeworkOrFollowUp: string[];
    riskReview: string;
    pendingFields: string[];
  };
  review: {
    requiresTherapistReview: true;
    mayBeSigned: false;
    reviewerRole: 'therapist';
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicFoundationCloseout {
  tenantSlug: string;
  generatedAt: Date;
  closeoutStatus: PsychologyClinicReadinessStatus;
  checklist: Array<{
    key: string;
    label: string;
    status: PsychologyClinicReadinessStatus;
    evidence: string;
  }>;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsReviewCheckCount: number;
    blockedCheckCount: number;
  };
  recommendedNextSlice:
    | 'psychology-treatment-plans'
    | 'psychology-product-activation-ui';
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}
