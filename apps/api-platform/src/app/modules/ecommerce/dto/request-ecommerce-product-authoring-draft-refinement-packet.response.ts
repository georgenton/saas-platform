import { TenantEcommerceProductAuthoringDraftRefinementPacketView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductAuthoringDraftResponseDto,
  toEcommerceProductAuthoringDraftResponseDto,
} from './ecommerce-product-authoring-draft-detail.response';

export interface RequestEcommerceProductAuthoringDraftRefinementPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  refinementStatus:
    | 'ready_for_refinement'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  pricingBand: string;
  offerAngle: string;
  primaryCta: string;
  channelSequence: string[];
  guardrails: string[];
  draft: EcommerceProductAuthoringDraftResponseDto;
}

export function toRequestEcommerceProductAuthoringDraftRefinementPacketResponseDto(
  view: TenantEcommerceProductAuthoringDraftRefinementPacketView,
): RequestEcommerceProductAuthoringDraftRefinementPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    refinementStatus: view.refinementStatus,
    summary: view.summary,
    pricingBand: view.pricingBand,
    offerAngle: view.offerAngle,
    primaryCta: view.primaryCta,
    channelSequence: [...view.channelSequence],
    guardrails: [...view.guardrails],
    draft: toEcommerceProductAuthoringDraftResponseDto(view.draft),
  };
}
