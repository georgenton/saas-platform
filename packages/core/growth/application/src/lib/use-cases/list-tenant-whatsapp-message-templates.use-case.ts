import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { WhatsappMessageTemplate } from '@saas-platform/growth-domain';
import { WhatsappMessageTemplateRepository } from '../ports/whatsapp-message-template.repository';

export class ListTenantWhatsappMessageTemplatesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappMessageTemplateRepository: WhatsappMessageTemplateRepository,
  ) {}

  async execute(tenantSlug: string): Promise<WhatsappMessageTemplate[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.whatsappMessageTemplateRepository.findByTenantId(tenant.id);
  }
}
