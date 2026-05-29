import { TenantEcommerceSavedProductAuthoringDraftSaveView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceSavedProductAuthoringDraftResponseDto,
  toEcommerceSavedProductAuthoringDraftResponseDto,
} from './ecommerce-product-authoring-draft-detail.response';

export interface SaveEcommerceProductAuthoringDraftResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: string;
  savedDraft: EcommerceSavedProductAuthoringDraftResponseDto;
}

export function toSaveEcommerceProductAuthoringDraftResponseDto(
  view: TenantEcommerceSavedProductAuthoringDraftSaveView,
): SaveEcommerceProductAuthoringDraftResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: view.summary,
    savedDraft: toEcommerceSavedProductAuthoringDraftResponseDto(
      view.savedDraft,
    ),
  };
}
