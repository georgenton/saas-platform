import {
  AiClinicAssistantTemplateContract,
  AiSuggestionContextBlock,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import {
  buildAiRetrievedMemoryContextBlocks,
  finalizeAiSuggestionContextBlocks,
} from '../support/ai-suggestion-context-blocks';
import { buildTenantAiSuggestionEnvelope } from '../support/ai-suggestion-envelope-factory';
import { GetTenantAiMemoryRetrievalUseCase } from './get-tenant-ai-memory-retrieval.use-case';

export abstract class GetTenantClinicAssistantAiSuggestionEnvelopeUseCase {
  protected constructor(
    private readonly template: AiClinicAssistantTemplateContract,
    private readonly getTenantAiMemoryRetrievalUseCase: GetTenantAiMemoryRetrievalUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    agentKey = this.template.agentKey,
  ): Promise<TenantAiSuggestionEnvelope> {
    const generatedAt = this.nowProvider();
    const retrieval = await this.getTenantAiMemoryRetrievalUseCase.execute(
      tenantSlug,
      agentKey,
    );

    return buildTenantAiSuggestionEnvelope({
      tenantSlug,
      agentKey,
      expectedAgentKey: this.template.agentKey,
      generatedAt,
      sourceGeneratedAt: generatedAt,
      mode: 'suggestion',
      contextBlocks: this.buildContextBlocks(retrieval.records),
      ...(retrieval.recordCount > 0 ? { retrieval } : {}),
    });
  }

  private buildContextBlocks(
    retrievedMemoryRecords: Awaited<
      ReturnType<GetTenantAiMemoryRetrievalUseCase['execute']>
    >['records'],
  ): AiSuggestionContextBlock[] {
    return finalizeAiSuggestionContextBlocks([
      {
        key: 'clinic_template_contract',
        title: `${this.template.title} contract`,
        detail:
          'This is the deterministic product contract the assistant can use before preparing clinic suggestions.',
        bullets: [
          `Product: ${this.template.productKey}`,
          `Domain: ${this.template.domainKey}`,
          `Status: ${this.template.status}`,
          `Primary surface: ${this.template.primarySurfaceKey}`,
        ],
      },
      {
        key: 'clinic_surfaces',
        title: 'Available clinic surfaces',
        detail:
          'These surfaces define the factual material available to the assistant without opening clinical automation.',
        bullets: this.template.surfaces.map(
          (surface) =>
            `${surface.title}: status=${surface.status}; use=${surface.aiUse}`,
        ),
      },
      {
        key: 'growth_bridge',
        title: 'Growth bridge',
        detail:
          'Growth is connected only through administrative, consent-aware reminder and follow-up handoffs.',
        bullets: this.template.surfaces.map(
          (surface) => `${surface.title}: ${surface.growthBridge}`,
        ),
      },
      {
        key: 'safety_boundaries',
        title: 'Safety boundaries',
        detail:
          'These capabilities remain blocked even when the assistant can draft reviewable clinic guidance.',
        bullets: Array.from(
          new Set(
            this.template.surfaces.flatMap(
              (surface) => surface.blockedCapabilities,
            ),
          ),
        ),
      },
      {
        key: 'approval_requirement',
        title: 'Approval requirement',
        detail:
          'Clinic assistant output is reviewable helper text. Human review is mandatory before operational or clinical use.',
        bullets: [
          'Require clinic operator or licensed professional review.',
          'Do not mutate appointments, sessions, patient records, messages, billing artifacts, or tax filings.',
          'Keep clinical judgment, legal records, emergency handling, and external filings outside AI execution.',
        ],
      },
      ...buildAiRetrievedMemoryContextBlocks(retrievedMemoryRecords),
    ]);
  }
}
