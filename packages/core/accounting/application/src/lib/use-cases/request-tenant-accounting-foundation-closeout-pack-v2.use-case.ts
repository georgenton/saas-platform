import {
  AccountingReadinessStatus,
  TenantAccountingFoundationCloseoutPackV2View,
} from '@saas-platform/accounting-domain';
import { GetTenantAccountingFoundationCloseoutSummaryUseCase } from './get-tenant-accounting-foundation-closeout-summary.use-case';
import { GetTenantAccountingOperationalCommandCenterUseCase } from './get-tenant-accounting-operational-command-center.use-case';

export class RequestTenantAccountingFoundationCloseoutPackV2UseCase {
  constructor(
    private readonly getTenantAccountingFoundationCloseoutSummaryUseCase: GetTenantAccountingFoundationCloseoutSummaryUseCase,
    private readonly getTenantAccountingOperationalCommandCenterUseCase: GetTenantAccountingOperationalCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingFoundationCloseoutPackV2View> {
    const [foundationSummary, commandCenter] = await Promise.all([
      this.getTenantAccountingFoundationCloseoutSummaryUseCase.execute(input),
      this.getTenantAccountingOperationalCommandCenterUseCase.execute(input),
    ]);
    const completedCapabilities = [
      capability(
        'opening_balances',
        'Opening balances',
        commandCenter.openingBalance.registryStatus,
        ['opening_balance_control_registry', 'opening_balance_journal_entry'],
      ),
      capability(
        'bank_controls',
        'Bank controls',
        commandCenter.bankReconciliation.reconciliationStatus,
        ['bank_account_registry', 'bank_statement_import_profiles'],
      ),
      capability(
        'financial_preview',
        'Financial preview',
        commandCenter.financialPreview.previewStatus,
        ['trial_balance', 'financial_statement_preview'],
      ),
      capability(
        'professional_handoff',
        'Professional handoff',
        commandCenter.closeoutCertification.certificationStatus,
        ['accountant_review', 'closeout_certification'],
      ),
      capability(
        'foundation_capstone',
        'Foundation capstone',
        foundationSummary.summaryStatus,
        ['foundation_closeout_summary', 'legal_books_readiness'],
      ),
    ];
    const blockers = [...foundationSummary.blockers, ...commandCenter.blockers];
    const closeoutStatus =
      blockers.length > 0
        ? 'blocked'
        : foundationSummary.summaryStatus === 'foundation_complete' &&
            commandCenter.commandStatus === 'ready'
          ? 'foundation_complete'
          : 'needs_review';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      foundationSummary,
      commandCenter,
      completedCapabilities,
      productBoundary: {
        currentProduct: 'accounting_foundation',
        nextRecommendedProduct: 'tax_compliance_ec',
        advancedAccountingTriggers: foundationSummary.advancedAccountingBacklog,
      },
      summary: {
        capabilityCount: completedCapabilities.length,
        readyCapabilityCount: completedCapabilities.filter(
          (item) => item.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        advancedBacklogCount: foundationSummary.advancedAccountingBacklog.length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        closeoutStatus === 'foundation_complete'
          ? 'Usar Accounting Foundation como evidencia operativa para Tax Compliance EC.'
          : 'Resolver blockers operativos antes de declarar Foundation completo.',
      guardrails: [
        'Closeout pack 2.0 declara cierre operativo, no certificacion legal.',
        'No genera libros oficiales, no firma estados financieros y no reemplaza contador.',
        'Accounting Advanced debe abrirse solo ante demanda explicita de workflows ledger-grade.',
      ],
    };
  }
}

function capability(
  key: string,
  label: string,
  rawStatus: string,
  evidence: string[],
): TenantAccountingFoundationCloseoutPackV2View['completedCapabilities'][number] {
  return {
    key,
    label,
    status: statusFrom(rawStatus),
    evidence,
  };
}

function statusFrom(value: string): AccountingReadinessStatus {
  if (value.includes('blocked')) {
    return 'blocked';
  }

  if (
    value.includes('needs') ||
    value.includes('empty') ||
    value.includes('review')
  ) {
    return 'needs_review';
  }

  return 'ready';
}
