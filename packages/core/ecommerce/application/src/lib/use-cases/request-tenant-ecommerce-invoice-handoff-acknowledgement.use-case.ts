import { TenantEcommerceInvoiceHandoffAcknowledgementView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase } from './get-tenant-ecommerce-invoice-draft-handoff-workspace.use-case';

export class RequestTenantEcommerceInvoiceHandoffAcknowledgementUseCase {
  constructor(
    private readonly getTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase: GetTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceInvoiceHandoffAcknowledgementView | null> {
    const handoffWorkspace =
      await this.getTenantEcommerceInvoiceDraftHandoffWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        orderDraftId,
      );

    if (!handoffWorkspace) {
      return null;
    }

    const acknowledgementStatus =
      handoffWorkspace.workspaceStatus === 'blocked'
        ? 'blocked'
        : handoffWorkspace.workspaceStatus === 'ready_for_invoice_handoff' &&
            handoffWorkspace.routeSnapshot.routeConfirmed
          ? 'accepted'
          : 'needs_data';

    const missingSignals =
      acknowledgementStatus === 'accepted'
        ? []
        : [
            ...(handoffWorkspace.routeSnapshot.routeConfirmed
              ? []
              : ['La ruta de la orden todavía no está confirmada hacia Invoicing.']),
            ...handoffWorkspace.blockedBy,
          ];

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      productEntity: handoffWorkspace.productEntity,
      orderDraft: handoffWorkspace.orderDraft,
      acknowledgementStatus,
      summary:
        acknowledgementStatus === 'accepted'
          ? 'El handoff hacia Invoicing ya tiene suficiente forma para ser recibido por el otro workspace.'
          : acknowledgementStatus === 'blocked'
            ? 'Todavía hay bloqueos y no conviene tratar el handoff como acknowledgement aceptado.'
            : 'El handoff ya existe, pero todavía necesita más señales antes de considerarse recibido de forma operable.',
      targetWorkspace: {
        ...handoffWorkspace.targetWorkspace,
      },
      receivedArtifacts: [...handoffWorkspace.handoffArtifacts],
      missingSignals: [...new Set(missingSignals)],
      nextStep:
        acknowledgementStatus === 'accepted'
          ? 'Abrir el invoice draft en Invoicing y mantener trazabilidad del snapshot comercial.'
          : acknowledgementStatus === 'blocked'
            ? 'Resolver bloqueos del handoff antes de intentar mover la orden al siguiente frente.'
            : 'Confirmar la ruta y completar los datos mínimos antes de pedir recepción del handoff.',
      blockedBy: [...handoffWorkspace.blockedBy],
      guardrails: [
        ...new Set([
          ...handoffWorkspace.guardrails,
          'Este acknowledgement confirma preparación de recepción; no implica emisión tributaria ni cobro real.',
        ]),
      ],
    };
  }
}
