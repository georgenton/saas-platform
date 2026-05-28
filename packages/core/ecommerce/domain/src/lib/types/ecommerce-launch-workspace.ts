export interface TenantEcommerceLaunchWorkspaceChecklistItemView {
  key: string;
  label: string;
  isCore: boolean;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
}

export interface TenantEcommerceLaunchWorkspaceChannelGuidanceView {
  key: 'catalog' | 'landing' | 'campaign' | 'operations';
  title: string;
  status: 'ready' | 'warning' | 'blocked';
  detail: string;
  recommendedUse: string;
}

export interface TenantEcommerceLaunchWorkspaceHintView {
  key: string;
  title: string;
  objective: string;
  whenToUse: string;
  recommendedInputs: string[];
  caution: string;
}

export interface TenantEcommerceLaunchPlanView {
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

export interface TenantEcommerceLaunchWorkspaceView {
  tenantSlug: string;
  generatedAt: Date;
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
  checklist: TenantEcommerceLaunchWorkspaceChecklistItemView[];
  channelGuidance: TenantEcommerceLaunchWorkspaceChannelGuidanceView[];
  launchPlans: TenantEcommerceLaunchPlanView[];
  launchHints: TenantEcommerceLaunchWorkspaceHintView[];
  safeActions: string[];
  blockedActions: string[];
}
