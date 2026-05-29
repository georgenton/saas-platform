import { TenantEcommerceProductEntityView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductEntityResponseDto,
  toEcommerceProductEntityResponseDto,
} from './ecommerce-product-entity.response';

export interface PromoteEcommerceProductSetupToProductEntityResponseDto {
  productEntity: EcommerceProductEntityResponseDto;
}

export function toPromoteEcommerceProductSetupToProductEntityResponseDto(
  view: TenantEcommerceProductEntityView,
): PromoteEcommerceProductSetupToProductEntityResponseDto {
  return {
    productEntity: toEcommerceProductEntityResponseDto(view),
  };
}
