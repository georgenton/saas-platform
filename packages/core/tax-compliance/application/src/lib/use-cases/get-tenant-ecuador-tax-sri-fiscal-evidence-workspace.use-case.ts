import {
  EcuadorTaxComplianceEventView,
  EcuadorTaxReadinessStatus,
  EcuadorTaxSriFiscalEvidenceWorkspaceView,
  EcuadorTaxSriVoucherEvidenceView,
} from '@saas-platform/tax-compliance-domain';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase {
  constructor(
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxSriFiscalEvidenceWorkspaceView> {
    const events = await this.listTenantEcuadorTaxComplianceEventsUseCase.execute(
      {
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 500,
      },
    );
    const importEvents = events.filter(
      (event) => event.eventType === 'sri_fiscal_evidence_import_recorded',
    );
    const voucherRows = collectLatestVouchers(importEvents);
    const duplicateAccessKeys = countDuplicateAccessKeys(voucherRows);
    const blockers = [
      ...new Set([
        ...voucherRows.flatMap((voucher) => voucher.blockers),
        duplicateAccessKeys > 0
          ? `sri_evidence.duplicate_access_keys:${duplicateAccessKeys}`
          : null,
      ].filter((blocker): blocker is string => blocker !== null)),
    ];
    const reviewNotes = [
      voucherRows.length === 0
        ? 'No hay comprobantes SRI importados para este periodo.'
        : null,
      duplicateAccessKeys > 0
        ? 'Existen claves de acceso repetidas que deben revisarse antes de usar la evidencia para formularios.'
        : null,
    ].filter((note): note is string => note !== null);
    const readinessStatus = resolveReadinessStatus(voucherRows, blockers);
    const summary = {
      totalVouchers: voucherRows.length,
      issuedVouchers: voucherRows.filter(
        (voucher) => voucher.direction === 'issued',
      ).length,
      receivedVouchers: voucherRows.filter(
        (voucher) => voucher.direction === 'received',
      ).length,
      duplicateAccessKeys,
      readyVouchers: voucherRows.filter(
        (voucher) => voucher.readinessStatus === 'ready',
      ).length,
      needsReviewVouchers: voucherRows.filter(
        (voucher) => voucher.readinessStatus === 'needs_review',
      ).length,
      blockedVouchers: voucherRows.filter(
        (voucher) => voucher.readinessStatus === 'blocked',
      ).length,
      importedBatchCount: importEvents.length,
    };
    const view: EcuadorTaxSriFiscalEvidenceWorkspaceView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      source: 'tax_compliance_event_ledger',
      summary,
      totalsByDirectionAndCurrency: buildTotals(voucherRows),
      voucherRows,
      blockers,
      reviewNotes,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver comprobantes SRI bloqueados o duplicados antes de preparar formularios.'
          : readinessStatus === 'needs_review'
            ? 'Revisar comprobantes SRI con notas antes de usarlos como evidencia fiscal.'
            : 'Usar evidencia SRI como fuente cruzada para IVA, renta, retenciones y anexos.',
      guardrails: [
        'La evidencia SRI debe ser descargada por el contribuyente o contador y cargada por un humano.',
        'No se almacenan credenciales SRI ni se automatiza recaptcha.',
        'Importar comprobantes no implica declarar, firmar ni pagar impuestos.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'sri_fiscal_evidence_workspace_reviewed',
        source: 'sri_fiscal_evidence_workspace',
        payload: {
          readinessStatus,
          summary,
          blockerCount: blockers.length,
        },
      });
    }

    return view;
  }
}

function collectLatestVouchers(
  events: EcuadorTaxComplianceEventView[],
): EcuadorTaxSriVoucherEvidenceView[] {
  const vouchers = new Map<string, EcuadorTaxSriVoucherEvidenceView>();

  for (const event of events) {
    const rows = Array.isArray(event.payload['voucherRows'])
      ? event.payload['voucherRows']
      : [];

    for (const row of rows) {
      if (!isVoucher(row)) {
        continue;
      }

      vouchers.set(String(row['evidenceId']), normalizeVoucher(row));
    }
  }

  return [...vouchers.values()].sort((left, right) =>
    (left.issuedAt?.toISOString() ?? '').localeCompare(
      right.issuedAt?.toISOString() ?? '',
    ),
  );
}

function isVoucher(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value['evidenceId'] === 'string' &&
    typeof value['direction'] === 'string' &&
    typeof value['voucherType'] === 'string'
  );
}

function normalizeVoucher(
  row: Record<string, unknown>,
): EcuadorTaxSriVoucherEvidenceView {
  return {
    evidenceId: String(row['evidenceId']),
    direction: row['direction'] === 'received' ? 'received' : 'issued',
    voucherType:
      row['voucherType'] === 'credit_note' ||
      row['voucherType'] === 'debit_note' ||
      row['voucherType'] === 'withholding' ||
      row['voucherType'] === 'purchase_settlement' ||
      row['voucherType'] === 'remission_guide' ||
      row['voucherType'] === 'other'
        ? row['voucherType']
        : 'invoice',
    source:
      row['source'] === 'sri_xml' || row['source'] === 'manual_summary'
        ? row['source']
        : 'sri_report',
    accessKey: stringOrNull(row['accessKey']),
    authorizationNumber: stringOrNull(row['authorizationNumber']),
    authorizationDate: dateOrNull(row['authorizationDate']),
    issuedAt: dateOrNull(row['issuedAt']),
    emitterTaxpayerId: stringOrNull(row['emitterTaxpayerId']),
    emitterName: stringOrNull(row['emitterName']),
    receiverTaxpayerId: stringOrNull(row['receiverTaxpayerId']),
    receiverName: stringOrNull(row['receiverName']),
    establishment: stringOrNull(row['establishment']),
    emissionPoint: stringOrNull(row['emissionPoint']),
    sequential: stringOrNull(row['sequential']),
    documentNumber: stringOrNull(row['documentNumber']),
    currency: typeof row['currency'] === 'string' ? row['currency'] : 'USD',
    subtotalInCents: numberOrZero(row['subtotalInCents']),
    vatInCents: numberOrZero(row['vatInCents']),
    incomeTaxWithholdingInCents: numberOrZero(
      row['incomeTaxWithholdingInCents'],
    ),
    vatWithholdingInCents: numberOrZero(row['vatWithholdingInCents']),
    totalInCents: numberOrZero(row['totalInCents']),
    relatedAccessKey: stringOrNull(row['relatedAccessKey']),
    xmlReference: stringOrNull(row['xmlReference']),
    rideReference: stringOrNull(row['rideReference']),
    readinessStatus:
      row['readinessStatus'] === 'ready' ||
      row['readinessStatus'] === 'needs_review' ||
      row['readinessStatus'] === 'blocked'
        ? row['readinessStatus']
        : 'needs_review',
    blockers: stringArray(row['blockers']),
    reviewNotes: stringArray(row['reviewNotes']),
  };
}

function buildTotals(vouchers: EcuadorTaxSriVoucherEvidenceView[]) {
  const buckets = new Map<
    string,
    EcuadorTaxSriFiscalEvidenceWorkspaceView['totalsByDirectionAndCurrency'][number]
  >();

  for (const voucher of vouchers) {
    const key = `${voucher.direction}:${voucher.currency}`;
    const bucket =
      buckets.get(key) ??
      ({
        direction: voucher.direction,
        currency: voucher.currency,
        voucherCount: 0,
        subtotalInCents: 0,
        vatInCents: 0,
        incomeTaxWithholdingInCents: 0,
        vatWithholdingInCents: 0,
        totalInCents: 0,
      } satisfies EcuadorTaxSriFiscalEvidenceWorkspaceView['totalsByDirectionAndCurrency'][number]);

    bucket.voucherCount += 1;
    bucket.subtotalInCents += voucher.subtotalInCents;
    bucket.vatInCents += voucher.vatInCents;
    bucket.incomeTaxWithholdingInCents +=
      voucher.incomeTaxWithholdingInCents;
    bucket.vatWithholdingInCents += voucher.vatWithholdingInCents;
    bucket.totalInCents += voucher.totalInCents;
    buckets.set(key, bucket);
  }

  return [...buckets.values()].sort((left, right) =>
    `${left.direction}:${left.currency}`.localeCompare(
      `${right.direction}:${right.currency}`,
    ),
  );
}

function countDuplicateAccessKeys(
  vouchers: EcuadorTaxSriVoucherEvidenceView[],
): number {
  const counts = new Map<string, number>();

  for (const voucher of vouchers) {
    if (!voucher.accessKey) {
      continue;
    }

    counts.set(voucher.accessKey, (counts.get(voucher.accessKey) ?? 0) + 1);
  }

  return [...counts.values()].filter((count) => count > 1).length;
}

function resolveReadinessStatus(
  vouchers: EcuadorTaxSriVoucherEvidenceView[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (
    blockers.length > 0 ||
    vouchers.some((voucher) => voucher.readinessStatus === 'blocked')
  ) {
    return 'blocked';
  }

  if (
    vouchers.length === 0 ||
    vouchers.some((voucher) => voucher.readinessStatus === 'needs_review')
  ) {
    return 'needs_review';
  }

  return 'ready';
}

function stringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function dateOrNull(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function numberOrZero(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}
