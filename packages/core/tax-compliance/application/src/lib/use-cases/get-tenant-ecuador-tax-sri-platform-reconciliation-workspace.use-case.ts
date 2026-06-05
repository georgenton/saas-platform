import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxSriPlatformReconciliationWorkspaceView,
  EcuadorTaxSriReconciliationIssueSeverity,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-purchase-expense-evidence-workspace.use-case';
import { GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-fiscal-evidence-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';

export class GetTenantEcuadorTaxSriPlatformReconciliationWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase: GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase: GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxSriPlatformReconciliationWorkspaceView> {
    const [sriEvidence, salesBook, purchaseWorkspace] = await Promise.all([
      this.getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxSalesBookUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const issues = buildIssues({
      sriEvidence,
      salesBook,
      purchaseWorkspace,
    });
    const issueSummary = {
      totalIssues: issues.length,
      blockingIssues: issues.filter((issue) => issue.severity === 'blocking')
        .length,
      reviewIssues: issues.filter((issue) => issue.severity === 'review')
        .length,
      infoIssues: issues.filter((issue) => issue.severity === 'info').length,
    };
    const readinessStatus = resolveReadinessStatus(issueSummary);
    const view: EcuadorTaxSriPlatformReconciliationWorkspaceView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      sriEvidenceSummary: sriEvidence.summary,
      platformSummary: {
        salesDocuments: salesBook.documentRows.length,
        purchaseDocuments: purchaseWorkspace.documentRows.length,
        ecommerceOrdersReadyToInvoice:
          salesBook.ecommerceEvidence.readyToInvoiceCount,
      },
      issueSummary,
      issues,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Importar o corregir evidencia SRI bloqueante antes de preparar casilleros de declaracion.'
          : readinessStatus === 'needs_review'
            ? 'Revisar diferencias SRI vs plataforma con contador antes del borrador de formularios.'
            : 'Usar conciliacion SRI como soporte de borradores IVA, renta y retenciones.',
      guardrails: [
        'La conciliacion SRI compara evidencia aportada por humanos contra evidencia operacional.',
        'No confirma que el SRI haya aceptado una declaracion.',
        'Diferencias informativas no deben convertirse en asientos contables automaticamente.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'sri_platform_reconciliation_reviewed',
        source: 'sri_platform_reconciliation_workspace',
        payload: {
          readinessStatus,
          issueSummary,
          sriEvidenceSummary: sriEvidence.summary,
          platformSummary: view.platformSummary,
        },
      });
    }

    return view;
  }
}

function buildIssues(input: {
  sriEvidence: Awaited<
    ReturnType<GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase['execute']>
  >;
  salesBook: Awaited<ReturnType<RequestTenantEcuadorTaxSalesBookUseCase['execute']>>;
  purchaseWorkspace: Awaited<
    ReturnType<GetTenantEcuadorTaxPurchaseExpenseEvidenceWorkspaceUseCase['execute']>
  >;
}): EcuadorTaxSriPlatformReconciliationWorkspaceView['issues'] {
  const issues: EcuadorTaxSriPlatformReconciliationWorkspaceView['issues'] = [];
  const sriAccessKeys = new Set(
    input.sriEvidence.voucherRows
      .map((voucher) => voucher.accessKey)
      .filter((accessKey): accessKey is string => accessKey !== null),
  );
  const platformSalesAccessKeys = new Set(
    input.salesBook.documentRows
      .map((row) => row.documentCode)
      .filter((documentCode): documentCode is string => documentCode !== null),
  );
  const platformPurchaseAccessKeys = new Set(
    input.purchaseWorkspace.documentRows
      .map((row) => row.documentCode)
      .filter((documentCode): documentCode is string => documentCode !== null),
  );

  const sriIssuedMissingInPlatform = input.sriEvidence.voucherRows.filter(
    (voucher) =>
      voucher.direction === 'issued' &&
      voucher.accessKey &&
      !platformSalesAccessKeys.has(voucher.accessKey),
  );

  if (sriIssuedMissingInPlatform.length > 0) {
    issues.push(
      issue({
        key: 'sri_issued_missing_in_platform_sales',
        severity: 'review',
        source: 'cross_check',
        summary: `${sriIssuedMissingInPlatform.length} comprobantes emitidos en SRI no aparecen en ventas de plataforma.`,
        evidenceIds: sriIssuedMissingInPlatform.map(
          (voucher) => voucher.evidenceId,
        ),
        suggestedAction:
          'Confirmar si son ventas externas, facturas de otro sistema o documentos que deben importarse a Invoicing.',
      }),
    );
  }

  const sriReceivedMissingInPlatform = input.sriEvidence.voucherRows.filter(
    (voucher) =>
      voucher.direction === 'received' &&
      voucher.accessKey &&
      !platformPurchaseAccessKeys.has(voucher.accessKey),
  );

  if (sriReceivedMissingInPlatform.length > 0) {
    issues.push(
      issue({
        key: 'sri_received_missing_in_platform_purchases',
        severity: 'review',
        source: 'cross_check',
        summary: `${sriReceivedMissingInPlatform.length} comprobantes recibidos en SRI no aparecen en compras/gastos.`,
        evidenceIds: sriReceivedMissingInPlatform.map(
          (voucher) => voucher.evidenceId,
        ),
        suggestedAction:
          'Clasificar los comprobantes recibidos como compra deducible, gasto, activo, no deducible o evidencia manual.',
      }),
    );
  }

  const platformSalesMissingSri = input.salesBook.documentRows.filter(
    (row) => row.documentCode && !sriAccessKeys.has(row.documentCode),
  );

  if (platformSalesMissingSri.length > 0) {
    issues.push(
      issue({
        key: 'platform_sales_missing_sri_match',
        severity: 'blocking',
        source: 'platform',
        summary: `${platformSalesMissingSri.length} ventas de plataforma con clave/documento no fueron encontradas en evidencia SRI importada.`,
        platformReferences: platformSalesMissingSri.map(
          (row) => `invoice.${row.invoiceId}`,
        ),
        suggestedAction:
          'Reimportar reporte SRI del periodo o revisar estado electronico/autorizacion del documento.',
      }),
    );
  }

  const platformPurchasesMissingSri = input.purchaseWorkspace.documentRows.filter(
    (row) => row.documentCode && !sriAccessKeys.has(row.documentCode),
  );

  if (platformPurchasesMissingSri.length > 0) {
    issues.push(
      issue({
        key: 'platform_purchases_missing_sri_match',
        severity: 'review',
        source: 'platform',
        summary: `${platformPurchasesMissingSri.length} compras/gastos con clave/documento no fueron encontrados en evidencia SRI importada.`,
        platformReferences: platformPurchasesMissingSri.map(
          (row) => `purchase_evidence.${row.evidenceId}`,
        ),
        suggestedAction:
          'Validar si el comprobante fue emitido fisicamente, esta fuera del periodo o falta importar XML/reporte SRI.',
      }),
    );
  }

  if (input.sriEvidence.summary.totalVouchers === 0) {
    issues.push(
      issue({
        key: 'sri_evidence_not_imported',
        severity: 'blocking',
        source: 'sri',
        summary:
          'No existe evidencia SRI importada para comparar contra la plataforma.',
        suggestedAction:
          'Solicitar al contribuyente o contador el reporte/XML SRI de comprobantes emitidos y recibidos del periodo.',
      }),
    );
  }

  return issues;
}

function issue(input: {
  key: string;
  severity: EcuadorTaxSriReconciliationIssueSeverity;
  source: 'sri' | 'platform' | 'cross_check';
  summary: string;
  evidenceIds?: string[];
  platformReferences?: string[];
  suggestedAction: string;
}): EcuadorTaxSriPlatformReconciliationWorkspaceView['issues'][number] {
  return {
    key: input.key,
    severity: input.severity,
    source: input.source,
    summary: input.summary,
    evidenceIds: input.evidenceIds ?? [],
    platformReferences: input.platformReferences ?? [],
    suggestedAction: input.suggestedAction,
  };
}

function resolveReadinessStatus(input: {
  blockingIssues: number;
  reviewIssues: number;
}): EcuadorTaxReadinessStatus {
  if (input.blockingIssues > 0) {
    return 'blocked';
  }

  return input.reviewIssues > 0 ? 'needs_review' : 'ready';
}
