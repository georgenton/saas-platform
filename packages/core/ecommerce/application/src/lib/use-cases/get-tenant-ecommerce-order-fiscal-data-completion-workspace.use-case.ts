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
    const buyerProfile = orderDraftDetail.orderDraft.customerProfile;
    const completionHints = invoiceDraftBridge.requiredFields.map((fieldKey) =>
      this.buildCompletionHint(fieldKey),
    );

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
      fiscalProfile: {
        legalName: buyerProfile.buyerCompany ?? buyerProfile.fullName,
        taxIdOrDocument: buyerProfile.buyerTaxIdOrDocument,
        billingEmail: buyerProfile.email,
        billingAddressStatus: 'recommended',
        documentType: 'invoice',
        documentIdHint: 'ruc_cedula_passport',
      },
      completionHints,
      operatorChecklist: [
        'Confirmar razón social o nombre exacto para el comprobante.',
        'Validar identificador del comprador: RUC, cédula o pasaporte antes del handoff.',
        'Confirmar correo fiscal que recibirá la factura electrónica.',
        'Solicitar dirección fiscal si el operador todavía no la capturó.',
        'Mantener tipo de comprobante sugerido como factura para este MVP.',
      ],
      blockedBy,
      guardrails: [
        ...new Set([
          ...orderDraftDetail.guardrails,
          ...invoiceDraftBridge.guardrails,
          'No tratar este workspace como emisión final ni como validación fiscal automática.',
          'Validar RUC, cédula o pasaporte con el comprador antes de crear una factura real.',
        ]),
      ],
    };
  }

  private buildCompletionHint(fieldKey: string): {
    fieldKey: string;
    label: string;
    hint: string;
  } {
    const hints: Record<string, { label: string; hint: string }> = {
      buyer_legal_name: {
        label: 'Razón social o nombre',
        hint: 'Pedir el nombre legal exacto como debe salir en factura.',
      },
      buyer_tax_id_or_document: {
        label: 'RUC, cédula o pasaporte',
        hint: 'Confirmar RUC, cédula o pasaporte del comprador antes del handoff.',
      },
      billing_email: {
        label: 'Correo fiscal',
        hint: 'Confirmar el correo que debe recibir la factura electrónica.',
      },
      accepted_offer_snapshot: {
        label: 'Oferta aceptada',
        hint: 'Guardar la referencia de la oferta cerrada y su pricing final.',
      },
    };

    return {
      fieldKey,
      label: hints[fieldKey]?.label ?? fieldKey.replace(/_/g, ' '),
      hint:
        hints[fieldKey]?.hint ??
        'Completar este dato antes de abrir el draft de factura.',
    };
  }
}
