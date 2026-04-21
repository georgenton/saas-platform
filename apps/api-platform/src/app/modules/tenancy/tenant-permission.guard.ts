import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TENANT_PERMISSION_KEY } from './require-tenant-permission.decorator';

@Injectable()
export class TenantPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      TENANT_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantAccess = request.tenantAccess as
      | { permissionKeys?: string[] }
      | undefined;

    if (!tenantAccess?.permissionKeys?.includes(requiredPermission)) {
      throw new ForbiddenException(
        `Permission "${requiredPermission}" is required for this tenant resource.`,
      );
    }

    return true;
  }
}
