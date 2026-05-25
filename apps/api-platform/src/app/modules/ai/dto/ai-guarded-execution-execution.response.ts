import { GrowthOperationalCaseRecord } from '@saas-platform/growth-application';
import {
  GrowthOperationalCaseResponseDto,
  toGrowthOperationalCaseResponseDto,
} from '../../growth/dto/growth-operational-case.response';

export interface AiGuardedExecutionExecutionResponseDto {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  executedAt: string;
  summary: string;
  detail: string;
  operationalCase: GrowthOperationalCaseResponseDto;
}

export function toAiGuardedExecutionExecutionResponseDto(input: {
  tenantSlug: string;
  agentKey: string;
  approvalRequestId: string;
  suggestionRunId: string;
  toolKey: string;
  executedAt: Date;
  summary: string;
  detail: string;
  operationalCase: GrowthOperationalCaseRecord;
}): AiGuardedExecutionExecutionResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    agentKey: input.agentKey,
    approvalRequestId: input.approvalRequestId,
    suggestionRunId: input.suggestionRunId,
    toolKey: input.toolKey,
    executedAt: input.executedAt.toISOString(),
    summary: input.summary,
    detail: input.detail,
    operationalCase: toGrowthOperationalCaseResponseDto(input.operationalCase),
  };
}
