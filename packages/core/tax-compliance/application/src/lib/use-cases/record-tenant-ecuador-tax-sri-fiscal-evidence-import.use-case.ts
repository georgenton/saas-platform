import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxSriEvidenceImportSource,
  EcuadorTaxSriFiscalEvidenceImportBatchView,
  EcuadorTaxSriVoucherDirection,
  EcuadorTaxSriVoucherEvidenceView,
  EcuadorTaxSriVoucherType,
} from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class RecordTenantEcuadorTaxSriFiscalEvidenceImportUseCase {
  constructor(
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    source?: EcuadorTaxSriEvidenceImportSource;
    importedByUserId?: string | null;
    importedByEmail?: string | null;
    vouchers: Array<{
      direction: EcuadorTaxSriVoucherDirection;
      voucherType: EcuadorTaxSriVoucherType;
      accessKey?: string | null;
      authorizationNumber?: string | null;
      authorizationDate?: string | Date | null;
      issuedAt?: string | Date | null;
      emitterTaxpayerId?: string | null;
      emitterName?: string | null;
      receiverTaxpayerId?: string | null;
      receiverName?: string | null;
      establishment?: string | null;
      emissionPoint?: string | null;
      sequential?: string | null;
      documentNumber?: string | null;
      currency?: string;
      subtotalInCents?: number;
      vatInCents?: number;
      incomeTaxWithholdingInCents?: number;
      vatWithholdingInCents?: number;
      totalInCents?: number;
      relatedAccessKey?: string | null;
      xmlReference?: string | null;
      rideReference?: string | null;
    }>;
  }): Promise<EcuadorTaxSriFiscalEvidenceImportBatchView> {
    const now = this.nowProvider();
    const source = input.source ?? 'sri_report';
    const importId = `sri_import_${now.getTime()}`;
    const voucherRows = input.vouchers.map((voucher, index) =>
      normalizeVoucher({
        importId,
        index,
        source,
        voucher,
      }),
    );
    const blockers = [
      ...new Set(voucherRows.flatMap((voucher) => voucher.blockers)),
    ];
    const reviewNotes = [
      voucherRows.length === 0
        ? 'sri_import.empty_batch'
        : `sri_import.vouchers_received:${voucherRows.length}`,
    ];
    const summary = {
      totalVouchers: voucherRows.length,
      issuedVouchers: voucherRows.filter(
        (voucher) => voucher.direction === 'issued',
      ).length,
      receivedVouchers: voucherRows.filter(
        (voucher) => voucher.direction === 'received',
      ).length,
      duplicateAccessKeys: countDuplicateAccessKeys(voucherRows),
      readyVouchers: voucherRows.filter(
        (voucher) => voucher.readinessStatus === 'ready',
      ).length,
      needsReviewVouchers: voucherRows.filter(
        (voucher) => voucher.readinessStatus === 'needs_review',
      ).length,
      blockedVouchers: voucherRows.filter(
        (voucher) => voucher.readinessStatus === 'blocked',
      ).length,
      importedBatchCount: 1,
    };
    const view: EcuadorTaxSriFiscalEvidenceImportBatchView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: now,
      importId,
      source,
      importedByUserId: input.importedByUserId ?? null,
      importedByEmail: input.importedByEmail ?? null,
      summary,
      voucherRows,
      blockers,
      reviewNotes,
      guardrails: [
        'Este batch representa datos aportados por el contribuyente o contador.',
        'No se valida una sesion SRI ni se almacena clave tributaria.',
        'La importacion no equivale a declaracion presentada.',
      ],
    };

    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      eventType: 'sri_fiscal_evidence_import_recorded',
      source: 'sri_fiscal_evidence_intake',
      payload: {
        importId,
        source,
        importedByUserId: view.importedByUserId,
        importedByEmail: view.importedByEmail,
        summary,
        voucherRows,
        blockerCount: blockers.length,
      },
    });

    return view;
  }
}

function normalizeVoucher(input: {
  importId: string;
  index: number;
  source: EcuadorTaxSriEvidenceImportSource;
  voucher: {
    direction: EcuadorTaxSriVoucherDirection;
    voucherType: EcuadorTaxSriVoucherType;
    accessKey?: string | null;
    authorizationNumber?: string | null;
    authorizationDate?: string | Date | null;
    issuedAt?: string | Date | null;
    emitterTaxpayerId?: string | null;
    emitterName?: string | null;
    receiverTaxpayerId?: string | null;
    receiverName?: string | null;
    establishment?: string | null;
    emissionPoint?: string | null;
    sequential?: string | null;
    documentNumber?: string | null;
    currency?: string;
    subtotalInCents?: number;
    vatInCents?: number;
    incomeTaxWithholdingInCents?: number;
    vatWithholdingInCents?: number;
    totalInCents?: number;
    relatedAccessKey?: string | null;
    xmlReference?: string | null;
    rideReference?: string | null;
  };
}): EcuadorTaxSriVoucherEvidenceView {
  const accessKey = clean(input.voucher.accessKey);
  const issuedAt = dateOrNull(input.voucher.issuedAt);
  const documentNumber =
    clean(input.voucher.documentNumber) ??
    buildDocumentNumber({
      establishment: clean(input.voucher.establishment),
      emissionPoint: clean(input.voucher.emissionPoint),
      sequential: clean(input.voucher.sequential),
    });
  const subtotalInCents = amount(input.voucher.subtotalInCents);
  const vatInCents = amount(input.voucher.vatInCents);
  const totalInCents =
    input.voucher.totalInCents === undefined
      ? Math.max(subtotalInCents + vatInCents, 0)
      : amount(input.voucher.totalInCents);
  const blockers = [
    accessKey ? null : 'sri_evidence.access_key_missing',
    issuedAt ? null : 'sri_evidence.issued_at_missing',
    clean(input.voucher.emitterTaxpayerId)
      ? null
      : 'sri_evidence.emitter_taxpayer_id_missing',
    clean(input.voucher.receiverTaxpayerId)
      ? null
      : 'sri_evidence.receiver_taxpayer_id_missing',
    documentNumber ? null : 'sri_evidence.document_number_missing',
  ].filter((blocker): blocker is string => blocker !== null);
  const reviewNotes = [
    input.voucher.voucherType === 'other'
      ? 'sri_evidence.voucher_type_requires_classification'
      : null,
    input.voucher.voucherType === 'remission_guide'
      ? 'sri_evidence.remission_guide_has_no_tax_amounts'
      : null,
  ].filter((note): note is string => note !== null);
  const readinessStatus = resolveReadinessStatus(blockers, reviewNotes);

  return {
    evidenceId: `${input.importId}_${input.index + 1}`,
    direction: input.voucher.direction,
    voucherType: input.voucher.voucherType,
    source: input.source,
    accessKey,
    authorizationNumber: clean(input.voucher.authorizationNumber),
    authorizationDate: dateOrNull(input.voucher.authorizationDate),
    issuedAt,
    emitterTaxpayerId: clean(input.voucher.emitterTaxpayerId),
    emitterName: clean(input.voucher.emitterName),
    receiverTaxpayerId: clean(input.voucher.receiverTaxpayerId),
    receiverName: clean(input.voucher.receiverName),
    establishment: clean(input.voucher.establishment),
    emissionPoint: clean(input.voucher.emissionPoint),
    sequential: clean(input.voucher.sequential),
    documentNumber,
    currency: input.voucher.currency ?? 'USD',
    subtotalInCents,
    vatInCents,
    incomeTaxWithholdingInCents: amount(
      input.voucher.incomeTaxWithholdingInCents,
    ),
    vatWithholdingInCents: amount(input.voucher.vatWithholdingInCents),
    totalInCents,
    relatedAccessKey: clean(input.voucher.relatedAccessKey),
    xmlReference: clean(input.voucher.xmlReference),
    rideReference: clean(input.voucher.rideReference),
    readinessStatus,
    blockers,
    reviewNotes,
  };
}

function resolveReadinessStatus(
  blockers: string[],
  reviewNotes: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0) {
    return 'blocked';
  }

  return reviewNotes.length > 0 ? 'needs_review' : 'ready';
}

function countDuplicateAccessKeys(
  voucherRows: EcuadorTaxSriVoucherEvidenceView[],
): number {
  const counts = new Map<string, number>();

  for (const voucher of voucherRows) {
    if (!voucher.accessKey) {
      continue;
    }

    counts.set(voucher.accessKey, (counts.get(voucher.accessKey) ?? 0) + 1);
  }

  return [...counts.values()].filter((count) => count > 1).length;
}

function buildDocumentNumber(input: {
  establishment: string | null;
  emissionPoint: string | null;
  sequential: string | null;
}): string | null {
  if (!input.establishment || !input.emissionPoint || !input.sequential) {
    return null;
  }

  return `${input.establishment}-${input.emissionPoint}-${input.sequential}`;
}

function clean(value: string | null | undefined): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function dateOrNull(value: Date | string | null | undefined): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function amount(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(Math.trunc(value), 0)
    : 0;
}
