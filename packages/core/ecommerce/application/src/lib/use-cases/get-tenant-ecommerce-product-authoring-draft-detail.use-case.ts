import { EcommerceProductAuthoringDraftNotFoundError } from '../errors/ecommerce-product-authoring-draft-not-found.error';
import {
  TenantEcommerceProductAuthoringDraftDetailView,
  TenantEcommerceProductAuthoringWorkspaceView,
} from '@saas-platform/ecommerce-domain';
import { EcommerceProductDraftRepository } from '../ports/ecommerce-product-draft.repository';
import { GetTenantEcommerceProductAuthoringWorkspaceUseCase } from './get-tenant-ecommerce-product-authoring-workspace.use-case';

export class GetTenantEcommerceProductAuthoringDraftDetailUseCase {
  constructor(
    private readonly getTenantEcommerceProductAuthoringWorkspaceUseCase: GetTenantEcommerceProductAuthoringWorkspaceUseCase,
    private readonly ecommerceProductDraftRepository?: EcommerceProductDraftRepository,
  ) {}

  async execute(
    tenantSlug: string,
    draftId: string,
  ): Promise<TenantEcommerceProductAuthoringDraftDetailView> {
    const workspace =
      await this.getTenantEcommerceProductAuthoringWorkspaceUseCase.execute(
        tenantSlug,
      );
    const draft = workspace.drafts.find((entry) => entry.id === draftId);

    if (!draft) {
      throw new EcommerceProductAuthoringDraftNotFoundError(tenantSlug, draftId);
    }

    const savedDraft = this.ecommerceProductDraftRepository
      ? await this.ecommerceProductDraftRepository.findByTenantSlugAndSourceDraftId(
          tenantSlug,
          draftId,
        )
      : null;

    return this.toDetail(workspace, draftId, savedDraft);
  }

  private toDetail(
    workspace: TenantEcommerceProductAuthoringWorkspaceView,
    draftId: string,
    savedDraft: TenantEcommerceProductAuthoringDraftDetailView['savedDraft'],
  ): TenantEcommerceProductAuthoringDraftDetailView {
    const draft = workspace.drafts.find((entry) => entry.id === draftId)!;

    return {
      tenantSlug: workspace.tenantSlug,
      generatedAt: workspace.generatedAt,
      workspaceSummary: {
        ...workspace.summary,
      },
      draftCollection: {
        ...workspace.draftCollection,
      },
      readinessChecklist: workspace.readinessChecklist.map((entry) => ({
        ...entry,
      })),
      safeActions: [...workspace.safeActions],
      blockedActions: [...workspace.blockedActions],
      draft: {
        ...draft,
        suggestedChannels: [...draft.suggestedChannels],
      },
      savedDraft: savedDraft
        ? {
            ...savedDraft,
            suggestedChannels: [...savedDraft.suggestedChannels],
            briefRequiredInputs: [...savedDraft.briefRequiredInputs],
            briefGuardrails: [...savedDraft.briefGuardrails],
            channelSequence: [...savedDraft.channelSequence],
            refinementGuardrails: [...savedDraft.refinementGuardrails],
          }
        : null,
    };
  }
}
