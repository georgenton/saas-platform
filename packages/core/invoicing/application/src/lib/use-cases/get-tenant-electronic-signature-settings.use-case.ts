import { ElectronicSignatureSettings } from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { ElectronicSignatureSettingsNotFoundError } from '../errors/electronic-signature-settings-not-found.error';
import { ElectronicSignatureSettingsRepository } from '../ports/electronic-signature-settings.repository';

export class GetTenantElectronicSignatureSettingsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly electronicSignatureSettingsRepository: ElectronicSignatureSettingsRepository,
  ) {}

  async execute(tenantSlug: string): Promise<ElectronicSignatureSettings> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const settings =
      await this.electronicSignatureSettingsRepository.findByTenantId(tenant.id);

    if (!settings) {
      throw new ElectronicSignatureSettingsNotFoundError(tenantSlug);
    }

    return settings;
  }
}
