import { TenantEcommerceLaunchPlanDetailView } from '@saas-platform/ecommerce-domain';
import { EcommerceLaunchPlanResponseDto } from './ecommerce-launch-workspace.response';

export interface EcommerceLaunchPlanDetailResponseDto {
  tenantSlug: string;
  generatedAt: string;
  workspaceSummary: {
    tone: 'healthy' | 'warning' | 'critical';
    launchReadiness: 'launch_ready' | 'needs_activation' | 'needs_core_modules';
    headline: string;
    detail: string;
    suggestedFocus: string;
  };
  moduleSnapshot: {
    productEnabled: boolean;
    activeModuleCount: number;
    coreModuleCount: number;
    optionalModuleCount: number;
    inactiveModuleKeys: string[];
  };
  checklist: Array<{
    key: string;
    label: string;
    isCore: boolean;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
  }>;
  channelGuidance: Array<{
    key: 'catalog' | 'landing' | 'campaign' | 'operations';
    title: string;
    status: 'ready' | 'warning' | 'blocked';
    detail: string;
    recommendedUse: string;
  }>;
  launchHints: Array<{
    key: string;
    title: string;
    objective: string;
    whenToUse: string;
    recommendedInputs: string[];
    caution: string;
  }>;
  safeActions: string[];
  blockedActions: string[];
  plan: EcommerceLaunchPlanResponseDto;
}

export function toEcommerceLaunchPlanDetailResponseDto(
  view: TenantEcommerceLaunchPlanDetailView,
): EcommerceLaunchPlanDetailResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    workspaceSummary: {
      ...view.workspaceSummary,
    },
    moduleSnapshot: {
      ...view.moduleSnapshot,
      inactiveModuleKeys: [...view.moduleSnapshot.inactiveModuleKeys],
    },
    checklist: view.checklist.map((entry) => ({ ...entry })),
    channelGuidance: view.channelGuidance.map((entry) => ({ ...entry })),
    launchHints: view.launchHints.map((entry) => ({
      ...entry,
      recommendedInputs: [...entry.recommendedInputs],
    })),
    safeActions: [...view.safeActions],
    blockedActions: [...view.blockedActions],
    plan: {
      ...view.plan,
      selectedChannels: [...view.plan.selectedChannels],
    },
  };
}
