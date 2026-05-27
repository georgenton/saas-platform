import {
  AiSuggestionContextBlock,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import {
  GetTenantGrowthAssistDailyAgendaUseCase,
  TenantGrowthAssistDailyAgendaView,
} from '@saas-platform/growth-application';
import { buildTenantAiSuggestionEnvelope } from '../support/ai-suggestion-envelope-factory';
import {
  buildAiRetrievedMemoryContextBlocks,
  finalizeAiSuggestionContextBlocks,
} from '../support/ai-suggestion-context-blocks';
import { GetTenantAiMemoryRetrievalUseCase } from './get-tenant-ai-memory-retrieval.use-case';

const GROWTH_ASSIST_AGENT_KEY = 'growth-assist-coach';

export class GetTenantGrowthAssistAiSuggestionEnvelopeUseCase {
  constructor(
    private readonly getTenantGrowthAssistDailyAgendaUseCase: GetTenantGrowthAssistDailyAgendaUseCase,
    private readonly getTenantAiMemoryRetrievalUseCase: GetTenantAiMemoryRetrievalUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey = GROWTH_ASSIST_AGENT_KEY,
  ): Promise<TenantAiSuggestionEnvelope> {
    const agenda =
      await this.getTenantGrowthAssistDailyAgendaUseCase.execute(tenantSlug);
    const retrieval = await this.getTenantAiMemoryRetrievalUseCase.execute(
      tenantSlug,
      agentKey,
    );

    return buildTenantAiSuggestionEnvelope({
      tenantSlug,
      agentKey,
      expectedAgentKey: GROWTH_ASSIST_AGENT_KEY,
      generatedAt: agenda.generatedAt,
      sourceGeneratedAt: agenda.generatedAt,
      mode: 'suggestion',
      contextBlocks: this.buildContextBlocks(agenda, retrieval.records),
      ...(retrieval.recordCount > 0 ? { retrieval } : {}),
    });
  }

  private buildContextBlocks(
    agenda: TenantGrowthAssistDailyAgendaView,
    retrievedMemoryRecords: Awaited<
      ReturnType<GetTenantAiMemoryRetrievalUseCase['execute']>
    >['records'],
  ): AiSuggestionContextBlock[] {
    return finalizeAiSuggestionContextBlocks([
      {
        key: 'agenda_summary',
        title: 'Agenda summary',
        detail: `${agenda.summary.headline} ${agenda.summary.detail}`,
        bullets: [
          `Reply now count: ${agenda.summary.replyNowCount}`,
          `Follow-up now count: ${agenda.summary.followUpNowCount}`,
          `Waiting customer count: ${agenda.summary.waitingCustomerCount}`,
          `Queue to organize count: ${agenda.summary.queueToOrganizeCount}`,
          `Channel risk count: ${agenda.summary.channelRiskCount}`,
          `Saved auto-assignment policy: ${agenda.summary.savedPolicyKey}`,
        ],
      },
      {
        key: 'top_next_actions',
        title: 'Top next actions',
        detail:
          'These are the clearest business actions the deterministic Growth Assist contract already recommends today.',
        bullets: agenda.nextActions.slice(0, 3).map(
          (entry) =>
            `${entry.title}: ${entry.recommendedAction} (${entry.businessImpact})`,
        ),
      },
      {
        key: 'reply_suggestions',
        title: 'Reply suggestions',
        detail:
          'These drafts and goals are safe starting points for suggestion-mode coaching.',
        bullets: agenda.replySuggestions.slice(0, 3).map(
          (entry) =>
            `${entry.title}: goal=${entry.goal}; draft=${entry.suggestedReply}`,
        ),
      },
      {
        key: 'lead_warmth',
        title: 'Lead warmth radar',
        detail: agenda.leadWarmthSummary.recommendedFocus,
        bullets: agenda.leadWarmthHints.slice(0, 3).map(
          (entry) =>
            `${entry.title}: ${entry.whyWarmth}; cadence=${entry.recommendedCadence}`,
        ),
      },
      {
        key: 'playbooks',
        title: 'Operator playbooks',
        detail:
          'These playbooks describe the deterministic operating guidance the AI layer must respect and explain.',
        bullets: agenda.playbooks.slice(0, 3).map(
          (entry) =>
            `${entry.title}: goal=${entry.goal}; avoid=${entry.avoid}; success=${entry.successSignal}`,
        ),
      },
      {
        key: 'channel_health',
        title: 'Channel health',
        detail:
          agenda.channelHealth.topAlertSummary ??
          'No top alert summary is active right now.',
        bullets: [
          `Overall status: ${agenda.channelHealth.overallStatus}`,
          `Total alerts: ${agenda.channelHealth.totalAlertCount}`,
          `Ready retries: ${agenda.channelHealth.readyRetryCount}`,
          `Top action: ${agenda.channelHealth.topAlertRecommendedAction ?? 'No action required'}`,
        ],
      },
      ...buildAiRetrievedMemoryContextBlocks(retrievedMemoryRecords),
    ]);
  }
}
