import { AiToolDefinition } from '@saas-platform/ai-domain';
import { AiAgentToolAccessView } from '@saas-platform/ai-application';

export interface AiToolRegistryResponseDto {
  key: string;
  title: string;
  summary: string;
  domainKey: 'growth' | 'invoicing' | 'ecommerce';
  availability: 'ready' | 'planned';
  riskLevel: 'low' | 'medium' | 'high';
  actionKind: 'read' | 'draft' | 'propose' | 'execute';
  requiresApproval: boolean;
}

export interface AiAgentToolAccessResponseDto {
  tool: AiToolRegistryResponseDto;
  accessLevel: 'allowed' | 'approval_required' | 'blocked';
  rationale: string;
}

export const toAiToolRegistryResponseDto = (
  entry: AiToolDefinition,
): AiToolRegistryResponseDto => ({
  ...entry,
});

export const toAiAgentToolAccessResponseDto = (
  entry: AiAgentToolAccessView,
): AiAgentToolAccessResponseDto => ({
  tool: toAiToolRegistryResponseDto(entry.tool),
  accessLevel: entry.accessLevel,
  rationale: entry.rationale,
});
