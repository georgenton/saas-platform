import {
  GrowthOperationalCaseAutoAssignmentPolicyKey,
  GrowthOperationalCaseAutoAssignmentSettings,
} from '@saas-platform/growth-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { GrowthOperationalCaseAutoAssignmentSettingsRepository } from '../ports/growth-operational-case-auto-assignment-settings.repository';

export interface UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsInput {
  tenantSlug: string;
  defaultPolicyKey: GrowthOperationalCaseAutoAssignmentPolicyKey;
}

export class UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly settingsRepository: GrowthOperationalCaseAutoAssignmentSettingsRepository,
  ) {}

  async execute(
    input: UpsertTenantGrowthOperationalCaseAutoAssignmentSettingsInput,
  ): Promise<GrowthOperationalCaseAutoAssignmentSettings> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = new Date();
    const existingSettings = await this.settingsRepository.findByTenantId(
      tenant.id,
    );

    const settings = GrowthOperationalCaseAutoAssignmentSettings.create({
      id:
        existingSettings?.id ??
        `${tenant.id}:growth-operational-case-auto-assignment-settings`,
      tenantId: tenant.id,
      defaultPolicyKey: input.defaultPolicyKey,
      createdAt: existingSettings?.createdAt ?? now,
      updatedAt: now,
    });

    await this.settingsRepository.save(settings);

    return settings;
  }
}
