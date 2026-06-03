import { TenantEcommerceOrderPaymentReconciliationWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderPaymentConfirmationLogUseCase } from './get-tenant-ecommerce-order-payment-confirmation-log.use-case';

export class GetTenantEcommerceOrderPaymentReconciliationWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPaymentConfirmationLogUseCase: GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPaymentReconciliationWorkspaceView | null> {
    const paymentLog =
      await this.getTenantEcommerceOrderPaymentConfirmationLogUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!paymentLog) {
      return null;
    }

    const reconciliationStatus =
      paymentLog.blockedBy.length > 0 ||
      paymentLog.decisionSignal.paymentDecision === 'blocked'
        ? 'blocked'
        : paymentLog.logStatus === 'confirmed' &&
            paymentLog.decisionSignal.paymentDecision === 'confirmed'
          ? 'reconciled'
          : 'needs_review';
    const attemptStatus =
      reconciliationStatus === 'blocked'
        ? 'failed'
        : paymentLog.logStatus === 'confirmed'
          ? 'confirmed'
          : paymentLog.logStatus === 'disputed'
            ? 'needs_review'
            : 'pending';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: paymentLog.productEntity,
      orderDraft: paymentLog.orderDraft,
      reconciliationStatus,
      summary:
        reconciliationStatus === 'reconciled'
          ? 'El cobro operativo, la decision de pago y el lifecycle post-sale están conciliados.'
          : reconciliationStatus === 'blocked'
            ? 'La conciliación de pago está bloqueada y requiere intervención antes de fulfillment.'
            : 'El cobro necesita revisión antes de tratarlo como ingreso conciliado.',
      paymentAttempt: {
        attemptStatus,
        collectionChannel: paymentLog.confirmationRecord.confirmationChannel,
        pricingSnapshot: paymentLog.orderDraft.pricingSnapshot,
        evidenceHints: [...paymentLog.confirmationRecord.evidenceHints],
      },
      reconciliationSignals: {
        paymentLogStatus: paymentLog.logStatus,
        paymentDecision: paymentLog.decisionSignal.paymentDecision,
        postSaleStatus: paymentLog.decisionSignal.postSaleStatus,
      },
      reconciliationChecklist: [
        'Comparar pricing snapshot contra evidencia de cobro.',
        'Confirmar que el canal de cobro coincide con el canal de cierre.',
        'No enviar fulfillment si el pago sigue en needs_review o disputed.',
      ],
      blockedBy: [...paymentLog.blockedBy],
      nextStep:
        reconciliationStatus === 'reconciled'
          ? 'Mantener el pago como confirmado y continuar con fulfillment controlado.'
          : reconciliationStatus === 'blocked'
            ? 'Resolver bloqueos de pago antes de tocar fulfillment o reporting definitivo.'
            : 'Solicitar revisión operativa de evidencia antes de cerrar conciliación.',
      guardrails: [
        ...new Set([
          ...paymentLog.guardrails,
          'Este workspace no ejecuta captura bancaria ni conciliación contra provider real.',
        ]),
      ],
    };
  }
}
