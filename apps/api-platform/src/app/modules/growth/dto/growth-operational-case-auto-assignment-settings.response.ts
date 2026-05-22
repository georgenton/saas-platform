import { GrowthOperationalCaseAutoAssignmentSettings } from '@saas-platform/growth-domain';

export interface GrowthOperationalCaseAutoAssignmentSettingsResponseDto {
  id: string;
  tenantId: string;
  defaultPolicyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first';
  createdAt: string;
  updatedAt: string;
}

export const toGrowthOperationalCaseAutoAssignmentSettingsResponseDto = (
  settings: GrowthOperationalCaseAutoAssignmentSettings,
): GrowthOperationalCaseAutoAssignmentSettingsResponseDto => ({
  id: settings.id,
  tenantId: settings.tenantId,
  defaultPolicyKey: settings.defaultPolicyKey,
  createdAt: settings.createdAt.toISOString(),
  updatedAt: settings.updatedAt.toISOString(),
});
