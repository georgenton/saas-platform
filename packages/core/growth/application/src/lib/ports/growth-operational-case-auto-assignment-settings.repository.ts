import { GrowthOperationalCaseAutoAssignmentSettings } from '@saas-platform/growth-domain';

export interface GrowthOperationalCaseAutoAssignmentSettingsRepository {
  save(
    settings: GrowthOperationalCaseAutoAssignmentSettings,
  ): Promise<void>;
  findByTenantId(
    tenantId: string,
  ): Promise<GrowthOperationalCaseAutoAssignmentSettings | null>;
}
