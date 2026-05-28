import { TenantEcommerceLaunchPlanDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceLaunchPlanNotFoundError } from '../errors/ecommerce-launch-plan-not-found.error';
import { GetTenantEcommerceLaunchWorkspaceUseCase } from './get-tenant-ecommerce-launch-workspace.use-case';

export class GetTenantEcommerceLaunchPlanDetailUseCase {
  constructor(
    private readonly getTenantEcommerceLaunchWorkspaceUseCase: GetTenantEcommerceLaunchWorkspaceUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    launchPlanId: string,
  ): Promise<TenantEcommerceLaunchPlanDetailView> {
    const workspace =
      await this.getTenantEcommerceLaunchWorkspaceUseCase.execute(tenantSlug);
    const plan =
      workspace.launchPlans.find((entry) => entry.id === launchPlanId) ?? null;

    if (!plan) {
      throw new EcommerceLaunchPlanNotFoundError(tenantSlug, launchPlanId);
    }

    return {
      tenantSlug: workspace.tenantSlug,
      generatedAt: workspace.generatedAt,
      workspaceSummary: {
        ...workspace.summary,
      },
      moduleSnapshot: {
        ...workspace.moduleSnapshot,
        inactiveModuleKeys: [...workspace.moduleSnapshot.inactiveModuleKeys],
      },
      checklist: workspace.checklist.map((entry) => ({ ...entry })),
      channelGuidance: workspace.channelGuidance.map((entry) => ({ ...entry })),
      launchHints: workspace.launchHints.map((entry) => ({
        ...entry,
        recommendedInputs: [...entry.recommendedInputs],
      })),
      safeActions: [...workspace.safeActions],
      blockedActions: [...workspace.blockedActions],
      plan: {
        ...plan,
        selectedChannels: [...plan.selectedChannels],
      },
    };
  }
}
