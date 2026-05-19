import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import {
  WhatsappMessageTemplate,
  WhatsappMessageTemplateCategory,
  WhatsappMessageTemplateProviderApprovalStatus,
} from '@saas-platform/growth-domain';
import { WhatsappMessageTemplateIdGenerator } from '../ports/whatsapp-message-template-id.generator';
import { WhatsappMessageTemplateRepository } from '../ports/whatsapp-message-template.repository';

export interface CreateTenantWhatsappMessageTemplateInput {
  tenantSlug: string;
  key: string;
  name: string;
  languageCode: string;
  category: WhatsappMessageTemplateCategory;
  bodyTemplate: string;
  intentKey?: string | null;
  providerTemplateName?: string | null;
  providerApprovalStatus?: WhatsappMessageTemplateProviderApprovalStatus | null;
}

export class CreateTenantWhatsappMessageTemplateUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappMessageTemplateRepository: WhatsappMessageTemplateRepository,
    private readonly whatsappMessageTemplateIdGenerator: WhatsappMessageTemplateIdGenerator,
  ) {}

  async execute(
    input: CreateTenantWhatsappMessageTemplateInput,
  ): Promise<WhatsappMessageTemplate> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = new Date();
    const template = WhatsappMessageTemplate.create({
      id: this.whatsappMessageTemplateIdGenerator.generate(),
      tenantId: tenant.id,
      key: input.key.trim(),
      name: input.name.trim(),
      languageCode: input.languageCode.trim().toLowerCase(),
      category: input.category,
      bodyTemplate: input.bodyTemplate.trim(),
      intentKey: input.intentKey?.trim() || null,
      providerTemplateName: input.providerTemplateName?.trim() || null,
      providerApprovalStatus: input.providerApprovalStatus ?? 'draft',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    await this.whatsappMessageTemplateRepository.save(template);

    return template;
  }
}
