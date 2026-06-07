import { EcuadorTaxAccountingEvidenceFromFoundationView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxCommandCenterUseCase } from './get-tenant-ecuador-tax-command-center.use-case';
import { RequestTenantEcuadorTaxAccountingReadinessPacketUseCase } from './request-tenant-ecuador-tax-accounting-readiness-packet.use-case';
import { RequestTenantEcuadorTaxPeriodCloseoutReportUseCase } from './request-tenant-ecuador-tax-period-closeout-report.use-case';

export class GetTenantEcuadorTaxAccountingEvidenceFromFoundationUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxAccountingReadinessPacketUseCase: RequestTenantEcuadorTaxAccountingReadinessPacketUseCase,
    private readonly requestTenantEcuadorTaxPeriodCloseoutReportUseCase: RequestTenantEcuadorTaxPeriodCloseoutReportUseCase,
    private readonly getTenantEcuadorTaxCommandCenterUseCase: GetTenantEcuadorTaxCommandCenterUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountingEvidenceFromFoundationView> {
    const [accountingReadiness, closeoutReport, commandCenter] =
      await Promise.all([
        this.requestTenantEcuadorTaxAccountingReadinessPacketUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.requestTenantEcuadorTaxPeriodCloseoutReportUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxCommandCenterUseCase.execute({
          ...input,
          recordEvent: false,
        }),
      ]);
    const evidenceSources: EcuadorTaxAccountingEvidenceFromFoundationView['evidenceSources'] =
      [
        {
          key: 'accounting_readiness',
          label: 'Accounting readiness packet',
          status: accountingReadiness.readinessStatus,
          source: 'tax_accounting_readiness',
          detail: `${accountingReadiness.summary.accountingMappedHints}/${accountingReadiness.summary.accountingMappedHints + accountingReadiness.summary.accountingUnmappedHints} hints mapeados.`,
        },
        {
          key: 'closeout_report',
          label: 'Tax closeout accounting section',
          status: closeoutReport.readinessStatus,
          source: 'tax_closeout_report',
          detail: `${closeoutReport.totals.accountingPreviewEntries} preview entries y ${closeoutReport.totals.accountingMappedHints} mapped hints.`,
        },
        {
          key: 'command_center',
          label: 'Tax command center',
          status:
            commandCenter.commandStatus === 'blocked'
              ? 'blocked'
              : commandCenter.commandStatus === 'ready' ||
                  commandCenter.commandStatus === 'externally_filed'
                ? 'ready'
                : 'needs_review',
          source: 'tax_command_center',
          detail: `${commandCenter.summary.readyTileCount}/${commandCenter.summary.tileCount} tiles listos.`,
        },
      ];
    const blockers = [
      ...accountingReadiness.blockers,
      ...closeoutReport.blockers,
      ...commandCenter.blockers,
    ];
    const readinessStatus =
      blockers.length > 0 || evidenceSources.some((source) => source.status === 'blocked')
        ? 'blocked'
        : evidenceSources.some((source) => source.status === 'needs_review')
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      evidenceSources,
      summary: {
        sourceCount: evidenceSources.length,
        readySourceCount: evidenceSources.filter(
          (source) => source.status === 'ready',
        ).length,
        needsReviewSourceCount: evidenceSources.filter(
          (source) => source.status === 'needs_review',
        ).length,
        blockedSourceCount: evidenceSources.filter(
          (source) => source.status === 'blocked',
        ).length,
        accountingMappedHints: accountingReadiness.summary.accountingMappedHints,
        accountingUnmappedHints:
          accountingReadiness.summary.accountingUnmappedHints,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready'
          ? 'Usar evidencia Accounting Foundation como comparativo tributario.'
          : 'Resolver gaps contables/tributarios antes del review de declaracion.',
      guardrails: [
        'Evidencia contable en Tax Compliance es comparativa, no ledger oficial.',
        'No presenta formularios ni reemplaza criterio del contador.',
      ],
    };
  }
}
