import {
  AiSuggestionContextBlock,
  TenantAiSuggestionEnvelope,
} from '@saas-platform/ai-domain';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import {
  findAiAgentByKey,
  findAiPromptRegistryEntryByAgentKey,
  listAiAgentToolAccessByAgentKey,
} from '../support/ai-agent-catalog';
import { GetTenantAiMemoryRetrievalUseCase } from './get-tenant-ai-memory-retrieval.use-case';
import {
  GetTenantEcommerceLaunchWorkspaceUseCase,
  TenantEcommerceLaunchWorkspaceView,
} from './get-tenant-ecommerce-launch-workspace.use-case';

const ECOMMERCE_LAUNCH_ASSISTANT_AGENT_KEY = 'ecommerce-launch-assistant';
const ECOMMERCE_LAUNCH_SURFACE_KEY = 'ecommerce_launch_workspace';

export class GetTenantEcommerceLaunchAssistantAiSuggestionEnvelopeUseCase {
  constructor(
    private readonly getTenantEcommerceLaunchWorkspaceUseCase: GetTenantEcommerceLaunchWorkspaceUseCase,
    private readonly getTenantAiMemoryRetrievalUseCase: GetTenantAiMemoryRetrievalUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    agentKey = ECOMMERCE_LAUNCH_ASSISTANT_AGENT_KEY,
  ): Promise<TenantAiSuggestionEnvelope> {
    const agent = findAiAgentByKey(agentKey);

    if (!agent || agent.key !== ECOMMERCE_LAUNCH_ASSISTANT_AGENT_KEY) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const promptPack = findAiPromptRegistryEntryByAgentKey(agentKey);

    if (!promptPack) {
      throw new AiAgentNotFoundError(agentKey);
    }

    const workspace =
      await this.getTenantEcommerceLaunchWorkspaceUseCase.execute(tenantSlug);
    const retrieval = await this.getTenantAiMemoryRetrievalUseCase.execute(
      tenantSlug,
      agentKey,
    );

    return {
      tenantSlug,
      generatedAt: workspace.generatedAt,
      mode: 'suggestion',
      agent: {
        ...agent,
        supportedSurfaceKeys: [...agent.supportedSurfaceKeys],
      },
      surface: {
        key: ECOMMERCE_LAUNCH_SURFACE_KEY,
        title: 'Ecommerce launch workspace',
        sourceContractKey: 'ecommerce.launch.workspace',
        sourceGeneratedAt: workspace.generatedAt,
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
      contextBlocks: this.buildContextBlocks(workspace, retrieval.records),
      ...(retrieval.recordCount > 0 ? { retrieval } : {}),
    };
  }

  private buildContextBlocks(
    workspace: TenantEcommerceLaunchWorkspaceView,
    retrievedMemoryRecords: Awaited<
      ReturnType<GetTenantAiMemoryRetrievalUseCase['execute']>
    >['records'],
  ): AiSuggestionContextBlock[] {
    return [
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
      ...retrievedMemoryRecords.map((entry) => ({
        key: `memory_${entry.id}`,
        title: `Memory: ${entry.title}`,
        detail: entry.summary,
        bullets: [
          entry.detail,
          `Scope: ${entry.scope}`,
          `Source: ${entry.sourceKind}`,
          `Freshness: ${entry.freshness}`,
          `Why included: ${entry.inclusionReason}`,
        ],
      })),
    ].map((block) => ({
      ...block,
      bullets:
        block.bullets.length > 0
          ? block.bullets
          : ['No deterministic signals were available for this block yet.'],
    }));
  }
}
