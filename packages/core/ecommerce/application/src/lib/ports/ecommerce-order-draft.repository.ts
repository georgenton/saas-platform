import { TenantEcommerceOrderDraftView } from '@saas-platform/ecommerce-domain';

export interface EcommerceOrderDraftRepository {
  save(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    productEntityId: string;
    status: 'draft' | 'needs_data' | 'ready_for_review' | 'blocked';
    orderLabel: string;
    offerTitle: string;
    pricingSnapshot: string;
    primaryCta: string;
    closingChannel: 'landing' | 'catalog' | 'whatsapp';
    captureStatus: 'ready_for_order_draft' | 'needs_customer_input' | 'blocked';
    invoicingReadinessStatus: 'ready_to_invoice' | 'needs_data' | 'blocked';
    customerProfile: {
      fullName: string | null;
      email: string | null;
      whatsappPhone: string | null;
      billingIntent: string | null;
      buyerCompany: string | null;
      buyerTaxIdOrDocument: string | null;
    };
    requiredFields: string[];
    optionalFields: string[];
    operatorPrompts: string[];
    missingFields: string[];
    blockedBy: string[];
    guardrails: string[];
  }): Promise<TenantEcommerceOrderDraftView>;
  listByTenantSlugAndProductEntityId(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderDraftView[]>;
  findByTenantSlugAndId(
    tenantSlug: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderDraftView | null>;
  findByTenantSlugAndProductEntityId(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderDraftView | null>;
}
