import {
  ConversationMessage,
  ConversationThread,
  WhatsappAutomationRule,
  WhatsappMessageTemplate,
} from '@saas-platform/growth-domain';
import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { WhatsappAutomationRuleRepository } from '../ports/whatsapp-automation-rule.repository';
import { WhatsappMessageTemplateRepository } from '../ports/whatsapp-message-template.repository';

export interface TenantWhatsappAutomationSuggestionView {
  ruleId: string;
  ruleKey: string;
  ruleName: string;
  triggerEvent: string;
  actionType: string;
  actionOutboundIntentKey: string | null;
  templateId: string | null;
  templateKey: string | null;
  templateName: string | null;
  providerTemplateName: string | null;
  providerApprovalStatus: string | null;
  bodyTemplatePreview: string | null;
}

export interface TenantWhatsappAutomationSuggestionsView {
  tenantSlug: string;
  threadId: string;
  generatedAt: Date;
  suggestions: TenantWhatsappAutomationSuggestionView[];
}

export class GetTenantWhatsappAutomationSuggestionsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly whatsappAutomationRuleRepository: WhatsappAutomationRuleRepository,
    private readonly whatsappMessageTemplateRepository: WhatsappMessageTemplateRepository,
  ) {}

  async execute(
    tenantSlug: string,
    threadId: string,
  ): Promise<TenantWhatsappAutomationSuggestionsView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const thread =
      await this.conversationThreadRepository.findByTenantIdAndId(
        tenant.id,
        threadId,
      );

    if (!thread || thread.channel !== 'whatsapp') {
      throw new ConversationThreadNotFoundError(tenantSlug, threadId);
    }

    const [messages, rules, templates] = await Promise.all([
      this.conversationMessageRepository.findByTenantIdAndThreadId(
        tenant.id,
        thread.id,
      ),
      this.whatsappAutomationRuleRepository.findByTenantId(tenant.id),
      this.whatsappMessageTemplateRepository.findByTenantId(tenant.id),
    ]);

    const templateIndex = new Map(templates.map((t) => [t.id, t] as const));
    const latestMessage = messages[messages.length - 1] ?? null;
    const latestOutboundMessage = [...messages]
      .reverse()
      .find((message) => message.direction === 'outbound') ?? null;

    const suggestions = rules
      .filter((rule) =>
        this.matchesRule(rule, thread, latestMessage, latestOutboundMessage),
      )
      .map((rule) => this.toSuggestion(rule, templateIndex.get(rule.templateId ?? '') ?? null));

    return {
      tenantSlug,
      threadId,
      generatedAt: new Date(),
      suggestions,
    };
  }

  private matchesRule(
    rule: WhatsappAutomationRule,
    thread: ConversationThread,
    latestMessage: ConversationMessage | null,
    latestOutboundMessage: ConversationMessage | null,
  ): boolean {
    if (rule.status !== 'active') {
      return false;
    }

    if (rule.matchAssigneeMode === 'assigned' && !thread.assigneeUserId) {
      return false;
    }

    if (rule.matchAssigneeMode === 'unassigned' && !!thread.assigneeUserId) {
      return false;
    }

    if (rule.triggerEvent === 'inbound_message' && latestMessage?.direction !== 'inbound') {
      return false;
    }

    if (
      rule.triggerEvent === 'delivery_status_changed' &&
      !latestOutboundMessage?.deliveryStatus
    ) {
      return false;
    }

    if (
      rule.matchOutboundIntentKey &&
      latestOutboundMessage?.outboundIntentKey !== rule.matchOutboundIntentKey
    ) {
      return false;
    }

    if (
      rule.matchDeliveryStatus &&
      latestOutboundMessage?.deliveryStatus !== rule.matchDeliveryStatus
    ) {
      return false;
    }

    return true;
  }

  private toSuggestion(
    rule: WhatsappAutomationRule,
    template: WhatsappMessageTemplate | null,
  ): TenantWhatsappAutomationSuggestionView {
    const templateData = template?.toPrimitives() ?? null;

    return {
      ruleId: rule.id,
      ruleKey: rule.key,
      ruleName: rule.name,
      triggerEvent: rule.triggerEvent,
      actionType: rule.actionType,
      actionOutboundIntentKey: rule.actionOutboundIntentKey,
      templateId: rule.templateId,
      templateKey: templateData?.key ?? null,
      templateName: templateData?.name ?? null,
      providerTemplateName: templateData?.providerTemplateName ?? null,
      providerApprovalStatus: templateData?.providerApprovalStatus ?? null,
      bodyTemplatePreview: templateData?.bodyTemplate ?? null,
    };
  }
}
