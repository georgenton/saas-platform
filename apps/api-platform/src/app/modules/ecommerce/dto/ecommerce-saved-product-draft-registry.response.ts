import { TenantEcommerceSavedProductAuthoringDraftRegistryView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceSavedProductAuthoringDraftResponseDto,
  toEcommerceSavedProductAuthoringDraftResponseDto,
} from './ecommerce-product-authoring-draft-detail.response';

export interface EcommerceSavedProductDraftRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
    totalSavedDrafts: number;
    readyForRefinementCount: number;
    needsCommercialConnectionsCount: number;
    needsActivationCount: number;
    headline: string;
    detail: string;
  };
  drafts: EcommerceSavedProductAuthoringDraftResponseDto[];
}

export function toEcommerceSavedProductDraftRegistryResponseDto(
  view: TenantEcommerceSavedProductAuthoringDraftRegistryView,
): EcommerceSavedProductDraftRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: {
      ...view.summary,
    },
    drafts: view.drafts.map((draft) =>
      toEcommerceSavedProductAuthoringDraftResponseDto(draft),
    ),
  };
}
