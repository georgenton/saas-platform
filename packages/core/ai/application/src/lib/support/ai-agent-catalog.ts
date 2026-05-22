import { AiAgentCatalogEntry } from '@saas-platform/ai-domain';

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
