import {
  AiApprovalPolicyEntry,
  AiAgentToolAccessEntry,
  AiAgentCatalogEntry,
  AiPromptRegistryEntry,
  AiToolDefinition,
} from '@saas-platform/ai-domain';

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
      'Will help draft, review, and explain invoicing document workflows once AI-ready invoicing surfaces are exposed.',
    domainKey: 'invoicing',
    productKey: 'invoicing',
    availability: 'planned',
    defaultMode: 'suggestion',
    supportedSurfaceKeys: ['invoice_document_drafting'],
  },
  {
    key: 'ecommerce-launch-assistant',
    title: 'Ecommerce Launch Assistant',
    summary:
      'Will help shape product, catalog, landing, and campaign suggestions once the ecommerce domain is active.',
    domainKey: 'ecommerce',
    productKey: 'ecommerce',
    availability: 'planned',
    defaultMode: 'suggestion',
    supportedSurfaceKeys: ['ecommerce_launch_workspace'],
  },
];

export function findAiAgentByKey(
  agentKey: string,
): AiAgentCatalogEntry | null {
  return AI_AGENT_CATALOG.find((entry) => entry.key === agentKey) ?? null;
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
  },
  {
    key: 'invoice_document_drafting',
    title: 'Invoice document drafting',
    summary:
      'Will help prepare deterministic drafting and review suggestions for invoicing document workflows.',
    domainKey: 'invoicing',
    availability: 'planned',
    riskLevel: 'medium',
    actionKind: 'draft',
    requiresApproval: false,
  },
  {
    key: 'ecommerce_launch_briefing',
    title: 'Ecommerce launch briefing',
    summary:
      'Will suggest landing, catalog, and campaign structure once ecommerce deterministic surfaces exist.',
    domainKey: 'ecommerce',
    availability: 'planned',
    riskLevel: 'medium',
    actionKind: 'propose',
    requiresApproval: false,
  },
];

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
    version: 'planned-v1',
    agentKey: 'invoice-document-assistant',
    mode: 'suggestion',
    title: 'Invoice Document Assistant Core',
    summary:
      'Planned prompt pack for document drafting, review, and checklist suggestions in Ecuador electronic invoicing.',
    objective:
      'Help operators draft and review tax document workflows without replacing fiscal validation owned by the invoicing domain.',
    styleGuidance: [
      'Explain tax-document steps in concrete operator language.',
      'Surface checklist gaps before proposing any draft output.',
    ],
    constraints: [
      'Do not treat prompt output as fiscal validation.',
      'Do not approve, sign, or submit tax documents automatically.',
    ],
    suggestedOutputs: [
      {
        key: 'drafting_brief',
        label: 'Drafting brief',
        description:
          'Summarize what needs to be drafted or reviewed before the document can move forward.',
      },
    ],
  },
  {
    key: 'ecommerce-launch-assistant-core',
    version: 'planned-v1',
    agentKey: 'ecommerce-launch-assistant',
    mode: 'suggestion',
    title: 'Ecommerce Launch Assistant Core',
    summary:
      'Planned prompt pack for product, landing, and campaign suggestions once ecommerce surfaces exist.',
    objective:
      'Propose launch content and structure suggestions without becoming the source of truth for catalog or storefront workflows.',
    styleGuidance: [
      'Favor concise, conversion-oriented recommendations.',
      'Keep brand and product structure grounded in deterministic ecommerce context.',
    ],
    constraints: [
      'Do not publish products or landing pages automatically.',
      'Do not invent catalog facts that are missing from the ecommerce domain surface.',
    ],
    suggestedOutputs: [
      {
        key: 'launch_brief',
        label: 'Launch brief',
        description:
          'Summarize the recommended launch angle, landing structure, and first content direction.',
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
      'Invoice drafting suggestions are planned, but they should stay behind explicit operator review before use.',
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
  return AI_TOOL_REGISTRY.map((entry) => ({ ...entry }));
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
        tool: { ...tool },
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
