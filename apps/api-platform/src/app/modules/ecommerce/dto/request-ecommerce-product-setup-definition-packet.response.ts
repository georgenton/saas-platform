import { TenantEcommerceProductSetupDefinitionPacketView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductSetupResponseDto,
  toEcommerceProductSetupResponseDto,
} from './ecommerce-product-setup.response';

export interface RequestEcommerceProductSetupDefinitionPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  productSetup: EcommerceProductSetupResponseDto;
  definitionStatus:
    | 'ready_for_product_definition'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  requiredDecisions: string[];
  blockedBy: string[];
  recommendedArtifacts: string[];
  guardrails: string[];
}

export function toRequestEcommerceProductSetupDefinitionPacketResponseDto(
  view: TenantEcommerceProductSetupDefinitionPacketView,
): RequestEcommerceProductSetupDefinitionPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    productSetup: toEcommerceProductSetupResponseDto(view.productSetup),
    definitionStatus: view.definitionStatus,
    summary: view.summary,
    requiredDecisions: [...view.requiredDecisions],
    blockedBy: [...view.blockedBy],
    recommendedArtifacts: [...view.recommendedArtifacts],
    guardrails: [...view.guardrails],
  };
}
