import { randomUUID } from 'node:crypto';
import {
  TenantEcommerceSavedProductAuthoringDraftSaveView,
  TenantEcommerceSavedProductAuthoringDraftView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantBySlugUseCase } from '@saas-platform/tenancy-application';
import { EcommerceProductDraftRepository } from '../ports/ecommerce-product-draft.repository';
import { GetTenantEcommerceProductAuthoringDraftDetailUseCase } from './get-tenant-ecommerce-product-authoring-draft-detail.use-case';
import { RequestTenantEcommerceProductAuthoringDraftBriefUseCase } from './request-tenant-ecommerce-product-authoring-draft-brief.use-case';
import { RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase } from './request-tenant-ecommerce-product-authoring-draft-refinement-packet.use-case';

export class SaveTenantEcommerceProductAuthoringDraftUseCase {
  constructor(
    private readonly getTenantBySlugUseCase: GetTenantBySlugUseCase,
    private readonly getTenantEcommerceProductAuthoringDraftDetailUseCase: GetTenantEcommerceProductAuthoringDraftDetailUseCase,
    private readonly requestTenantEcommerceProductAuthoringDraftBriefUseCase: RequestTenantEcommerceProductAuthoringDraftBriefUseCase,
    private readonly requestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase: RequestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase,
    private readonly ecommerceProductDraftRepository: EcommerceProductDraftRepository,
    private readonly idGenerator: () => string = () => randomUUID(),
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    draftId: string,
  ): Promise<TenantEcommerceSavedProductAuthoringDraftSaveView> {
    const [tenant, detail, brief, refinement, existing] = await Promise.all([
      this.getTenantBySlugUseCase.execute(tenantSlug),
      this.getTenantEcommerceProductAuthoringDraftDetailUseCase.execute(
        tenantSlug,
        draftId,
      ),
      this.requestTenantEcommerceProductAuthoringDraftBriefUseCase.execute(
        tenantSlug,
        draftId,
      ),
      this.requestTenantEcommerceProductAuthoringDraftRefinementPacketUseCase.execute(
        tenantSlug,
        draftId,
      ),
      this.ecommerceProductDraftRepository.findByTenantSlugAndSourceDraftId(
        tenantSlug,
        draftId,
      ),
    ]);

    const savedDraft = await this.ecommerceProductDraftRepository.save({
      id: existing?.id ?? this.idGenerator(),
      tenantId: tenant.id,
      tenantSlug,
      sourceDraftId: detail.draft.id,
      title: detail.draft.title,
      productType: detail.draft.productType,
      rationale: detail.draft.rationale,
      suggestedChannels: [...detail.draft.suggestedChannels],
      briefingStatus: brief.briefingStatus,
      briefSummary: brief.summary,
      briefRequiredInputs: [...brief.requiredInputs],
      briefGuardrails: [...brief.guardrails],
      refinementStatus: refinement.refinementStatus,
      refinementSummary: refinement.summary,
      pricingBand: refinement.pricingBand,
      offerAngle: refinement.offerAngle,
      primaryCta: refinement.primaryCta,
      channelSequence: [...refinement.channelSequence],
      refinementGuardrails: [...refinement.guardrails],
    });

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: this.buildSummary(savedDraft),
      savedDraft,
    };
  }

  private buildSummary(
    savedDraft: TenantEcommerceSavedProductAuthoringDraftView,
  ): string {
    if (
      savedDraft.refinementStatus === 'needs_activation' ||
      savedDraft.briefingStatus === 'needs_activation'
    ) {
      return 'El draft quedo guardado como catalog candidate, pero Ecommerce todavia necesita activacion antes de convertirlo en authoring operativo.';
    }

    if (
      savedDraft.refinementStatus === 'needs_commercial_connections' ||
      savedDraft.briefingStatus === 'needs_commercial_connections'
    ) {
      return 'El draft quedo guardado como catalog candidate con sus packets comerciales actuales, manteniendo visibles las conexiones pendientes antes de abrir publicacion o pricing final.';
    }

    return 'El draft quedo guardado como catalog candidate del tenant, listo para seguir refinandose sin depender solo del starter set efimero.';
  }
}
