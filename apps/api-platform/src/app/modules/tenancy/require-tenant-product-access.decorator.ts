import { SetMetadata } from '@nestjs/common';

export const TENANT_PRODUCT_ACCESS_PARAM_KEY = 'tenantProductAccessParam';

export interface RequireTenantProductAccessOptions {
  productParamName?: string;
  productKey?: string;
}

export const RequireTenantProductAccess = (
  options: string | RequireTenantProductAccessOptions = 'productKey',
): MethodDecorator & ClassDecorator =>
  SetMetadata(
    TENANT_PRODUCT_ACCESS_PARAM_KEY,
    typeof options === 'string'
      ? { productParamName: options }
      : {
          productParamName: options.productParamName ?? 'productKey',
          productKey: options.productKey,
        },
  );
