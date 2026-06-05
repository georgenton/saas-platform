import { TenantAccountingChartOfAccountsWorkspaceView } from '@saas-platform/accounting-domain';

export interface AccountingChartOfAccountsWorkspaceResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  accounts: Array<{
    accountKey: string;
    code: string;
    name: string;
    category: string;
    source: string;
    mappedAccountHint: string | null;
    status: string;
    appliesToEntryKeys: string[];
    notes: string[];
  }>;
  summary: {
    accountCount: number;
    mappedAccountCount: number;
    suggestedAccountCount: number;
    needsMappingCount: number;
    sourceHintCount: number;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingChartOfAccountsWorkspaceResponseDto(
  view: TenantAccountingChartOfAccountsWorkspaceView,
): AccountingChartOfAccountsWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    accounts: view.accounts.map((account) => ({
      ...account,
      appliesToEntryKeys: [...account.appliesToEntryKeys],
      notes: [...account.notes],
    })),
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
