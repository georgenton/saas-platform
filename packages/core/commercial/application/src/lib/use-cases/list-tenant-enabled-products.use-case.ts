import { ProductRepository } from '@saas-platform/catalog-application';
import { Product } from '@saas-platform/catalog-domain';
import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { EntitlementRepository } from '../ports/entitlement.repository';

const PRODUCTS_ENTITLEMENT_KEY = 'products';

export class ListTenantEnabledProductsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly entitlementRepository: EntitlementRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(tenantSlug: string): Promise<Product[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const [entitlements, products] = await Promise.all([
      this.entitlementRepository.findByTenantId(tenant.id),
      this.productRepository.findAll(),
    ]);

    const enabledKeys = this.resolveEnabledProductKeys(entitlements);

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
  ): string[] {
    const productsEntitlement = entitlements.find(
      (entitlement) => entitlement.key === PRODUCTS_ENTITLEMENT_KEY,
    );

    if (!productsEntitlement || !Array.isArray(productsEntitlement.value)) {
      return [];
    }

    return productsEntitlement.value.filter(
      (value): value is string => typeof value === 'string',
    );
  }
}
