import { Injectable } from '@nestjs/common';
import { EcommerceProductEntityChannelDraftRepository } from '@saas-platform/ecommerce-application';
import { TenantEcommerceSavedProductEntityChannelDraftView } from '@saas-platform/ecommerce-domain';
import { PrismaService } from '../prisma.service';

type EcommerceProductEntityChannelDraftRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  productEntityId: string;
  channelKey: 'landing' | 'catalog' | 'whatsapp';
  status: string;
  preparationStatus: 'ready_to_stage' | 'needs_core_copy' | 'blocked';
  handoffOwner: 'ecommerce' | 'growth' | 'shared';
  title: string;
  summary: string;
  headline: string;
  draftBlueprintJson: string;
  publishChecklistJson: string;
  recommendedArtifactsJson: string;
  nextMilestone: string;
  blockedByJson: string;
  guardrailsJson: string;
  promotedToAssetWorkspaceAt: Date | null;
  promotedToAssetEntityAt: Date | null;
  promotedToReleaseCandidateAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaEcommerceProductEntityChannelDraftRepository
  implements EcommerceProductEntityChannelDraftRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    command: Parameters<EcommerceProductEntityChannelDraftRepository['save']>[0],
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView> {
    const record = await this.delegate.upsert({
      where: {
        tenantId_productEntityId_channelKey: {
          tenantId: command.tenantId,
          productEntityId: command.productEntityId,
          channelKey: command.channelKey,
        },
      },
      update: {
        tenantSlug: command.tenantSlug,
        status: 'saved_channel_draft',
        preparationStatus: command.preparationStatus,
        handoffOwner: command.handoffOwner,
        title: command.title,
        summary: command.summary,
        headline: command.headline,
        draftBlueprintJson: JSON.stringify(command.draftBlueprint),
        publishChecklistJson: JSON.stringify(command.publishChecklist),
        recommendedArtifactsJson: JSON.stringify(command.recommendedArtifacts),
        nextMilestone: command.nextMilestone,
        blockedByJson: JSON.stringify(command.blockedBy),
        guardrailsJson: JSON.stringify(command.guardrails),
      },
      create: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        productEntityId: command.productEntityId,
        channelKey: command.channelKey,
        status: 'saved_channel_draft',
        preparationStatus: command.preparationStatus,
        handoffOwner: command.handoffOwner,
        title: command.title,
        summary: command.summary,
        headline: command.headline,
        draftBlueprintJson: JSON.stringify(command.draftBlueprint),
        publishChecklistJson: JSON.stringify(command.publishChecklist),
        recommendedArtifactsJson: JSON.stringify(command.recommendedArtifacts),
        nextMilestone: command.nextMilestone,
        blockedByJson: JSON.stringify(command.blockedBy),
        guardrailsJson: JSON.stringify(command.guardrails),
      },
    });

    return this.toView(record as EcommerceProductEntityChannelDraftRow);
  }

  async listByTenantSlugAndProductEntityId(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView[]> {
    const records = await this.delegate.findMany({
      where: { tenantSlug, productEntityId },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: EcommerceProductEntityChannelDraftRow) =>
      this.toView(record),
    );
  }

  async findByTenantSlugAndProductEntityIdAndChannelKey(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null> {
    const record = await this.delegate.findFirst({
      where: { tenantSlug, productEntityId, channelKey },
    });

    return record
      ? this.toView(record as EcommerceProductEntityChannelDraftRow)
      : null;
  }

  async markPromotedToAssetWorkspace(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
    promotedAt: Date,
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null> {
    const updateResult = await this.delegate.updateMany({
      where: { tenantSlug, productEntityId, channelKey },
      data: {
        promotedToAssetWorkspaceAt: promotedAt,
      },
    });

    if (!updateResult.count) {
      return null;
    }

    return this.findByTenantSlugAndProductEntityIdAndChannelKey(
      tenantSlug,
      productEntityId,
      channelKey,
    );
  }

  async markPromotedToAssetEntity(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
    promotedAt: Date,
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null> {
    const updateResult = await this.delegate.updateMany({
      where: { tenantSlug, productEntityId, channelKey },
      data: {
        promotedToAssetEntityAt: promotedAt,
      },
    });

    if (!updateResult.count) {
      return null;
    }

    return this.findByTenantSlugAndProductEntityIdAndChannelKey(
      tenantSlug,
      productEntityId,
      channelKey,
    );
  }

  async updateEditableSnapshot(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
    patch: {
      title: string;
      headline: string;
      draftBlueprint: string[];
      recommendedArtifacts: string[];
      nextMilestone: string;
    },
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null> {
    const updateResult = await this.delegate.updateMany({
      where: { tenantSlug, productEntityId, channelKey },
      data: {
        title: patch.title,
        headline: patch.headline,
        draftBlueprintJson: JSON.stringify(patch.draftBlueprint),
        recommendedArtifactsJson: JSON.stringify(
          patch.recommendedArtifacts,
        ),
        nextMilestone: patch.nextMilestone,
      },
    });

    if (!updateResult.count) {
      return null;
    }

    return this.findByTenantSlugAndProductEntityIdAndChannelKey(
      tenantSlug,
      productEntityId,
      channelKey,
    );
  }

  async markPromotedToReleaseCandidate(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
    promotedAt: Date,
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftView | null> {
    const updateResult = await this.delegate.updateMany({
      where: { tenantSlug, productEntityId, channelKey },
      data: {
        promotedToReleaseCandidateAt: promotedAt,
      },
    });

    if (!updateResult.count) {
      return null;
    }

    return this.findByTenantSlugAndProductEntityIdAndChannelKey(
      tenantSlug,
      productEntityId,
      channelKey,
    );
  }

  private toView(
    record: EcommerceProductEntityChannelDraftRow,
  ): TenantEcommerceSavedProductEntityChannelDraftView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      productEntityId: record.productEntityId,
      channelKey: record.channelKey,
      status: 'saved_channel_draft',
      preparationStatus: record.preparationStatus,
      handoffOwner: record.handoffOwner,
      title: record.title,
      summary: record.summary,
      headline: record.headline,
      draftBlueprint: JSON.parse(record.draftBlueprintJson),
      publishChecklist: JSON.parse(record.publishChecklistJson),
      recommendedArtifacts: JSON.parse(record.recommendedArtifactsJson),
      nextMilestone: record.nextMilestone,
      blockedBy: JSON.parse(record.blockedByJson),
      guardrails: JSON.parse(record.guardrailsJson),
      promotedToAssetWorkspaceAt: record.promotedToAssetWorkspaceAt,
      promotedToAssetEntityAt: record.promotedToAssetEntityAt,
      promotedToReleaseCandidateAt: record.promotedToReleaseCandidateAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).ecommerceProductEntityChannelDraft;
  }
}
