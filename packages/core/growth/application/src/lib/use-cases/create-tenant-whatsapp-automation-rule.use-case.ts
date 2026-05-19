import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import {
  ConversationMessageDeliveryStatus,
  WhatsappAutomationActionType,
  WhatsappAutomationAssigneeMode,
  WhatsappAutomationRule,
  WhatsappAutomationTriggerEvent,
} from '@saas-platform/growth-domain';
import { WhatsappMessageTemplateNotFoundError } from '../errors/whatsapp-message-template-not-found.error';
import { WhatsappAutomationRuleIdGenerator } from '../ports/whatsapp-automation-rule-id.generator';
import { WhatsappAutomationRuleRepository } from '../ports/whatsapp-automation-rule.repository';
import { WhatsappMessageTemplateRepository } from '../ports/whatsapp-message-template.repository';

export interface CreateTenantWhatsappAutomationRuleInput {
  tenantSlug: string;
  key: string;
  name: string;
  triggerEvent: WhatsappAutomationTriggerEvent;
  matchOutboundIntentKey?: string | null;
  matchDeliveryStatus?: ConversationMessageDeliveryStatus | null;
  matchAssigneeMode?: WhatsappAutomationAssigneeMode | null;
  templateId?: string | null;
  actionType?: WhatsappAutomationActionType | null;
  actionOutboundIntentKey?: string | null;
}

export class CreateTenantWhatsappAutomationRuleUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappAutomationRuleRepository: WhatsappAutomationRuleRepository,
    private readonly whatsappAutomationRuleIdGenerator: WhatsappAutomationRuleIdGenerator,
    private readonly whatsappMessageTemplateRepository: WhatsappMessageTemplateRepository,
  ) {}

  async execute(
    input: CreateTenantWhatsappAutomationRuleInput,
  ): Promise<WhatsappAutomationRule> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const templateId = this.normalizeOptionalValue(input.templateId);

    if (templateId) {
      const template =
        await this.whatsappMessageTemplateRepository.findByTenantIdAndId(
          tenant.id,
          templateId,
        );

      if (!template) {
        throw new WhatsappMessageTemplateNotFoundError(
          input.tenantSlug,
          templateId,
        );
      }
    }

    const now = new Date();
    const rule = WhatsappAutomationRule.create({
      id: this.whatsappAutomationRuleIdGenerator.generate(),
      tenantId: tenant.id,
      key: input.key.trim(),
      name: input.name.trim(),
      triggerEvent: input.triggerEvent,
      matchOutboundIntentKey: this.normalizeOptionalValue(
        input.matchOutboundIntentKey,
      ),
      matchDeliveryStatus: input.matchDeliveryStatus ?? null,
      matchAssigneeMode: input.matchAssigneeMode ?? 'any',
      templateId,
      actionType: input.actionType ?? 'suggest_template',
      actionOutboundIntentKey: this.normalizeOptionalValue(
        input.actionOutboundIntentKey,
      ),
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });

    await this.whatsappAutomationRuleRepository.save(rule);

    return rule;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();
    return normalizedValue ? normalizedValue : null;
  }
}
