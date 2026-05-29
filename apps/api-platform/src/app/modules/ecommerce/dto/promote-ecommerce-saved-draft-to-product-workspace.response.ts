import { TenantEcommerceProductWorkspaceView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductWorkspaceResponseDto,
  toEcommerceProductWorkspaceResponseDto,
} from './ecommerce-product-workspace.response';

export interface PromoteEcommerceSavedDraftToProductWorkspaceResponseDto {
  workspace: EcommerceProductWorkspaceResponseDto;
}

export function toPromoteEcommerceSavedDraftToProductWorkspaceResponseDto(
  view: TenantEcommerceProductWorkspaceView,
): PromoteEcommerceSavedDraftToProductWorkspaceResponseDto {
  return {
    workspace: toEcommerceProductWorkspaceResponseDto(view),
  };
}
