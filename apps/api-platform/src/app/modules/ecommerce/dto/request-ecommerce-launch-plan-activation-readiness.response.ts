import { TenantEcommerceLaunchPlanActivationReadinessView } from '@saas-platform/ecommerce-domain';
import { EcommerceLaunchPlanResponseDto } from './ecommerce-launch-workspace.response';

export interface RequestEcommerceLaunchPlanActivationReadinessResponseDto {
  tenantSlug: string;
  generatedAt: string;
  activationStatus:
    | 'ready_for_shadow_review'
    | 'needs_activation'
    | 'needs_core_modules';
  summary: string;
  requiredActions: string[];
  blockedBy: string[];
  guardrails: string[];
  plan: EcommerceLaunchPlanResponseDto;
}

export function toRequestEcommerceLaunchPlanActivationReadinessResponseDto(
  view: TenantEcommerceLaunchPlanActivationReadinessView,
): RequestEcommerceLaunchPlanActivationReadinessResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    activationStatus: view.activationStatus,
    summary: view.summary,
    requiredActions: [...view.requiredActions],
    blockedBy: [...view.blockedBy],
    guardrails: [...view.guardrails],
    plan: {
      ...view.plan,
      selectedChannels: [...view.plan.selectedChannels],
    },
  };
}
