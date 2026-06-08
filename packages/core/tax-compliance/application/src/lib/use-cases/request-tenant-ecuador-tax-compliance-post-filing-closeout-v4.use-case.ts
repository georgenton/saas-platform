import {
  EcuadorTaxCompliancePostFilingCloseoutV4View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPaymentObligationTrackerUseCase } from './get-tenant-ecuador-tax-payment-obligation-tracker.use-case';
import { GetTenantEcuadorTaxPostFilingExceptionCenterUseCase } from './get-tenant-ecuador-tax-post-filing-exception-center.use-case';
import { GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase } from './get-tenant-ecuador-tax-sri-filing-receipt-evidence-vault.use-case';
import { ListTenantEcuadorTaxExternalFilingResultsUseCase } from './list-tenant-ecuador-tax-external-filing-results.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxPeriodPostFilingCertificateUseCase } from './request-tenant-ecuador-tax-period-post-filing-certificate.use-case';

export class RequestTenantEcuadorTaxCompliancePostFilingCloseoutV4UseCase {
  constructor(
    private readonly listTenantEcuadorTaxExternalFilingResultsUseCase: ListTenantEcuadorTaxExternalFilingResultsUseCase,
    private readonly getTenantEcuadorTaxPaymentObligationTrackerUseCase: GetTenantEcuadorTaxPaymentObligationTrackerUseCase,
    private readonly getTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase: GetTenantEcuadorTaxSriFilingReceiptEvidenceVaultUseCase,
    private readonly getTenantEcuadorTaxPostFilingExceptionCenterUseCase: GetTenantEcuadorTaxPostFilingExceptionCenterUseCase,
    private readonly requestTenantEcuadorTaxPeriodPostFilingCertificateUseCase: RequestTenantEcuadorTaxPeriodPostFilingCertificateUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxCompliancePostFilingCloseoutV4View> {
    const [
      filingResults,
      paymentTracker,
      receiptVault,
      exceptionCenter,
      postFilingCertificate,
    ] = await Promise.all([
      this.listTenantEcuadorTaxExternalFilingResultsUseCase.execute(input),
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
      this.requestTenantEcuadorTaxPeriodPostFilingCertificateUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const closeoutItems = [
      item(
        'filing_results',
        'Resultados externos registrados',
        filingResults.length > 0 ? 'ready' : 'blocked',
        filingResults.map(
          (result) => `${result.obligationKey}: ${result.resultStatus}`,
        ),
      ),
      item(
        'payment_tracker',
        'Pagos externos conciliados',
        paymentTracker.trackerStatus,
        [`Outstanding: ${paymentTracker.summary.outstandingAmountInCents}`],
      ),
      item(
        'receipt_vault',
        'Recibos archivados',
        receiptVault.vaultStatus,
        receiptVault.receiptFolders.map((folder) => folder.label),
      ),
      item(
        'exceptions',
        'Excepciones post-filing',
        exceptionCenter.centerStatus,
        exceptionCenter.exceptions.map((exception) => exception.label),
      ),
      item(
        'certificate',
        'Certificado post-filing',
        mapCertificateStatus(postFilingCertificate.certificateStatus),
        [postFilingCertificate.nextStep],
      ),
    ];
    const blockers = [
      ...paymentTracker.blockers,
      ...receiptVault.blockers,
      ...exceptionCenter.blockers,
      ...postFilingCertificate.blockers,
      filingResults.length === 0
        ? 'post_filing_closeout.no_external_results'
        : null,
    ].filter((blocker): blocker is string => blocker !== null);
    const closeoutStatus = resolveCloseoutStatus(
      closeoutItems.map((item) => item.status),
      blockers,
      paymentTracker.summary.outstandingAmountInCents,
      exceptionCenter.summary.accountantOwnedCount,
    );
    const summary = {
      itemCount: closeoutItems.length,
      readyItemCount: closeoutItems.filter((item) => item.status === 'ready')
        .length,
      blockerCount: [...new Set(blockers)].length,
      outstandingAmountInCents: paymentTracker.summary.outstandingAmountInCents,
      exceptionCount: exceptionCenter.summary.exceptionCount,
    };
    const view: EcuadorTaxCompliancePostFilingCloseoutV4View = {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      filingResults,
      paymentTracker,
      receiptVault,
      exceptionCenter,
      postFilingCertificate,
      closeoutItems,
      summary,
      recommendedNextStep: resolveRecommendedNextStep(closeoutStatus),
      blockers: [...new Set(blockers)],
      nextStep: resolveNextStep(closeoutStatus),
      guardrails: [
        'Closeout post-filing es operacional; no certifica oficialmente ante SRI.',
        'La plataforma no paga, no presenta, no descarga recibos y no reemplaza contador.',
        'Accounting Advanced solo se abre si el cierre exige libros, bancos certificados o auditoria.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_compliance_post_filing_closeout_v4_requested',
        source: 'tax_compliance_post_filing_closeout_v4',
        payload: {
          closeoutStatus,
          recommendedNextStep: view.recommendedNextStep,
          summary,
        },
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
): EcuadorTaxCompliancePostFilingCloseoutV4View['closeoutItems'][number] {
  return { key, label, status, evidence };
}

function mapCertificateStatus(status: string): EcuadorTaxReadinessStatus {
  return status === 'post_filing_complete'
    ? 'ready'
    : status === 'blocked'
      ? 'blocked'
      : 'needs_review';
}

function resolveCloseoutStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
  outstandingAmountInCents: number,
  accountantOwnedCount: number,
): EcuadorTaxCompliancePostFilingCloseoutV4View['closeoutStatus'] {
  if (blockers.some((blocker) => blocker.includes('accounting'))) {
    return 'accounting_advanced_candidate';
  }

  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  if (accountantOwnedCount > 0) {
    return 'accountant_review_required';
  }

  return outstandingAmountInCents > 0 || statuses.includes('needs_review')
    ? 'payment_or_evidence_pending'
    : 'closed_operationally';
}

function resolveRecommendedNextStep(
  status: EcuadorTaxCompliancePostFilingCloseoutV4View['closeoutStatus'],
): EcuadorTaxCompliancePostFilingCloseoutV4View['recommendedNextStep'] {
  if (status === 'closed_operationally') {
    return 'period_closed';
  }

  if (status === 'accountant_review_required') {
    return 'accountant_review';
  }

  return status === 'accounting_advanced_candidate'
    ? 'accounting_advanced_discovery'
    : 'collect_payment_or_receipt';
}

function resolveNextStep(
  status: EcuadorTaxCompliancePostFilingCloseoutV4View['closeoutStatus'],
): string {
  if (status === 'closed_operationally') {
    return 'Mantener expediente post-filing como cierre operacional defendible.';
  }

  if (status === 'accountant_review_required') {
    return 'Enviar excepciones post-filing al contador.';
  }

  return status === 'accounting_advanced_candidate'
    ? 'Abrir discovery de Accounting Advanced.'
    : 'Completar pagos, referencias o recibos antes de cerrar periodo.';
}
