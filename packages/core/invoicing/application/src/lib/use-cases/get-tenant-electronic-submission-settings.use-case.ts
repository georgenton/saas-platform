import { ElectronicSubmissionSettings } from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { ElectronicSubmissionSettingsNotFoundError } from '../errors/electronic-submission-settings-not-found.error';
import { ElectronicSubmissionSettingsRepository } from '../ports/electronic-submission-settings.repository';

export class GetTenantElectronicSubmissionSettingsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly electronicSubmissionSettingsRepository: ElectronicSubmissionSettingsRepository,
  ) {}

  async execute(tenantSlug: string): Promise<ElectronicSubmissionSettings> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const settings =
      await this.electronicSubmissionSettingsRepository.findByTenantId(
        tenant.id,
      );

    if (!settings) {
      throw new ElectronicSubmissionSettingsNotFoundError(tenantSlug);
    }

    return settings;
  }
}
