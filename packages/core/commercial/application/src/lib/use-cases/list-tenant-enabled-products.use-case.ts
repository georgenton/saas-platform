import { ProductRepository } from '@saas-platform/catalog-application';
import { Product } from '@saas-platform/catalog-domain';
import { FeatureFlagRepository } from '@saas-platform/feature-flags-application';
import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { EntitlementRepository } from '../ports/entitlement.repository';

const PRODUCTS_ENTITLEMENT_KEY = 'products';
const PRODUCT_FLAG_PREFIX = 'product.';
const PRODUCT_FLAG_SUFFIX = '.enabled';

export class ListTenantEnabledProductsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly entitlementRepository: EntitlementRepository,
    private readonly productRepository: ProductRepository,
    private readonly featureFlagRepository: FeatureFlagRepository,
  ) {}

  async execute(tenantSlug: string): Promise<Product[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const [entitlements, products, featureFlags] = await Promise.all([
      this.entitlementRepository.findByTenantId(tenant.id),
      this.productRepository.findAll(),
      this.featureFlagRepository.findByTenantId(tenant.id),
    ]);

    const enabledKeys = this.resolveEnabledProductKeys(entitlements, featureFlags);

    if (enabledKeys.length === 0) {
      return [];
    }

    const activeProductsByKey = new Map(
      products
        .filter((product) => product.isActive)
        .map((product) => [product.key, product] as const),
    );

    return enabledKeys
      .map((key) => activeProductsByKey.get(key) ?? null)
      .filter((product): product is Product => product !== null);
  }

  private resolveEnabledProductKeys(
    entitlements: Awaited<ReturnType<EntitlementRepository['findByTenantId']>>,
    featureFlags: Awaited<ReturnType<FeatureFlagRepository['findByTenantId']>>,
  ): string[] {
    const enabledKeys = new Set<string>();
    const productsEntitlement = entitlements.find(
      (entitlement) => entitlement.key === PRODUCTS_ENTITLEMENT_KEY,
    );

    if (productsEntitlement && Array.isArray(productsEntitlement.value)) {
      productsEntitlement.value
        .filter((value): value is string => typeof value === 'string')
        .forEach((value) => enabledKeys.add(value));
    }

    featureFlags.forEach((featureFlag) => {
      const productKey = this.toProductKey(featureFlag.key);

      if (!productKey) {
        return;
      }

      if (featureFlag.enabled) {
        enabledKeys.add(productKey);
        return;
      }

      enabledKeys.delete(productKey);
    });

    return [...enabledKeys];
  }

  private toProductKey(featureFlagKey: string): string | null {
    if (
      !featureFlagKey.startsWith(PRODUCT_FLAG_PREFIX) ||
      !featureFlagKey.endsWith(PRODUCT_FLAG_SUFFIX)
    ) {
      return null;
    }

    return featureFlagKey.slice(
      PRODUCT_FLAG_PREFIX.length,
      featureFlagKey.length - PRODUCT_FLAG_SUFFIX.length,
    );
  }
}
