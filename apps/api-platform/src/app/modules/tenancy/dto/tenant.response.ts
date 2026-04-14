import { Tenant } from '@saas-platform/tenancy-domain';

export interface TenantResponseDto {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function toTenantResponseDto(tenant: Tenant): TenantResponseDto {
  const data = tenant.toPrimitives();

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    status: data.status,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}
