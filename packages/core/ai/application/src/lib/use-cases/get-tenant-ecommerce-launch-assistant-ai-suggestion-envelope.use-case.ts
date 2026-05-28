import {
  AiSuggestionContextBlock,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import { buildTenantAiSuggestionEnvelope } from '../support/ai-suggestion-envelope-factory';
import {
  buildAiRetrievedMemoryContextBlocks,
  finalizeAiSuggestionContextBlocks,
} from '../support/ai-suggestion-context-blocks';
import {
  GetTenantEcommerceLaunchWorkspaceUseCase,
} from '@saas-platform/ecommerce-application';
import { TenantEcommerceLaunchWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantAiMemoryRetrievalUseCase } from './get-tenant-ai-memory-retrieval.use-case';

const ECOMMERCE_LAUNCH_ASSISTANT_AGENT_KEY = 'ecommerce-launch-assistant';

export class GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase {
  constructor(
    private readonly getTenantEcommerceLaunchWorkspaceUseCase: GetTenantEcommerceLaunchWorkspaceUseCase,
    private readonly getTenantAiMemoryRetrievalUseCase: GetTenantAiMemoryRetrievalUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey = ECOMMERCE_LAUNCH_ASSISTANT_AGENT_KEY,
  ): Promise<TenantAiSuggestionEnvelope> {
    const workspace =
      await this.getTenantEcommerceLaunchWorkspaceUseCase.execute(tenantSlug);
    const retrieval = await this.getTenantAiMemoryRetrievalUseCase.execute(
      tenantSlug,
      agentKey,
    );

    return buildTenantAiSuggestionEnvelope({
      tenantSlug,
      agentKey,
      expectedAgentKey: ECOMMERCE_LAUNCH_ASSISTANT_AGENT_KEY,
      generatedAt: workspace.generatedAt,
      sourceGeneratedAt: workspace.generatedAt,
      mode: 'suggestion',
      contextBlocks: this.buildContextBlocks(workspace, retrieval.records),
      ...(retrieval.recordCount > 0 ? { retrieval } : {}),
    });
  }

  private buildContextBlocks(
    workspace: TenantEcommerceLaunchWorkspaceView,
    retrievedMemoryRecords: Awaited<
      ReturnType<GetTenantAiMemoryRetrievalUseCase['execute']>
    >['records'],
  ): AiSuggestionContextBlock[] {
    return finalizeAiSuggestionContextBlocks([
      {
        key: 'launch_summary',
        title: 'Launch summary',
        detail: `${workspace.summary.headline} ${workspace.summary.detail}`,
        bullets: [
          `Launch readiness: ${workspace.summary.launchReadiness}`,
          `Product enabled: ${workspace.moduleSnapshot.productEnabled}`,
          `Active module count: ${workspace.moduleSnapshot.activeModuleCount}`,
          `Inactive module keys: ${
            workspace.moduleSnapshot.inactiveModuleKeys.join(', ') || 'none'
          }`,
          `Suggested focus: ${workspace.summary.suggestedFocus}`,
        ],
      },
      {
        key: 'module_posture',
        title: 'Module posture',
        detail:
          'These are the deterministic ecommerce modules the assistant can rely on while shaping a launch brief.',
        bullets: workspace.checklist.map(
          (entry) =>
            `${entry.label}: status=${entry.status}; core=${entry.isCore}; ${entry.detail}`,
        ),
      },
      {
        key: 'launch_lanes',
        title: 'Launch lanes',
        detail:
          'This tells the assistant how far it can go across catalog, landing, campaign, and operational handoff without inventing structure.',
        bullets: workspace.channelGuidance.map(
          (entry) =>
            `${entry.title}: status=${entry.status}; use=${entry.recommendedUse}`,
        ),
      },
      {
        key: 'launch_hints',
        title: 'Launch hints',
        detail:
          'These deterministic hints shape the first ecommerce launch brief and keep it narrow.',
        bullets: workspace.launchHints.map(
          (entry) =>
            `${entry.title}: objective=${entry.objective}; caution=${entry.caution}`,
        ),
      },
      {
        key: 'safety_boundaries',
        title: 'Safety boundaries',
        detail:
          'These actions stay blocked even if the assistant can already help with launch structure and messaging.',
        bullets: workspace.blockedActions,
      },
      ...buildAiRetrievedMemoryContextBlocks(retrievedMemoryRecords),
    ]);
  }
}
