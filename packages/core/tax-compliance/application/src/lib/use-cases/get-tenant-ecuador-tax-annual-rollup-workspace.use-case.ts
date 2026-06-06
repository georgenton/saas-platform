import {
  EcuadorTaxAnnualRollupWorkspaceView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-income-tax-evidence-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase } from './request-tenant-ecuador-tax-period-closeout-certification.use-case';

export class GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase: RequestTenantEcuadorTaxPeriodCloseoutCertificationUseCase,
    private readonly getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAnnualRollupWorkspaceView> {
    const [currentCertification, incomeWorkspace] = await Promise.all([
      this.requestTenantEcuadorTaxPeriodCloseoutCertificationUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
      }),
    ]);
    const currentStatus = resolveStatus(currentCertification.certificationStatus);
    const monthlySnapshots = [
      {
        period: input.period,
        status: currentStatus,
        revenueInCents: incomeWorkspace.summary.grossRevenueInCents,
        deductibleExpenseInCents:
          incomeWorkspace.summary.deductibleExpenseInCents,
        withholdingCreditInCents:
          incomeWorkspace.summary.withholdingCreditInCents,
        blockerCount: currentCertification.blockers.length,
      },
    ];
    const blockers = [...currentCertification.blockers, ...incomeWorkspace.blockers];
    const readinessStatus = resolveReadiness(
      monthlySnapshots.map((snapshot) => snapshot.status),
      blockers,
    );
    const revenueInCents = monthlySnapshots.reduce(
      (total, snapshot) => total + snapshot.revenueInCents,
      0,
    );
    const deductibleExpenseInCents = monthlySnapshots.reduce(
      (total, snapshot) => total + snapshot.deductibleExpenseInCents,
      0,
    );
    const view: EcuadorTaxAnnualRollupWorkspaceView = {
      tenantSlug: input.tenantSlug,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      currentPeriod: input.period,
      currentCertification,
      monthlySnapshots,
      annualSummary: {
        revenueInCents,
        deductibleExpenseInCents,
        estimatedTaxableBaseInCents: Math.max(
          revenueInCents - deductibleExpenseInCents,
          0,
        ),
        withholdingCreditInCents: monthlySnapshots.reduce(
          (total, snapshot) => total + snapshot.withholdingCreditInCents,
          0,
        ),
        reviewedPeriodCount: monthlySnapshots.length,
        blockedPeriodCount: monthlySnapshots.filter(
          (snapshot) => snapshot.status === 'blocked',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver periodos bloqueados antes de usar rollup anual para renta.'
          : 'Usar rollup anual como base acumulada para revision de impuesto a la renta.',
      guardrails: [
        'Rollup anual operativo; no sustituye conciliacion contable anual.',
        'Cada periodo adicional debe incorporarse desde certificaciones cerradas.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_annual_rollup_workspace_reviewed',
        source: 'tax_annual_rollup_workspace',
        payload: { readinessStatus, annualSummary: view.annualSummary },
      });
    }

    return view;
  }
}

function resolveStatus(
  certificationStatus: string,
): EcuadorTaxReadinessStatus {
  if (certificationStatus === 'blocked') {
    return 'blocked';
  }

  return certificationStatus === 'externally_filed' ? 'ready' : 'needs_review';
}

function resolveReadiness(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
