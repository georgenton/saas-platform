import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  GetTenantEnabledProductByKeyUseCase,
  TenantProductAccessDeniedError,
} from '@saas-platform/commercial-application';
import { ProductNotFoundError } from '@saas-platform/catalog-application';
import { TENANT_PRODUCT_ACCESS_PARAM_KEY } from './require-tenant-product-access.decorator';

@Injectable()
export class TenantProductAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly getTenantEnabledProductByKeyUseCase: GetTenantEnabledProductByKeyUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const productParamName = this.reflector.getAllAndOverride<string>(
      TENANT_PRODUCT_ACCESS_PARAM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!productParamName) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantSlug = request.tenantAccess?.tenantSlug as string | undefined;
    const productKey = request.params?.[productParamName] as string | undefined;

    if (!tenantSlug) {
      throw new UnauthorizedException(
        'A resolved tenant access context is required.',
      );
    }

    if (!productKey) {
      throw new UnauthorizedException('A tenant product key is required.');
    }

    try {
      request.tenantProduct =
        await this.getTenantEnabledProductByKeyUseCase.execute(
          tenantSlug,
          productKey,
        );

      return true;
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof TenantProductAccessDeniedError) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
