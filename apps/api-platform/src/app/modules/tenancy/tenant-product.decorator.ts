import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Product } from '@saas-platform/catalog-domain';

export const TenantProduct = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Product | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantProduct as Product | undefined;
  },
);
