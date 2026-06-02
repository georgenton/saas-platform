import { TenantEcommerceOrderFiscalDataCompletionWorkspaceView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderDraftDetailUseCase } from './get-tenant-ecommerce-order-draft-detail.use-case';
import { RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase } from './request-tenant-ecommerce-order-invoice-draft-bridge.use-case';

export class GetTenantEcommerceOrderFiscalDataCompletionWorkspaceUseCase {
  constructor(
    private readonly getTenantEcommerceOrderDraftDetailUseCase: GetTenantEcommerceOrderDraftDetailUseCase,
    private readonly requestTenantEcommerceOrderInvoiceDraftBridgeUseCase: RequestTenantEcommerceOrderInvoiceDraftBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderFiscalDataCompletionWorkspaceView | null> {
    const [orderDraftDetail, invoiceDraftBridge] = await Promise.all([
      this.getTenantEcommerceOrderDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
      this.requestTenantEcommerceOrderInvoiceDraftBridgeUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      ),
    ]);

    if (!orderDraftDetail || !invoiceDraftBridge) {
      return null;
    }

    const blockedBy = [
      ...orderDraftDetail.blockedBy,
      ...invoiceDraftBridge.blockedBy,
    ];

    const workspaceStatus =
      blockedBy.length > 0
        ? 'blocked'
        : invoiceDraftBridge.missingFields.length === 0
          ? 'ready'
          : 'needs_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: orderDraftDetail.productEntity,
      orderDraft: orderDraftDetail.orderDraft,
      workspaceStatus,
      summary:
        workspaceStatus === 'ready'
          ? 'Los datos fiscales mínimos ya tienen suficiente forma para abrir un invoice draft asistido.'
          : workspaceStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar esta orden como completable en fiscal.'
            : 'La orden ya puede moverse hacia fiscal completion, pero todavía faltan datos mínimos del comprador.',
      targetWorkspace: {
        productKey: 'invoicing',
        stage: 'electronic_invoicing_ec_mvp',
      },
      requiredFields: [...invoiceDraftBridge.requiredFields],
      missingFields: [...invoiceDraftBridge.missingFields],
      completionHints: invoiceDraftBridge.requiredFields.map((fieldKey) => ({
        fieldKey,
        label: fieldKey.replace(/_/g, ' '),
        hint:
          fieldKey === 'buyer_legal_name'
            ? 'Pedir el nombre legal exacto como debe salir en factura.'
            : fieldKey === 'buyer_tax_id_or_document'
              ? 'Confirmar RUC, cédula o documento equivalente del comprador.'
              : fieldKey === 'billing_email'
                ? 'Confirmar el correo que debe recibir la factura.'
                : fieldKey === 'accepted_offer_snapshot'
                  ? 'Guardar la referencia de la oferta cerrada y su pricing final.'
                  : 'Completar este dato antes de abrir el draft de factura.',
      })),
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...invoiceDraftBridge.guardrails,
          'No tratar este workspace como emisión final ni como validación fiscal automática.',
        ]),
      ],
    };
  }
}
