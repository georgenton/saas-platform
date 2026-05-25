export type AiActivityEventTypeResponseDto =
  | 'suggestion_run_prepared'
  | 'approval_requested'
  | 'approval_reviewed';

export interface AiActivityFeedEntryResponseDto {
  id: string;
  tenantSlug: string;
  agentKey: string;
  eventType: AiActivityEventTypeResponseDto;
  occurredAt: string;
  suggestionRunId: string;
  approvalRequestId: string | null;
  actorUserId: string | null;
  actorEmail: string | null;
  summary: string;
  detail: string;
}

export interface AiActivityFeedResponseDto {
  tenantSlug: string;
  generatedAt: string;
  entries: AiActivityFeedEntryResponseDto[];
}

export function toAiActivityFeedResponseDto(input: {
  tenantSlug: string;
  generatedAt: Date;
  entries: Array<{
    id: string;
    tenantSlug: string;
    agentKey: string;
    eventType: AiActivityEventTypeResponseDto;
    occurredAt: Date;
    suggestionRunId: string;
    approvalRequestId: string | null;
    actorUserId: string | null;
    actorEmail: string | null;
    summary: string;
    detail: string;
  }>;
}): AiActivityFeedResponseDto {
  return {
    tenantSlug: input.tenantSlug,
    generatedAt: input.generatedAt.toISOString(),
    entries: input.entries.map((entry) => ({
      ...entry,
      occurredAt: entry.occurredAt.toISOString(),
    })),
  };
}
