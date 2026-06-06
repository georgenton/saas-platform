import { EcuadorTaxIncomeTaxEvidenceWorkspaceView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationSourceLedgerUseCase } from './get-tenant-ecuador-tax-declaration-source-ledger.use-case';
import { RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase } from './request-tenant-ecuador-tax-income-tax-evidence-packet.use-case';

export class GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase: RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxIncomeTaxEvidenceWorkspaceView> {
    const [sourceLedger, evidencePacket] = await Promise.all([
      this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute(input),
      this.requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const revenueRows = sourceLedger.sourceRows.filter(
      (row) => row.direction === 'sale',
    );
    const purchaseRows = sourceLedger.sourceRows.filter(
      (row) => row.direction === 'purchase',
    );
    const withholdingRows = sourceLedger.sourceRows.filter(
      (row) => row.incomeTaxWithholdingInCents > 0,
    );
    const grossRevenueInCents = revenueRows.reduce(
      (total, row) => total + row.subtotalInCents,
      0,
    );
    const deductibleExpenseInCents =
      evidencePacket.estimatedTaxableBaseByCurrency.reduce(
        (total, row) => total + row.deductibleExpenseInCents,
        0,
      );
    const withholdingCreditInCents = withholdingRows.reduce(
      (total, row) => total + row.incomeTaxWithholdingInCents,
      0,
    );
    const classifications: EcuadorTaxIncomeTaxEvidenceWorkspaceView['classifications'] =
      [
        {
          key: 'gross_revenue',
          label: 'Ingresos gravables operativos',
          amountInCents: grossRevenueInCents,
          rowCount: revenueRows.length,
          readinessStatus: revenueRows.length > 0 ? 'ready' : 'needs_review',
          notes: ['Ventas emitidas y evidencia SRI/plataforma.'],
        },
        {
          key: 'deductible_expenses',
          label: 'Gastos deducibles preliminares',
          amountInCents: deductibleExpenseInCents,
          rowCount: purchaseRows.length,
          readinessStatus:
            evidencePacket.readinessStatus === 'blocked'
              ? 'blocked'
              : 'needs_review',
          notes: ['Deducibilidad requiere revision del contador.'],
        },
        {
          key: 'withholding_credits',
          label: 'Creditos por retenciones',
          amountInCents: withholdingCreditInCents,
          rowCount: withholdingRows.length,
          readinessStatus: withholdingRows.length > 0 ? 'ready' : 'needs_review',
          notes: ['Cruzar con certificados de retencion.'],
        },
      ];
    const blockers = [...sourceLedger.blockers, ...evidencePacket.blockers];
    const readinessStatus =
      blockers.length > 0
        ? 'blocked'
        : evidencePacket.readinessStatus === 'needs_review' ||
            sourceLedger.readinessStatus === 'needs_review'
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      sourceLedger,
      evidencePacket,
      classifications,
      summary: {
        grossRevenueInCents,
        deductibleExpenseInCents,
        nonDeductibleReviewAmountInCents: Math.max(
          sourceLedger.summary.purchaseSubtotalInCents -
            deductibleExpenseInCents,
          0,
        ),
        estimatedTaxableBaseInCents: Math.max(
          grossRevenueInCents - deductibleExpenseInCents,
          0,
        ),
        withholdingCreditInCents,
        gapCount: sourceLedger.summary.gapCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de preparar evidencia de renta.'
          : 'Revisar clasificaciones de renta con contador.',
      guardrails: [
        'No calcula impuesto a la renta final.',
        'Deducibilidad y conciliacion tributaria requieren criterio profesional.',
      ],
    };
  }
}
