import { TenantAccountingPeriodLockReadinessView } from '@saas-platform/accounting-domain';

export interface AccountingPeriodLockReadinessResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  lockReadinessStatus: string;
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
    trialBalanceBalanced: boolean;
    closeoutReportStatus: string;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingPeriodLockReadinessResponseDto(
  view: TenantAccountingPeriodLockReadinessView,
): AccountingPeriodLockReadinessResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    lockReadinessStatus: view.lockReadinessStatus,
    checks: view.checks.map((check) => ({ ...check })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
