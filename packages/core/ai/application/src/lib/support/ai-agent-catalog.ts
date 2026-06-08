import {
  AiApprovalPolicyEntry,
  AiAgentToolAccessEntry,
  AiAgentCatalogEntry,
  AiOperatingModelAgentHandoffContract,
  AiGuardedExecutionCandidateDescriptor,
  AiOperatingModelAgentEntry,
  AiOperatingModelAgentApprovalPolicyReference,
  AiOperatingModelAgentPrimarySurfaceReference,
  AiOperatingModelManifest,
  AiPromptRegistryEntry,
  AiToolDefinition,
} from '@saas-platform/ai-domain';

export const AI_OPERATING_MODEL_VERSION = 'v1';

export const AI_AGENT_CATALOG: AiAgentCatalogEntry[] = [
  {
    key: 'growth-assist-coach',
    title: 'Growth Assist Coach',
    summary:
      'Turns deterministic Growth Assist signals into tenant-scoped commercial suggestions without executing actions automatically.',
    domainKey: 'growth',
    productKey: 'growth',
    availability: 'ready',
    defaultMode: 'suggestion',
    supportedSurfaceKeys: ['growth_assist_daily_agenda'],
  },
  {
    key: 'invoice-document-assistant',
    title: 'Invoice Document Assistant',
    summary:
      'Turns deterministic invoicing drafting and readiness signals into tenant-scoped document guidance without executing fiscal actions automatically.',
    domainKey: 'invoicing',
    productKey: 'invoicing',
    availability: 'ready',
    defaultMode: 'suggestion',
    supportedSurfaceKeys: ['invoice_document_drafting'],
  },
  {
    key: 'ecommerce-launch-assistant',
    title: 'Ecommerce Launch Assistant',
    summary:
      'Turns deterministic ecommerce launch signals into tenant-scoped launch suggestions without publishing storefront work automatically.',
    domainKey: 'ecommerce',
    productKey: 'ecommerce',
    availability: 'ready',
    defaultMode: 'suggestion',
    supportedSurfaceKeys: ['ecommerce_launch_workspace'],
  },
  {
    key: 'tax-compliance-ec-review-assistant',
    title: 'Tax Compliance EC Review Assistant',
    summary:
      'Turns deterministic Ecuador tax compliance packets into review guidance without replacing accountant validation or SRI filing.',
    domainKey: 'tax-compliance',
    productKey: 'tax-compliance-ec',
    availability: 'ready',
    defaultMode: 'suggestion',
    supportedSurfaceKeys: ['tax_compliance_ec_review_packet'],
  },
  {
    key: 'medical-clinic-assistant',
    title: 'Medical Clinic Assistant',
    summary:
      'Turns deterministic medical clinic surfaces into reviewable clinic guidance without diagnosing, prescribing, signing records, or mutating clinic workflows.',
    domainKey: 'medical',
    productKey: 'medical-clinics',
    availability: 'ready',
    defaultMode: 'suggestion',
    supportedSurfaceKeys: ['medical_clinics_assistant_contract'],
  },
  {
    key: 'psychology-clinic-assistant',
    title: 'Psychology Clinic Assistant',
    summary:
      'Turns deterministic psychology clinic surfaces into reviewable therapy operations guidance without replacing therapist judgment or clinical records.',
    domainKey: 'psychology',
    productKey: 'psychology-clinics',
    availability: 'ready',
    defaultMode: 'suggestion',
    supportedSurfaceKeys: ['psychology_clinics_assistant_contract'],
  },
];

const AI_AGENT_OPERATING_MODEL_METADATA: Record<
  string,
  {
    requiredPermissionKey: string;
    handoffContract: AiOperatingModelAgentHandoffContract;
    primarySurface: AiOperatingModelAgentPrimarySurfaceReference;
  }
> = {
  'growth-assist-coach': {
    requiredPermissionKey: 'growth.conversations.read',
    handoffContract: {
      requestApprovalRationale:
        'Solicitar revision humana antes de tratar el handoff como aprobado.',
      reviewNotes: {
        approved: 'Aprobado desde la consola transversal de AI.',
        rejected: 'Rechazado desde la consola transversal de AI.',
      },
    },
    primarySurface: {
      key: 'growth_assist_daily_agenda',
      title: 'Growth Assist daily agenda',
      sourceContractKey: 'growth.assist.daily_agenda',
    },
  },
  'invoice-document-assistant': {
    requiredPermissionKey: 'invoicing.reports.read',
    handoffContract: {
      requestApprovalRationale:
        'Solicitar revision humana antes de usar la sugerencia sobre documentos tributarios.',
      reviewNotes: {
        approved:
          'Aprobado desde la consola transversal de AI para Invoice Document Assistant.',
        rejected:
          'Rechazado desde la consola transversal de AI para Invoice Document Assistant.',
      },
    },
    primarySurface: {
      key: 'invoice_document_drafting',
      title: 'Invoice document drafting',
      sourceContractKey: 'invoicing.assist.document_drafting',
    },
  },
  'ecommerce-launch-assistant': {
    requiredPermissionKey: 'tenant.entitlements.read',
    handoffContract: {
      requestApprovalRationale:
        'Solicitar revision humana antes de usar la sugerencia de Ecommerce Launch Assistant.',
      reviewNotes: {
        approved:
          'Aprobado desde la consola transversal de AI para Ecommerce Launch Assistant.',
        rejected:
          'Rechazado desde la consola transversal de AI para Ecommerce Launch Assistant.',
      },
    },
    primarySurface: {
      key: 'ecommerce_launch_workspace',
      title: 'Ecommerce launch workspace',
      sourceContractKey: 'ecommerce.launch.workspace',
    },
  },
  'tax-compliance-ec-review-assistant': {
    requiredPermissionKey: 'tax-compliance.ec.read',
    handoffContract: {
      requestApprovalRationale:
        'Solicitar revision humana antes de usar la sugerencia del asistente tributario.',
      reviewNotes: {
        approved:
          'Aprobado desde la consola transversal de AI para Tax Compliance EC Review Assistant.',
        rejected:
          'Rechazado desde la consola transversal de AI para Tax Compliance EC Review Assistant.',
      },
    },
    primarySurface: {
      key: 'tax_compliance_ec_review_packet',
      title: 'Tax Compliance EC review packet',
      sourceContractKey: 'tax_compliance.ec.review_assistant_packet',
    },
  },
  'medical-clinic-assistant': {
    requiredPermissionKey: 'medical-clinics.read',
    handoffContract: {
      requestApprovalRationale:
        'Solicitar revision humana antes de usar una sugerencia del asistente medico.',
      reviewNotes: {
        approved:
          'Aprobado desde la consola transversal de AI para Medical Clinic Assistant.',
        rejected:
          'Rechazado desde la consola transversal de AI para Medical Clinic Assistant.',
      },
    },
    primarySurface: {
      key: 'medical_clinics_assistant_contract',
      title: 'Medical clinics assistant contract',
      sourceContractKey: 'medical_clinics.ai.assistant_contract',
    },
  },
  'psychology-clinic-assistant': {
    requiredPermissionKey: 'psychology-clinics.read',
    handoffContract: {
      requestApprovalRationale:
        'Solicitar revision humana antes de usar una sugerencia del asistente de psicologia.',
      reviewNotes: {
        approved:
          'Aprobado desde la consola transversal de AI para Psychology Clinic Assistant.',
        rejected:
          'Rechazado desde la consola transversal de AI para Psychology Clinic Assistant.',
      },
    },
    primarySurface: {
      key: 'psychology_clinics_assistant_contract',
      title: 'Psychology clinics assistant contract',
      sourceContractKey: 'psychology_clinics.ai.assistant_contract',
    },
  },
};

const AI_GUARDED_EXECUTION_CANDIDATE_DESCRIPTORS: Record<
  string,
  AiGuardedExecutionCandidateDescriptor
> = {
  growth_case_assignment_execution: {
    toolKey: 'growth_case_assignment_execution',
    title: 'Growth case assignment lane',
    targetKind: 'growth_operational_case',
    operatingLane: 'operational_case_assignment_lane',
    blastRadius: 'single_queue_lane',
    safeFallbackMode: 'suggestion_only_with_manual_assignment',
    preferredPilotTypeWhenReady: 'human_gate_then_execute',
    targetSelectionLabel: 'Operational case',
    emptyTargetSelectionLabel: 'No eligible operational cases',
    executeActionLabel: 'Execute take-case',
    rollbackActionLabel: 'Rollback take-case',
  },
  invoice_payment_collection_execution: {
    toolKey: 'invoice_payment_collection_execution',
    title: 'Invoice payment collection lane',
    targetKind: 'invoice',
    operatingLane: 'single_record_execution_lane',
    blastRadius: 'single_record',
    safeFallbackMode: 'suggestion_only',
    preferredPilotTypeWhenReady: 'human_gate_then_execute',
    targetSelectionLabel: 'Invoice',
    emptyTargetSelectionLabel: 'No eligible invoices',
    executeActionLabel: 'Execute post-payment',
    rollbackActionLabel: 'Rollback payment',
  },
  ecommerce_launch_publish_execution: {
    toolKey: 'ecommerce_launch_publish_execution',
    title: 'Ecommerce launch publish lane',
    targetKind: 'ecommerce_launch_plan',
    operatingLane: 'single_record_execution_lane',
    blastRadius: 'single_record',
    safeFallbackMode: 'suggestion_only',
    preferredPilotTypeWhenReady: 'shadow_review',
    targetSelectionLabel: 'Launch plan',
    emptyTargetSelectionLabel: 'No eligible launch plan',
    executeActionLabel: 'Execute launch publish',
    rollbackActionLabel: 'Rollback launch publish',
  },
};

function cloneAiAgentCatalogEntry(entry: AiAgentCatalogEntry): AiAgentCatalogEntry {
  return {
    ...entry,
    supportedSurfaceKeys: [...entry.supportedSurfaceKeys],
  };
}

function cloneAiAgentHandoffContract(
  contract: AiOperatingModelAgentHandoffContract,
): AiOperatingModelAgentHandoffContract {
  return {
    requestApprovalRationale: contract.requestApprovalRationale,
    reviewNotes: {
      approved: contract.reviewNotes.approved,
      rejected: contract.reviewNotes.rejected,
    },
  };
}

function cloneAiAgentPrimarySurfaceDescriptor(
  descriptor: AiOperatingModelAgentPrimarySurfaceReference,
): AiOperatingModelAgentPrimarySurfaceReference {
  return {
    key: descriptor.key,
    title: descriptor.title,
    sourceContractKey: descriptor.sourceContractKey,
  };
}

function cloneAiGuardedExecutionCandidateDescriptor(
  descriptor: AiGuardedExecutionCandidateDescriptor,
): AiGuardedExecutionCandidateDescriptor {
  return {
    toolKey: descriptor.toolKey,
    title: descriptor.title,
    targetKind: descriptor.targetKind,
    operatingLane: descriptor.operatingLane,
    blastRadius: descriptor.blastRadius,
    safeFallbackMode: descriptor.safeFallbackMode,
    preferredPilotTypeWhenReady: descriptor.preferredPilotTypeWhenReady,
    targetSelectionLabel: descriptor.targetSelectionLabel,
    emptyTargetSelectionLabel: descriptor.emptyTargetSelectionLabel,
    executeActionLabel: descriptor.executeActionLabel,
    rollbackActionLabel: descriptor.rollbackActionLabel,
  };
}

export function findAiAgentByKey(
  agentKey: string,
): AiAgentCatalogEntry | null {
  const entry = AI_AGENT_CATALOG.find((candidate) => candidate.key === agentKey);

  return entry ? cloneAiAgentCatalogEntry(entry) : null;
}

function getAiAgentHandoffContract(
  agentKey: string,
): AiOperatingModelAgentHandoffContract | null {
  const contract = AI_AGENT_OPERATING_MODEL_METADATA[agentKey]?.handoffContract;

  if (!contract) {
    return null;
  }

  return cloneAiAgentHandoffContract(contract);
}

export const AI_TOOL_REGISTRY: AiToolDefinition[] = [
  {
    key: 'growth_assist_reply_drafting',
    title: 'Growth Assist reply drafting',
    summary:
      'Drafts customer-facing reply suggestions grounded in the deterministic Growth Assist agenda.',
    domainKey: 'growth',
    availability: 'ready',
    riskLevel: 'low',
    actionKind: 'draft',
    requiresApproval: false,
    inputContract: {
      sourceSurfaceKeys: ['growth_assist_daily_agenda'],
      primaryPayload:
        'Tenant-scoped Growth Assist agenda with hottest conversation cues and deterministic reply suggestions.',
      requiredContext: [
        'conversation heat',
        'reply recommendation',
        'playbook hints',
      ],
    },
    outputContract: {
      primaryArtifact: 'Customer-facing reply draft.',
      suggestedOutputKeys: ['reply_draft'],
      humanReviewFocus: [
        'Confirm tone still fits the customer context.',
        'Verify no promise, discount, or operational commitment was invented.',
      ],
    },
    executionBoundary: {
      executionMode: 'suggestion_only',
      stateMutation: 'none',
      externalSideEffects: 'none',
      reviewRequirement:
        'An operator should review the draft before sending it through any real channel.',
      blockedCapabilities: [
        'send_whatsapp_message',
        'mutate_conversation_state',
      ],
    },
  },
  {
    key: 'growth_assist_follow_up_planning',
    title: 'Growth Assist follow-up planning',
    summary:
      'Proposes follow-up plans and next-action briefs without mutating Growth workflow state.',
    domainKey: 'growth',
    availability: 'ready',
    riskLevel: 'low',
    actionKind: 'propose',
    requiresApproval: false,
    inputContract: {
      sourceSurfaceKeys: ['growth_assist_daily_agenda'],
      primaryPayload:
        'Tenant-scoped Growth Assist agenda with waiting-customer timing, playbooks, and hottest commercial opportunities.',
      requiredContext: [
        'follow-up timing',
        'playbook guidance',
        'next-action recommendation',
      ],
    },
    outputContract: {
      primaryArtifact: 'Follow-up plan and next-action brief.',
      suggestedOutputKeys: ['follow_up_plan', 'next_action_brief'],
      humanReviewFocus: [
        'Confirm the sequence matches the operator capacity and business context.',
        'Check that escalation or discount ideas stay within policy.',
      ],
    },
    executionBoundary: {
      executionMode: 'suggestion_only',
      stateMutation: 'none',
      externalSideEffects: 'none',
      reviewRequirement:
        'The operator should translate the plan into real CRM or messaging actions manually.',
      blockedCapabilities: [
        'schedule_message_send',
        'update_case_follow_up_state',
      ],
    },
  },
  {
    key: 'growth_case_assignment_execution',
    title: 'Growth case assignment execution',
    summary:
      'Would execute operational-case assignment or routing changes once guarded execution exists.',
    domainKey: 'growth',
    availability: 'planned',
    riskLevel: 'high',
    actionKind: 'execute',
    requiresApproval: true,
    inputContract: {
      sourceSurfaceKeys: ['growth_assist_daily_agenda'],
      primaryPayload:
        'Tenant-scoped operational routing signals and deterministic assignment recommendations.',
      requiredContext: [
        'assignment recommendation',
        'queue pressure',
        'assignee availability',
      ],
    },
    outputContract: {
      primaryArtifact: 'Assignment or routing change intent.',
      suggestedOutputKeys: ['assignment_change_intent'],
      humanReviewFocus: [
        'Validate the assignee or queue target still makes operational sense.',
        'Confirm any routing mutation is explicitly approved before execution.',
      ],
    },
    executionBoundary: {
      executionMode: 'guarded_execution_planned',
      stateMutation: 'planned',
      externalSideEffects: 'planned',
      reviewRequirement:
        'This tool stays blocked until approval memory and guarded execution flows are operational.',
      blockedCapabilities: [
        'assign_operational_case',
        'reroute_queue_membership',
      ],
    },
  },
  {
    key: 'invoice_document_drafting',
    title: 'Invoice document drafting',
    summary:
      'Prepares deterministic drafting, checklist, and review suggestions for invoicing document workflows.',
    domainKey: 'invoicing',
    availability: 'ready',
    riskLevel: 'medium',
    actionKind: 'draft',
    requiresApproval: false,
    inputContract: {
      sourceSurfaceKeys: ['invoice_document_drafting'],
      primaryPayload:
        'Tenant-scoped invoicing drafting surface with deterministic readiness, checklist, and blocker signals.',
      requiredContext: [
        'readiness summary',
        'drafting checklist',
        'fiscal blocker explanation',
      ],
    },
    outputContract: {
      primaryArtifact: 'Document drafting brief and review checklist.',
      suggestedOutputKeys: [
        'drafting_brief',
        'review_checklist',
        'blocker_explanation',
      ],
      humanReviewFocus: [
        'Verify the suggestion does not replace fiscal validation.',
        'Confirm tax-document facts still match the deterministic invoicing surface.',
      ],
    },
    executionBoundary: {
      executionMode: 'suggestion_only',
      stateMutation: 'none',
      externalSideEffects: 'none',
      reviewRequirement:
        'Document guidance must stay advisory and be reviewed before any operator uses it in fiscal work.',
      blockedCapabilities: [
        'sign_tax_document',
        'submit_tax_document',
        'mark_document_authorized',
      ],
    },
  },
  {
    key: 'invoice_payment_collection_execution',
    title: 'Invoice payment collection execution',
    summary:
      'Would execute a narrow invoice payment posting step once guarded execution exists for invoicing.',
    domainKey: 'invoicing',
    availability: 'planned',
    riskLevel: 'high',
    actionKind: 'execute',
    requiresApproval: true,
    inputContract: {
      sourceSurfaceKeys: ['invoice_document_drafting'],
      primaryPayload:
        'Tenant-scoped invoice detail and settlement state with deterministic outstanding balance signals.',
      requiredContext: [
        'invoice status',
        'outstanding balance',
        'payment settlement state',
      ],
    },
    outputContract: {
      primaryArtifact: 'Invoice payment posting intent.',
      suggestedOutputKeys: ['payment_posting_intent'],
      humanReviewFocus: [
        'Validate that the invoice is the intended receivable before posting any payment.',
        'Confirm the payment amount and settlement effect are explicitly approved before execution.',
      ],
    },
    executionBoundary: {
      executionMode: 'guarded_execution_planned',
      stateMutation: 'planned',
      externalSideEffects: 'planned',
      reviewRequirement:
        'This tool stays blocked until approval memory and guarded execution flows are operational for invoicing.',
      blockedCapabilities: ['post_invoice_payment', 'reverse_invoice_payment'],
    },
  },
  {
    key: 'ecommerce_launch_briefing',
    title: 'Ecommerce launch briefing',
    summary:
      'Prepares deterministic launch, landing, catalog, and campaign suggestions for ecommerce rollout planning.',
    domainKey: 'ecommerce',
    availability: 'ready',
    riskLevel: 'medium',
    actionKind: 'propose',
    requiresApproval: false,
    inputContract: {
      sourceSurfaceKeys: ['ecommerce_launch_workspace'],
      primaryPayload:
        'Tenant-scoped ecommerce launch workspace with deterministic catalog, landing, and campaign posture signals.',
      requiredContext: [
        'catalog facts',
        'landing structure',
        'campaign scope',
      ],
    },
    outputContract: {
      primaryArtifact: 'Launch brief and structured launch proposal.',
      suggestedOutputKeys: ['launch_brief'],
      humanReviewFocus: [
        'Check that launch claims stay grounded in real catalog data.',
        'Review that campaign structure fits the operator plan before publication.',
      ],
    },
    executionBoundary: {
      executionMode: 'suggestion_only',
      stateMutation: 'none',
      externalSideEffects: 'none',
      reviewRequirement:
        'Suggestions should be reviewed by an operator before they influence storefront or campaign work.',
      blockedCapabilities: [
        'publish_storefront_content',
        'launch_campaign',
        'change_catalog_pricing',
      ],
    },
  },
  {
    key: 'ecommerce_launch_publish_execution',
    title: 'Ecommerce launch publish execution',
    summary:
      'Would publish a narrow ecommerce launch plan once guarded execution exists for storefront rollout.',
    domainKey: 'ecommerce',
    availability: 'planned',
    riskLevel: 'high',
    actionKind: 'execute',
    requiresApproval: true,
    inputContract: {
      sourceSurfaceKeys: ['ecommerce_launch_workspace'],
      primaryPayload:
        'Tenant-scoped ecommerce launch workspace with deterministic launch scope, catalog readiness, and campaign posture signals.',
      requiredContext: [
        'launch readiness',
        'catalog scope',
        'campaign posture',
      ],
    },
    outputContract: {
      primaryArtifact: 'Launch publish intent.',
      suggestedOutputKeys: ['launch_publish_intent'],
      humanReviewFocus: [
        'Check that the publish scope stays inside the named launch plan.',
        'Confirm no storefront, campaign, or catalog mutation is opened without explicit human gate approval.',
      ],
    },
    executionBoundary: {
      executionMode: 'guarded_execution_planned',
      stateMutation: 'planned',
      externalSideEffects: 'planned',
      reviewRequirement:
        'This tool stays blocked until approval memory and guarded execution flows are operational for ecommerce launch.',
      blockedCapabilities: [
        'publish_storefront_content',
        'launch_campaign',
        'activate_checkout',
      ],
    },
  },
  {
    key: 'tax_compliance_ec_review_briefing',
    title: 'Tax Compliance EC review briefing',
    summary:
      'Prepares advisory risk summaries, accountant questions, and evidence checklists from deterministic Ecuador tax compliance packets.',
    domainKey: 'tax-compliance',
    availability: 'ready',
    riskLevel: 'medium',
    actionKind: 'propose',
    requiresApproval: true,
    inputContract: {
      sourceSurfaceKeys: ['tax_compliance_ec_review_packet'],
      primaryPayload:
        'Tenant-scoped Ecuador tax review assistant packet with deterministic readiness, evidence, closeout, and accounting-bridge signals.',
      requiredContext: [
        'readiness status',
        'risk signals',
        'accountant questions',
        'evidence checklist',
        'accounting bridge mapping',
      ],
    },
    outputContract: {
      primaryArtifact:
        'Tax review brief with risk summary, accountant questions, evidence gaps, and next steps.',
      suggestedOutputKeys: [
        'tax_risk_summary',
        'accountant_question_pack',
        'evidence_gap_checklist',
        'owner_explanation',
        'pre_filing_next_steps',
      ],
      humanReviewFocus: [
        'Confirm the suggestion is grounded only in deterministic tax packets.',
        'Verify it does not present declarations, calculate official forms, or replace accountant validation.',
      ],
    },
    executionBoundary: {
      executionMode: 'suggestion_only',
      stateMutation: 'none',
      externalSideEffects: 'none',
      reviewRequirement:
        'A tax operator or accountant must review the brief before using it for filing, payment, or external advice.',
      blockedCapabilities: [
        'file_sri_declaration',
        'generate_official_annex_xml',
        'approve_tax_filing',
        'post_accounting_journal',
      ],
    },
  },
  {
    key: 'medical_clinic_assistant_review_briefing',
    title: 'Medical clinic assistant review briefing',
    summary:
      'Prepares reviewable medical clinic guidance from deterministic clinic surfaces without clinical diagnosis, prescription, record signature, or state mutation.',
    domainKey: 'medical',
    availability: 'ready',
    riskLevel: 'high',
    actionKind: 'propose',
    requiresApproval: true,
    inputContract: {
      sourceSurfaceKeys: ['medical_clinics_assistant_contract'],
      primaryPayload:
        'Tenant-scoped medical clinic assistant contract with profile, appointment, encounter, billing/tax, and Growth bridge context.',
      requiredContext: [
        'clinic profile',
        'appointment scheduling posture',
        'encounter note draft boundaries',
        'billing tax bridge',
        'Growth reminder consent',
      ],
    },
    outputContract: {
      primaryArtifact:
        'Medical clinic review brief with operational checklist, safety boundaries, and Growth handoff notes.',
      suggestedOutputKeys: [
        'clinic_review_brief',
        'operator_checklist',
        'growth_handoff_notes',
        'clinical_boundary_checklist',
      ],
      humanReviewFocus: [
        'Confirm the suggestion does not diagnose, prescribe, or sign clinical records.',
        'Verify Growth handoffs are administrative and consent-aware.',
      ],
    },
    executionBoundary: {
      executionMode: 'suggestion_only',
      stateMutation: 'none',
      externalSideEffects: 'none',
      reviewRequirement:
        'A clinic operator or licensed professional must review the brief before any operational or clinical use.',
      blockedCapabilities: [
        'diagnose_patient',
        'prescribe_medication',
        'classify_clinical_risk',
        'sign_clinical_record',
        'send_emergency_message',
        'mutate_clinic_state',
      ],
    },
  },
  {
    key: 'psychology_clinic_assistant_review_briefing',
    title: 'Psychology clinic assistant review briefing',
    summary:
      'Prepares reviewable psychology clinic guidance from deterministic therapy surfaces without therapist replacement, risk automation, or record signature.',
    domainKey: 'psychology',
    availability: 'ready',
    riskLevel: 'high',
    actionKind: 'propose',
    requiresApproval: true,
    inputContract: {
      sourceSurfaceKeys: ['psychology_clinics_assistant_contract'],
      primaryPayload:
        'Tenant-scoped psychology clinic assistant contract with profile, consent, session note, outcomes, privacy, and Growth bridge context.',
      requiredContext: [
        'therapy consent posture',
        'session note review loop',
        'privacy controls',
        'outcomes evidence posture',
        'Growth reminder consent',
      ],
    },
    outputContract: {
      primaryArtifact:
        'Psychology clinic review brief with therapist review checklist, consent boundaries, and Growth handoff notes.',
      suggestedOutputKeys: [
        'therapy_operations_brief',
        'therapist_review_checklist',
        'privacy_consent_checklist',
        'growth_handoff_notes',
      ],
      humanReviewFocus: [
        'Confirm the suggestion does not replace therapist judgment or interpret clinical scales.',
        'Verify consent and messaging opt-in before any administrative Growth handoff.',
      ],
    },
    executionBoundary: {
      executionMode: 'suggestion_only',
      stateMutation: 'none',
      externalSideEffects: 'none',
      reviewRequirement:
        'A clinic operator or licensed therapist must review the brief before any operational or clinical use.',
      blockedCapabilities: [
        'diagnose_patient',
        'classify_clinical_risk',
        'interpret_assessment_scale',
        'sign_clinical_record',
        'send_emergency_message',
        'mutate_clinic_state',
      ],
    },
  },
];

function cloneAiToolDefinition(entry: AiToolDefinition): AiToolDefinition {
  return {
    ...entry,
    inputContract: {
      ...entry.inputContract,
      sourceSurfaceKeys: [...entry.inputContract.sourceSurfaceKeys],
      requiredContext: [...entry.inputContract.requiredContext],
    },
    outputContract: {
      ...entry.outputContract,
      suggestedOutputKeys: [...entry.outputContract.suggestedOutputKeys],
      humanReviewFocus: [...entry.outputContract.humanReviewFocus],
    },
    executionBoundary: {
      ...entry.executionBoundary,
      blockedCapabilities: [...entry.executionBoundary.blockedCapabilities],
    },
  };
}

export const AI_PROMPT_REGISTRY: AiPromptRegistryEntry[] = [
  {
    key: 'growth-assist-coach-core',
    version: 'v1',
    agentKey: 'growth-assist-coach',
    mode: 'suggestion',
    title: 'Growth Assist Coach Core',
    summary:
      'Prompt pack for turning deterministic Growth Assist agenda signals into commercial suggestions for non-expert operators.',
    objective:
      'Propose clear commercial suggestions for a non-expert operator using the deterministic Growth Assist agenda as the source of truth.',
    styleGuidance: [
      'Prefer short, direct, Spanish-first suggestions.',
      'Explain business impact in simple operator language instead of internal queue jargon.',
      'Keep outputs practical and oriented to what the business should do today.',
    ],
    constraints: [
      'Stay in suggestion mode only. Do not assume messages are sent or cases are mutated automatically.',
      'Use only the tenant-scoped Growth Assist agenda and its embedded operational signals.',
      'Prefer short, direct, Spanish-first suggestions that help a small business operator move today.',
      'Respect domain boundaries: business rules, approvals, and workflow state still belong to Growth.',
    ],
    suggestedOutputs: [
      {
        key: 'reply_draft',
        label: 'Reply draft',
        description:
          'Draft a customer-facing WhatsApp reply using the hottest conversation cues and reply suggestions.',
      },
      {
        key: 'next_action_brief',
        label: 'Next action brief',
        description:
          'Explain the top commercial action to take now and why it matters today.',
      },
      {
        key: 'follow_up_plan',
        label: 'Follow-up plan',
        description:
          'Suggest a short follow-up sequence grounded in playbooks and waiting-customer timing.',
      },
    ],
  },
  {
    key: 'invoice-document-assistant-core',
    version: 'v1',
    agentKey: 'invoice-document-assistant',
    mode: 'suggestion',
    title: 'Invoice Document Assistant Core',
    summary:
      'Prompt pack for document drafting, review, and checklist suggestions in Ecuador electronic invoicing.',
    objective:
      'Help operators draft and review tax document workflows without replacing fiscal validation owned by the invoicing domain.',
    styleGuidance: [
      'Explain tax-document steps in concrete operator language.',
      'Prefer checklist-driven wording over abstract tax jargon.',
      'Surface checklist gaps before proposing any draft output.',
    ],
    constraints: [
      'Do not treat prompt output as fiscal validation.',
      'Do not approve, sign, or submit tax documents automatically.',
      'Use only the tenant-scoped invoicing drafting surface and its embedded readiness/report signals.',
      'Keep the suggestion explicitly advisory and suitable for human review.',
    ],
    suggestedOutputs: [
      {
        key: 'drafting_brief',
        label: 'Drafting brief',
        description:
          'Summarize what needs to be drafted or reviewed before the document can move forward.',
      },
      {
        key: 'review_checklist',
        label: 'Review checklist',
        description:
          'Explain the human review checklist that should be completed before the document advances.',
      },
      {
        key: 'blocker_explanation',
        label: 'Blocker explanation',
        description:
          'Translate current blockers or warnings into simple operator language and next steps.',
      },
    ],
  },
  {
    key: 'ecommerce-launch-assistant-core',
    version: 'v1',
    agentKey: 'ecommerce-launch-assistant',
    mode: 'suggestion',
    title: 'Ecommerce Launch Assistant Core',
    summary:
      'Prompt pack for ecommerce launch, landing, and campaign suggestions grounded in deterministic tenant context.',
    objective:
      'Propose launch content and structure suggestions without becoming the source of truth for catalog or storefront workflows.',
    styleGuidance: [
      'Favor concise, conversion-oriented recommendations.',
      'Keep brand and product structure grounded in deterministic ecommerce context.',
      'Translate launch tradeoffs into simple operator language before suggesting expansion.',
    ],
    constraints: [
      'Do not publish products or landing pages automatically.',
      'Do not invent catalog facts that are missing from the ecommerce domain surface.',
      'Keep recommendations advisory and suitable for explicit human review.',
    ],
    suggestedOutputs: [
      {
        key: 'launch_brief',
        label: 'Launch brief',
        description:
          'Summarize the recommended launch angle, landing structure, and first content direction.',
      },
      {
        key: 'channel_plan',
        label: 'Channel plan',
        description:
          'Explain the narrow catalog, landing, and campaign sequence that best fits the current tenant posture.',
      },
      {
        key: 'launch_risk_checklist',
        label: 'Launch risk checklist',
        description:
          'Call out missing modules, risky assumptions, and operator checkpoints before launch work starts.',
      },
    ],
  },
  {
    key: 'tax-compliance-ec-review-assistant-core',
    version: 'v1',
    agentKey: 'tax-compliance-ec-review-assistant',
    mode: 'suggestion',
    title: 'Tax Compliance EC Review Assistant Core',
    summary:
      'Prompt pack for Ecuador tax risk summaries, accountant questions, evidence gaps, and pre-filing next steps.',
    objective:
      'Help an operator and accountant review deterministic Tax Compliance EC packets without replacing professional validation, official SRI filing, or accounting books.',
    styleGuidance: [
      'Use Spanish-first, plain business language suitable for an owner and accountant.',
      'Lead with the concrete risk or missing evidence before suggesting next steps.',
      'Separate operator tasks from accountant questions.',
      'Explain uncertainty explicitly when the deterministic packet only supports a handoff.',
    ],
    constraints: [
      'Do not present declarations, generate official annex XML, or claim SRI submission is complete.',
      'Do not replace accountant judgment or legal/tax advice.',
      'Use only deterministic Tax Compliance EC packets and embedded readiness signals.',
      'Keep all recommendations advisory and require human review before external filing or payment.',
      'Do not create journal entries, ledgers, balances, or financial statements.',
    ],
    suggestedOutputs: [
      {
        key: 'tax_risk_summary',
        label: 'Tax risk summary',
        description:
          'Summarize blockers and risk signals for the selected Ecuador tax period.',
      },
      {
        key: 'accountant_question_pack',
        label: 'Accountant questions',
        description:
          'Prepare focused questions that should be answered by the accountant before filing.',
      },
      {
        key: 'evidence_gap_checklist',
        label: 'Evidence gap checklist',
        description:
          'List missing or weak evidence needed for VAT, income tax, retentions, annexes, and closeout.',
      },
      {
        key: 'owner_explanation',
        label: 'Owner explanation',
        description:
          'Explain the tax period status in plain language for the business owner.',
      },
      {
        key: 'pre_filing_next_steps',
        label: 'Pre-filing next steps',
        description:
          'Suggest the safest next operator/accountant actions before external declaration or payment.',
      },
    ],
  },
  {
    key: 'medical-clinic-assistant-core',
    version: 'v1',
    agentKey: 'medical-clinic-assistant',
    mode: 'suggestion',
    title: 'Medical Clinic Assistant Core',
    summary:
      'Prompt pack for medical clinic operational briefs, safety boundaries, and Growth handoff notes.',
    objective:
      'Help a clinic operator review deterministic medical clinic surfaces without replacing licensed clinical judgment or mutating clinic workflows.',
    styleGuidance: [
      'Use Spanish-first, plain operator language.',
      'Separate administrative next steps from clinical review requirements.',
      'Lead with blockers, consent posture, and human review needs before suggestions.',
    ],
    constraints: [
      'Do not diagnose, prescribe, classify risk, sign records, or send emergency messages.',
      'Use only deterministic medical clinic surfaces and explicit AI memory records.',
      'Keep Growth handoffs administrative, consent-aware, and suggestion-only.',
      'Do not create appointments, patient records, invoices, messages, or tax filings.',
    ],
    suggestedOutputs: [
      {
        key: 'clinic_review_brief',
        label: 'Clinic review brief',
        description:
          'Summarize the clinic operating context and what a human should review next.',
      },
      {
        key: 'operator_checklist',
        label: 'Operator checklist',
        description:
          'List administrative steps that can be reviewed without touching clinical judgment.',
      },
      {
        key: 'growth_handoff_notes',
        label: 'Growth handoff notes',
        description:
          'Explain safe reminder or follow-up handoffs that respect consent and opt-in posture.',
      },
      {
        key: 'clinical_boundary_checklist',
        label: 'Clinical boundary checklist',
        description:
          'Call out any diagnosis, prescription, record, emergency, or risk boundary that must remain human-owned.',
      },
    ],
  },
  {
    key: 'psychology-clinic-assistant-core',
    version: 'v1',
    agentKey: 'psychology-clinic-assistant',
    mode: 'suggestion',
    title: 'Psychology Clinic Assistant Core',
    summary:
      'Prompt pack for psychology clinic review briefs, consent boundaries, therapist review, and Growth handoff notes.',
    objective:
      'Help clinic operators and therapists review deterministic psychology clinic surfaces without replacing therapist judgment or clinical records.',
    styleGuidance: [
      'Use Spanish-first, careful, privacy-aware language.',
      'Keep consent and therapist review requirements visible.',
      'Avoid clinical interpretation; explain administrative readiness and review questions.',
    ],
    constraints: [
      'Do not diagnose, classify clinical risk, interpret scales, sign records, or send emergency messages.',
      'Use only deterministic psychology clinic surfaces and explicit AI memory records.',
      'Keep Growth handoffs administrative, consent-aware, and suggestion-only.',
      'Do not create sessions, notes, patient records, messages, billing artifacts, or tax filings.',
    ],
    suggestedOutputs: [
      {
        key: 'therapy_operations_brief',
        label: 'Therapy operations brief',
        description:
          'Summarize operational therapy context and review needs without clinical interpretation.',
      },
      {
        key: 'therapist_review_checklist',
        label: 'Therapist review checklist',
        description:
          'List therapist-owned review points for notes, records, outcomes, or evidence.',
      },
      {
        key: 'privacy_consent_checklist',
        label: 'Privacy consent checklist',
        description:
          'Surface consent, privacy, messaging opt-in, and blocked handoff constraints.',
      },
      {
        key: 'growth_handoff_notes',
        label: 'Growth handoff notes',
        description:
          'Explain safe administrative reminders or follow-ups that can be handed to Growth.',
      },
    ],
  },
];

export function findAiPromptRegistryEntryByAgentKey(
  agentKey: string,
): AiPromptRegistryEntry | null {
  return AI_PROMPT_REGISTRY.find((entry) => entry.agentKey === agentKey) ?? null;
}

export const AI_AGENT_TOOL_ACCESS: AiAgentToolAccessEntry[] = [
  {
    agentKey: 'growth-assist-coach',
    toolKey: 'growth_assist_reply_drafting',
    accessLevel: 'allowed',
    rationale:
      'The agent can safely prepare reply drafts because Growth remains the source of truth and no message is sent automatically.',
  },
  {
    agentKey: 'growth-assist-coach',
    toolKey: 'growth_assist_follow_up_planning',
    accessLevel: 'allowed',
    rationale:
      'The agent can suggest follow-up sequencing and next actions while staying inside suggestion mode.',
  },
  {
    agentKey: 'growth-assist-coach',
    toolKey: 'growth_case_assignment_execution',
    accessLevel: 'blocked',
    rationale:
      'Direct assignment or workflow mutation remains blocked until approval flows and guarded execution are in place.',
  },
  {
    agentKey: 'invoice-document-assistant',
    toolKey: 'invoice_document_drafting',
    accessLevel: 'approval_required',
    rationale:
      'Invoice drafting suggestions are available, but they should stay behind explicit operator review before influencing invoicing work.',
  },
  {
    agentKey: 'invoice-document-assistant',
    toolKey: 'invoice_payment_collection_execution',
    accessLevel: 'blocked',
    rationale:
      'Direct payment posting remains blocked until approval flows and guarded execution are in place for invoicing.',
  },
  {
    agentKey: 'ecommerce-launch-assistant',
    toolKey: 'ecommerce_launch_briefing',
    accessLevel: 'approval_required',
    rationale:
      'Launch suggestions are expected to be reviewed by an operator before they influence storefront work.',
  },
  {
    agentKey: 'ecommerce-launch-assistant',
    toolKey: 'ecommerce_launch_publish_execution',
    accessLevel: 'blocked',
    rationale:
      'Direct storefront or campaign launch remains blocked until approval flows and guarded execution are in place for ecommerce.',
  },
  {
    agentKey: 'tax-compliance-ec-review-assistant',
    toolKey: 'tax_compliance_ec_review_briefing',
    accessLevel: 'approval_required',
    rationale:
      'Tax review suggestions can help operators and accountants, but they must stay behind explicit human review before influencing external filing decisions.',
  },
  {
    agentKey: 'medical-clinic-assistant',
    toolKey: 'medical_clinic_assistant_review_briefing',
    accessLevel: 'approval_required',
    rationale:
      'Medical clinic suggestions can help operators, but must stay behind human review and cannot perform clinical or workflow actions.',
  },
  {
    agentKey: 'psychology-clinic-assistant',
    toolKey: 'psychology_clinic_assistant_review_briefing',
    accessLevel: 'approval_required',
    rationale:
      'Psychology clinic suggestions can help operators and therapists, but must stay behind human review and cannot replace therapist judgment.',
  },
];

export function listAiToolRegistry(): AiToolDefinition[] {
  return AI_TOOL_REGISTRY.map((entry) => cloneAiToolDefinition(entry));
}

export function findAiToolRegistryEntryByKey(
  toolKey: string,
): AiToolDefinition | null {
  const entry = AI_TOOL_REGISTRY.find((candidate) => candidate.key === toolKey);

  return entry ? cloneAiToolDefinition(entry) : null;
}

export function listAiAgentToolAccessByAgentKey(
  agentKey: string,
): { tool: AiToolDefinition; accessLevel: AiAgentToolAccessEntry['accessLevel']; rationale: string }[] {
  return AI_AGENT_TOOL_ACCESS.filter((entry) => entry.agentKey === agentKey)
    .map((entry) => {
      const tool = AI_TOOL_REGISTRY.find((candidate) => candidate.key === entry.toolKey);

      if (!tool) {
        return null;
      }

      return {
        tool: cloneAiToolDefinition(tool),
        accessLevel: entry.accessLevel,
        rationale: entry.rationale,
      };
    })
    .filter((entry): entry is { tool: AiToolDefinition; accessLevel: AiAgentToolAccessEntry['accessLevel']; rationale: string } => entry !== null);
}

export const AI_APPROVAL_POLICY_REGISTRY: AiApprovalPolicyEntry[] = [
  {
    policyKey: 'growth-assist-suggestion-review',
    agentKey: 'growth-assist-coach',
    scope: 'suggestion_review',
    title: 'Growth Assist suggestion review',
    summary:
      'Requests human review before a Growth Assist suggestion handoff is treated as approved for operator use.',
    reviewGuidance:
      'Verify that the suggestion stays grounded in deterministic Growth signals, does not overreach beyond the tenant context, and still sounds safe for a human operator to adapt.',
    approvalRequired: true,
  },
  {
    policyKey: 'invoice-document-assistant-suggestion-review',
    agentKey: 'invoice-document-assistant',
    scope: 'suggestion_review',
    title: 'Invoice suggestion review',
    summary:
      'Keeps document-drafting suggestions behind explicit operator review before they influence invoicing work.',
    reviewGuidance:
      'Confirm that the suggestion is only advisory, matches the fiscal document context, and does not replace domain validation or tax compliance checks.',
    approvalRequired: true,
  },
  {
    policyKey: 'ecommerce-launch-assistant-suggestion-review',
    agentKey: 'ecommerce-launch-assistant',
    scope: 'suggestion_review',
    title: 'Ecommerce launch suggestion review',
    summary:
      'Keeps launch and campaign suggestions behind operator review before they influence storefront work.',
    reviewGuidance:
      'Check that the suggestion stays grounded in product context, does not invent catalog facts, and is safe to translate into real launch work.',
    approvalRequired: true,
  },
  {
    policyKey: 'tax-compliance-ec-review-assistant-suggestion-review',
    agentKey: 'tax-compliance-ec-review-assistant',
    scope: 'suggestion_review',
    title: 'Tax Compliance EC suggestion review',
    summary:
      'Keeps Ecuador tax review suggestions behind explicit human review before they influence filing or accountant handoff work.',
    reviewGuidance:
      'Confirm the suggestion is grounded in deterministic tax packets, does not replace accountant validation, and does not claim official SRI filing or accounting close.',
    approvalRequired: true,
  },
  {
    policyKey: 'medical-clinic-assistant-suggestion-review',
    agentKey: 'medical-clinic-assistant',
    scope: 'suggestion_review',
    title: 'Medical clinic suggestion review',
    summary:
      'Keeps medical clinic suggestions behind explicit human review before they influence clinic operations.',
    reviewGuidance:
      'Confirm the suggestion is grounded in deterministic medical clinic surfaces, does not diagnose, prescribe, sign records, classify risk, mutate workflow state, or bypass consent-aware Growth handoffs.',
    approvalRequired: true,
  },
  {
    policyKey: 'psychology-clinic-assistant-suggestion-review',
    agentKey: 'psychology-clinic-assistant',
    scope: 'suggestion_review',
    title: 'Psychology clinic suggestion review',
    summary:
      'Keeps psychology clinic suggestions behind explicit human review before they influence therapy operations.',
    reviewGuidance:
      'Confirm the suggestion is grounded in deterministic psychology clinic surfaces, does not replace therapist judgment, interpret scales, classify risk, sign records, mutate workflow state, or bypass privacy and consent constraints.',
    approvalRequired: true,
  },
];

export function listAiApprovalPolicies(): AiApprovalPolicyEntry[] {
  return AI_APPROVAL_POLICY_REGISTRY.map((entry) => ({ ...entry }));
}

export function listAiApprovalPoliciesByAgentKey(
  agentKey: string,
): AiApprovalPolicyEntry[] {
  return AI_APPROVAL_POLICY_REGISTRY.filter(
    (entry) => entry.agentKey === agentKey,
  ).map((entry) => ({ ...entry }));
}

export function getAiAgentRequiredPermissionKey(agentKey: string): string | null {
  return AI_AGENT_OPERATING_MODEL_METADATA[agentKey]?.requiredPermissionKey ?? null;
}

export function getAiGuardedExecutionCandidateToolKey(
  agentKey: string,
): string | null {
  return (
    listAiAgentToolAccessByAgentKey(agentKey).find(
      (entry) =>
        entry.tool.executionBoundary.executionMode ===
        'guarded_execution_planned',
    )?.tool.key ?? null
  );
}

export function getAiGuardedExecutionCandidateDescriptor(
  agentKey: string,
): AiGuardedExecutionCandidateDescriptor | null {
  const toolKey = getAiGuardedExecutionCandidateToolKey(agentKey);
  const descriptor = toolKey
    ? AI_GUARDED_EXECUTION_CANDIDATE_DESCRIPTORS[toolKey]
    : null;

  return descriptor ? cloneAiGuardedExecutionCandidateDescriptor(descriptor) : null;
}

export function getAiAgentPrimarySurfaceDescriptor(
  agentKey: string,
): AiOperatingModelAgentPrimarySurfaceReference {
  const descriptor = AI_AGENT_OPERATING_MODEL_METADATA[agentKey]?.primarySurface;

  if (!descriptor) {
    throw new Error(
      `AI primary surface descriptor is not configured for agent ${agentKey}.`,
    );
  }

  return cloneAiAgentPrimarySurfaceDescriptor(descriptor);
}

export function listAiOperatingModelApprovalPoliciesByAgentKey(
  agentKey: string,
): AiOperatingModelAgentApprovalPolicyReference[] {
  return listAiApprovalPoliciesByAgentKey(agentKey).map((entry) => ({
    policyKey: entry.policyKey,
    agentKey: entry.agentKey,
    scope: entry.scope,
    title: entry.title,
    summary: entry.summary,
    reviewGuidance: entry.reviewGuidance,
    approvalRequired: entry.approvalRequired,
  }));
}

export function listAiOperatingModelManifest(): AiOperatingModelManifest {
  const agents: AiOperatingModelAgentEntry[] = AI_AGENT_CATALOG.map((agent) => {
    const promptPack = findAiPromptRegistryEntryByAgentKey(agent.key);
    const requiredPermissionKey = getAiAgentRequiredPermissionKey(agent.key);

    if (!promptPack || !requiredPermissionKey) {
      throw new Error(
        `AI operating model is incomplete for agent ${agent.key}.`,
      );
    }

    const handoffContract = getAiAgentHandoffContract(agent.key);

    if (!handoffContract) {
      throw new Error(
        `AI handoff contract is incomplete for agent ${agent.key}.`,
      );
    }

    const toolAccess = listAiAgentToolAccessByAgentKey(agent.key).map((entry) => ({
      tool: entry.tool,
      accessLevel: entry.accessLevel,
      rationale: entry.rationale,
    }));
    const approvalPolicies = listAiOperatingModelApprovalPoliciesByAgentKey(
      agent.key,
    );
    const approvalPolicyKeys = approvalPolicies.map((entry) => entry.policyKey);

    return {
      agent: cloneAiAgentCatalogEntry(agent),
      requiredPermissionKey,
      primarySurface: getAiAgentPrimarySurfaceDescriptor(agent.key),
      promptPack: {
        key: promptPack.key,
        version: promptPack.version,
        mode: promptPack.mode,
        title: promptPack.title,
        summary: promptPack.summary,
        objective: promptPack.objective,
      },
      approvalPolicies,
      primaryApprovalPolicyKey: approvalPolicyKeys[0] ?? null,
      approvalPolicyKeys,
      toolAccess,
      handoffContract,
      guardedExecutionCandidateToolKey:
        getAiGuardedExecutionCandidateToolKey(agent.key),
      guardedExecutionCandidate:
        getAiGuardedExecutionCandidateDescriptor(agent.key),
    };
  });

  const totalToolAccessEntries = agents.reduce(
    (total, agent) => total + agent.toolAccess.length,
    0,
  );
  const approvalRequiredToolAccessEntries = agents.reduce(
    (total, agent) =>
      total +
      agent.toolAccess.filter((entry) => entry.accessLevel === 'approval_required')
        .length,
    0,
  );
  const blockedToolAccessEntries = agents.reduce(
    (total, agent) =>
      total + agent.toolAccess.filter((entry) => entry.accessLevel === 'blocked').length,
    0,
  );

  return {
    version: AI_OPERATING_MODEL_VERSION,
    agents,
    counts: {
      totalAgents: agents.length,
      readyAgents: agents.filter((entry) => entry.agent.availability === 'ready').length,
      plannedAgents: agents.filter((entry) => entry.agent.availability === 'planned').length,
      agentsWithApprovalPolicies: agents.filter(
        (entry) => entry.approvalPolicyKeys.length > 0,
      ).length,
      agentsWithGuardedExecutionCandidate: agents.filter(
        (entry) => entry.guardedExecutionCandidateToolKey !== null,
      ).length,
      totalToolAccessEntries,
      approvalRequiredToolAccessEntries,
      blockedToolAccessEntries,
    },
  };
}

export function findAiOperatingModelAgentEntryByKey(
  agentKey: string,
): AiOperatingModelAgentEntry | null {
  return (
    listAiOperatingModelManifest().agents.find(
      (entry) => entry.agent.key === agentKey,
    ) ?? null
  );
}
