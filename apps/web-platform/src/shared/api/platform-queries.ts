import { useQuery } from '@tanstack/react-query';
import {
  listPlans,
  listProducts,
  listTenantEnabledProducts,
} from '../../app/api';

export const platformQueryKeys = {
  catalog: (token: string) => ['platform', 'catalog', tokenScope(token)] as const,
  tenantProducts: (token: string, tenantSlug: string) =>
    ['platform', 'tenant-products', tokenScope(token), tenantSlug] as const,
};

function tokenScope(token: string): string {
  if (!token) {
    return 'anonymous';
  }

  let hash = 2166136261;

  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `token:${(hash >>> 0).toString(16)}`;
}

export function usePlatformCatalogQuery(token: string) {
  return useQuery({
    enabled: Boolean(token),
    queryFn: async () => {
      const [plans, products] = await Promise.all([
        listPlans(token),
        listProducts(token),
      ]);

      return { plans, products };
    },
    queryKey: platformQueryKeys.catalog(token),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTenantEnabledProductsQuery(
  token: string,
  tenantSlug: string | null,
) {
  return useQuery({
    enabled: Boolean(token && tenantSlug),
    queryFn: () => {
      if (!tenantSlug) {
        return Promise.resolve([]);
      }

      return listTenantEnabledProducts(token, tenantSlug);
    },
    queryKey: tenantSlug
      ? platformQueryKeys.tenantProducts(token, tenantSlug)
      : ['platform', 'tenant-products', tokenScope(token), 'none'],
    staleTime: 2 * 60 * 1000,
  });
}
