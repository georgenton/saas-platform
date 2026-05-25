import { GrowthOperationalCaseRecord } from '@saas-platform/growth-application';
import {
  GrowthOperationalCaseResponseDto,
  toGrowthOperationalCaseResponseDto,
} from '../../growth/dto/growth-operational-case.response';

export interface AiGuardedExecutionRollbackExecutionResponseDto {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  rolledBackAt: string;
  safeFallbackMode: 'suggestion_only';
  summary: string;
  detail: string;
  operationalCase: GrowthOperationalCaseResponseDto;
}

export function toAiGuardedExecutionRollbackExecutionResponseDto(input: {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  rolledBackAt: Date;
  summary: string;
  detail: string;
  operationalCase: GrowthOperationalCaseRecord;
}): AiGuardedExecutionRollbackExecutionResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    agentKey: input.agentKey,
    approvalRequestId: input.approvalRequestId,
    suggestionRunId: input.suggestionRunId,
    toolKey: input.toolKey,
    rolledBackAt: input.rolledBackAt.toISOString(),
    safeFallbackMode: 'suggestion_only',
    summary: input.summary,
    detail: input.detail,
    operationalCase: toGrowthOperationalCaseResponseDto(input.operationalCase),
  };
}
