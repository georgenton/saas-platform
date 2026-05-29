import { TenantEcommerceProductSetupView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductSetupResponseDto,
  toEcommerceProductSetupResponseDto,
} from './ecommerce-product-setup.response';

export interface PromoteEcommerceProductWorkspaceToProductSetupResponseDto {
  productSetup: EcommerceProductSetupResponseDto;
}

export function toPromoteEcommerceProductWorkspaceToProductSetupResponseDto(
  view: TenantEcommerceProductSetupView,
): PromoteEcommerceProductWorkspaceToProductSetupResponseDto {
  return {
    productSetup: toEcommerceProductSetupResponseDto(view),
  };
}
