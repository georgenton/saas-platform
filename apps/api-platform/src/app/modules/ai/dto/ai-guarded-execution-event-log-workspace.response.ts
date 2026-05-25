export type AiGuardedExecutionEventLogEntryTypeResponseDto =
  | 'suggestion_run_prepared'
  | 'approval_requested'
  | 'approval_reviewed'
  | 'guarded_execution_executed'
  | 'guarded_execution_rolled_back'
  | 'guarded_execution_pilot_only'
  | 'guarded_execution_lane_ready';

export interface AiGuardedExecutionEventLogEntryResponseDto {
  id: string;
  tenantSlug: string;
  agentKey: string;
  eventType: AiGuardedExecutionEventLogEntryTypeResponseDto;
  occurredAt: string;
  suggestionRunId: string | null;
  approvalRequestId: string | null;
  candidateToolKey: string | null;
  summary: string;
  detail: string;
}

export interface AiGuardedExecutionEventLogWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  counts: {
    totalEvents: number;
    suggestionRunPreparedEvents: number;
    approvalRequestedEvents: number;
    approvalReviewedEvents: number;
    executedEvents: number;
    rolledBackEvents: number;
    guardedExecutionStatusEvents: number;
  };
  entries: AiGuardedExecutionEventLogEntryResponseDto[];
}

export function toAiGuardedExecutionEventLogWorkspaceResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  counts: {
    totalEvents: number;
    suggestionRunPreparedEvents: number;
    approvalRequestedEvents: number;
    approvalReviewedEvents: number;
    executedEvents: number;
    rolledBackEvents: number;
    guardedExecutionStatusEvents: number;
  };
  entries: Array<{
    id: string;
    tenantSlug: string;
    agentKey: string;
    eventType: AiGuardedExecutionEventLogEntryTypeResponseDto;
    occurredAt: Date;
    suggestionRunId: string | null;
    approvalRequestId: string | null;
    candidateToolKey: string | null;
    summary: string;
    detail: string;
  }>;
}): AiGuardedExecutionEventLogWorkspaceResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    counts: input.counts,
    entries: input.entries.map((entry) => ({
      ...entry,
      occurredAt: entry.occurredAt.toISOString(),
    })),
  };
}
