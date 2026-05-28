import {
  EcommerceLaunchPlanNotFoundError,
  GetTenantEcommerceLaunchPlanDetailUseCase,
} from '@saas-platform/ecommerce-application';

describe('Ecommerce launch plan detail use case', () => {
  it('returns one tenant-scoped ecommerce launch plan detail from the workspace', async () => {
    const getTenantEcommerceLaunchWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-24T11:00:00.000Z'),
        summary: {
          tone: 'warning',
          launchReadiness: 'launch_ready',
          headline: 'Launch ready with narrow scope',
          detail: 'Catalog, landing, and campaign can move in shadow review.',
          suggestedFocus: 'Keep the first launch intentionally small.',
        },
        moduleSnapshot: {
          productEnabled: true,
          activeModuleCount: 5,
          coreModuleCount: 5,
          optionalModuleCount: 0,
          inactiveModuleKeys: ['promotions'],
        },
        checklist: [
          {
            key: 'catalog',
            label: 'Catalog',
            isCore: true,
            status: 'ready',
            detail: 'Disponible para el launch base del tenant.',
          },
        ],
        channelGuidance: [
          {
            key: 'catalog',
            title: 'Catalog scope',
            status: 'ready',
            detail: 'Ya puedes estructurar un catalogo inicial.',
            recommendedUse: 'Empieza por un set corto de productos ancla.',
          },
        ],
        launchPlans: [
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
        ],
        launchHints: [
          {
            key: 'launch-angle',
            title: 'Launch angle',
            objective: 'Bajar el lanzamiento a una promesa comercial concreta.',
            whenToUse: 'Cuando ya hay base para escribir el primer brief comercial.',
            recommendedInputs: ['Enabled product list'],
            caution: 'No inventes promociones que no existen.',
          },
        ],
        safeActions: ['Resumir el launch scope inicial usando solo productos activos.'],
        blockedActions: ['Publicar catalogo automaticamente.'],
      }),
    };

    const useCase = new GetTenantEcommerceLaunchPlanDetailUseCase(
      getTenantEcommerceLaunchWorkspaceUseCase as never,
    );

    await expect(
      useCase.execute('saas-platform', 'saas-platform:launch-plan:initial'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-24T11:00:00.000Z'),
      workspaceSummary: {
        tone: 'warning',
        launchReadiness: 'launch_ready',
        headline: 'Launch ready with narrow scope',
        detail: 'Catalog, landing, and campaign can move in shadow review.',
        suggestedFocus: 'Keep the first launch intentionally small.',
      },
      moduleSnapshot: {
        productEnabled: true,
        activeModuleCount: 5,
        coreModuleCount: 5,
        optionalModuleCount: 0,
        inactiveModuleKeys: ['promotions'],
      },
      checklist: [
        {
          key: 'catalog',
          label: 'Catalog',
          isCore: true,
          status: 'ready',
          detail: 'Disponible para el launch base del tenant.',
        },
      ],
      channelGuidance: [
        {
          key: 'catalog',
          title: 'Catalog scope',
          status: 'ready',
          detail: 'Ya puedes estructurar un catalogo inicial.',
          recommendedUse: 'Empieza por un set corto de productos ancla.',
        },
      ],
      launchHints: [
        {
          key: 'launch-angle',
          title: 'Launch angle',
          objective: 'Bajar el lanzamiento a una promesa comercial concreta.',
          whenToUse: 'Cuando ya hay base para escribir el primer brief comercial.',
          recommendedInputs: ['Enabled product list'],
          caution: 'No inventes promociones que no existen.',
        },
      ],
      safeActions: ['Resumir el launch scope inicial usando solo productos activos.'],
      blockedActions: ['Publicar catalogo automaticamente.'],
      plan: {
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
    });

    expect(
      getTenantEcommerceLaunchWorkspaceUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });

  it('throws when the tenant launch plan does not exist', async () => {
    const getTenantEcommerceLaunchWorkspaceUseCase = {
      execute: jest.fn().mockResolvedValue({
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-24T11:00:00.000Z'),
        summary: {
          tone: 'healthy',
          launchReadiness: 'launch_ready',
          headline: 'Ready',
          detail: 'Ready',
          suggestedFocus: 'Ready',
        },
        moduleSnapshot: {
          productEnabled: true,
          activeModuleCount: 5,
          coreModuleCount: 5,
          optionalModuleCount: 0,
          inactiveModuleKeys: [],
        },
        checklist: [],
        channelGuidance: [],
        launchPlans: [],
        launchHints: [],
        safeActions: [],
        blockedActions: [],
      }),
    };

    const useCase = new GetTenantEcommerceLaunchPlanDetailUseCase(
      getTenantEcommerceLaunchWorkspaceUseCase as never,
    );

    await expect(
      useCase.execute('saas-platform', 'missing-plan'),
    ).rejects.toBeInstanceOf(EcommerceLaunchPlanNotFoundError);
  });
});
