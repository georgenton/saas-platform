import { TenantAccountingPeriodCloseoutReadinessView } from '@saas-platform/accounting-domain';

export interface AccountingPeriodCloseoutReadinessResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  checks: Array<{
    key: string;
    label: string;
    status: string;
    detail: string;
    blockerCount: number;
  }>;
  summary: {
    checkCount: number;
    readyCheckCount: number;
    needsReviewCheckCount: number;
    blockedCheckCount: number;
    journalEntryCount: number;
    ledgerBalanced: boolean;
    taxCloseoutStatus: string | null;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingPeriodCloseoutReadinessResponseDto(
  view: TenantAccountingPeriodCloseoutReadinessView,
): AccountingPeriodCloseoutReadinessResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    checks: view.checks.map((check) => ({ ...check })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
