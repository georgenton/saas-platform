import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { WhatsappMessageTemplate } from '@saas-platform/growth-domain';
import { WhatsappMessageTemplateNotFoundError } from '../errors/whatsapp-message-template-not-found.error';
import { WhatsappMessageTemplateRepository } from '../ports/whatsapp-message-template.repository';

export class GetTenantWhatsappMessageTemplateByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappMessageTemplateRepository: WhatsappMessageTemplateRepository,
  ) {}

  async execute(
    tenantSlug: string,
    templateId: string,
  ): Promise<WhatsappMessageTemplate> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const template =
      await this.whatsappMessageTemplateRepository.findByTenantIdAndId(
        tenant.id,
        templateId,
      );

    if (!template) {
      throw new WhatsappMessageTemplateNotFoundError(tenantSlug, templateId);
    }

    return template;
  }
}
