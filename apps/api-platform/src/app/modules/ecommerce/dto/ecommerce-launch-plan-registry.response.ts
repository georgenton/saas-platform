import { TenantEcommerceLaunchPlanRegistryView } from '@saas-platform/ecommerce-domain';
import { EcommerceLaunchPlanResponseDto } from './ecommerce-launch-workspace.response';

export interface EcommerceLaunchPlanRegistryResponseDto {
  tenantSlug: string;
  generatedAt: string;
  workspaceSummary: {
    tone: 'healthy' | 'warning' | 'critical';
    launchReadiness: 'launch_ready' | 'needs_activation' | 'needs_core_modules';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  counts: {
    totalPlans: number;
    readyPlans: number;
    warningPlans: number;
    blockedPlans: number;
    shadowReviewReadyPlans: number;
    activationBlockedPlans: number;
    coreModuleBlockedPlans: number;
  };
  plans: EcommerceLaunchPlanResponseDto[];
}

export function toEcommerceLaunchPlanRegistryResponseDto(
  view: TenantEcommerceLaunchPlanRegistryView,
): EcommerceLaunchPlanRegistryResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    workspaceSummary: {
      ...view.workspaceSummary,
    },
    counts: {
      ...view.counts,
    },
    plans: view.plans.map((entry) => ({
      ...entry,
      selectedChannels: [...entry.selectedChannels],
    })),
  };
}
