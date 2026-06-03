import {
  TenantEcommerceOrderCustomerProfileUpdateView,
  TenantEcommerceOrderDraftView,
} from '@saas-platform/ecommerce-domain';
import { EcommerceOrderDraftRepository } from '../ports/ecommerce-order-draft.repository';

export type UpdateTenantEcommerceOrderCustomerProfileCommand = {
  fullName?: string | null;
  email?: string | null;
  whatsappPhone?: string | null;
  billingIntent?: string | null;
  buyerCompany?: string | null;
  buyerTaxIdOrDocument?: string | null;
};

export class UpdateTenantEcommerceOrderCustomerProfileUseCase {
  constructor(
    private readonly ecommerceOrderDraftRepository: EcommerceOrderDraftRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
    command: UpdateTenantEcommerceOrderCustomerProfileCommand,
  ): Promise<TenantEcommerceOrderCustomerProfileUpdateView | null> {
    const orderDraft =
      await this.ecommerceOrderDraftRepository.findByTenantSlugAndId(
        tenantSlug,
        orderDraftId,
      );

    if (!orderDraft || orderDraft.productEntityId !== productEntityId) {
      return null;
    }

    const customerProfile = this.mergeProfile(
      orderDraft.customerProfile,
      command,
    );
    const missingFields = this.resolveMissingFields(customerProfile);
    const blockedBy = orderDraft.blockedBy.filter(
      (entry) =>
        !entry.includes('buyer profile') &&
        !entry.includes('datos del comprador'),
    );
    const readinessStatus =
      blockedBy.length > 0
        ? 'blocked'
        : missingFields.length === 0
          ? 'ready_to_invoice'
          : 'needs_data';
    const status = this.resolveOrderStatus(
      orderDraft,
      missingFields,
      blockedBy,
    );

    const updatedOrderDraft =
      await this.ecommerceOrderDraftRepository.updateCustomerProfile({
        tenantSlug,
        orderDraftId,
        status,
        invoicingReadinessStatus: readinessStatus,
        customerProfile,
        missingFields,
        blockedBy,
      });

    if (!updatedOrderDraft) {
      return null;
    }

    const buyerProfileStatus =
      blockedBy.length > 0
        ? 'blocked'
        : missingFields.length === 0
          ? 'ready'
          : 'needs_customer_fiscal_data';
    const handoffStatus =
      blockedBy.length > 0
        ? 'blocked'
        : missingFields.length === 0
          ? 'ready_for_invoice_handoff'
          : 'needs_customer_fiscal_data';

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary:
        missingFields.length === 0
          ? 'El buyer profile ya tiene datos suficientes para continuar el handoff fiscal asistido.'
          : 'El buyer profile quedó actualizado, pero todavía faltan datos mínimos para el handoff fiscal.',
      orderDraft: updatedOrderDraft,
      readinessSnapshot: {
        buyerProfileStatus,
        missingFields,
        handoffStatus,
      },
      nextActions:
        missingFields.length === 0
          ? [
              'Revisar el order draft antes de solicitar invoice handoff.',
              'Mantener el snapshot comercial unido al buyer profile aprobado.',
            ]
          : [
              'Completar los campos faltantes antes de bajar a Invoicing.',
              'No solicitar emisión viva de factura hasta cerrar los datos fiscales.',
            ],
    };
  }

  private mergeProfile(
    current: TenantEcommerceOrderDraftView['customerProfile'],
    command: UpdateTenantEcommerceOrderCustomerProfileCommand,
  ): TenantEcommerceOrderDraftView['customerProfile'] {
    return {
      fullName: this.normalize(command.fullName, current.fullName),
      email: this.normalize(command.email, current.email),
      whatsappPhone: this.normalize(
        command.whatsappPhone,
        current.whatsappPhone,
      ),
      billingIntent: this.normalize(
        command.billingIntent,
        current.billingIntent,
      ),
      buyerCompany: this.normalize(command.buyerCompany, current.buyerCompany),
      buyerTaxIdOrDocument: this.normalize(
        command.buyerTaxIdOrDocument,
        current.buyerTaxIdOrDocument,
      ),
    };
  }

  private resolveMissingFields(
    customerProfile: TenantEcommerceOrderDraftView['customerProfile'],
  ): string[] {
    const missingFields: string[] = [];
    const legalName = customerProfile.buyerCompany ?? customerProfile.fullName;

    if (!legalName) {
      missingFields.push('buyer_legal_name');
    }

    if (!customerProfile.buyerTaxIdOrDocument) {
      missingFields.push('buyer_tax_id_or_document');
    }

    if (!customerProfile.email) {
      missingFields.push('billing_email');
    }

    return missingFields;
  }

  private resolveOrderStatus(
    orderDraft: TenantEcommerceOrderDraftView,
    missingFields: string[],
    blockedBy: string[],
  ): TenantEcommerceOrderDraftView['status'] {
    if (blockedBy.length > 0) {
      return 'blocked';
    }

    if (missingFields.length === 0) {
      return 'ready_for_review';
    }

    if (orderDraft.captureStatus === 'ready_for_order_draft') {
      return 'draft';
    }

    return 'needs_data';
  }

  private normalize(
    value: string | null | undefined,
    fallback: string | null,
  ): string | null {
    if (value === undefined) {
      return fallback;
    }

    const trimmed = value?.trim() ?? '';

    return trimmed.length > 0 ? trimmed : null;
  }
}
