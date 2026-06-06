import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxVatDeclarationDraftWorkspaceView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationSourceLedgerUseCase } from './get-tenant-ecuador-tax-declaration-source-ledger.use-case';
import { RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase } from './request-tenant-ecuador-tax-declaration-form-draft-packet.use-case';

export class GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxVatDeclarationDraftWorkspaceView> {
    const [sourceLedger, formDraftPacket] = await Promise.all([
      this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute(input),
      this.requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase.execute({
        ...input,
        formKey: 'iva',
        recordEvent: false,
      }),
    ]);
    const salesRows = sourceLedger.sourceRows.filter(
      (row) => row.direction === 'sale',
    );
    const purchaseRows = sourceLedger.sourceRows.filter(
      (row) => row.direction === 'purchase',
    );
    const withholdings = sourceLedger.sourceRows.filter(
      (row) =>
        row.incomeTaxWithholdingInCents > 0 || row.vatWithholdingInCents > 0,
    );
    const vatBuckets: EcuadorTaxVatDeclarationDraftWorkspaceView['vatBuckets'] =
      [
        bucket('taxable_sales', 'Ventas gravadas', salesRows, 'ready'),
        bucket('zero_rate_sales', 'Ventas tarifa 0', [], 'needs_review'),
        bucket('not_subject_sales', 'Ventas no objeto', [], 'needs_review'),
        bucket('creditable_purchases', 'Compras con credito IVA', purchaseRows, 'ready'),
        bucket('non_creditable_purchases', 'Compras sin credito IVA', [], 'needs_review'),
        bucket('withholdings', 'Retenciones asociadas', withholdings, 'ready'),
      ];
    const blockers = [
      ...sourceLedger.blockers,
      ...formDraftPacket.blockers,
      ...vatBuckets
        .filter((item) => item.readinessStatus === 'blocked')
        .map((item) => `vat_workspace.${item.bucketKey}.blocked`),
    ];
    const readyBucketCount = vatBuckets.filter(
      (item) => item.readinessStatus === 'ready',
    ).length;
    const readinessStatus =
      blockers.length > 0
        ? 'blocked'
        : sourceLedger.readinessStatus === 'needs_review' ||
            formDraftPacket.readinessStatus === 'needs_review'
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      sourceLedger,
      formDraftPacket,
      vatBuckets,
      suggestedFormBoxes: formDraftPacket.suggestedBoxes,
      summary: {
        bucketCount: vatBuckets.length,
        readyBucketCount,
        suggestedBoxCount: formDraftPacket.suggestedBoxes.length,
        outputVatInCents: sourceLedger.summary.outputVatInCents,
        inputVatInCents: sourceLedger.summary.inputVatInCents,
        estimatedVatPayableInCents: Math.max(
          sourceLedger.summary.outputVatInCents -
            sourceLedger.summary.inputVatInCents -
            sourceLedger.summary.vatWithholdingInCents,
          0,
        ),
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de preparar IVA.'
          : readinessStatus === 'needs_review'
            ? 'Revisar buckets y casilleros IVA con contador.'
            : 'Usar workspace IVA como borrador asistido para carga manual.',
      guardrails: [
        'No declara ni firma IVA automaticamente.',
        'Los casilleros deben validarse en portal SRI por usuario o contador.',
      ],
    };
  }
}

function bucket(
  bucketKey: EcuadorTaxVatDeclarationDraftWorkspaceView['vatBuckets'][number]['bucketKey'],
  label: string,
  rows: Array<{ subtotalInCents: number; vatInCents: number }>,
  fallbackStatus: EcuadorTaxReadinessStatus,
): EcuadorTaxVatDeclarationDraftWorkspaceView['vatBuckets'][number] {
  return {
    bucketKey,
    label,
    amountInCents: rows.reduce((total, row) => total + row.subtotalInCents, 0),
    vatInCents: rows.reduce((total, row) => total + row.vatInCents, 0),
    sourceRowCount: rows.length,
    readinessStatus: rows.length > 0 ? fallbackStatus : 'needs_review',
  };
}
