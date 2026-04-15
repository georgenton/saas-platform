import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantAccessContext } from '@saas-platform/tenancy-application';

export const TenantAccess = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TenantAccessContext | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantAccess as TenantAccessContext | undefined;
  },
);
