import {
  AiSuggestionContextBlock,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import {
  GetTenantInvoiceDocumentDraftingAssistUseCase,
  TenantInvoiceDocumentDraftingAssistView,
} from '@saas-platform/invoicing-application';
import { buildTenantAiSuggestionEnvelope } from '../support/ai-suggestion-envelope-factory';
import {
  buildAiRetrievedMemoryContextBlocks,
  finalizeAiSuggestionContextBlocks,
} from '../support/ai-suggestion-context-blocks';
import { GetTenantAiMemoryRetrievalUseCase } from './get-tenant-ai-memory-retrieval.use-case';

const INVOICE_DOCUMENT_ASSISTANT_AGENT_KEY = 'invoice-document-assistant';

export class GetTenantInvoiceDocumentAssistantAiSuggestionEnvelopeUseCase {
  constructor(
    private readonly getTenantInvoiceDocumentDraftingAssistUseCase: GetTenantInvoiceDocumentDraftingAssistUseCase,
    private readonly getTenantAiMemoryRetrievalUseCase: GetTenantAiMemoryRetrievalUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey = INVOICE_DOCUMENT_ASSISTANT_AGENT_KEY,
  ): Promise<TenantAiSuggestionEnvelope> {
    const assist =
      await this.getTenantInvoiceDocumentDraftingAssistUseCase.execute(
        tenantSlug,
      );
    const retrieval = await this.getTenantAiMemoryRetrievalUseCase.execute(
      tenantSlug,
      agentKey,
    );

    return buildTenantAiSuggestionEnvelope({
      tenantSlug,
      agentKey,
      expectedAgentKey: INVOICE_DOCUMENT_ASSISTANT_AGENT_KEY,
      generatedAt: assist.generatedAt,
      sourceGeneratedAt: assist.generatedAt,
      mode: 'suggestion',
      contextBlocks: this.buildContextBlocks(assist, retrieval.records),
      ...(retrieval.recordCount > 0 ? { retrieval } : {}),
    });
  }

  private buildContextBlocks(
    assist: TenantInvoiceDocumentDraftingAssistView,
    retrievedMemoryRecords: Awaited<
      ReturnType<GetTenantAiMemoryRetrievalUseCase['execute']>
    >['records'],
  ): AiSuggestionContextBlock[] {
    return finalizeAiSuggestionContextBlocks([
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
      ...buildAiRetrievedMemoryContextBlocks(retrievedMemoryRecords),
    ]);
  }
}
