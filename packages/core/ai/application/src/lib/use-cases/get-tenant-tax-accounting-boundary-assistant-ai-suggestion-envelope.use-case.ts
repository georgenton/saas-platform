import {
  AiSuggestionContextBlock,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import { GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase } from '@saas-platform/tax-compliance-application';
import {
  buildAiRetrievedMemoryContextBlocks,
  finalizeAiSuggestionContextBlocks,
} from '../support/ai-suggestion-context-blocks';
import { buildTenantAiSuggestionEnvelope } from '../support/ai-suggestion-envelope-factory';
import { GetTenantAiMemoryRetrievalUseCase } from './get-tenant-ai-memory-retrieval.use-case';

const TAX_ACCOUNTING_BOUNDARY_ASSISTANT_AGENT_KEY =
  'tax-accounting-boundary-assistant';

export class GetTenantTaxAccountingBoundaryAssistantAiSuggestionEnvelopeUseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountingBoundaryAiReviewUseCase: GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase,
    private readonly getTenantAiMemoryRetrievalUseCase: GetTenantAiMemoryRetrievalUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    agentKey = TAX_ACCOUNTING_BOUNDARY_ASSISTANT_AGENT_KEY,
  ): Promise<TenantAiSuggestionEnvelope> {
    const generatedAt = this.nowProvider();
    const period = generatedAt.toISOString().slice(0, 7);
    const year = generatedAt.getUTCFullYear();
    const [review, retrieval] = await Promise.all([
      this.getTenantEcuadorTaxAccountingBoundaryAiReviewUseCase.execute({
        tenantSlug,
        period,
        year,
      }),
      this.getTenantAiMemoryRetrievalUseCase.execute(tenantSlug, agentKey),
    ]);

    return buildTenantAiSuggestionEnvelope({
      tenantSlug,
      agentKey,
      expectedAgentKey: TAX_ACCOUNTING_BOUNDARY_ASSISTANT_AGENT_KEY,
      generatedAt: review.generatedAt,
      sourceGeneratedAt: review.generatedAt,
      mode: 'suggestion',
      contextBlocks: this.buildContextBlocks(review, retrieval.records),
      ...(retrieval.recordCount > 0 ? { retrieval } : {}),
    });
  }

  private buildContextBlocks(
    review: Awaited<
      ReturnType<GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase['execute']>
    >,
    retrievedMemoryRecords: Awaited<
      ReturnType<GetTenantAiMemoryRetrievalUseCase['execute']>
    >['records'],
  ): AiSuggestionContextBlock[] {
    return finalizeAiSuggestionContextBlocks([
      {
        key: 'boundary_review_summary',
        title: 'Boundary review summary',
        detail:
          'Deterministic Tax/Accounting boundary review the assistant can explain.',
        bullets: [
          `Period: ${review.period}`,
          `Year: ${review.year}`,
          `Review status: ${review.reviewStatus}`,
          `Accountant required: ${review.summary.accountantRequired}`,
          `Open Accounting Advanced now: ${review.summary.openAdvancedAccountingNow}`,
        ],
      },
      {
        key: 'boundary_lanes',
        title: 'Boundary lanes',
        detail:
          'These lanes separate Tax Compliance, Accounting Foundation, Accounting Advanced and external accountant ownership.',
        bullets: review.boundaryLanes.map(
          (lane) =>
            `${lane.label}: owner=${lane.owner}; status=${lane.status}; ${lane.explanation}`,
        ),
      },
      {
        key: 'professional_handoff',
        title: 'Professional handoff',
        detail:
          'This tells the assistant whether the tenant can self-serve, needs accountant review, or should open advanced accounting discovery.',
        bullets: [
          `Service mode: ${review.professionalHandoff.decision.serviceMode}`,
          `Reason: ${review.professionalHandoff.decision.reason}`,
          `Next step: ${review.professionalHandoff.nextStep}`,
        ],
      },
      {
        key: 'accounting_advanced_gate',
        title: 'Accounting Advanced gate',
        detail:
          'This gate keeps Accounting Advanced from opening unless formal accounting pressure exists.',
        bullets: [
          `Gate status: ${review.accountingAdvancedGate.gateStatus}`,
          `Next product: ${review.accountingAdvancedGate.recommendation.nextProduct}`,
          `Reason: ${review.accountingAdvancedGate.recommendation.reason}`,
          ...review.accountingAdvancedGate.recommendation.minimumEvidenceBeforeOpening.map(
            (item) => `Minimum evidence: ${item}`,
          ),
        ],
      },
      {
        key: 'blocked_outputs',
        title: 'Blocked outputs',
        detail:
          'The assistant can explain and draft questions, but these outputs stay blocked.',
        bullets: review.assistantInstructions.blockedOutputs,
      },
      ...buildAiRetrievedMemoryContextBlocks(retrievedMemoryRecords),
    ]);
  }
}
