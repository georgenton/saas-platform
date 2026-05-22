import { GrowthOperationalCaseAutoAssignmentSettings } from '@saas-platform/growth-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { GrowthOperationalCaseAutoAssignmentSettingsRepository } from '../ports/growth-operational-case-auto-assignment-settings.repository';

export class GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly settingsRepository: GrowthOperationalCaseAutoAssignmentSettingsRepository,
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<GrowthOperationalCaseAutoAssignmentSettings> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const settings = await this.settingsRepository.findByTenantId(tenant.id);

    if (settings) {
      return settings;
    }

    const now = new Date();
    return GrowthOperationalCaseAutoAssignmentSettings.create({
      id: `${tenant.id}:growth-operational-case-auto-assignment-settings`,
      tenantId: tenant.id,
      defaultPolicyKey: 'balanced',
      createdAt: now,
      updatedAt: now,
    });
  }
}
