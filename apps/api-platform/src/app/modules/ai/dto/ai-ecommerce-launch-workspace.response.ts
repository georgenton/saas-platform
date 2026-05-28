import {
  TenantEcommerceLaunchPlanView,
  TenantEcommerceLaunchWorkspaceView,
} from '@saas-platform/ecommerce-domain';

export interface AiEcommerceLaunchPlanResponseDto {
  id: string;
  title: string;
  status: 'ready' | 'warning' | 'blocked';
  guardedExecutionReadiness:
    | 'shadow_review_ready'
    | 'needs_activation'
    | 'needs_core_modules';
  scopeSummary: string;
  selectedChannels: Array<'catalog' | 'landing' | 'campaign'>;
  nextStep: string;
}

export interface AiEcommerceLaunchWorkspaceResponseDto {
  tenantSlug: string;
  generatedAt: string;
  summary: {
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
  launchPlans: AiEcommerceLaunchPlanResponseDto[];
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
}

export function toAiEcommerceLaunchWorkspaceResponseDto(
  view: TenantEcommerceLaunchWorkspaceView,
): AiEcommerceLaunchWorkspaceResponseDto {
  return {
    tenantSlug: view.tenantSlug,
    generatedAt: view.generatedAt.toISOString(),
    summary: {
      ...view.summary,
    },
    moduleSnapshot: {
      ...view.moduleSnapshot,
      inactiveModuleKeys: [...view.moduleSnapshot.inactiveModuleKeys],
    },
    checklist: view.checklist.map((entry) => ({ ...entry })),
    channelGuidance: view.channelGuidance.map((entry) => ({ ...entry })),
    launchPlans: view.launchPlans.map((entry) =>
      toAiEcommerceLaunchPlanResponseDto(entry),
    ),
    launchHints: view.launchHints.map((entry) => ({
      ...entry,
      recommendedInputs: [...entry.recommendedInputs],
    })),
    safeActions: [...view.safeActions],
    blockedActions: [...view.blockedActions],
  };
}

export function toAiEcommerceLaunchPlanResponseDto(
  view: TenantEcommerceLaunchPlanView,
): AiEcommerceLaunchPlanResponseDto {
  return {
    ...view,
    selectedChannels: [...view.selectedChannels],
  };
}
