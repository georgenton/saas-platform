import {
  AiClinicAssistantTemplateContract,
  AiClinicSurfaceContract,
  AiClinicsCloseoutGrowthBridgeReviewView,
  AiClinicsDomainContractRegistryView,
  AiClinicsGuardrailApprovalPackView,
} from '@saas-platform/ai-domain';

const CLINICS_BLOCKED_CAPABILITIES = [
  'diagnose_patient',
  'prescribe_medication',
  'classify_clinical_risk',
  'interpret_assessment_scale',
  'sign_clinical_record',
  'send_emergency_message',
  'mutate_clinic_state',
];

const MEDICAL_SURFACES: AiClinicSurfaceContract[] = [
  {
    key: 'medical_clinics.profile_workspace',
    title: 'Medical clinic profile workspace',
    productKey: 'medical-clinics',
    status: 'ready',
    sourceContractKey: 'medical_clinics.profile.workspace',
    summary: 'Clinic profile, service catalog, operating posture, and readiness.',
    aiUse: 'Ground assistant suggestions in clinic services and operating constraints.',
    growthBridge:
      'Use service and opt-in context when explaining appointment reminders and follow-up handoffs.',
    blockedCapabilities: CLINICS_BLOCKED_CAPABILITIES,
  },
  {
    key: 'medical_clinics.appointment_scheduling_workspace',
    title: 'Appointment scheduling workspace',
    productKey: 'medical-clinics',
    status: 'ready',
    sourceContractKey: 'medical_clinics.appointment_scheduling.workspace',
    summary: 'Appointment status, reminder readiness, billing posture, and blockers.',
    aiUse: 'Prepare operational appointment briefs without booking or messaging automatically.',
    growthBridge:
      'Connects to Growth reminder handoff for appointment confirmations and follow-ups.',
    blockedCapabilities: CLINICS_BLOCKED_CAPABILITIES,
  },
  {
    key: 'medical_clinics.encounter_note_draft_packet',
    title: 'Encounter note draft packet',
    productKey: 'medical-clinics',
    status: 'ready',
    sourceContractKey: 'medical_clinics.encounter_note.draft_packet',
    summary: 'Draft packet for human review of encounter notes and care-plan context.',
    aiUse: 'Suggest structure and review questions while leaving clinical authorship to humans.',
    growthBridge:
      'Only references follow-up readiness after human clinical review creates an allowed handoff.',
    blockedCapabilities: CLINICS_BLOCKED_CAPABILITIES,
  },
  {
    key: 'medical_clinics.billing_tax_bridge',
    title: 'Billing and tax bridge',
    productKey: 'medical-clinics',
    status: 'ready',
    sourceContractKey: 'medical_clinics.billing_tax.bridge',
    summary: 'Invoiceable service evidence and tax handoff posture.',
    aiUse: 'Explain administrative billing/tax next steps without issuing invoices or tax filings.',
    growthBridge:
      'Keeps commercial follow-up separate from fiscal and clinical validation.',
    blockedCapabilities: CLINICS_BLOCKED_CAPABILITIES,
  },
];

const PSYCHOLOGY_SURFACES: AiClinicSurfaceContract[] = [
  {
    key: 'psychology_clinics.profile_workspace',
    title: 'Psychology clinic profile workspace',
    productKey: 'psychology-clinics',
    status: 'ready',
    sourceContractKey: 'psychology_clinics.profile.workspace',
    summary: 'Therapy services, consent posture, privacy review, and operating mode.',
    aiUse: 'Ground suggestions in privacy, consent, and therapist-owned workflows.',
    growthBridge:
      'Uses consent and opt-in posture before any reminder or follow-up handoff is suggested.',
    blockedCapabilities: CLINICS_BLOCKED_CAPABILITIES,
  },
  {
    key: 'psychology_clinics.session_note_review_loop',
    title: 'Session note review loop',
    productKey: 'psychology-clinics',
    status: 'ready',
    sourceContractKey: 'psychology_clinics.session_note.review_loop',
    summary: 'Therapist review loop for session notes, blockers, evidence, and hardening.',
    aiUse: 'Prepare review checklists and owner explanations without signing clinical records.',
    growthBridge:
      'Growth receives only allowed reminder/follow-up context after therapist review.',
    blockedCapabilities: CLINICS_BLOCKED_CAPABILITIES,
  },
  {
    key: 'psychology_clinics.privacy_consent_control_center',
    title: 'Privacy and consent control center',
    productKey: 'psychology-clinics',
    status: 'ready',
    sourceContractKey: 'psychology_clinics.privacy_consent.control_center',
    summary: 'Consent, messaging opt-in, privacy controls, and blocked handoff signals.',
    aiUse: 'Make privacy and consent constraints explicit before drafting any suggestion.',
    growthBridge:
      'Blocks reminder suggestions when consent or messaging opt-in is not ready.',
    blockedCapabilities: CLINICS_BLOCKED_CAPABILITIES,
  },
  {
    key: 'psychology_clinics.outcomes_review_workspace',
    title: 'Outcomes review workspace',
    productKey: 'psychology-clinics',
    status: 'ready',
    sourceContractKey: 'psychology_clinics.outcomes_review.workspace',
    summary: 'Outcome evidence and assessment scale registry for therapist review.',
    aiUse: 'Summarize evidence posture without interpreting scales or clinical progress.',
    growthBridge:
      'Keeps outcomes evidence out of commercial messaging and limits Growth to administrative reminders.',
    blockedCapabilities: CLINICS_BLOCKED_CAPABILITIES,
  },
];

export const AI_CLINICS_ASSISTANT_TEMPLATES: AiClinicAssistantTemplateContract[] = [
  {
    agentKey: 'medical-clinic-assistant',
    productKey: 'medical-clinics',
    domainKey: 'medical',
    title: 'Medical Clinic Assistant',
    status: 'ready',
    primarySurfaceKey: 'medical_clinics_assistant_contract',
    surfaces: MEDICAL_SURFACES,
  },
  {
    agentKey: 'psychology-clinic-assistant',
    productKey: 'psychology-clinics',
    domainKey: 'psychology',
    title: 'Psychology Clinic Assistant',
    status: 'ready',
    primarySurfaceKey: 'psychology_clinics_assistant_contract',
    surfaces: PSYCHOLOGY_SURFACES,
  },
];

export function buildAiClinicsDomainContractRegistryView(
  generatedAt: Date,
): AiClinicsDomainContractRegistryView {
  const templates = AI_CLINICS_ASSISTANT_TEMPLATES.map((template) => ({
    ...template,
    surfaces: template.surfaces.map((surface) => ({
      ...surface,
      blockedCapabilities: [...surface.blockedCapabilities],
    })),
  }));

  return {
    generatedAt,
    registryVersion: 'v1',
    status: 'ready',
    templates,
    summary: {
      templateCount: templates.length,
      readyTemplateCount: templates.filter((entry) => entry.status === 'ready')
        .length,
      surfaceCount: templates.reduce(
        (count, entry) => count + entry.surfaces.length,
        0,
      ),
      growthConnectedTemplateCount: templates.length,
    },
    notes: [
      'AI stays transversal: clinical products own facts, Growth owns reminders, and AI prepares reviewable suggestions.',
      'Clinical automation remains out of scope until a separate professional validation and regulatory design exists.',
    ],
  };
}

export function buildAiClinicsGuardrailApprovalPackView(
  generatedAt: Date,
): AiClinicsGuardrailApprovalPackView {
  return {
    generatedAt,
    packVersion: 'v1',
    status: 'ready',
    guardrails: [
      {
        key: 'no_diagnosis',
        title: 'No automatic diagnosis',
        enforcement:
          'The assistant can summarize deterministic context, but diagnosis belongs to licensed clinical professionals.',
        blockedCapabilities: ['diagnose_patient'],
      },
      {
        key: 'no_prescription',
        title: 'No prescription or treatment order',
        enforcement:
          'Medication, orders, referrals, and treatment decisions remain human-owned clinical actions.',
        blockedCapabilities: ['prescribe_medication', 'create_treatment_order'],
      },
      {
        key: 'no_clinical_risk_automation',
        title: 'No automatic clinical risk classification',
        enforcement:
          'Risk and safety material can be surfaced for review, not interpreted or triaged automatically.',
        blockedCapabilities: [
          'classify_clinical_risk',
          'send_emergency_message',
        ],
      },
      {
        key: 'no_record_signature',
        title: 'No signed clinical record',
        enforcement:
          'Notes, evidence, and records stay draft or review packets until a human professional signs externally.',
        blockedCapabilities: ['sign_clinical_record', 'own_legal_ehr'],
      },
      {
        key: 'no_state_mutation',
        title: 'No clinic workflow mutation',
        enforcement:
          'The assistant cannot create appointments, sessions, records, messages, or billing artifacts.',
        blockedCapabilities: ['mutate_clinic_state'],
      },
    ],
    approvalPolicy: {
      required: true,
      scope: 'suggestion_review',
      reviewerRole: 'Clinic operator or licensed professional',
      rationale:
        'Clinical suggestions are useful only as reviewable helper text; any operational or clinical use needs human approval.',
    },
    notes: [
      'The approval pack applies to both medical and psychology assistants.',
      'Growth handoffs are administrative only and must respect consent and opt-in posture.',
    ],
  };
}

export function buildAiClinicsCloseoutGrowthBridgeReviewView(
  generatedAt: Date,
): AiClinicsCloseoutGrowthBridgeReviewView {
  return {
    generatedAt,
    reviewVersion: 'v1',
    status: 'ready',
    products: AI_CLINICS_ASSISTANT_TEMPLATES.map((template) => ({
      productKey: template.productKey,
      aiTemplateStatus: template.status,
      growthBridgeStatus: 'connected',
      evidence: [
        `${template.title} is registered as a ready AI agent.`,
        `${template.productKey} exposes deterministic clinical/admin surfaces for reviewable suggestions.`,
        'Growth handoff remains administrative and consent-aware.',
      ],
      remainingWork: [
        'Wire richer UI panels for clinics-specific assistant briefs.',
        'Evaluate guarded execution only for non-clinical administrative tasks after separate approval design.',
      ],
    })),
    decision: {
      recommendedNextSlice: 'clinic-assistant-ui-briefing-panels',
      keepAiTransversal: true,
      growthConnected: true,
      openClinicalAutomation: false,
    },
    notes: [
      'Medical Clinics and Psychology Clinics are ready for AI suggestion envelopes.',
      'Clinical automation remains deferred; this closeout only confirms transversal AI and Growth connectivity.',
    ],
  };
}

export function findAiClinicsAssistantTemplateByAgentKey(
  agentKey: string,
): AiClinicAssistantTemplateContract | null {
  const template =
    AI_CLINICS_ASSISTANT_TEMPLATES.find((entry) => entry.agentKey === agentKey) ??
    null;

  return template
    ? {
        ...template,
        surfaces: template.surfaces.map((surface) => ({
          ...surface,
          blockedCapabilities: [...surface.blockedCapabilities],
        })),
      }
    : null;
}
