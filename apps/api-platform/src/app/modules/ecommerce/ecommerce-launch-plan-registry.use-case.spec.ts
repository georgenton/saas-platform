import { ListTenantEcommerceLaunchPlansUseCase } from '@saas-platform/ecommerce-application';

describe('Ecommerce launch plan registry use case', () => {
  it('returns a tenant-scoped launch plan registry from the workspace', async () => {
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
        checklist: [],
        channelGuidance: [],
        launchPlans: [
          {
            id: 'saas-platform:launch-plan:initial',
            title: 'Initial ecommerce launch plan',
            status: 'warning',
            guardedExecutionReadiness: 'shadow_review_ready',
            scopeSummary:
              'El launch puede avanzar con alcance estrecho mientras dejas fuera modulos no activos: promotions.',
            selectedChannels: ['catalog', 'landing', 'campaign'],
            nextStep: 'Usa este plan como target de approval.',
          },
        ],
        launchHints: [],
        safeActions: [],
        blockedActions: [],
      }),
    };

    const useCase = new ListTenantEcommerceLaunchPlansUseCase(
      getTenantEcommerceLaunchWorkspaceUseCase as never,
    );

    await expect(useCase.execute('saas-platform')).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-24T11:00:00.000Z'),
      workspaceSummary: {
        tone: 'warning',
        launchReadiness: 'launch_ready',
        headline: 'Launch ready with narrow scope',
        detail: 'Catalog, landing, and campaign can move in shadow review.',
        suggestedFocus: 'Keep the first launch intentionally small.',
      },
      counts: {
        totalPlans: 1,
        readyPlans: 0,
        warningPlans: 1,
        blockedPlans: 0,
        shadowReviewReadyPlans: 1,
        activationBlockedPlans: 0,
        coreModuleBlockedPlans: 0,
      },
      plans: [
        {
          id: 'saas-platform:launch-plan:initial',
          title: 'Initial ecommerce launch plan',
          status: 'warning',
          guardedExecutionReadiness: 'shadow_review_ready',
          scopeSummary:
            'El launch puede avanzar con alcance estrecho mientras dejas fuera modulos no activos: promotions.',
          selectedChannels: ['catalog', 'landing', 'campaign'],
          nextStep: 'Usa este plan como target de approval.',
        },
      ],
    });

    expect(
      getTenantEcommerceLaunchWorkspaceUseCase.execute,
    ).toHaveBeenCalledWith('saas-platform');
  });
});
