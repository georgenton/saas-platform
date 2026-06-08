import {
  EcuadorTaxPeriodPostFilingCertificateView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPaymentObligationTrackerUseCase } from './get-tenant-ecuador-tax-payment-obligation-tracker.use-case';
import { GetTenantEcuadorTaxPostFilingExceptionCenterUseCase } from './get-tenant-ecuador-tax-post-filing-exception-center.use-case';
import { GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase } from './get-tenant-ecuador-tax-sri-filing-receipt-evidence-vault.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase } from './request-tenant-ecuador-tax-compliance-declaration-closeout-v3.use-case';

export class RequestTenantEcuadorTaxPeriodPostFilingCertificateUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase: RequestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase,
    private readonly getTenantEcuadorTaxPaymentObligationTrackerUseCase: GetTenantEcuadorTaxPaymentObligationTrackerUseCase,
    private readonly getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase: GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
    private readonly getTenantEcuadorTaxPostFilingExceptionCenterUseCase: GetTenantEcuadorTaxPostFilingExceptionCenterUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxPeriodPostFilingCertificateView> {
    const [declarationCloseout, paymentTracker, receiptVault, exceptionCenter] =
      await Promise.all([
        this.requestTenantEcuadorTaxComplianceDeclarationCloseoutV3UseCase.execute(
          {
            ...input,
            recordEvent: false,
          },
        ),
        this.getTenantEcuadorTaxPaymentObligationTrackerUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxPostFilingExceptionCenterUseCase.execute({
          ...input,
          recordEvent: false,
        }),
      ]);
    const certificateItems = [
      item(
        'declaration_closeout',
        'Declaracion preparada y cerrada para accion humana',
        mapCloseoutStatus(declarationCloseout.closeoutStatus),
        [declarationCloseout.nextStep],
        'La preparacion fue revisada antes del filing externo.',
      ),
      item(
        'payment_tracker',
        'Pagos externos controlados',
        paymentTracker.trackerStatus,
        paymentTracker.paymentRows.map(
          (row) => `${row.obligationKey}: ${row.paymentStatus}`,
        ),
        'Los pagos se registran por evidencia externa aportada.',
      ),
      item(
        'receipt_vault',
        'Recibos y referencias SRI archivados',
        receiptVault.vaultStatus,
        receiptVault.receiptFolders.map(
          (folder) => `${folder.label}: ${folder.readinessStatus}`,
        ),
        'La carpeta conserva referencias y soportes externos.',
      ),
      item(
        'post_filing_exceptions',
        'Excepciones post-filing resueltas',
        exceptionCenter.centerStatus,
        exceptionCenter.exceptions.map((exception) => exception.label),
        'No quedan excepciones criticas sin propietario.',
      ),
    ];
    const blockers = [
      ...declarationCloseout.blockers,
      ...paymentTracker.blockers,
      ...receiptVault.blockers,
      ...exceptionCenter.blockers,
    ];
    const certificateStatus = resolveCertificateStatus(
      certificateItems.map((item) => item.status),
      blockers,
      paymentTracker.summary.outstandingAmountInCents,
      exceptionCenter.summary.accountantOwnedCount,
    );
    const summary = {
      itemCount: certificateItems.length,
      readyItemCount: certificateItems.filter((item) => item.status === 'ready')
        .length,
      blockerCount: [...new Set(blockers)].length,
      outstandingAmountInCents: paymentTracker.summary.outstandingAmountInCents,
      evidenceRefCount: receiptVault.summary.evidenceRefCount,
    };
    const view: EcuadorTaxPeriodPostFilingCertificateView = {
      ...input,
      generatedAt: this.nowProvider(),
      certificateStatus,
      declarationCloseout,
      paymentTracker,
      receiptVault,
      exceptionCenter,
      certificateItems,
      summary,
      blockers: [...new Set(blockers)],
      nextStep:
        certificateStatus === 'post_filing_complete'
          ? 'Usar certificado como soporte de closeout post-filing 4.0.'
          : 'Resolver pagos, recibos o revision contable pendiente.',
      guardrails: [
        'Certificado post-filing es interno; no certifica presentacion ante SRI.',
        'La evidencia de pago y filing debe provenir de soporte humano externo.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_period_post_filing_certificate_requested',
        source: 'tax_period_post_filing_certificate',
        payload: { certificateStatus, summary },
      });
    }

    return view;
  }
}

function item(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidence: string[],
  attestation: string,
): EcuadorTaxPeriodPostFilingCertificateView['certificateItems'][number] {
  return { key, label, status, evidence, attestation };
}

function mapCloseoutStatus(status: string): EcuadorTaxReadinessStatus {
  return status === 'ready_for_external_filing'
    ? 'ready'
    : status === 'blocked'
      ? 'blocked'
      : 'needs_review';
}

function resolveCertificateStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
  outstandingAmountInCents: number,
  accountantOwnedCount: number,
): EcuadorTaxPeriodPostFilingCertificateView['certificateStatus'] {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  if (accountantOwnedCount > 0) {
    return 'accountant_review_required';
  }

  return outstandingAmountInCents > 0 || statuses.includes('needs_review')
    ? 'payment_or_receipt_pending'
    : 'post_filing_complete';
}
