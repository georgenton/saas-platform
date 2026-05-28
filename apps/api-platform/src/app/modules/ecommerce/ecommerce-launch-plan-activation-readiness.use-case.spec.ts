import { RequestTenantEcommerceLaunchPlanActivationReadinessUseCase } from '@saas-platform/ecommerce-application';

describe('Ecommerce launch plan activation readiness use case', () => {
  it('returns a shadow-review-ready readiness packet for an eligible launch plan', async () => {
    const getTenantEcommerceLaunchPlanDetailUseCase = {
      execute: jest.fn().mockResolvedValue({
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
        checklist: [],
        channelGuidance: [],
        launchHints: [],
        safeActions: [],
        blockedActions: [],
        plan: {
          id: 'saas-platform:launch-plan:initial',
          title: 'Initial ecommerce launch plan',
          status: 'warning',
          guardedExecutionReadiness: 'shadow_review_ready',
          scopeSummary: 'Ready for a narrow pilot.',
          selectedChannels: ['catalog', 'landing', 'campaign'],
          nextStep: 'Use this plan as the pilot target.',
        },
      }),
    };

    const useCase = new RequestTenantEcommerceLaunchPlanActivationReadinessUseCase(
      getTenantEcommerceLaunchPlanDetailUseCase as never,
      () => new Date('2026-05-28T12:00:00.000Z'),
    );

    await expect(
      useCase.execute('saas-platform', 'saas-platform:launch-plan:initial'),
    ).resolves.toEqual({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-28T12:00:00.000Z'),
      plan: {
        id: 'saas-platform:launch-plan:initial',
        title: 'Initial ecommerce launch plan',
        status: 'warning',
        guardedExecutionReadiness: 'shadow_review_ready',
        scopeSummary: 'Ready for a narrow pilot.',
        selectedChannels: ['catalog', 'landing', 'campaign'],
        nextStep: 'Use this plan as the pilot target.',
      },
      activationStatus: 'ready_for_shadow_review',
      summary:
        'El launch plan ya tiene base suficiente para pedir activation readiness del publish pilot en shadow review.',
      requiredActions: [
        'Confirmar owner humano del piloto antes de ejecutar el lane.',
        'Mantener el launch scope estrecho y sin storefront publish real.',
      ],
      blockedBy: [],
      guardrails: [
        'El publish pilot sigue siendo auditado y no publica storefront real.',
        'No ampliar el scope fuera de los canales seleccionados por el plan.',
      ],
    });
  });
});
