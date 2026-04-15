import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TENANT_ROLE_KEY } from './require-tenant-role.decorator';

@Injectable()
export class TenantRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<'owner' | 'member'>(
      TENANT_ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantAccess = request.tenantAccess as
      | { membershipRole?: 'owner' | 'member' }
      | undefined;

    if (!tenantAccess?.membershipRole) {
      throw new ForbiddenException('Tenant access context is missing.');
    }

    if (
      requiredRole === 'owner' &&
      tenantAccess.membershipRole !== 'owner'
    ) {
      throw new ForbiddenException(
        'Owner role is required for this tenant resource.',
      );
    }

    return true;
  }
}
