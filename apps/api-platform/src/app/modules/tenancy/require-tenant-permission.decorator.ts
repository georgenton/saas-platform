import { SetMetadata } from '@nestjs/common';

export const TENANT_PERMISSION_KEY = 'tenant-permission';

export const RequireTenantPermission = (permission: string) =>
  SetMetadata(TENANT_PERMISSION_KEY, permission);
