import { Injectable } from '@nestjs/common';
import { EcommerceProductSetupRepository } from '@saas-platform/ecommerce-application';
import { TenantEcommerceProductSetupView } from '@saas-platform/ecommerce-domain';
import { PrismaService } from '../prisma.service';

type EcommerceProductSetupRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  savedDraftId: string;
  sourceDraftId: string;
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  status: 'draft_setup' | 'needs_commercial_connections' | 'needs_activation';
  pricingBand: string | null;
  offerAngle: string | null;
  primaryCta: string | null;
  suggestedChannelsJson: string;
  channelSequenceJson: string;
  promotedFromWorkspaceAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaEcommerceProductSetupRepository
  implements EcommerceProductSetupRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    command: Parameters<EcommerceProductSetupRepository['save']>[0],
  ): Promise<TenantEcommerceProductSetupView> {
    const record = await this.delegate.upsert({
      where: {
        tenantId_savedDraftId: {
          tenantId: command.tenantId,
          savedDraftId: command.savedDraftId,
        },
      },
      update: {
        tenantSlug: command.tenantSlug,
        sourceDraftId: command.sourceDraftId,
        title: command.title,
        productType: command.productType,
        status: command.status,
        pricingBand: command.pricingBand,
        offerAngle: command.offerAngle,
        primaryCta: command.primaryCta,
        suggestedChannelsJson: JSON.stringify(command.suggestedChannels),
        channelSequenceJson: JSON.stringify(command.channelSequence),
        promotedFromWorkspaceAt: command.promotedFromWorkspaceAt,
      },
      create: {
        id: command.id,
        tenantId: command.tenantId,
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
        promotedFromWorkspaceAt: command.promotedFromWorkspaceAt,
      },
    });

    return this.toView(record as EcommerceProductSetupRow);
  }

  async listByTenantSlug(
    tenantSlug: string,
  ): Promise<TenantEcommerceProductSetupView[]> {
    const records = await this.delegate.findMany({
      where: { tenantSlug },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: EcommerceProductSetupRow) => this.toView(record));
  }

  async findByTenantSlugAndId(
    tenantSlug: string,
    productSetupId: string,
  ): Promise<TenantEcommerceProductSetupView | null> {
    const record = await this.delegate.findFirst({
      where: {
        tenantSlug,
        id: productSetupId,
      },
    });

    return record ? this.toView(record as EcommerceProductSetupRow) : null;
  }

  async findByTenantSlugAndSavedDraftId(
    tenantSlug: string,
    savedDraftId: string,
  ): Promise<TenantEcommerceProductSetupView | null> {
    const record = await this.delegate.findFirst({
      where: {
        tenantSlug,
        savedDraftId,
      },
    });

    return record ? this.toView(record as EcommerceProductSetupRow) : null;
  }

  async updateEditableSnapshot(
    tenantSlug: string,
    productSetupId: string,
    patch: Parameters<
      EcommerceProductSetupRepository['updateEditableSnapshot']
    >[2],
  ): Promise<TenantEcommerceProductSetupView | null> {
    const record = await this.delegate.updateManyAndReturn({
      where: {
        tenantSlug,
        id: productSetupId,
      },
      data: {
        title: patch.title,
        pricingBand: patch.pricingBand,
        offerAngle: patch.offerAngle,
        primaryCta: patch.primaryCta,
        channelSequenceJson: JSON.stringify(patch.channelSequence),
      },
      take: 1,
    });

    const firstRecord = (record?.[0] ?? null) as EcommerceProductSetupRow | null;
    return firstRecord ? this.toView(firstRecord) : null;
  }

  private toView(
    record: EcommerceProductSetupRow,
  ): TenantEcommerceProductSetupView {
    return {
      tenantSlug: record.tenantSlug,
      generatedAt: record.updatedAt,
      productSetupId: record.id,
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
      promotedFromWorkspaceAt: record.promotedFromWorkspaceAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).ecommerceProductSetup;
  }
}
