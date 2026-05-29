import { Injectable } from '@nestjs/common';
import { EcommerceProductDraftRepository } from '@saas-platform/ecommerce-application';
import { TenantEcommerceSavedProductAuthoringDraftView } from '@saas-platform/ecommerce-domain';
import { PrismaService } from '../prisma.service';

type EcommerceProductDraftRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  sourceDraftId: string;
  title: string;
  productType: 'core_offer' | 'entry_offer' | 'upsell';
  status: string;
  rationale: string;
  suggestedChannelsJson: string;
  briefingStatus:
    | 'ready_for_ai_brief'
    | 'needs_commercial_connections'
    | 'needs_activation'
    | null;
  briefSummary: string | null;
  briefRequiredInputsJson: string;
  briefGuardrailsJson: string;
  refinementStatus:
    | 'ready_for_refinement'
    | 'needs_commercial_connections'
    | 'needs_activation'
    | null;
  refinementSummary: string | null;
  pricingBand: string | null;
  offerAngle: string | null;
  primaryCta: string | null;
  channelSequenceJson: string;
  refinementGuardrailsJson: string;
  promotedToWorkspaceAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaEcommerceProductDraftRepository
  implements EcommerceProductDraftRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    command: Parameters<EcommerceProductDraftRepository['save']>[0],
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView> {
    const record = await this.delegate.upsert({
      where: {
        tenantId_sourceDraftId: {
          tenantId: command.tenantId,
          sourceDraftId: command.sourceDraftId,
        },
      },
      update: {
        tenantSlug: command.tenantSlug,
        title: command.title,
        productType: command.productType,
        status: 'saved_draft',
        rationale: command.rationale,
        suggestedChannelsJson: JSON.stringify(command.suggestedChannels),
        briefingStatus: command.briefingStatus,
        briefSummary: command.briefSummary,
        briefRequiredInputsJson: JSON.stringify(command.briefRequiredInputs),
        briefGuardrailsJson: JSON.stringify(command.briefGuardrails),
        refinementStatus: command.refinementStatus,
        refinementSummary: command.refinementSummary,
        pricingBand: command.pricingBand,
        offerAngle: command.offerAngle,
        primaryCta: command.primaryCta,
        channelSequenceJson: JSON.stringify(command.channelSequence),
        refinementGuardrailsJson: JSON.stringify(
          command.refinementGuardrails,
        ),
      },
      create: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        sourceDraftId: command.sourceDraftId,
        title: command.title,
        productType: command.productType,
        status: 'saved_draft',
        rationale: command.rationale,
        suggestedChannelsJson: JSON.stringify(command.suggestedChannels),
        briefingStatus: command.briefingStatus,
        briefSummary: command.briefSummary,
        briefRequiredInputsJson: JSON.stringify(command.briefRequiredInputs),
        briefGuardrailsJson: JSON.stringify(command.briefGuardrails),
        refinementStatus: command.refinementStatus,
        refinementSummary: command.refinementSummary,
        pricingBand: command.pricingBand,
        offerAngle: command.offerAngle,
        primaryCta: command.primaryCta,
        channelSequenceJson: JSON.stringify(command.channelSequence),
        refinementGuardrailsJson: JSON.stringify(
          command.refinementGuardrails,
        ),
      },
    });

    return this.toView(record as EcommerceProductDraftRow);
  }

  async findByTenantSlugAndSourceDraftId(
    tenantSlug: string,
    sourceDraftId: string,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView | null> {
    const record = await this.delegate.findFirst({
      where: {
        tenantSlug,
        sourceDraftId,
      },
    });

    return record ? this.toView(record as EcommerceProductDraftRow) : null;
  }

  async listByTenantSlug(
    tenantSlug: string,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantSlug,
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: EcommerceProductDraftRow) =>
      this.toView(record),
    );
  }

  async findByTenantSlugAndId(
    tenantSlug: string,
    savedDraftId: string,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView | null> {
    const record = await this.delegate.findFirst({
      where: {
        tenantSlug,
        id: savedDraftId,
      },
    });

    return record ? this.toView(record as EcommerceProductDraftRow) : null;
  }

  async markPromotedToWorkspace(
    tenantSlug: string,
    savedDraftId: string,
    promotedAt: Date,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView | null> {
    const updateResult = await this.delegate.updateMany({
      where: {
        tenantSlug,
        id: savedDraftId,
      },
      data: {
        promotedToWorkspaceAt: promotedAt,
      },
    });

    if (!updateResult.count) {
      return null;
    }

    return this.findByTenantSlugAndId(tenantSlug, savedDraftId);
  }

  async updateEditableSnapshot(
    tenantSlug: string,
    savedDraftId: string,
    patch: {
      title: string;
      pricingBand: string | null;
      offerAngle: string | null;
      primaryCta: string | null;
      channelSequence: string[];
    },
  ): Promise<TenantEcommerceSavedProductAuthoringDraftView | null> {
    const updateResult = await this.delegate.updateMany({
      where: {
        tenantSlug,
        id: savedDraftId,
      },
      data: {
        title: patch.title,
        pricingBand: patch.pricingBand,
        offerAngle: patch.offerAngle,
        primaryCta: patch.primaryCta,
        channelSequenceJson: JSON.stringify(patch.channelSequence),
      },
    });

    if (!updateResult.count) {
      return null;
    }

    return this.findByTenantSlugAndId(tenantSlug, savedDraftId);
  }

  private toView(
    record: EcommerceProductDraftRow,
  ): TenantEcommerceSavedProductAuthoringDraftView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      sourceDraftId: record.sourceDraftId,
      title: record.title,
      productType: record.productType,
      status: 'saved_draft',
      rationale: record.rationale,
      suggestedChannels: JSON.parse(record.suggestedChannelsJson),
      briefingStatus: record.briefingStatus,
      briefSummary: record.briefSummary,
      briefRequiredInputs: JSON.parse(record.briefRequiredInputsJson),
      briefGuardrails: JSON.parse(record.briefGuardrailsJson),
      refinementStatus: record.refinementStatus,
      refinementSummary: record.refinementSummary,
      pricingBand: record.pricingBand,
      offerAngle: record.offerAngle,
      primaryCta: record.primaryCta,
      channelSequence: JSON.parse(record.channelSequenceJson),
      refinementGuardrails: JSON.parse(record.refinementGuardrailsJson),
      promotedToWorkspaceAt: record.promotedToWorkspaceAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).ecommerceProductDraft;
  }
}
