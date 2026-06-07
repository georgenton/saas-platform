import { EcuadorTaxComplianceProductCloseoutV3View } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxOperatingDashboardV3UseCase } from './get-tenant-ecuador-tax-operating-dashboard-v3.use-case';

export class RequestTenantEcuadorTaxComplianceProductCloseoutV3UseCase {
  constructor(
    private readonly getTenantEcuadorTaxOperatingDashboardV3UseCase: GetTenantEcuadorTaxOperatingDashboardV3UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxComplianceProductCloseoutV3View> {
    const dashboard =
      await this.getTenantEcuadorTaxOperatingDashboardV3UseCase.execute(input);
    const closeoutChecklist: EcuadorTaxComplianceProductCloseoutV3View['closeoutChecklist'] =
      dashboard.dashboardTiles.map((tile) => ({
        key: tile.key,
        label: tile.label,
        status: tile.status,
        evidence: [tile.key],
      }));
    const blockers = [
      ...dashboard.blockers,
      ...closeoutChecklist
        .filter((item) => item.status === 'blocked')
        .map((item) => item.key),
    ];
    const closeoutStatus =
      blockers.length > 0
        ? 'blocked'
        : closeoutChecklist.some((item) => item.status === 'needs_review')
          ? 'needs_hardening'
          : 'mvp_operable';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      dashboard,
      closeoutChecklist,
      summary: {
        checklistCount: closeoutChecklist.length,
        readyChecklistCount: closeoutChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        operatingSurfaceCount: 6,
        qualityScore: dashboard.summary.qualityScore,
      },
      recommendedNextProduct:
        closeoutStatus === 'blocked'
          ? 'accounting_advanced_discovery'
          : closeoutStatus === 'needs_hardening'
            ? 'parties_2_0'
            : 'tax_compliance_hardening',
      blockers: [...new Set(blockers)],
      nextStep:
        closeoutStatus === 'mvp_operable'
          ? 'Tax Compliance EC esta operable; continuar hardening o decidir siguiente producto.'
          : 'Cerrar readiness operativo antes de declarar producto completo.',
      guardrails: [
        'Product closeout 3.0 es cierre de producto, no declaracion oficial.',
        'Accounting Advanced y Parties 2.0 siguen siendo decisiones posteriores segun riesgo real.',
      ],
    };
  }
}
