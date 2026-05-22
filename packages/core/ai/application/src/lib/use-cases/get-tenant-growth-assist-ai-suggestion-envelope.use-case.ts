import {
  AiSuggestionContextBlock,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import {
  GetTenantGrowthAssistDailyAgendaUseCase,
  TenantGrowthAssistDailyAgendaView,
} from '@saas-platform/growth-application';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import {
  findAiAgentByKey,
  findAiPromptRegistryEntryByAgentKey,
  listAiAgentToolAccessByAgentKey,
} from '../support/ai-agent-catalog';

const GROWTH_ASSIST_AGENT_KEY = 'growth-assist-coach';
const GROWTH_ASSIST_SURFACE_KEY = 'growth_assist_daily_agenda';

export class GetTenantGrowthAssistAiSuggestionEnvelopeUseCase {
  constructor(
    private readonly getTenantGrowthAssistDailyAgendaUseCase: GetTenantGrowthAssistDailyAgendaUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey = GROWTH_ASSIST_AGENT_KEY,
  ): Promise<TenantAiSuggestionEnvelope> {
    const agent = findAiAgentByKey(agentKey);

    if (!agent || agent.key !== GROWTH_ASSIST_AGENT_KEY) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const promptPack = findAiPromptRegistryEntryByAgentKey(agentKey);

    if (!promptPack) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const agenda =
      await this.getTenantGrowthAssistDailyAgendaUseCase.execute(tenantSlug);

    return {
      tenantSlug,
      generatedAt: agenda.generatedAt,
      mode: 'suggestion',
      agent: {
        ...agent,
        supportedSurfaceKeys: [...agent.supportedSurfaceKeys],
      },
      surface: {
        key: GROWTH_ASSIST_SURFACE_KEY,
        title: 'Growth Assist daily agenda',
        sourceContractKey: 'growth.assist.daily_agenda',
        sourceGeneratedAt: agenda.generatedAt,
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
      contextBlocks: this.buildContextBlocks(agenda),
    };
  }

  private buildContextBlocks(
    agenda: TenantGrowthAssistDailyAgendaView,
  ): AiSuggestionContextBlock[] {
    return [
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
    ].map((block) => ({
      ...block,
      bullets:
        block.bullets.length > 0
          ? block.bullets
          : ['No deterministic signals were available for this block yet.'],
    }));
  }
}
