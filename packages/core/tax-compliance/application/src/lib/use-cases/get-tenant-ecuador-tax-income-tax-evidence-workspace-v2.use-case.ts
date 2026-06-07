import { EcuadorTaxIncomeTaxEvidenceWorkspaceV2View } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase } from './get-tenant-ecuador-tax-accounting-evidence-from-foundation.use-case';
import { GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase } from './get-tenant-ecuador-tax-annual-rollup-workspace.use-case';
import { GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-income-tax-evidence-workspace.use-case';

export class GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxAnnualRollupWorkspaceUseCase: GetTenantEcuadorTaxAnnualRollupWorkspaceUseCase,
    private readonly getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase: GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxIncomeTaxEvidenceWorkspaceV2View> {
    const [incomeTaxWorkspace, annualRollup, accountingEvidence] =
      await Promise.all([
        this.getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase.execute(input),
        this.getTenantEcuadorTaxAnnualRollupWorkspaceUseCase.execute(input),
        this.getTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase.execute(
          input,
        ),
      ]);
    const evidenceLines: EcuadorTaxIncomeTaxEvidenceWorkspaceV2View['evidenceLines'] =
      [
        {
          key: 'gross_revenue',
          label: 'Ingresos acumulados',
          status: incomeTaxWorkspace.readinessStatus,
          amountInCents: incomeTaxWorkspace.summary.grossRevenueInCents,
          source: 'period_income_tax',
          accountantReviewRequired: false,
          note: 'Ingresos desde ledger fiscal del periodo.',
        },
        {
          key: 'deductible_expense',
          label: 'Gastos deducibles preliminares',
          status: 'needs_review',
          amountInCents: incomeTaxWorkspace.summary.deductibleExpenseInCents,
          source: 'period_income_tax',
          accountantReviewRequired: true,
          note: 'Deducibilidad requiere criterio profesional.',
        },
        {
          key: 'annual_taxable_base',
          label: 'Base imponible anual estimada',
          status: annualRollup.readinessStatus,
          amountInCents:
            annualRollup.annualSummary.estimatedTaxableBaseInCents,
          source: 'annual_rollup',
          accountantReviewRequired: true,
          note: 'La renta debe revisarse con contexto anual y saldos previos.',
        },
        {
          key: 'accounting_foundation',
          label: 'Comparativo Accounting Foundation',
          status: accountingEvidence.readinessStatus,
          amountInCents: 0,
          source: 'accounting_foundation',
          accountantReviewRequired: true,
          note: 'Evidencia contable comparativa, no libro oficial.',
        },
      ];
    const blockers = [
      ...incomeTaxWorkspace.blockers,
      ...annualRollup.blockers,
      ...accountingEvidence.blockers,
    ];
    const readinessStatus =
      blockers.length > 0 ||
      incomeTaxWorkspace.readinessStatus === 'blocked' ||
      annualRollup.readinessStatus === 'blocked' ||
      accountingEvidence.readinessStatus === 'blocked'
        ? 'blocked'
        : evidenceLines.some((line) => line.status === 'needs_review')
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      incomeTaxWorkspace,
      annualRollup,
      accountingEvidence,
      evidenceLines,
      summary: {
        evidenceLineCount: evidenceLines.length,
        accountantReviewLineCount: evidenceLines.filter(
          (line) => line.accountantReviewRequired,
        ).length,
        grossRevenueInCents: incomeTaxWorkspace.summary.grossRevenueInCents,
        deductibleExpenseInCents:
          incomeTaxWorkspace.summary.deductibleExpenseInCents,
        estimatedTaxableBaseInCents:
          incomeTaxWorkspace.summary.estimatedTaxableBaseInCents,
        withholdingCreditInCents:
          incomeTaxWorkspace.summary.withholdingCreditInCents,
        annualBlockedPeriodCount:
          annualRollup.annualSummary.blockedPeriodCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de preparar renta.'
          : 'Enviar evidencia de renta 2.0 a revision contable/tributaria.',
      guardrails: [
        'Renta 2.0 prepara evidencia y preguntas, no calcula impuesto final.',
        'Conciliacion tributaria y deducibilidad requieren contador.',
      ],
    };
  }
}
