import { SetMetadata } from '@nestjs/common';

export const TENANT_PRODUCT_ACCESS_PARAM_KEY = 'tenantProductAccessParam';

export const RequireTenantProductAccess = (
  productParamName = 'productKey',
): MethodDecorator & ClassDecorator =>
  SetMetadata(TENANT_PRODUCT_ACCESS_PARAM_KEY, productParamName);
