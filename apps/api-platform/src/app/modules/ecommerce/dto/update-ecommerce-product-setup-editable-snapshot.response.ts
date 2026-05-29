import { TenantEcommerceProductSetupDetailView } from '@saas-platform/ecommerce-domain';
import {
  EcommerceProductSetupDetailResponseDto,
  toEcommerceProductSetupDetailResponseDto,
} from './ecommerce-product-setup.response';

export interface UpdateEcommerceProductSetupEditableSnapshotResponseDto {
  setup: EcommerceProductSetupDetailResponseDto;
}

export function toUpdateEcommerceProductSetupEditableSnapshotResponseDto(
  view: TenantEcommerceProductSetupDetailView,
): UpdateEcommerceProductSetupEditableSnapshotResponseDto {
  return {
    setup: toEcommerceProductSetupDetailResponseDto(view),
  };
}
