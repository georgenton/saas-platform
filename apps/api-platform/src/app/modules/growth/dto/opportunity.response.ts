import { Opportunity } from '@saas-platform/growth-domain';

export interface OpportunityResponseDto {
  id: string;
  tenantId: string;
  leadId: string | null;
  threadId: string | null;
  assigneeUserId: string | null;
  title: string;
  stage: string;
  amountInCents: number | null;
  currency: string | null;
  notes: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toOpportunityResponseDto = (
  opportunity: Opportunity,
): OpportunityResponseDto => {
  const data = opportunity.toPrimitives();

  return {
    id: data.id,
    tenantId: data.tenantId,
    leadId: data.leadId ?? null,
    threadId: data.threadId ?? null,
    assigneeUserId: data.assigneeUserId ?? null,
    title: data.title,
    stage: data.stage,
    amountInCents: data.amountInCents ?? null,
    currency: data.currency ?? null,
    notes: data.notes ?? null,
    closedAt: data.closedAt?.toISOString() ?? null,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
};
