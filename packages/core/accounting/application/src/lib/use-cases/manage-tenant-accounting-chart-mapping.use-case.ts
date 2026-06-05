import { TenantAccountingChartMappingManagementView } from '@saas-platform/accounting-domain';
import { UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase } from '@saas-platform/tax-compliance-application';
import { GetTenantAccountingChartOfAccountsWorkspaceUseCase } from './get-tenant-accounting-chart-of-accounts-workspace.use-case';

export class ManageTenantAccountingChartMappingUseCase {
  constructor(
    private readonly upsertTenantEcuadorTaxAccountingBridgeMappingUseCase: UpsertTenantEcuadorTaxAccountingBridgeMappingUseCase,
    private readonly getTenantAccountingChartOfAccountsWorkspaceUseCase: GetTenantAccountingChartOfAccountsWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    mappings: Array<{
      accountHint: string;
      suggestedAccountCode?: string | null;
      suggestedAccountName?: string | null;
    }>;
    updatedByUserId?: string | null;
    updatedByEmail?: string | null;
  }): Promise<TenantAccountingChartMappingManagementView> {
    await this.upsertTenantEcuadorTaxAccountingBridgeMappingUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      mappings: input.mappings,
      updatedByUserId: input.updatedByUserId ?? null,
      updatedByEmail: input.updatedByEmail ?? null,
    });

    const chartWorkspace =
      await this.getTenantAccountingChartOfAccountsWorkspaceUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
      });
    const mappingStatus =
      chartWorkspace.blockers.length > 0
        ? 'blocked'
        : chartWorkspace.summary.needsMappingCount > 0
          ? 'needs_mapping'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus: chartWorkspace.readinessStatus,
      mappingStatus,
      updatedMappingCount: input.mappings.length,
      chartWorkspace,
      blockers: [...chartWorkspace.blockers],
      nextStep:
        mappingStatus === 'ready'
          ? 'Revisar y aprobar borradores contables del periodo.'
          : 'Completar mappings contables pendientes antes de aprobar borradores.',
      guardrails: [
        'Gestiona mappings foundation; no crea catalogo contable oficial.',
        'Los mappings deben ser validados por un contador antes de posteo formal.',
        'No modifica declaraciones tributarias ni libros contables.',
      ],
    };
  }
}
