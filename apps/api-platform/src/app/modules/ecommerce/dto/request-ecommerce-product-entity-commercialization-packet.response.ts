import { TenantEcommerceProductEntityCommercializationPacketView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface RequestEcommerceProductEntityCommercializationPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productEntity: EcommerceProductEntityResponseDto;
  commercializationStatus:
    | 'ready_for_channel_rollout'
    | 'needs_channel_assets'
    | 'needs_activation';
  summary: string;
  requiredDecisions: string[];
  blockedBy: string[];
  recommendedArtifacts: string[];
  guardrails: string[];
}

export function toRequestEcommerceProductEntityCommercializationPacketResponseDto(
  view: TenantEcommerceProductEntityCommercializationPacketView,
): RequestEcommerceProductEntityCommercializationPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productEntity: toEcommerceProductEntityResponseDto(view.productEntity),
    commercializationStatus: view.commercializationStatus,
    summary: view.summary,
    requiredDecisions: [...view.requiredDecisions],
    blockedBy: [...view.blockedBy],
    recommendedArtifacts: [...view.recommendedArtifacts],
    guardrails: [...view.guardrails],
  };
}
