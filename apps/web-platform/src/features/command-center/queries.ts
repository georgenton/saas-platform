import {
  usePlatformCatalogQuery,
  useTenantEnabledProductsQuery,
} from '../../shared/api/platform-queries';

export function useCommandCenterPlatformData(
  token: string,
  tenantSlug: string | null,
) {
  const platformCatalogQuery = usePlatformCatalogQuery(token);
  const tenantEnabledProductsQuery = useTenantEnabledProductsQuery(
    token,
    tenantSlug,
  );

  return {
    catalogError:
      platformCatalogQuery.error instanceof Error
        ? platformCatalogQuery.error.message
        : tenantEnabledProductsQuery.error instanceof Error
          ? tenantEnabledProductsQuery.error.message
          : null,
    catalogLoading:
      platformCatalogQuery.isLoading || tenantEnabledProductsQuery.isLoading,
    planCatalog: platformCatalogQuery.data?.plans ?? [],
    productCatalog: platformCatalogQuery.data?.products ?? [],
    tenantEnabledProducts: tenantEnabledProductsQuery.data ?? [],
  };
}
