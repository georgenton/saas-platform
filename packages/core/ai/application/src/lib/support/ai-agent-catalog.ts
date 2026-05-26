import {
  AiApprovalPolicyEntry,
  AiAgentToolAccessEntry,
  AiAgentCatalogEntry,
  AiOperatingModelAgentEntry,
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
];

const AI_AGENT_REQUIRED_PERMISSION_KEYS: Record<string, string> = {
  'growth-assist-coach': 'growth.conversations.read',
  'invoice-document-assistant': 'invoicing.reports.read',
  'ecommerce-launch-assistant': 'tenant.entitlements.read',
};

function cloneAiAgentCatalogEntry(entry: AiAgentCatalogEntry): AiAgentCatalogEntry {
  return {
    ...entry,
    supportedSurfaceKeys: [...entry.supportedSurfaceKeys],
  };
}

export function findAiAgentByKey(
  agentKey: string,
): AiAgentCatalogEntry | null {
  const entry = AI_AGENT_CATALOG.find((candidate) => candidate.key === agentKey);

  return entry ? cloneAiAgentCatalogEntry(entry) : null;
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
  return AI_AGENT_REQUIRED_PERMISSION_KEYS[agentKey] ?? null;
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

export function listAiOperatingModelManifest(): AiOperatingModelManifest {
  const agents: AiOperatingModelAgentEntry[] = AI_AGENT_CATALOG.map((agent) => {
    const promptPack = findAiPromptRegistryEntryByAgentKey(agent.key);
    const requiredPermissionKey = getAiAgentRequiredPermissionKey(agent.key);

    if (!promptPack || !requiredPermissionKey) {
      throw new Error(
        `AI operating model is incomplete for agent ${agent.key}.`,
      );
    }

    const toolAccess = listAiAgentToolAccessByAgentKey(agent.key).map((entry) => ({
      toolKey: entry.tool.key,
      accessLevel: entry.accessLevel,
      availability: entry.tool.availability,
      actionKind: entry.tool.actionKind,
      executionMode: entry.tool.executionBoundary.executionMode,
      requiresApproval: entry.tool.requiresApproval,
    }));

    return {
      agent: cloneAiAgentCatalogEntry(agent),
      requiredPermissionKey,
      promptPack: {
        key: promptPack.key,
        version: promptPack.version,
        mode: promptPack.mode,
        title: promptPack.title,
      },
      approvalPolicyKeys: listAiApprovalPoliciesByAgentKey(agent.key).map(
        (entry) => entry.policyKey,
      ),
      toolAccess,
      guardedExecutionCandidateToolKey:
        getAiGuardedExecutionCandidateToolKey(agent.key),
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
