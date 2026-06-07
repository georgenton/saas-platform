import { TenantAccountingTaxDeclarationEvidenceBridgeView } from '@saas-platform/accounting-domain';
import { RequestTenantAccountingTaxComplianceFeedbackBridgeUseCase } from './request-tenant-accounting-tax-compliance-feedback-bridge.use-case';

export class GetTenantAccountingTaxDeclarationEvidenceBridgeUseCase {
  constructor(
    private readonly requestTenantAccountingTaxComplianceFeedbackBridgeUseCase: RequestTenantAccountingTaxComplianceFeedbackBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingTaxDeclarationEvidenceBridgeView> {
    const feedbackBridge =
      await this.requestTenantAccountingTaxComplianceFeedbackBridgeUseCase.execute(
        input,
      );
    const financialPreview =
      feedbackBridge.closeoutPack.commandCenter.financialPreview;
    const evidenceLines: TenantAccountingTaxDeclarationEvidenceBridgeView['evidenceLines'] =
      [
        {
          lineKey: 'accounting:revenue',
          label: 'Ingresos contables preview',
          source: 'accounting_financial_statement_preview',
          amountInCents: financialPreview.incomeStatement.revenueInCents,
          taxUse: 'income_tax',
          confidence: 'medium',
          notes: ['Comparar contra ventas SRI/plataforma antes de declarar.'],
        },
        {
          lineKey: 'accounting:expenses',
          label: 'Gastos contables preview',
          source: 'accounting_financial_statement_preview',
          amountInCents: financialPreview.incomeStatement.expenseInCents,
          taxUse: 'income_tax',
          confidence: 'review_required',
          notes: ['Validar deducibilidad fiscal con contador.'],
        },
        {
          lineKey: 'accounting:tax_expense',
          label: 'Impuestos contables preview',
          source: 'accounting_financial_statement_preview',
          amountInCents: financialPreview.incomeStatement.taxExpenseInCents,
          taxUse: 'vat',
          confidence: 'review_required',
          notes: ['Usar solo como senal comparativa contra IVA/retenciones.'],
        },
        {
          lineKey: 'accounting:bank_difference',
          label: 'Diferencia bancaria operacional',
          source: 'accounting_bank_reconciliation_workspace',
          amountInCents:
            feedbackBridge.closeoutPack.commandCenter.bankReconciliation.summary
              .totalDifferenceInCents,
          taxUse: 'annex',
          confidence:
            feedbackBridge.closeoutPack.commandCenter.bankReconciliation.summary
              .totalDifferenceInCents === 0
              ? 'high'
              : 'review_required',
          notes: ['Diferencias bancarias pueden afectar anexos o soporte de pago.'],
        },
      ];
    const blockers = [...feedbackBridge.blockers];
    const reviewRequiredLineCount = evidenceLines.filter(
      (line) => line.confidence === 'review_required',
    ).length;
    const evidenceStatus =
      blockers.length > 0
        ? 'blocked'
        : reviewRequiredLineCount > 0
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      evidenceStatus,
      feedbackBridge,
      evidenceLines,
      reconciliationHints: [
        {
          key: 'sri_platform_accounting_compare',
          label: 'Comparar SRI, plataforma y Accounting',
          severity: reviewRequiredLineCount > 0 ? 'high' : 'normal',
          detail:
            'Usar esta evidencia para explicar diferencias, no para sobrescribir formularios fiscales.',
        },
      ],
      summary: {
        evidenceLineCount: evidenceLines.length,
        highConfidenceLineCount: evidenceLines.filter(
          (line) => line.confidence === 'high',
        ).length,
        reviewRequiredLineCount,
        totalRevenueInCents: financialPreview.incomeStatement.revenueInCents,
        totalExpenseInCents: financialPreview.incomeStatement.expenseInCents,
        totalTaxInCents: financialPreview.incomeStatement.taxExpenseInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        evidenceStatus === 'ready'
          ? 'Adjuntar evidencia Accounting al review tributario del periodo.'
          : 'Revisar lineas contables con contador antes de usarlas en formularios.',
      guardrails: [
        'Evidencia Accounting es comparativa y no reemplaza SRI ni criterio fiscal.',
        'No calcula ni presenta declaraciones automaticamente.',
        'Las diferencias deben explicarse antes del filing handoff.',
      ],
    };
  }
}
