import { randomUUID } from 'node:crypto';
import { TenantEcommerceSavedProductEntityChannelDraftSaveView } from '@saas-platform/ecommerce-domain';
import { GetTenantBySlugUseCase } from '@saas-platform/tenancy-application';
import { EcommerceProductEntityChannelDraftRepository } from '../ports/ecommerce-product-entity-channel-draft.repository';
import { GetTenantEcommerceProductEntityChannelDraftDetailUseCase } from './get-tenant-ecommerce-product-entity-channel-draft-detail.use-case';
import { GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase } from './get-tenant-ecommerce-product-entity-channel-draft-publish-preparation-workspace.use-case';

export class SaveTenantEcommerceProductEntityChannelDraftUseCase {
  constructor(
    private readonly getTenantBySlugUseCase: GetTenantBySlugUseCase,
    private readonly getTenantEcommerceProductEntityChannelDraftDetailUseCase: GetTenantEcommerceProductEntityChannelDraftDetailUseCase,
    private readonly getTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase: GetTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase,
    private readonly ecommerceProductEntityChannelDraftRepository: EcommerceProductEntityChannelDraftRepository,
    private readonly idGenerator: () => string = () => randomUUID(),
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    channelKey: 'landing' | 'catalog' | 'whatsapp',
  ): Promise<TenantEcommerceSavedProductEntityChannelDraftSaveView> {
    const [tenant, detail, workspace, existing] = await Promise.all([
      this.getTenantBySlugUseCase.execute(tenantSlug),
      this.getTenantEcommerceProductEntityChannelDraftDetailUseCase.execute(
        tenantSlug,
        productEntityId,
        channelKey,
      ),
      this.getTenantEcommerceProductEntityChannelDraftPublishPreparationWorkspaceUseCase.execute(
        tenantSlug,
        productEntityId,
        channelKey,
      ),
      this.ecommerceProductEntityChannelDraftRepository.findByTenantSlugAndProductEntityIdAndChannelKey(
        tenantSlug,
        productEntityId,
        channelKey,
      ),
    ]);

    const savedChannelDraft =
      await this.ecommerceProductEntityChannelDraftRepository.save({
        id: existing?.id ?? this.idGenerator(),
        tenantId: tenant.id,
        tenantSlug,
        productEntityId,
        channelKey,
        preparationStatus: workspace.preparationStatus,
        handoffOwner: workspace.handoffOwner,
        title: `${detail.productEntity.title} ${channelKey} draft`,
        summary: workspace.summary,
        headline: detail.headline,
        draftBlueprint: [...workspace.draftBlueprint],
        publishChecklist: [...workspace.publishChecklist],
        recommendedArtifacts: [...workspace.recommendedArtifacts],
        nextMilestone: workspace.nextMilestone,
        blockedBy: [...workspace.blockedBy],
        guardrails: [...workspace.guardrails],
      });

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: this.buildSummary(savedChannelDraft),
      savedChannelDraft,
    };
  }

  private buildSummary(
    savedChannelDraft: TenantEcommerceSavedProductEntityChannelDraftSaveView['savedChannelDraft'],
  ): string {
    if (savedChannelDraft.preparationStatus === 'blocked') {
      return 'El channel draft quedó guardado con sus bloqueos visibles para que el equipo pueda retomarlo sin perder contexto.';
    }

    if (savedChannelDraft.preparationStatus === 'needs_core_copy') {
      return 'El channel draft quedó guardado como asset candidate, manteniendo copy pendiente y checklist visible antes de staging más real.';
    }

    return 'El channel draft quedó guardado como asset candidate listo para seguir preparando staging controlado dentro de Ecommerce.';
  }
}
