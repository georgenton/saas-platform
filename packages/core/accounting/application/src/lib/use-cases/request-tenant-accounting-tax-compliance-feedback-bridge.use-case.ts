import { TenantAccountingTaxComplianceFeedbackBridgeView } from '@saas-platform/accounting-domain';
import { RequestTenantAccountingFoundationCloseoutPackV2UseCase } from './request-tenant-accounting-foundation-closeout-pack-v2.use-case';

export class RequestTenantAccountingTaxComplianceFeedbackBridgeUseCase {
  constructor(
    private readonly requestTenantAccountingFoundationCloseoutPackV2UseCase: RequestTenantAccountingFoundationCloseoutPackV2UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingTaxComplianceFeedbackBridgeView> {
    const closeoutPack =
      await this.requestTenantAccountingFoundationCloseoutPackV2UseCase.execute(
        input,
      );
    const feedbackSignals: TenantAccountingTaxComplianceFeedbackBridgeView['feedbackSignals'] =
      [
        {
          key: 'financial_preview_for_declarations',
          label: 'Financial preview for declarations',
          status:
            closeoutPack.commandCenter.financialPreview.previewStatus ===
            'ready_for_review'
              ? 'ready'
              : closeoutPack.commandCenter.financialPreview.previewStatus ===
                  'blocked'
                ? 'blocked'
                : 'needs_review',
          taxUse: 'declaration_evidence',
          detail: `${closeoutPack.commandCenter.financialPreview.summary.trialBalanceAccountCount} cuentas disponibles para revision tributaria.`,
        },
        {
          key: 'bank_reconciliation_for_annexes',
          label: 'Bank reconciliation for annexes',
          status: closeoutPack.commandCenter.bankReconciliation.readinessStatus,
          taxUse: 'annex_review',
          detail: `${closeoutPack.commandCenter.bankReconciliation.summary.exactMatchCount}/${closeoutPack.commandCenter.bankReconciliation.summary.candidateCount} matches bancarios.`,
        },
        {
          key: 'professional_closeout_for_handoff',
          label: 'Professional closeout for handoff',
          status:
            closeoutPack.closeoutStatus === 'foundation_complete'
              ? 'ready'
              : closeoutPack.closeoutStatus === 'blocked'
                ? 'blocked'
                : 'needs_review',
          taxUse: 'accountant_handoff',
          detail: `Accounting closeout ${closeoutPack.closeoutStatus}.`,
        },
        {
          key: 'opening_balance_guardrail',
          label: 'Opening balance guardrail',
          status:
            closeoutPack.commandCenter.openingBalance.registryStatus === 'ready'
              ? 'ready'
              : closeoutPack.commandCenter.openingBalance.registryStatus === 'blocked'
                ? 'blocked'
                : 'needs_review',
          taxUse: 'period_guardrail',
          detail: `${closeoutPack.commandCenter.openingBalance.summary.materializedEntryCount} asientos de apertura materializados.`,
        },
      ];
    const blockedSignalCount = feedbackSignals.filter(
      (signal) => signal.status === 'blocked',
    ).length;
    const needsReviewSignalCount = feedbackSignals.filter(
      (signal) => signal.status === 'needs_review',
    ).length;
    const bridgeStatus =
      blockedSignalCount > 0
        ? 'blocked'
        : needsReviewSignalCount > 0
          ? 'needs_accountant_review'
          : 'usable_for_tax';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      bridgeStatus,
      closeoutPack,
      feedbackSignals,
      summary: {
        signalCount: feedbackSignals.length,
        usableSignalCount: feedbackSignals.filter(
          (signal) => signal.status === 'ready',
        ).length,
        needsReviewSignalCount,
        blockedSignalCount,
      },
      blockers: [...closeoutPack.blockers],
      nextStep:
        bridgeStatus === 'usable_for_tax'
          ? 'Consumir señales Accounting en Tax Compliance EC para revisar declaraciones.'
          : 'Enviar señales Accounting pendientes a contador antes de usarlas en declaraciones.',
      guardrails: [
        'Bridge informativo: Tax Compliance no hereda ownership de journals ni libros.',
        'No presenta declaraciones ni reemplaza revision del contador.',
        'Los montos contables se usan como evidencia comparativa, no como verdad fiscal unica.',
      ],
    };
  }
}
