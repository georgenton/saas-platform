import { TenantAccountingChartMappingManagementView } from '@saas-platform/accounting-domain';
import {
  AccountingChartOfAccountsWorkspaceResponseDto,
  toAccountingChartOfAccountsWorkspaceResponseDto,
} from './accounting-chart-of-accounts-workspace.response';

export interface ManageAccountingChartMappingRequestDto {
  period: string;
  year: number;
  mappings: Array<{
    accountHint: string;
    suggestedAccountCode?: string | null;
    suggestedAccountName?: string | null;
  }>;
  updatedByUserId?: string | null;
  updatedByEmail?: string | null;
}

export interface AccountingChartMappingManagementResponseDto {
  tenantSlug: string;
  period: string;
  year: number;
  generatedAt: string;
  readinessStatus: string;
  mappingStatus: string;
  updatedMappingCount: number;
  chartWorkspace: AccountingChartOfAccountsWorkspaceResponseDto;
  blockers: string[];
  nextStep: string;
  guardrails: string[];
}

export function toAccountingChartMappingManagementResponseDto(
  view: TenantAccountingChartMappingManagementView,
): AccountingChartMappingManagementResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    period: view.period,
    year: view.year,
    generatedAt: view.generatedAt.toISOString(),
    readinessStatus: view.readinessStatus,
    mappingStatus: view.mappingStatus,
    updatedMappingCount: view.updatedMappingCount,
    chartWorkspace: toAccountingChartOfAccountsWorkspaceResponseDto(
      view.chartWorkspace,
    ),
    blockers: [...view.blockers],
    nextStep: view.nextStep,
    guardrails: [...view.guardrails],
  };
}
