import { TenantAccountingAuditTrailWorkspaceView } from '@saas-platform/accounting-domain';

export interface AccountingAuditTrailWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  auditStatus: string;
  timeline: Array<{
    eventKey: string;
    eventType: string;
    source: string;
    status: string;
    actorEmail: string | null;
    occurredAt: string;
    summary: string;
    metadata: Record<string, string | number | boolean | null>;
  }>;
  summary: TenantAccountingAuditTrailWorkspaceView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingAuditTrailWorkspaceResponseDto(
  view: TenantAccountingAuditTrailWorkspaceView,
): AccountingAuditTrailWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    auditStatus: view.auditStatus,
    timeline: view.timeline.map((event) => ({
      ...event,
      occurredAt: event.occurredAt.toISOString(),
      metadata: { ...event.metadata },
    })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
