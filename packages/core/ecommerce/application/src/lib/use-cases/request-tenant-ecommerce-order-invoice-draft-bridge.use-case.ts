import { TenantEcommerceOrderInvoiceDraftBridgeView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';
import { RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase } from './request-tenant-ecommerce-order-to-invoice-readiness-packet.use-case';

export class RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase: RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderInvoiceDraftBridgeView | null> {
    const [orderDraftDetail, invoiceReadiness] = await Promise.all([
      this.getTenantEcommerceOrderDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!orderDraftDetail || !invoiceReadiness) {
      return null;
    }

    const blockedBy = [
      ...orderDraftDetail.blockedBy,
      ...invoiceReadiness.blockedBy,
    ];

    const missingFields = [
      ...new Set([
        ...orderDraftDetail.orderDraft.missingFields,
        ...invoiceReadiness.missingFields,
      ]),
    ];

    const bridgeStatus =
      blockedBy.length > 0
        ? 'blocked'
        : orderDraftDetail.orderDraft.status === 'ready_for_review' &&
            invoiceReadiness.readinessStatus === 'ready_to_invoice'
          ? 'ready_to_open_invoice_draft'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      bridgeStatus,
      summary:
        bridgeStatus === 'ready_to_open_invoice_draft'
          ? 'La orden ya tiene suficiente forma comercial y fiscal para abrir un invoice draft asistido.'
          : bridgeStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como seed de invoice draft.'
            : 'La orden ya se puede perfilar hacia factura, pero todavía faltan datos mínimos antes de abrir el draft.',
      targetWorkspace: {
        productKey: 'invoicing',
        stage: 'electronic_invoicing_ec_mvp',
        handoffMode: 'operator_assist',
      },
      invoiceDraftSeed: {
        customerLabel:
          orderDraftDetail.orderDraft.customerProfile.fullName ??
          orderDraftDetail.orderDraft.customerProfile.buyerCompany ??
          orderDraftDetail.orderDraft.offerTitle,
        documentHint: 'invoice',
        offerTitle: orderDraftDetail.orderDraft.offerTitle,
        pricingSnapshot: orderDraftDetail.orderDraft.pricingSnapshot,
        billingIntent:
          orderDraftDetail.orderDraft.customerProfile.billingIntent,
      },
      requiredFields: [...invoiceReadiness.fiscalRequirements],
      missingFields,
      handoffArtifacts: [
        'Order draft snapshot',
        ...invoiceReadiness.handoffArtifacts,
      ],
      operatorChecklist: [
        ...invoiceReadiness.operatorChecklist,
        'Confirmar que el customer label del invoice draft coincide con el buyer profile del order draft.',
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...invoiceReadiness.guardrails,
          'No tratar este bridge como emisión automática de factura ni como documento final.',
        ]),
      ],
    };
  }
}
