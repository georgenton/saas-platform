import { TenantAccountingFinancialStatementPreviewView } from '@saas-platform/accounting-domain';

export interface AccountingFinancialStatementPreviewResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  previewStatus: string;
  incomeStatement: {
    revenueInCents: number;
    expenseInCents: number;
    taxExpenseInCents: number;
    netIncomeInCents: number;
    sections: Array<{
      key: string;
      label: string;
      amountInCents: number;
      accountCodes: string[];
    }>;
  };
  balanceSheet: {
    assetsInCents: number;
    liabilitiesInCents: number;
    equityInCents: number;
    retainedEarningsPreviewInCents: number;
    balanced: boolean;
    sections: Array<{
      key: string;
      label: string;
      amountInCents: number;
      accountCodes: string[];
    }>;
  };
  summary: {
    trialBalanceAccountCount: number;
    journalEntryCount: number;
    netIncomeInCents: number;
    balanceSheetBalanced: boolean;
  };
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingFinancialStatementPreviewResponseDto(
  view: TenantAccountingFinancialStatementPreviewView,
): AccountingFinancialStatementPreviewResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    previewStatus: view.previewStatus,
    incomeStatement: {
      ...view.incomeStatement,
      sections: view.incomeStatement.sections.map((section) => ({
        ...section,
        accountCodes: [...section.accountCodes],
      })),
    },
    balanceSheet: {
      ...view.balanceSheet,
      sections: view.balanceSheet.sections.map((section) => ({
        ...section,
        accountCodes: [...section.accountCodes],
      })),
    },
    summary: { ...view.summary },
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
