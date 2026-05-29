import { TenantEcommerceProductWorkspaceDetailView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductWorkspaceResponseDto,
  toEcommerceProductWorkspaceResponseDto,
} from './ecommerce-product-workspace.response';

export interface EcommerceProductWorkspaceDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  workspace: EcommerceProductWorkspaceResponseDto;
  sourceDraftId: string;
  readiness: {
    briefingStatus:
      | 'ready_for_ai_brief'
      | 'needs_commercial_connections'
      | 'needs_activation'
      | null;
    refinementStatus:
      | 'ready_for_refinement'
      | 'needs_commercial_connections'
      | 'needs_activation'
      | null;
    lastSavedAt: string;
  };
}

export function toEcommerceProductWorkspaceDetailResponseDto(
  view: TenantEcommerceProductWorkspaceDetailView,
): EcommerceProductWorkspaceDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    workspace: toEcommerceProductWorkspaceResponseDto(view.workspace),
    sourceDraftId: view.sourceDraftId,
    readiness: {
      briefingStatus: view.readiness.briefingStatus,
      refinementStatus: view.readiness.refinementStatus,
      lastSavedAt: view.readiness.lastSavedAt.toISOString(),
    },
  };
}
