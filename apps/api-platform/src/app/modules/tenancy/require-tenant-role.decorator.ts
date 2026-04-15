import { SetMetadata } from '@nestjs/common';

export const TENANT_ROLE_KEY = 'tenant-role';

export const RequireTenantRole = (role: 'owner' | 'member') =>
  SetMetadata(TENANT_ROLE_KEY, role);
