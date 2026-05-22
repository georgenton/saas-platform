import {
  AiAgentCatalogEntry,
  AiPromptRegistryEntry,
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
