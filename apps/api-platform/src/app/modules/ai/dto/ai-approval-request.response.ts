import { AiApprovalRequestRecord } from '@saas-platform/ai-domain';

export interface AiApprovalRequestResponseDto {
  id: string;
  tenantSlug: string;
  agentKey: string;
  policyKey: string;
  scope: 'suggestion_review';
  suggestionRunId: string;
  requestedByUserId: string;
  requestedByEmail: string | null;
  rationale: string | null;
  summary: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  reviewedByEmail: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toAiApprovalRequestResponseDto = (
  record: AiApprovalRequestRecord,
): AiApprovalRequestResponseDto => ({
  id: record.id,
  tenantSlug: record.tenantSlug,
  agentKey: record.agentKey,
  policyKey: record.policyKey,
  scope: record.scope,
  suggestionRunId: record.suggestionRunId,
  requestedByUserId: record.requestedByUserId,
  requestedByEmail: record.requestedByEmail,
  rationale: record.rationale,
  summary: record.summary,
  status: record.status,
  reviewedAt: record.reviewedAt?.toISOString() ?? null,
  reviewedByUserId: record.reviewedByUserId,
  reviewedByEmail: record.reviewedByEmail,
  reviewNote: record.reviewNote,
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString(),
});
