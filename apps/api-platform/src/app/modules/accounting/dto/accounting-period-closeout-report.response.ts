import { TenantAccountingPeriodCloseoutReportView } from '@saas-platform/accounting-domain';

export interface AccountingPeriodCloseoutReportResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  reportStatus: string;
  sections: Array<{
    key: string;
    title: string;
    status: string;
    metrics: Array<{
      key: string;
      label: string;
      value: string | number | boolean | null;
    }>;
    notes: string[];
  }>;
  summary: {
    sectionCount: number;
    readySectionCount: number;
    needsReviewSectionCount: number;
    blockedSectionCount: number;
    journalEntryCount: number;
    trialBalanceAccountCount: number;
    netIncomeInCents: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingPeriodCloseoutReportResponseDto(
  view: TenantAccountingPeriodCloseoutReportView,
): AccountingPeriodCloseoutReportResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    reportStatus: view.reportStatus,
    sections: view.sections.map((section) => ({
      ...section,
      metrics: section.metrics.map((metric) => ({ ...metric })),
      notes: [...section.notes],
    })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
