import { Injectable } from '@nestjs/common';
import { EcommerceOrderDraftRepository } from '@saas-platform/ecommerce-application';
import { TenantEcommerceOrderDraftView } from '@saas-platform/ecommerce-domain';
import { PrismaService } from '../prisma.service';

type EcommerceOrderDraftRow = {
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
  customerProfileJson: string;
  requiredFieldsJson: string;
  optionalFieldsJson: string;
  operatorPromptsJson: string;
  missingFieldsJson: string;
  blockedByJson: string;
  guardrailsJson: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaEcommerceOrderDraftRepository
  implements EcommerceOrderDraftRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    command: Parameters<EcommerceOrderDraftRepository['save']>[0],
  ): Promise<TenantEcommerceOrderDraftView> {
    const record = await this.delegate.upsert({
      where: {
        tenantId_productEntityId: {
          tenantId: command.tenantId,
          productEntityId: command.productEntityId,
        },
      },
      update: {
        tenantSlug: command.tenantSlug,
        status: command.status,
        orderLabel: command.orderLabel,
        offerTitle: command.offerTitle,
        pricingSnapshot: command.pricingSnapshot,
        primaryCta: command.primaryCta,
        closingChannel: command.closingChannel,
        captureStatus: command.captureStatus,
        invoicingReadinessStatus: command.invoicingReadinessStatus,
        customerProfileJson: JSON.stringify(command.customerProfile),
        requiredFieldsJson: JSON.stringify(command.requiredFields),
        optionalFieldsJson: JSON.stringify(command.optionalFields),
        operatorPromptsJson: JSON.stringify(command.operatorPrompts),
        missingFieldsJson: JSON.stringify(command.missingFields),
        blockedByJson: JSON.stringify(command.blockedBy),
        guardrailsJson: JSON.stringify(command.guardrails),
      },
      create: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        productEntityId: command.productEntityId,
        status: command.status,
        orderLabel: command.orderLabel,
        offerTitle: command.offerTitle,
        pricingSnapshot: command.pricingSnapshot,
        primaryCta: command.primaryCta,
        closingChannel: command.closingChannel,
        captureStatus: command.captureStatus,
        invoicingReadinessStatus: command.invoicingReadinessStatus,
        customerProfileJson: JSON.stringify(command.customerProfile),
        requiredFieldsJson: JSON.stringify(command.requiredFields),
        optionalFieldsJson: JSON.stringify(command.optionalFields),
        operatorPromptsJson: JSON.stringify(command.operatorPrompts),
        missingFieldsJson: JSON.stringify(command.missingFields),
        blockedByJson: JSON.stringify(command.blockedBy),
        guardrailsJson: JSON.stringify(command.guardrails),
      },
    });

    return this.toView(record as EcommerceOrderDraftRow);
  }

  async listByTenantSlugAndProductEntityId(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderDraftView[]> {
    const records = await this.delegate.findMany({
      where: { tenantSlug, productEntityId },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: EcommerceOrderDraftRow) => this.toView(record));
  }

  async findByTenantSlugAndId(
    tenantSlug: string,
    orderDraftId: string,
  ): Promise<TenantEcommerceOrderDraftView | null> {
    const record = await this.delegate.findFirst({
      where: { tenantSlug, id: orderDraftId },
    });

    return record ? this.toView(record as EcommerceOrderDraftRow) : null;
  }

  async findByTenantSlugAndProductEntityId(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceOrderDraftView | null> {
    const record = await this.delegate.findFirst({
      where: { tenantSlug, productEntityId },
    });

    return record ? this.toView(record as EcommerceOrderDraftRow) : null;
  }

  async updateCustomerProfile(
    command: Parameters<
      EcommerceOrderDraftRepository['updateCustomerProfile']
    >[0],
  ): Promise<TenantEcommerceOrderDraftView | null> {
    const existing = await this.delegate.findFirst({
      where: { tenantSlug: command.tenantSlug, id: command.orderDraftId },
    });

    if (!existing) {
      return null;
    }

    const record = await this.delegate.update({
      where: { id: command.orderDraftId },
      data: {
        status: command.status,
        invoicingReadinessStatus: command.invoicingReadinessStatus,
        customerProfileJson: JSON.stringify(command.customerProfile),
        missingFieldsJson: JSON.stringify(command.missingFields),
        blockedByJson: JSON.stringify(command.blockedBy),
      },
    });

    return this.toView(record as EcommerceOrderDraftRow);
  }

  private toView(
    record: EcommerceOrderDraftRow,
  ): TenantEcommerceOrderDraftView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      productEntityId: record.productEntityId,
      status: record.status,
      orderLabel: record.orderLabel,
      offerTitle: record.offerTitle,
      pricingSnapshot: record.pricingSnapshot,
      primaryCta: record.primaryCta,
      closingChannel: record.closingChannel,
      captureStatus: record.captureStatus,
      invoicingReadinessStatus: record.invoicingReadinessStatus,
      customerProfile: JSON.parse(record.customerProfileJson),
      requiredFields: JSON.parse(record.requiredFieldsJson),
      optionalFields: JSON.parse(record.optionalFieldsJson),
      operatorPrompts: JSON.parse(record.operatorPromptsJson),
      missingFields: JSON.parse(record.missingFieldsJson),
      blockedBy: JSON.parse(record.blockedByJson),
      guardrails: JSON.parse(record.guardrailsJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).ecommerceOrderDraft;
  }
}
