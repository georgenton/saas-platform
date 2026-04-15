import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ResolveTenantAccessUseCase,
  TenantAccessDeniedError,
  TenantNotFoundError,
} from '@saas-platform/tenancy-application';

@Injectable()
export class TenantMembershipGuard implements CanActivate {
  constructor(
    private readonly resolveTenantAccessUseCase: ResolveTenantAccessUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const slug = request.params.slug as string | undefined;
    const userId = request.headers['x-user-id'] as string | undefined;

    if (!userId) {
      throw new UnauthorizedException('x-user-id header is required.');
    }

    if (!slug) {
      throw new UnauthorizedException('Tenant slug is required.');
    }

    try {
      request.tenantAccess = await this.resolveTenantAccessUseCase.execute({
        tenantSlug: slug,
        userId,
      });

      return true;
    } catch (error) {
      if (error instanceof TenantNotFoundError) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof TenantAccessDeniedError) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
