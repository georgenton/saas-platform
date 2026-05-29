import { TenantEcommerceProductWorkspaceReadinessPacketView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductWorkspaceResponseDto,
  toEcommerceProductWorkspaceResponseDto,
} from './ecommerce-product-workspace.response';

export interface RequestEcommerceProductWorkspaceReadinessPacketResponseDto {
  tenantSlug: string;
  generatedAt: string;
  workspace: EcommerceProductWorkspaceResponseDto;
  readinessStatus:
    | 'ready_for_product_setup'
    | 'needs_commercial_connections'
    | 'needs_activation';
  summary: string;
  requiredDecisions: string[];
  blockedBy: string[];
  recommendedArtifacts: string[];
  guardrails: string[];
}

export function toRequestEcommerceProductWorkspaceReadinessPacketResponseDto(
  view: TenantEcommerceProductWorkspaceReadinessPacketView,
): RequestEcommerceProductWorkspaceReadinessPacketResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    workspace: toEcommerceProductWorkspaceResponseDto(view.workspace),
    readinessStatus: view.readinessStatus,
    summary: view.summary,
    requiredDecisions: [...view.requiredDecisions],
    blockedBy: [...view.blockedBy],
    recommendedArtifacts: [...view.recommendedArtifacts],
    guardrails: [...view.guardrails],
  };
}
