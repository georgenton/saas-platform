import { TenantEcommerceLaunchPlanRegistryView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceLaunchWorkspaceUseCase } from './get-tenant-ecommerce-launch-workspace.use-case';

export class ListTenantEcommerceLaunchPlansUseCase {
  constructor(
    private readonly getTenantEcommerceLaunchWorkspaceUseCase: GetTenantEcommerceLaunchWorkspaceUseCase,
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantEcommerceLaunchPlanRegistryView> {
    const workspace =
      await this.getTenantEcommerceLaunchWorkspaceUseCase.execute(tenantSlug);

    return {
      tenantSlug: workspace.tenantSlug,
      generatedAt: workspace.generatedAt,
      workspaceSummary: {
        ...workspace.summary,
      },
      counts: {
        totalPlans: workspace.launchPlans.length,
        readyPlans: workspace.launchPlans.filter((entry) => entry.status === 'ready')
          .length,
        warningPlans: workspace.launchPlans.filter(
          (entry) => entry.status === 'warning',
        ).length,
        blockedPlans: workspace.launchPlans.filter(
          (entry) => entry.status === 'blocked',
        ).length,
        shadowReviewReadyPlans: workspace.launchPlans.filter(
          (entry) =>
            entry.guardedExecutionReadiness === 'shadow_review_ready',
        ).length,
        activationBlockedPlans: workspace.launchPlans.filter(
          (entry) => entry.guardedExecutionReadiness === 'needs_activation',
        ).length,
        coreModuleBlockedPlans: workspace.launchPlans.filter(
          (entry) => entry.guardedExecutionReadiness === 'needs_core_modules',
        ).length,
      },
      plans: workspace.launchPlans.map((entry) => ({
        ...entry,
        selectedChannels: [...entry.selectedChannels],
      })),
    };
  }
}
