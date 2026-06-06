import {
  EcuadorTaxDeclarationSource,
  EcuadorTaxDeclarationSourceLedgerView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-fiscal-evidence-workspace.use-case';
import { GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-purchase-expense-evidence-workspace.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';

export class GetTenantEcuadorTaxDeclarationSourceLedgerUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase: GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxDeclarationSourceLedgerView> {
    const [salesBook, purchases, sriEvidence] = await Promise.all([
      this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const salesRows: EcuadorTaxDeclarationSourceLedgerView['sourceRows'] =
      salesBook.documentRows.map((row) => ({
        rowKey: `invoicing:${row.invoiceId}`,
        source: 'invoicing',
        direction: 'sale',
        documentType: row.documentCode ?? 'invoice',
        reference: row.number,
        counterpartyName: row.buyerName,
        counterpartyTaxpayerId: row.buyerIdentification,
        issuedAt: row.issuedAt,
        currency: row.currency,
        subtotalInCents: row.subtotalInCents,
        vatInCents: row.taxInCents,
        incomeTaxWithholdingInCents: 0,
        vatWithholdingInCents: 0,
        totalInCents: row.totalInCents,
        readinessStatus: row.blockers.length > 0 ? 'blocked' : 'ready',
        blockers: row.blockers,
        notes: [row.status, row.electronicStatus ?? 'electronic_unknown'],
      }));
    const purchaseRows: EcuadorTaxDeclarationSourceLedgerView['sourceRows'] =
      purchases.documentRows.map((row) => ({
        rowKey: `manual_evidence:${row.evidenceId}`,
        source: 'manual_evidence',
        direction: 'purchase',
        documentType: row.documentCode ?? row.category,
        reference: row.documentNumber ?? row.evidenceId,
        counterpartyName: row.supplierName,
        counterpartyTaxpayerId: row.supplierTaxpayerId,
        issuedAt: row.issuedAt,
        currency: row.currency,
        subtotalInCents: row.subtotalInCents,
        vatInCents: row.vatInCents,
        incomeTaxWithholdingInCents: 0,
        vatWithholdingInCents: 0,
        totalInCents: row.totalInCents,
        readinessStatus: row.readinessStatus,
        blockers: row.blockers,
        notes: row.reviewNotes,
      }));
    const sriRows: EcuadorTaxDeclarationSourceLedgerView['sourceRows'] =
      sriEvidence.voucherRows.map((voucher) => ({
        rowKey: `sri_import:${voucher.evidenceId}`,
        source: 'sri_import',
        direction: voucher.direction === 'issued' ? 'sale' : 'purchase',
        documentType: voucher.voucherType,
        reference: voucher.documentNumber ?? voucher.accessKey ?? voucher.evidenceId,
        counterpartyName:
          voucher.direction === 'issued'
            ? voucher.receiverName
            : voucher.emitterName,
        counterpartyTaxpayerId:
          voucher.direction === 'issued'
            ? voucher.receiverTaxpayerId
            : voucher.emitterTaxpayerId,
        issuedAt: voucher.issuedAt,
        currency: voucher.currency,
        subtotalInCents: voucher.subtotalInCents,
        vatInCents: voucher.vatInCents,
        incomeTaxWithholdingInCents: voucher.incomeTaxWithholdingInCents,
        vatWithholdingInCents: voucher.vatWithholdingInCents,
        totalInCents: voucher.totalInCents,
        readinessStatus: voucher.readinessStatus,
        blockers: voucher.blockers,
        notes: voucher.reviewNotes,
      }));
    const ecommerceRows: EcuadorTaxDeclarationSourceLedgerView['sourceRows'] =
      salesBook.ecommerceEvidence.readyToInvoiceCount > 0
        ? [
            {
              rowKey: `ecommerce:${input.period}:ready-to-invoice`,
              source: 'ecommerce',
              direction: 'sale',
              documentType: 'order_ready_to_invoice',
              reference: `ecommerce:${input.period}`,
              counterpartyName: null,
              counterpartyTaxpayerId: null,
              issuedAt: null,
              currency: 'USD',
              subtotalInCents: 0,
              vatInCents: 0,
              incomeTaxWithholdingInCents: 0,
              vatWithholdingInCents: 0,
              totalInCents: 0,
              readinessStatus:
                salesBook.ecommerceEvidence.blockedCount > 0
                  ? 'blocked'
                  : 'needs_review',
              blockers:
                salesBook.ecommerceEvidence.blockedCount > 0
                  ? ['tax_source_ledger.ecommerce_blocked_orders']
                  : [],
              notes: salesBook.ecommerceEvidence.notes,
            },
          ]
        : [];
    const accountingRows: EcuadorTaxDeclarationSourceLedgerView['sourceRows'] = [
      {
        rowKey: `accounting:${input.period}:closeout-support`,
        source: 'accounting',
        direction: 'accounting_closeout',
        documentType: 'accounting_foundation_closeout',
        reference: `accounting:${input.period}`,
        counterpartyName: null,
        counterpartyTaxpayerId: null,
        issuedAt: null,
        currency: 'USD',
        subtotalInCents: 0,
        vatInCents: 0,
        incomeTaxWithholdingInCents: 0,
        vatWithholdingInCents: 0,
        totalInCents: 0,
        readinessStatus: 'needs_review',
        blockers: [],
        notes: [
          'Accounting closeout debe revisarse como soporte externo; Tax Compliance no lee libros oficiales automaticamente.',
        ],
      },
    ];
    const sourceRows = [
      ...salesRows,
      ...purchaseRows,
      ...sriRows,
      ...ecommerceRows,
      ...accountingRows,
    ];
    const blockers = [
      ...salesBook.blockers,
      ...purchases.blockers,
      ...sriEvidence.blockers,
      ...sourceRows.flatMap((row) => row.blockers),
    ];
    const gapCount = sourceRows.filter(
      (row) => row.readinessStatus !== 'ready',
    ).length;
    const readinessStatus = resolveReadinessStatus(blockers, gapCount);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      sourceRows,
      totalsBySource: buildTotalsBySource(sourceRows),
      summary: {
        rowCount: sourceRows.length,
        salesSubtotalInCents: sumRows(sourceRows, 'sale', 'subtotalInCents'),
        purchaseSubtotalInCents: sumRows(
          sourceRows,
          'purchase',
          'subtotalInCents',
        ),
        outputVatInCents: sumRows(sourceRows, 'sale', 'vatInCents'),
        inputVatInCents: sumRows(sourceRows, 'purchase', 'vatInCents'),
        incomeTaxWithholdingInCents: sourceRows.reduce(
          (total, row) => total + row.incomeTaxWithholdingInCents,
          0,
        ),
        vatWithholdingInCents: sourceRows.reduce(
          (total, row) => total + row.vatWithholdingInCents,
          0,
        ),
        gapCount,
        accountingCloseoutAvailable: accountingRows.length > 0,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver gaps bloqueantes del ledger fiscal antes de preparar declaraciones.'
          : readinessStatus === 'needs_review'
            ? 'Revisar filas con contador antes de llenar formularios.'
            : 'Usar ledger fiscal como fuente de IVA, renta y retenciones.',
      guardrails: [
        'El source ledger consolida evidencia; no presenta declaraciones ni reemplaza revision humana.',
        'Accounting se referencia como soporte operacional, no como libro legal oficial.',
      ],
    };
  }
}

function resolveReadinessStatus(
  blockers: string[],
  gapCount: number,
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0) {
    return 'blocked';
  }
  return gapCount > 0 ? 'needs_review' : 'ready';
}

function buildTotalsBySource(
  rows: EcuadorTaxDeclarationSourceLedgerView['sourceRows'],
): EcuadorTaxDeclarationSourceLedgerView['totalsBySource'] {
  const sources: EcuadorTaxDeclarationSource[] = [
    'invoicing',
    'ecommerce',
    'sri_import',
    'manual_evidence',
    'accounting',
  ];

  return sources.map((source) => {
    const sourceRows = rows.filter((row) => row.source === source);

    return {
      source,
      rowCount: sourceRows.length,
      subtotalInCents: sourceRows.reduce(
        (total, row) => total + row.subtotalInCents,
        0,
      ),
      vatInCents: sourceRows.reduce((total, row) => total + row.vatInCents, 0),
      incomeTaxWithholdingInCents: sourceRows.reduce(
        (total, row) => total + row.incomeTaxWithholdingInCents,
        0,
      ),
      vatWithholdingInCents: sourceRows.reduce(
        (total, row) => total + row.vatWithholdingInCents,
        0,
      ),
      totalInCents: sourceRows.reduce(
        (total, row) => total + row.totalInCents,
        0,
      ),
    };
  });
}

function sumRows(
  rows: EcuadorTaxDeclarationSourceLedgerView['sourceRows'],
  direction: 'sale' | 'purchase',
  field: 'subtotalInCents' | 'vatInCents',
): number {
  return rows
    .filter((row) => row.direction === direction)
    .reduce((total, row) => total + row[field], 0);
}
