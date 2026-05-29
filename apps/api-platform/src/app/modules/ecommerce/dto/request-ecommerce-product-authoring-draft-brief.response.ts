import { TenantEcommerceProductAuthoringDraftBriefRequestView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductAuthoringDraftResponseDto,
  toEcommerceProductAuthoringDraftResponseDto,
} from './ecommerce-product-authoring-draft-detail.response';

export interface RequestEcommerceProductAuthoringDraftBriefResponseDto {
  tenantSlug: string;
  generatedAt: string;
  briefingStatus:
    | 'ready_for_ai_brief'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  requiredInputs: string[];
  guardrails: string[];
  draft: EcommerceProductAuthoringDraftResponseDto;
}

export function toRequestEcommerceProductAuthoringDraftBriefResponseDto(
  view: TenantEcommerceProductAuthoringDraftBriefRequestView,
): RequestEcommerceProductAuthoringDraftBriefResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    briefingStatus: view.briefingStatus,
    summary: view.summary,
    requiredInputs: [...view.requiredInputs],
    guardrails: [...view.guardrails],
    draft: toEcommerceProductAuthoringDraftResponseDto(view.draft),
  };
}
