import { TenantEcommerceOrderPaymentDisputeWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderPaymentConfirmationLogUseCase } from './get-tenant-ecommerce-order-payment-confirmation-log.use-case';
import { GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase } from './get-tenant-ecommerce-order-post-sale-lifecycle-detail.use-case';
import { RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase } from './request-tenant-ecommerce-order-payment-confirmation-decision.use-case';

export class GetTenantEcommerceOrderPaymentDisputeWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderPaymentConfirmationLogUseCase: GetTenantEcommerceOrderPaymentConfirmationLogUseCase,
    private readonly requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase: RequestTenantEcommerceOrderPaymentConfirmationDecisionUseCase,
    private readonly getTenantEcommerceOrderPostSaleLifecycleDetailUseCase: GetTenantEcommerceOrderPostSaleLifecycleDetailUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderPaymentDisputeWorkspaceView | null> {
    const [paymentLog, decision, postSaleLifecycle] = await Promise.all([
      this.getTenantEcommerceOrderPaymentConfirmationLogUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceOrderPaymentConfirmationDecisionUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.getTenantEcommerceOrderPostSaleLifecycleDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
    ]);

    if (!paymentLog || !decision || !postSaleLifecycle) {
      return null;
    }

    const blockedBy = [
      ...paymentLog.blockedBy,
      ...decision.blockedBy,
      ...postSaleLifecycle.blockedBy,
    ];

    const disputeStatus =
      paymentLog.logStatus === 'disputed' ||
      decision.decision === 'blocked' ||
      postSaleLifecycle.currentStatus === 'blocked' ||
      blockedBy.length > 0
        ? 'hold'
        : paymentLog.logStatus === 'needs_review' ||
            decision.decision === 'needs_review'
          ? 'needs_review'
          : 'confirmed';

    const activeChannel = paymentLog.confirmationRecord.confirmationChannel;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: paymentLog.productEntity,
      orderDraft: paymentLog.orderDraft,
      disputeStatus,
      summary:
        disputeStatus === 'confirmed'
          ? 'La orden ya tiene una ruta de cobro suficientemente clara y no presenta fricción operativa relevante.'
          : disputeStatus === 'hold'
            ? 'La orden necesita pausa operativa hasta resolver inconsistencias de cobro o lifecycle.'
            : 'La orden sigue necesitando revisión humana antes de tratar el cobro como definitivo.',
      disputeProfile: {
        disputeReason:
          disputeStatus === 'hold'
            ? 'Existe fricción entre señales de cobro, decisión operativa y lifecycle post-sale.'
            : disputeStatus === 'needs_review'
              ? 'Las señales de cobro todavía no alcanzan un nivel de certeza suficiente.'
              : 'Las señales de cobro quedaron alineadas para continuar sin disputa activa.',
        activeChannel,
        recommendedOwnerRole: 'operator',
        expectedEvidence: [
          ...paymentLog.confirmationRecord.evidenceHints,
          'Confirmación del canal de cobro usado por el buyer.',
        ],
      },
      resolutionPaths: [
        {
          key: 'confirmed',
          label: 'Confirmar cobro',
          detail:
            'Usar esta salida cuando evidencia, decisión y lifecycle ya están alineados.',
        },
        {
          key: 'needs_review',
          label: 'Mantener revisión',
          detail:
            'Mantener la orden bajo revisión si falta evidencia o la señal todavía es ambigua.',
        },
        {
          key: 'hold',
          label: 'Enviar a hold',
          detail:
            'Detener el avance cuando la disputa compromete fulfillment, billing o cierre operativo.',
        },
      ],
      nextStep:
        disputeStatus === 'confirmed'
          ? 'Continuar hacia fulfillment o cierre post-venta sin abrir una disputa adicional.'
          : disputeStatus === 'hold'
            ? 'Pedir evidencia extra y resolver inconsistencia antes de seguir operando la orden.'
            : 'Revisar evidencia, operador note y lifecycle antes de confirmar cobro.',
      blockedBy,
      guardrails: [
        ...new Set([
          ...paymentLog.guardrails,
          ...decision.guardrails,
          ...postSaleLifecycle.guardrails,
          'Este workspace orienta la resolución operativa del cobro; no reemplaza conciliación bancaria ni control contable formal.',
        ]),
      ],
    };
  }
}
