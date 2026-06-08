export type MedicalClinicReadinessStatus = 'ready' | 'needs_review' | 'blocked';

export type MedicalClinicAppointmentStatus =
  | 'requested'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface MedicalClinicOperationalLane {
  laneKey: string;
  label: string;
  status: MedicalClinicReadinessStatus;
  blockerCount: number;
  primaryMetric: string;
  nextAction: string;
}

export interface MedicalClinicProfileSnapshot {
  clinicProfile: TenantMedicalClinicProfileWorkspace['clinicProfile'];
  careLocations: TenantMedicalClinicProfileWorkspace['careLocations'];
  professionals: TenantMedicalClinicProfileWorkspace['professionals'];
  serviceCatalog: TenantMedicalClinicProfileWorkspace['serviceCatalog'];
  workspaceStatus: MedicalClinicReadinessStatus;
  blockers: string[];
  guardrails: string[];
}

export interface TenantMedicalClinicPatientRecord {
  id: string;
  tenantSlug: string;
  patientDisplayName: string;
  identificationStatus: MedicalClinicReadinessStatus;
  contactStatus: MedicalClinicReadinessStatus;
  consentStatus: MedicalClinicReadinessStatus;
  messagingOptInStatus: MedicalClinicReadinessStatus;
  triageReason: string;
  contact: {
    email: string | null;
    phoneE164: string | null;
    whatsappE164: string | null;
  };
  representative: {
    displayName: string | null;
    relationship: string | null;
    identification: string | null;
  };
  blockers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantMedicalClinicAppointmentRecord {
  id: string;
  tenantSlug: string;
  patientId: string;
  patientDisplayName: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantMedicalClinicOperationalEventRecord {
  id: string;
  tenantSlug: string;
  appointmentId: string | null;
  eventType: string;
  source: string;
  status: MedicalClinicReadinessStatus;
  payload: Record<string, unknown>;
  occurredAt: Date;
  createdAt: Date;
}

export interface TenantMedicalClinicProductAnchorView {
  tenantSlug: string;
  generatedAt: Date;
  productKey: 'medical-clinics';
  productName: string;
  anchorStatus: MedicalClinicReadinessStatus;
  modules: Array<{
    key: string;
    name: string;
    description: string;
    isCore: boolean;
  }>;
  lanes: MedicalClinicOperationalLane[];
  summary: {
    moduleCount: number;
    coreModuleCount: number;
    readyLaneCount: number;
    blockerCount: number;
  };
  guardrails: string[];
  nextStep: string;
}

export interface TenantMedicalClinicProfileWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  workspaceStatus: MedicalClinicReadinessStatus;
  clinicProfile: {
    legalName: string;
    tradeName: string;
    rucStatus: 'pending_party_link' | 'linked';
    operatingMode: 'single_location' | 'multi_location_ready';
  };
  careLocations: Array<{
    id: string;
    name: string;
    city: string;
    roomCount: number;
    status: MedicalClinicReadinessStatus;
  }>;
  professionals: Array<{
    id: string;
    displayName: string;
    specialty: string;
    licenseStatus: 'pending_review' | 'ready';
    scheduleStatus: MedicalClinicReadinessStatus;
  }>;
  serviceCatalog: Array<{
    id: string;
    name: string;
    category: string;
    defaultDurationMinutes: number;
    billingMode: 'invoiceable_service' | 'bundle_review_required';
    status: MedicalClinicReadinessStatus;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicPatientIntakeWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  workspaceStatus: MedicalClinicReadinessStatus;
  intakeQueue: Array<{
    id: string;
    patientDisplayName: string;
    identificationStatus: MedicalClinicReadinessStatus;
    contactStatus: MedicalClinicReadinessStatus;
    consentStatus: MedicalClinicReadinessStatus;
    triageReason: string;
    nextAction: string;
  }>;
  intakeChecklist: Array<{
    key: string;
    label: string;
    status: MedicalClinicReadinessStatus;
  }>;
  summary: {
    patientCount: number;
    readyPatientCount: number;
    blockedPatientCount: number;
    pendingConsentCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicAppointmentSchedulingWorkspace {
  tenantSlug: string;
  generatedAt: Date;
  workspaceStatus: MedicalClinicReadinessStatus;
  dateWindow: {
    from: string;
    to: string;
  };
  availability: Array<{
    professionalId: string;
    professionalName: string;
    specialty: string;
    availableSlotCount: number;
    bookedSlotCount: number;
    blockerCount: number;
  }>;
  appointments: Array<{
    id: string;
    patientDisplayName: string;
    serviceName: string;
    professionalName: string;
    startsAt: string;
    status: MedicalClinicAppointmentStatus;
    reminderStatus: MedicalClinicReadinessStatus;
    billingStatus: MedicalClinicReadinessStatus;
  }>;
  summary: {
    appointmentCount: number;
    confirmedCount: number;
    needsReminderCount: number;
    billingReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicGrowthReminderBridge {
  tenantSlug: string;
  generatedAt: Date;
  bridgeStatus: MedicalClinicReadinessStatus;
  channel: 'whatsapp';
  reminders: Array<{
    appointmentId: string;
    patientDisplayName: string;
    templateKey: string;
    sendWindow: string;
    status: MedicalClinicReadinessStatus;
    nextAction: string;
  }>;
  handoff: {
    growthProductKey: 'growth';
    conversationPurpose: 'appointment_confirmation' | 'post_visit_follow_up';
    requiresHumanReview: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicBillingTaxBridge {
  tenantSlug: string;
  generatedAt: Date;
  bridgeStatus: MedicalClinicReadinessStatus;
  invoiceableItems: Array<{
    appointmentId: string;
    patientDisplayName: string;
    serviceName: string;
    amount: number;
    currency: 'USD';
    partyStatus: MedicalClinicReadinessStatus;
    invoiceDraftStatus: MedicalClinicReadinessStatus;
    taxEvidenceStatus: MedicalClinicReadinessStatus;
  }>;
  handoff: {
    invoicingProductKey: 'invoicing';
    taxComplianceProductKey: 'tax-compliance-ec';
    partyDirectoryRequired: boolean;
  };
  summary: {
    invoiceableItemCount: number;
    readyInvoiceDraftCount: number;
    partyReviewCount: number;
    taxEvidenceReviewCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicEncounterWorkspace {
  tenantSlug: string;
  appointmentId: string;
  generatedAt: Date;
  workspaceStatus: MedicalClinicReadinessStatus;
  appointment: {
    id: string;
    patientDisplayName: string;
    serviceName: string;
    professionalName: string;
    startsAt: string;
    status: MedicalClinicAppointmentStatus;
  };
  clinicalContext: {
    chiefConcern: string;
    visitMode: 'in_person' | 'teleconsultation_review_required';
    consentStatus: MedicalClinicReadinessStatus;
    intakeStatus: MedicalClinicReadinessStatus;
    billingStatus: MedicalClinicReadinessStatus;
  };
  encounterChecklist: Array<{
    key: string;
    label: string;
    status: MedicalClinicReadinessStatus;
  }>;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicClinicalNoteDraftPacket {
  tenantSlug: string;
  appointmentId: string;
  generatedAt: Date;
  packetStatus: MedicalClinicReadinessStatus;
  draftSections: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    pendingFields: string[];
  };
  review: {
    requiresProfessionalReview: boolean;
    mayBeSigned: false;
    reviewerRole: 'medical_professional';
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicTreatmentFollowUpReadiness {
  tenantSlug: string;
  appointmentId: string;
  generatedAt: Date;
  readinessStatus: MedicalClinicReadinessStatus;
  planItems: Array<{
    key: string;
    label: string;
    owner: 'patient' | 'clinic' | 'professional';
    status: MedicalClinicReadinessStatus;
    dueHint: string;
  }>;
  suggestedFollowUp: {
    recommendedWindow: string;
    schedulingStatus: MedicalClinicReadinessStatus;
    growthReminderStatus: MedicalClinicReadinessStatus;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicPrescriptionReadinessPacket {
  tenantSlug: string;
  appointmentId: string;
  generatedAt: Date;
  packetStatus: MedicalClinicReadinessStatus;
  draftItems: Array<{
    label: string;
    category: 'medication' | 'indication' | 'exam' | 'referral';
    status: MedicalClinicReadinessStatus;
    reviewNote: string;
  }>;
  approval: {
    requiresMedicalApproval: true;
    officialPrescriptionIssued: false;
    signatureStatus: 'not_supported_in_clinics';
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicEncounterCloseout {
  tenantSlug: string;
  appointmentId: string;
  generatedAt: Date;
  closeoutStatus: MedicalClinicReadinessStatus;
  checklist: Array<{
    key: string;
    label: string;
    status: MedicalClinicReadinessStatus;
    evidence: string;
  }>;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    blockedCheckCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export interface TenantMedicalClinicClinicalBoundaryCloseout {
  tenantSlug: string;
  generatedAt: Date;
  boundaryStatus: MedicalClinicReadinessStatus;
  acceptedCapabilities: string[];
  explicitlyExcludedCapabilities: string[];
  requiredHumanControls: string[];
  nextRecommendedSlice:
    | 'medical-history-records'
    | 'psychology-clinics-foundation';
  guardrails: string[];
}
