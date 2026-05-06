import { ElectronicSubmissionSettings } from '@saas-platform/invoicing-domain';

export interface ElectronicSubmissionSettingsRepository {
  save(settings: ElectronicSubmissionSettings): Promise<void>;
  findByTenantId(
    tenantId: string,
  ): Promise<ElectronicSubmissionSettings | null>;
}
