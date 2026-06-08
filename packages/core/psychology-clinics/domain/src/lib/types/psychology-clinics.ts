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

export interface TenantPsychologyClinicTreatmentPlanWorkspace {
  tenantSlug: string;
  patientId: string;
  generatedAt: Date;
  workspaceStatus: PsychologyClinicReadinessStatus;
  patient: {
    id: string;
    displayName: string;
    presentingConcern: string;
    therapyConsentStatus: PsychologyClinicReadinessStatus;
    initialRiskReviewStatus: PsychologyClinicReadinessStatus;
  };
  goals: Array<{
    id: string;
    label: string;
    status: PsychologyClinicReadinessStatus;
    reviewCadence: string;
    nextAction: string;
  }>;
  careTasks: Array<{
    id: string;
    label: string;
    owner: 'therapist' | 'patient' | 'front_desk';
    status: PsychologyClinicReadinessStatus;
    dueWindow: string;
    growthBridgeStatus: PsychologyClinicReadinessStatus;
  }>;
  summary: {
    goalCount: number;
    readyGoalCount: number;
    taskCount: number;
    blockedTaskCount: number;
    growthReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicTreatmentFollowUpReadiness {
  tenantSlug: string;
  sessionId: string;
  patientId: string;
  generatedAt: Date;
  readinessStatus: PsychologyClinicReadinessStatus;
  session: {
    id: string;
    patientDisplayName: string;
    serviceName: string;
    therapistName: string;
    status: PsychologyClinicSessionStatus;
    startsAt: string;
  };
  planItems: Array<{
    key: string;
    label: string;
    status: PsychologyClinicReadinessStatus;
    evidence: string;
  }>;
  suggestedFollowUp: {
    recommendedWindow: string;
    channel: 'in_session' | 'whatsapp_review_required';
    requiresTherapistReview: true;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicGrowthReminderBridge {
  tenantSlug: string;
  generatedAt: Date;
  bridgeStatus: PsychologyClinicReadinessStatus;
  channel: 'whatsapp';
  reminders: Array<{
    sessionId: string;
    patientDisplayName: string;
    templateKey: string;
    sendWindow: string;
    status: PsychologyClinicReadinessStatus;
    nextAction: string;
  }>;
  handoff: {
    growthProductKey: 'growth';
    conversationPurpose: 'therapy_session_confirmation' | 'therapy_follow_up';
    requiresHumanReview: true;
    privacyReviewRequired: true;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicBillingTaxBridge {
  tenantSlug: string;
  generatedAt: Date;
  bridgeStatus: PsychologyClinicReadinessStatus;
  invoiceableItems: Array<{
    sessionId: string;
    patientDisplayName: string;
    serviceName: string;
    therapistName: string;
    occurredAt: string;
    partyStatus: PsychologyClinicReadinessStatus;
    invoiceDraftStatus: PsychologyClinicReadinessStatus;
    taxEvidenceStatus: PsychologyClinicReadinessStatus;
  }>;
  handoff: {
    invoicingProductKey: 'invoicing';
    taxComplianceProductKey: 'tax-compliance-ec';
    requiresHumanReview: true;
  };
  summary: {
    invoiceableItemCount: number;
    readyItemCount: number;
    blockedItemCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicPatientTimelineWorkspace {
  tenantSlug: string;
  patientId: string;
  generatedAt: Date;
  workspaceStatus: PsychologyClinicReadinessStatus;
  patient: {
    id: string;
    displayName: string;
    presentingConcern: string;
    therapyConsentStatus: PsychologyClinicReadinessStatus;
  };
  timeline: Array<{
    id: string;
    occurredAt: string;
    label: string;
    source:
      | 'patient-intake'
      | 'session'
      | 'session-note'
      | 'growth-bridge'
      | 'billing-tax-bridge'
      | 'treatment-plan';
    status: PsychologyClinicReadinessStatus;
    evidence: string;
  }>;
  summary: {
    eventCount: number;
    sessionCount: number;
    noteDraftCount: number;
    bridgeEventCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicOperationsCloseout {
  tenantSlug: string;
  generatedAt: Date;
  closeoutStatus: PsychologyClinicReadinessStatus;
  closedLayers: Array<{
    key: string;
    label: string;
    status: PsychologyClinicReadinessStatus;
    evidence: string;
  }>;
  productReadiness: {
    foundationReady: boolean;
    productActivationReady: boolean;
    treatmentPlansReady: boolean;
    growthBridgeReady: boolean;
    billingTaxBridgeReady: boolean;
    timelineReady: boolean;
  };
  summary: {
    patientCount: number;
    sessionCount: number;
    operationalEventCount: number;
    blockerCount: number;
  };
  remainingGaps: string[];
  recommendedNextProduct:
    | 'psychology-records-hardening'
    | 'medical-clinics-ehr-discovery';
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicRecordsHardeningWorkspace {
  tenantSlug: string;
  patientId: string;
  generatedAt: Date;
  workspaceStatus: PsychologyClinicReadinessStatus;
  recordLayers: Array<{
    key: string;
    label: string;
    status: PsychologyClinicReadinessStatus;
    evidenceCount: number;
    nextAction: string;
  }>;
  continuity: {
    sessionCount: number;
    noteDraftCount: number;
    treatmentEventCount: number;
    bridgeEventCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicClinicalEvidenceRegistry {
  tenantSlug: string;
  patientId: string;
  generatedAt: Date;
  registryStatus: PsychologyClinicReadinessStatus;
  evidenceItems: Array<{
    id: string;
    type:
      | 'consent'
      | 'session_note_draft'
      | 'treatment_plan'
      | 'external_document'
      | 'privacy_review'
      | 'safety_review';
    label: string;
    status: PsychologyClinicReadinessStatus;
    source: string;
    capturedAt: string;
    requiresTherapistReview: boolean;
  }>;
  summary: {
    evidenceCount: number;
    consentEvidenceCount: number;
    reviewRequiredCount: number;
    blockedEvidenceCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicSessionNoteReviewLoop {
  tenantSlug: string;
  sessionId: string;
  generatedAt: Date;
  reviewStatus: PsychologyClinicReadinessStatus;
  stages: Array<{
    key: 'draft' | 'therapist_review' | 'approved_draft' | 'archived_record';
    label: string;
    status: PsychologyClinicReadinessStatus;
    evidence: string;
  }>;
  reviewPolicy: {
    requiresTherapistReview: true;
    mayBeSigned: false;
    legalEhrRecord: false;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicRiskSafetyReviewWorkspace {
  tenantSlug: string;
  patientId: string;
  generatedAt: Date;
  workspaceStatus: PsychologyClinicReadinessStatus;
  reviewSignals: Array<{
    key: string;
    label: string;
    status: PsychologyClinicReadinessStatus;
    evidence: string;
    owner: 'therapist' | 'front_desk';
  }>;
  escalation: {
    emergencyContactPresent: boolean;
    requiresHumanReview: true;
    automationAllowed: false;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicPrivacyConsentControlCenter {
  tenantSlug: string;
  generatedAt: Date;
  controlStatus: PsychologyClinicReadinessStatus;
  controls: Array<{
    key: string;
    label: string;
    status: PsychologyClinicReadinessStatus;
    affectedPatientCount: number;
    nextAction: string;
  }>;
  summary: {
    patientCount: number;
    consentReadyCount: number;
    messagingReadyCount: number;
    privacyReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantPsychologyClinicRecordsCloseoutV3 {
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
  recommendedNextProduct:
    | 'psychology-ehr-discovery'
    | 'psychology-clinical-evidence-hardening';
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}
