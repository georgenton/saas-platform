import { Injectable } from '@nestjs/common';
import { EcommerceProductEntityRepository } from '@saas-platform/ecommerce-application';
import { TenantEcommerceProductEntityView } from '@saas-platform/ecommerce-domain';
import { PrismaService } from '../prisma.service';

type EcommerceProductEntityRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  productSetupId: string;
  savedDraftId: string;
  sourceDraftId: string;
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  status:
    | 'draft_catalog_product'
    | 'needs_channel_assets'
    | 'needs_activation';
  pricingBand: string | null;
  offerAngle: string | null;
  primaryCta: string | null;
  suggestedChannelsJson: string;
  channelSequenceJson: string;
  promotedFromSetupAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaEcommerceProductEntityRepository
  implements EcommerceProductEntityRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    command: Parameters<EcommerceProductEntityRepository['save']>[0],
  ): Promise<TenantEcommerceProductEntityView> {
    const productSetup = await (this.prisma as any).ecommerceProductSetup.findFirst({
      where: {
        tenantSlug: command.tenantSlug,
        id: command.productSetupId,
      },
      select: { tenantId: true },
    });

    const record = await this.delegate.upsert({
      where: {
        tenantId_productSetupId: {
          tenantId: productSetup.tenantId,
          productSetupId: command.productSetupId,
        },
      },
      update: {
        tenantSlug: command.tenantSlug,
        savedDraftId: command.savedDraftId,
        sourceDraftId: command.sourceDraftId,
        title: command.title,
        productType: command.productType,
        status: command.status,
        pricingBand: command.pricingBand,
        offerAngle: command.offerAngle,
        primaryCta: command.primaryCta,
        suggestedChannelsJson: JSON.stringify(command.suggestedChannels),
        channelSequenceJson: JSON.stringify(command.channelSequence),
        promotedFromSetupAt: command.promotedFromSetupAt,
      },
      create: {
        id: command.id,
        tenantId: productSetup.tenantId,
        tenantSlug: command.tenantSlug,
        productSetupId: command.productSetupId,
        savedDraftId: command.savedDraftId,
        sourceDraftId: command.sourceDraftId,
        title: command.title,
        productType: command.productType,
        status: command.status,
        pricingBand: command.pricingBand,
        offerAngle: command.offerAngle,
        primaryCta: command.primaryCta,
        suggestedChannelsJson: JSON.stringify(command.suggestedChannels),
        channelSequenceJson: JSON.stringify(command.channelSequence),
        promotedFromSetupAt: command.promotedFromSetupAt,
      },
    });

    return this.toView(record as EcommerceProductEntityRow);
  }

  async listByTenantSlug(
    tenantSlug: string,
  ): Promise<TenantEcommerceProductEntityView[]> {
    const records = await this.delegate.findMany({
      where: { tenantSlug },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: EcommerceProductEntityRow) => this.toView(record));
  }

  async findByTenantSlugAndId(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceProductEntityView | null> {
    const record = await this.delegate.findFirst({
      where: { tenantSlug, id: productEntityId },
    });

    return record ? this.toView(record as EcommerceProductEntityRow) : null;
  }

  async findByTenantSlugAndProductSetupId(
    tenantSlug: string,
    productSetupId: string,
  ): Promise<TenantEcommerceProductEntityView | null> {
    const record = await this.delegate.findFirst({
      where: { tenantSlug, productSetupId },
    });

    return record ? this.toView(record as EcommerceProductEntityRow) : null;
  }

  private toView(
    record: EcommerceProductEntityRow,
  ): TenantEcommerceProductEntityView {
    return {
      tenantSlug: record.tenantSlug,
      generatedAt: record.updatedAt,
      productEntityId: record.id,
      productSetupId: record.productSetupId,
      savedDraftId: record.savedDraftId,
      sourceDraftId: record.sourceDraftId,
      status: record.status,
      title: record.title,
      productType: record.productType,
      pricingBand: record.pricingBand,
      offerAngle: record.offerAngle,
      primaryCta: record.primaryCta,
      suggestedChannels: JSON.parse(record.suggestedChannelsJson),
      channelSequence: JSON.parse(record.channelSequenceJson),
      promotedFromSetupAt: record.promotedFromSetupAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).ecommerceProductEntity;
  }
}
