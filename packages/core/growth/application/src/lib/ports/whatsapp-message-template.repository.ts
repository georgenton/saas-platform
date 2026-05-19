import { WhatsappMessageTemplate } from '@saas-platform/growth-domain';

export interface WhatsappMessageTemplateRepository {
  save(template: WhatsappMessageTemplate): Promise<void>;
  findByTenantId(tenantId: string): Promise<WhatsappMessageTemplate[]>;
  findByTenantIdAndId(
    tenantId: string,
    templateId: string,
  ): Promise<WhatsappMessageTemplate | null>;
  findByTenantIdAndKey(
    tenantId: string,
    key: string,
  ): Promise<WhatsappMessageTemplate | null>;
}
