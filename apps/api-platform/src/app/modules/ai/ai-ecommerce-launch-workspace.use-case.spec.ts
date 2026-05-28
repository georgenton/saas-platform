import { GetTenantEcommerceLaunchWorkspaceUseCase } from '@saas-platform/ecommerce-application';
import { PlatformModule, Product } from '@saas-platform/catalog-domain';

describe('AI ecommerce launch workspace use case', () => {
  const listTenantEnabledProductsUseCase = {
    execute: jest.fn(),
  };
  const listProductModulesUseCase = {
    execute: jest.fn(),
  };

  const ecommerceProduct = Product.create({
    id: 'product_ecommerce',
    key: 'ecommerce',
    name: 'Ecommerce',
    description: 'Catalogo, checkout y ordenes.',
    isActive: true,
    createdAt: new Date('2026-05-24T10:00:00.000Z'),
    updatedAt: new Date('2026-05-24T10:00:00.000Z'),
  });

  beforeEach(() => {
    jest.resetAllMocks();
    listTenantEnabledProductsUseCase.execute.mockResolvedValue([ecommerceProduct]);
    listProductModulesUseCase.execute.mockResolvedValue([
      PlatformModule.create({
        id: 'module_catalog',
        productId: 'product_ecommerce',
        key: 'catalog',
        name: 'Catalog',
        description: 'Catalogo comercial.',
        isCore: true,
        isActive: true,
        createdAt: new Date('2026-05-24T10:00:00.000Z'),
        updatedAt: new Date('2026-05-24T10:00:00.000Z'),
      }),
      PlatformModule.create({
        id: 'module_products',
        productId: 'product_ecommerce',
        key: 'products',
        name: 'Products',
        description: 'Gestion de productos.',
        isCore: true,
        isActive: true,
        createdAt: new Date('2026-05-24T10:00:00.000Z'),
        updatedAt: new Date('2026-05-24T10:00:00.000Z'),
      }),
      PlatformModule.create({
        id: 'module_inventory',
        productId: 'product_ecommerce',
        key: 'inventory',
        name: 'Inventory',
        description: 'Inventario y stock.',
        isCore: true,
        isActive: true,
        createdAt: new Date('2026-05-24T10:00:00.000Z'),
        updatedAt: new Date('2026-05-24T10:00:00.000Z'),
      }),
      PlatformModule.create({
        id: 'module_orders',
        productId: 'product_ecommerce',
        key: 'orders',
        name: 'Orders',
        description: 'Gestion de ordenes.',
        isCore: true,
        isActive: true,
        createdAt: new Date('2026-05-24T10:00:00.000Z'),
        updatedAt: new Date('2026-05-24T10:00:00.000Z'),
      }),
      PlatformModule.create({
        id: 'module_checkout',
        productId: 'product_ecommerce',
        key: 'checkout',
        name: 'Checkout',
        description: 'Checkout y cierre de venta.',
        isCore: true,
        isActive: true,
        createdAt: new Date('2026-05-24T10:00:00.000Z'),
        updatedAt: new Date('2026-05-24T10:00:00.000Z'),
      }),
      PlatformModule.create({
        id: 'module_promotions',
        productId: 'product_ecommerce',
        key: 'promotions',
        name: 'Promotions',
        description: 'Promociones.',
        isCore: false,
        isActive: false,
        createdAt: new Date('2026-05-24T10:00:00.000Z'),
        updatedAt: new Date('2026-05-24T10:00:00.000Z'),
      }),
    ]);
  });

  it('builds a tenant-scoped ecommerce launch workspace from enabled product and catalog modules', async () => {
    const useCase = new GetTenantEcommerceLaunchWorkspaceUseCase(
      listTenantEnabledProductsUseCase as any,
      listProductModulesUseCase as any,
      () => new Date('2026-05-24T11:00:00.000Z'),
    );

    const result = await useCase.execute('saas-platform');

    expect(result.generatedAt).toEqual(new Date('2026-05-24T11:00:00.000Z'));
    expect(result.summary).toEqual(
      expect.objectContaining({
        tone: 'warning',
        launchReadiness: 'launch_ready',
      }),
    );
    expect(result.moduleSnapshot).toEqual({
      productEnabled: true,
      activeModuleCount: 5,
      coreModuleCount: 5,
      optionalModuleCount: 0,
      inactiveModuleKeys: ['promotions'],
    });
    expect(result.checklist).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'catalog',
          status: 'ready',
          isCore: true,
        }),
        expect.objectContaining({
          key: 'promotions',
          status: 'warning',
          isCore: false,
        }),
      ]),
    );
    expect(result.channelGuidance).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'catalog',
          status: 'ready',
        }),
        expect.objectContaining({
          key: 'campaign',
          status: 'warning',
        }),
      ]),
    );
    expect(result.launchPlans).toEqual([
      {
        id: 'saas-platform:launch-plan:initial',
        title: 'Initial ecommerce launch plan',
        status: 'warning',
        guardedExecutionReadiness: 'shadow_review_ready',
        scopeSummary:
          'El launch puede avanzar con alcance estrecho mientras dejas fuera modulos no activos: promotions.',
        selectedChannels: ['catalog', 'landing', 'campaign'],
        nextStep:
          'Usa este plan como target de approval y shadow review mientras el publish real sigue bloqueado.',
      },
    ]);
  });
});
