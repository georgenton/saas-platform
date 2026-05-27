import { TenantAiSuggestionEnvelope } from '@saas-platform/ai-domain';
import { AiAgentNotFoundError } from '../errors/ai-agent-not-found.error';
import {
  findAiAgentByKey,
  findAiPromptRegistryEntryByAgentKey,
  getAiAgentPrimarySurfaceDescriptor,
  listAiAgentToolAccessByAgentKey,
} from './ai-agent-catalog';

type BuildTenantAiSuggestionEnvelopeParams = Pick<
  TenantAiSuggestionEnvelope,
  'tenantSlug' | 'generatedAt' | 'mode' | 'contextBlocks'
> & {
  agentKey: string;
  expectedAgentKey: string;
  sourceGeneratedAt: Date;
  retrieval?: TenantAiSuggestionEnvelope['retrieval'];
};

function clonePromptPack(
  promptPack: NonNullable<TenantAiSuggestionEnvelope['promptPack']>,
): TenantAiSuggestionEnvelope['promptPack'] {
  return {
    ...promptPack,
    styleGuidance: [...promptPack.styleGuidance],
    constraints: [...promptPack.constraints],
    suggestedOutputs: promptPack.suggestedOutputs.map((entry) => ({ ...entry })),
  };
}

export function buildTenantAiSuggestionEnvelope(
  params: BuildTenantAiSuggestionEnvelopeParams,
): TenantAiSuggestionEnvelope {
  const agent = findAiAgentByKey(params.agentKey);

  if (!agent || agent.key !== params.expectedAgentKey) {
    throw new AiAgentNotFoundError(params.agentKey);
  }

  const promptPack = findAiPromptRegistryEntryByAgentKey(params.agentKey);

  if (!promptPack) {
    throw new AiAgentNotFoundError(params.agentKey);
  }

  const surface = getAiAgentPrimarySurfaceDescriptor(params.agentKey);

  return {
    tenantSlug: params.tenantSlug,
    generatedAt: params.generatedAt,
    mode: params.mode,
    agent: {
      ...agent,
      supportedSurfaceKeys: [...agent.supportedSurfaceKeys],
    },
    surface: {
      ...surface,
      sourceGeneratedAt: params.sourceGeneratedAt,
    },
    promptPack: clonePromptPack(promptPack),
    toolAccess: listAiAgentToolAccessByAgentKey(params.agentKey).map((entry) => ({
      tool: entry.tool,
      accessLevel: entry.accessLevel,
      rationale: entry.rationale,
    })),
    contextBlocks: params.contextBlocks,
    ...(params.retrieval ? { retrieval: params.retrieval } : {}),
  };
}
