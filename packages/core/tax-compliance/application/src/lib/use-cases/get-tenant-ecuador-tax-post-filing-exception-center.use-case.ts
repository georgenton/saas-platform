import {
  EcuadorTaxPostFilingExceptionCenterView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPaymentObligationTrackerUseCase } from './get-tenant-ecuador-tax-payment-obligation-tracker.use-case';
import { GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase } from './get-tenant-ecuador-tax-sri-filing-receipt-evidence-vault.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxPostFilingExceptionCenterUseCase {
  constructor(
    private readonly getTenantEcuadorTaxPaymentObligationTrackerUseCase: GetTenantEcuadorTaxPaymentObligationTrackerUseCase,
    private readonly getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase: GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPostFilingExceptionCenterView> {
    const [paymentTracker, receiptVault] = await Promise.all([
      this.getTenantEcuadorTaxPaymentObligationTrackerUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const exceptions: EcuadorTaxPostFilingExceptionCenterView['exceptions'] = [
      ...paymentTracker.paymentRows
        .filter(
          (row) =>
            row.paymentStatus === 'pending' || row.paymentStatus === 'partial',
        )
        .map((row) => ({
          key: `payment.${row.key}`,
          label: `${row.obligationKey} con pago pendiente`,
          status: 'needs_review' as const,
          severity: 'high' as const,
          owner: 'operator' as const,
          source: 'payment' as const,
          recommendedAction: row.nextAction,
        })),
      ...paymentTracker.paymentRows
        .filter((row) => row.paymentStatus === 'rejected')
        .map((row) => ({
          key: `filing.${row.key}.rejected`,
          label: `${row.obligationKey} rechazado externamente`,
          status: 'blocked' as const,
          severity: 'critical' as const,
          owner: 'accountant' as const,
          source: 'filing_result' as const,
          recommendedAction:
            'Resolver rechazo con contador antes de cerrar periodo.',
        })),
      ...receiptVault.receiptFolders
        .filter((folder) => folder.readinessStatus !== 'ready')
        .map((folder) => ({
          key: `receipt.${folder.key}`,
          label: `${folder.label} sin evidencia completa`,
          status: folder.readinessStatus,
          severity:
            folder.readinessStatus === 'blocked'
              ? ('critical' as const)
              : ('normal' as const),
          owner: 'operator' as const,
          source: 'receipt_vault' as const,
          recommendedAction: `Adjuntar: ${folder.missingItems.join(', ') || 'soporte externo'}.`,
        })),
    ];
    const blockers = [
      ...paymentTracker.blockers,
      ...receiptVault.blockers,
      ...exceptions
        .filter((exception) => exception.status === 'blocked')
        .map((exception) => `post_filing_exception.${exception.key}`),
    ];
    const centerStatus = resolveStatus(
      exceptions.map((exception) => exception.status),
      blockers,
    );
    const summary = {
      exceptionCount: exceptions.length,
      criticalCount: exceptions.filter(
        (exception) => exception.severity === 'critical',
      ).length,
      accountantOwnedCount: exceptions.filter(
        (exception) => exception.owner === 'accountant',
      ).length,
      blockerCount: [...new Set(blockers)].length,
    };
    const view: EcuadorTaxPostFilingExceptionCenterView = {
      ...input,
      generatedAt: this.nowProvider(),
      centerStatus,
      paymentTracker,
      receiptVault,
      exceptions,
      summary,
      blockers: [...new Set(blockers)],
      nextStep:
        centerStatus === 'ready'
          ? 'Continuar con certificado post-filing.'
          : 'Resolver excepciones post-filing antes de closeout operacional.',
      guardrails: [
        'Exception center prioriza resolucion; no reintenta filing ni pagos automaticamente.',
        'Rechazos externos deben revisarse con contador.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_post_filing_exception_center_reviewed',
        source: 'tax_post_filing_exception_center',
        payload: { centerStatus, summary },
      });
    }

    return view;
  }
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
