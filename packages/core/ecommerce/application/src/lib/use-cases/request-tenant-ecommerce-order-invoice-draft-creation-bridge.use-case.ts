import { TenantEcommerceOrderInvoiceDraftCreationBridgeView } from '@saas-platform/ecommerce-domain';
import { RequestTenantEcommerceOrderInvoiceExecutionPacketUseCase } from './request-tenant-ecommerce-order-invoice-execution-packet.use-case';

export class RequestTenantEcommerceOrderInvoiceDraftCreationBridgeUseCase {
  constructor(
    private readonly requestTenantEcommerceOrderInvoiceExecutionPacketUseCase: RequestTenantEcommerceOrderInvoiceExecutionPacketUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderInvoiceDraftCreationBridgeView | null> {
    const executionPacket =
      await this.requestTenantEcommerceOrderInvoiceExecutionPacketUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!executionPacket) {
      return null;
    }

    const customerId = this.resolveCustomerId(executionPacket.orderDraft);
    const unitPriceInCents = this.resolveUnitPriceInCents(
      executionPacket.invoicePayload.pricingSnapshot,
    );
    const blockedBy = [
      ...executionPacket.blockedBy,
      ...(executionPacket.executionStatus === 'blocked'
        ? ['invoice_execution_packet_blocked']
        : []),
    ];
    const requiredActions = [
      ...executionPacket.requiredActions,
      ...(customerId ? [] : ['Mapear buyer profile a customerId de Invoicing.']),
      ...(unitPriceInCents > 0
        ? []
        : ['Confirmar precio unitario en centavos para el item de factura.']),
    ];
    const creationStatus =
      blockedBy.length > 0
        ? 'blocked'
        : customerId && unitPriceInCents > 0
          ? 'ready_to_create_invoice_draft'
          : 'needs_customer_mapping';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: executionPacket.productEntity,
      orderDraft: executionPacket.orderDraft,
      creationStatus,
      summary:
        creationStatus === 'ready_to_create_invoice_draft'
          ? 'El bridge ya contiene request compatible para crear invoice draft e item en Invoicing.'
          : creationStatus === 'blocked'
            ? 'El bridge no debe crear invoice draft porque existen bloqueos previos.'
            : 'El bridge ya mapea la orden a requests de Invoicing, pero falta customerId real.',
      invoicingTarget: {
        invoiceEndpoint: `/api/invoicing/tenants/${tenantSlug}/invoices`,
        itemEndpointTemplate:
          `/api/invoicing/tenants/${tenantSlug}/invoices/{invoiceId}/items`,
        requiredPermission: 'invoicing.invoices.manage',
        submitSri: false,
      },
      invoiceCreateRequest: {
        customerId,
        customerLabel: executionPacket.invoicePayload.customerLabel,
        currency: 'USD',
        status: 'draft',
        notes: `Created from ecommerce order draft ${orderDraftId}. ${executionPacket.invoicePayload.offerTitle}.`,
      },
      itemCreateRequests: [
        {
          description: executionPacket.invoicePayload.offerTitle,
          quantity: 1,
          unitPriceInCents,
          taxRateId: null,
        },
      ],
      requiredActions,
      blockedBy,
      guardrails: [
        ...executionPacket.guardrails,
        'Crear sólo invoice draft; no cambiar status a issued ni enviar al SRI desde este bridge.',
        'Adjuntar el sourceOrderDraftId como trazabilidad antes de cualquier emisión fiscal.',
      ],
    };
  }

  private resolveCustomerId(
    orderDraft: TenantEcommerceOrderInvoiceDraftCreationBridgeView['orderDraft'],
  ): string | null {
    const profile = orderDraft.customerProfile;

    return typeof (profile as Record<string, unknown>).customerId === 'string'
      ? ((profile as Record<string, unknown>).customerId as string)
      : null;
  }

  private resolveUnitPriceInCents(pricingSnapshot: string): number {
    const match = pricingSnapshot.match(/(?:USD|\$)\s*(\d+(?:\.\d{1,2})?)/i);

    if (!match) {
      return 0;
    }

    return Math.round(Number.parseFloat(match[1]) * 100);
  }
}
