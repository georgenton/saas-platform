import { TenantAccountingOpeningBalanceWorkspaceView } from '@saas-platform/accounting-domain';

export interface AccountingOpeningBalanceWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  openingBalanceStatus: string;
  previousPeriod: string;
  balanceLines: TenantAccountingOpeningBalanceWorkspaceView['balanceLines'];
  suggestedAdjustment: TenantAccountingOpeningBalanceWorkspaceView['suggestedAdjustment'];
  summary: TenantAccountingOpeningBalanceWorkspaceView['summary'];
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingOpeningBalanceWorkspaceResponseDto(
  view: TenantAccountingOpeningBalanceWorkspaceView,
): AccountingOpeningBalanceWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    openingBalanceStatus: view.openingBalanceStatus,
    previousPeriod: view.previousPeriod,
    balanceLines: view.balanceLines.map((line) => ({
      ...line,
      sourceJournalEntryIds: [...line.sourceJournalEntryIds],
      notes: [...line.notes],
    })),
    suggestedAdjustment: view.suggestedAdjustment
      ? {
          ...view.suggestedAdjustment,
          lines: view.suggestedAdjustment.lines.map((line) => ({
            ...line,
            notes: [...line.notes],
          })),
          totals: { ...view.suggestedAdjustment.totals },
        }
      : null,
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
