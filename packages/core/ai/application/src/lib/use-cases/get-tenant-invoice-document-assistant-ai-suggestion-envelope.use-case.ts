import {
  AiSuggestionContextBlock,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import {
  GetTenantInvoiceDocumentDraftingAssistUseCase,
  TenantInvoiceDocumentDraftingAssistView,
} from '@saas-platform/invoicing-application';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import {
  findAiAgentByKey,
  findAiPromptRegistryEntryByAgentKey,
  listAiAgentToolAccessByAgentKey,
} from '../support/ai-agent-catalog';

const INVOICE_DOCUMENT_ASSISTANT_AGENT_KEY = 'invoice-document-assistant';
const INVOICE_DOCUMENT_ASSISTANT_SURFACE_KEY = 'invoice_document_drafting';

export class GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase {
  constructor(
    private readonly getTenantInvoiceDocumentDraftingAssistUseCase: GetTenantInvoiceDocumentDraftingAssistUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey = INVOICE_DOCUMENT_ASSISTANT_AGENT_KEY,
  ): Promise<TenantAiSuggestionEnvelope> {
    const agent = findAiAgentByKey(agentKey);

    if (!agent || agent.key !== INVOICE_DOCUMENT_ASSISTANT_AGENT_KEY) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const promptPack = findAiPromptRegistryEntryByAgentKey(agentKey);

    if (!promptPack) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const assist =
      await this.getTenantInvoiceDocumentDraftingAssistUseCase.execute(
        tenantSlug,
      );

    return {
      tenantSlug,
      generatedAt: assist.generatedAt,
      mode: 'suggestion',
      agent: {
        ...agent,
        supportedSurfaceKeys: [...agent.supportedSurfaceKeys],
      },
      surface: {
        key: INVOICE_DOCUMENT_ASSISTANT_SURFACE_KEY,
        title: 'Invoice document drafting',
        sourceContractKey: 'invoicing.assist.document_drafting',
        sourceGeneratedAt: assist.generatedAt,
      },
      promptPack: {
        ...promptPack,
        styleGuidance: [...promptPack.styleGuidance],
        constraints: [...promptPack.constraints],
        suggestedOutputs: promptPack.suggestedOutputs.map((entry) => ({ ...entry })),
      },
      toolAccess: listAiAgentToolAccessByAgentKey(agentKey).map((entry) => ({
        tool: { ...entry.tool },
        accessLevel: entry.accessLevel,
        rationale: entry.rationale,
      })),
      contextBlocks: this.buildContextBlocks(assist),
    };
  }

  private buildContextBlocks(
    assist: TenantInvoiceDocumentDraftingAssistView,
  ): AiSuggestionContextBlock[] {
    return [
      {
        key: 'drafting_summary',
        title: 'Drafting summary',
        detail: `${assist.summary.headline} ${assist.summary.detail}`,
        bullets: [
          `Readiness status: ${assist.summary.readinessStatus}`,
          `Suggested focus: ${assist.summary.suggestedFocus}`,
          `Outstanding amount in cents: ${assist.reportSnapshot.outstandingTotalInCents}`,
          `Invoice count: ${assist.reportSnapshot.invoiceCount}`,
          `Customer count: ${assist.reportSnapshot.customerCount}`,
        ],
      },
      {
        key: 'formal_checklist',
        title: 'Formal checklist',
        detail:
          'These are the deterministic controls the assistant must explain before it suggests any drafting or review help.',
        bullets: assist.checklist.map(
          (entry) => `${entry.label}: status=${entry.status}; ${entry.detail}`,
        ),
      },
      {
        key: 'document_guidance',
        title: 'Document guidance',
        detail:
          'This tells the assistant which Ecuador document lanes are more usable today and how they should be framed.',
        bullets: assist.documentGuidance.map(
          (entry) =>
            `${entry.label}: status=${entry.status}; use=${entry.recommendedUse}`,
        ),
      },
      {
        key: 'drafting_hints',
        title: 'Drafting hints',
        detail:
          'These deterministic hints shape what kind of help the assistant may offer in suggestion mode.',
        bullets: assist.draftingHints.map(
          (entry) =>
            `${entry.title}: objective=${entry.objective}; caution=${entry.caution}`,
        ),
      },
      {
        key: 'safety_boundaries',
        title: 'Safety boundaries',
        detail:
          'These actions stay blocked even if the assistant can already help with drafting or review guidance.',
        bullets: assist.blockedActions,
      },
    ].map((block) => ({
      ...block,
      bullets:
        block.bullets.length > 0
          ? block.bullets
          : ['No deterministic signals were available for this block yet.'],
    }));
  }
}
