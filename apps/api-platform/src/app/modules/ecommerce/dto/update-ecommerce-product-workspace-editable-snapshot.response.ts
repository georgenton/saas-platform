import { TenantEcommerceProductWorkspaceDetailView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductWorkspaceDetailResponseDto,
  toEcommerceProductWorkspaceDetailResponseDto,
} from './ecommerce-product-workspace-detail.response';

export interface UpdateEcommerceProductWorkspaceEditableSnapshotResponseDto {
  workspace: EcommerceProductWorkspaceDetailResponseDto;
}

export function toUpdateEcommerceProductWorkspaceEditableSnapshotResponseDto(
  view: TenantEcommerceProductWorkspaceDetailView,
): UpdateEcommerceProductWorkspaceEditableSnapshotResponseDto {
  return {
    workspace: toEcommerceProductWorkspaceDetailResponseDto(view),
  };
}
