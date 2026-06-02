import { randomUUID } from 'node:crypto';
import { TenantEcommerceOrderDraftSaveView } from '@saas-platform/ecommerce-domain';
import { GetTenantBySlugUseCase } from '@saas-platform/tenancy-application';
import { EcommerceOrderDraftRepository } from '../ports/ecommerce-order-draft.repository';
import { RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase } from './request-tenant-ecommerce-checkout-customer-capture-packet.use-case';
import { RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase } from './request-tenant-ecommerce-order-to-invoice-readiness-packet.use-case';

export class SaveTenantEcommerceOrderDraftUseCase {
  constructor(
    private readonly getTenantBySlugUseCase: GetTenantBySlugUseCase,
    private readonly requestTenantEcommerceCheckoutCustomerCapturePacketUseCase: RequestTenantEcommerceCheckoutCustomerCapturePacketUseCase,
    private readonly requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase: RequestTenantEcommerceOrderToInvoiceReadinessPacketUseCase,
    private readonly ecommerceOrderDraftRepository: EcommerceOrderDraftRepository,
    private readonly idGenerator: () => string = () => randomUUID(),
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderDraftSaveView | null> {
    const [tenant, capturePacket, invoiceReadiness, existing] = await Promise.all([
      this.getTenantBySlugUseCase.execute(tenantSlug),
      this.requestTenantEcommerceCheckoutCustomerCapturePacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.requestTenantEcommerceOrderToInvoiceReadinessPacketUseCase.execute(
        tenantSlug,
        productEntityId,
      ),
      this.ecommerceOrderDraftRepository.findByTenantSlugAndProductEntityId(
        tenantSlug,
        productEntityId,
      ),
    ]);

    if (!capturePacket || !invoiceReadiness) {
      return null;
    }

    const status =
      capturePacket.captureStatus === 'blocked' ||
      invoiceReadiness.readinessStatus === 'blocked'
        ? 'blocked'
        : invoiceReadiness.readinessStatus === 'ready_to_invoice'
          ? 'ready_for_review'
          : capturePacket.captureStatus === 'ready_for_order_draft'
            ? 'draft'
            : 'needs_data';

    const orderDraft = await this.ecommerceOrderDraftRepository.save({
      id: existing?.id ?? this.idGenerator(),
      tenantId: tenant.id,
      tenantSlug,
      productEntityId,
      status,
      orderLabel: `${capturePacket.productEntity.title} order draft`,
      offerTitle: capturePacket.orderDraftSeed.offerTitle,
      pricingSnapshot: capturePacket.orderDraftSeed.pricingSnapshot,
      primaryCta: capturePacket.orderDraftSeed.primaryCta,
      closingChannel: capturePacket.orderDraftSeed.closingChannel,
      captureStatus: capturePacket.captureStatus,
      invoicingReadinessStatus: invoiceReadiness.readinessStatus,
      customerProfile: existing?.customerProfile ?? {
        fullName: null,
        email: null,
        whatsappPhone: null,
        billingIntent: null,
        buyerCompany: null,
        buyerTaxIdOrDocument: null,
      },
      requiredFields: [...capturePacket.captureForm.requiredFields],
      optionalFields: [...capturePacket.captureForm.optionalFields],
      operatorPrompts: [...capturePacket.operatorPrompts],
      missingFields: [...invoiceReadiness.missingFields],
      blockedBy: [
        ...new Set([
          ...capturePacket.blockedBy,
          ...invoiceReadiness.blockedBy,
        ]),
      ],
      guardrails: [
        ...new Set([
          ...capturePacket.guardrails,
          ...invoiceReadiness.guardrails,
        ]),
      ],
    });

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: this.buildSummary(orderDraft.status),
      orderDraft,
    };
  }

  private buildSummary(status: TenantEcommerceOrderDraftSaveView['orderDraft']['status']): string {
    if (status === 'ready_for_review') {
      return 'La intención de compra ya quedó persistida como order draft y puede pasar a revisión operativa.';
    }

    if (status === 'blocked') {
      return 'El order draft quedó persistido con bloqueos visibles para que el equipo pueda retomarlo sin perder contexto.';
    }

    if (status === 'draft') {
      return 'El order draft quedó persistido como cierre comercial asistido, aunque todavía conviene completar datos antes del cierre final.';
    }

    return 'El order draft quedó persistido, pero todavía necesita datos mínimos del comprador antes de tratarlo como cierre operable.';
  }
}
