import { ElectronicSignatureSettings } from '@saas-platform/invoicing-domain';

export interface ElectronicSignatureSettingsRepository {
  save(settings: ElectronicSignatureSettings): Promise<void>;
  findByTenantId(tenantId: string): Promise<ElectronicSignatureSettings | null>;
}
