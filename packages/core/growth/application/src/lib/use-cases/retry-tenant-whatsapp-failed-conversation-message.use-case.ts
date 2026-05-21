import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ConversationMessage } from '@saas-platform/growth-domain';
import { ConversationMessageNotFoundError } from '../errors/conversation-message-not-found.error';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { WhatsappMessageRetryNotAllowedError } from '../errors/whatsapp-message-retry-not-allowed.error';
import { ConversationDeliveryEventRepository } from '../ports/conversation-delivery-event.repository';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { assessWhatsappRetryOperation } from '../support/whatsapp-provider-operations';
import { parseWhatsappTemplateRenderSnapshot } from '../support/whatsapp-template-render-snapshot';
import { SendTenantWhatsappConversationMessageUseCase } from './send-tenant-whatsapp-conversation-message.use-case';

export interface RetryTenantWhatsappFailedConversationMessageInput {
  tenantSlug: string;
  threadId: string;
  messageId: string;
  occurredAt?: Date | null;
}

export class RetryTenantWhatsappFailedConversationMessageUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly conversationDeliveryEventRepository: ConversationDeliveryEventRepository,
    private readonly sendTenantWhatsappConversationMessageUseCase: SendTenantWhatsappConversationMessageUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: RetryTenantWhatsappFailedConversationMessageInput,
  ): Promise<ConversationMessage> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const thread = await this.conversationThreadRepository.findByTenantIdAndId(
      tenant.id,
      input.threadId,
    );

    if (!thread || thread.channel !== 'whatsapp') {
      throw new ConversationThreadNotFoundError(input.tenantSlug, input.threadId);
    }

    const message = await this.conversationMessageRepository.findByTenantIdAndId(
      tenant.id,
      input.messageId,
    );

    if (!message) {
      throw new ConversationMessageNotFoundError(input.tenantSlug, input.messageId);
    }

    if (message.threadId !== thread.id || message.direction !== 'outbound') {
      throw new WhatsappMessageRetryNotAllowedError(
        input.tenantSlug,
        input.messageId,
        'only outbound WhatsApp thread messages can be retried.',
      );
    }

    if (message.deliveryStatus !== 'failed') {
      throw new WhatsappMessageRetryNotAllowedError(
        input.tenantSlug,
        input.messageId,
        'only failed messages can be retried.',
      );
    }

    const tenantMessages = await this.conversationMessageRepository.findByTenantId(
      tenant.id,
    );
    const hasChildRetries = tenantMessages.some(
      (tenantMessage) => tenantMessage.retryOfMessageId === message.id,
    );

    if (hasChildRetries) {
      throw new WhatsappMessageRetryNotAllowedError(
        input.tenantSlug,
        input.messageId,
        'a newer retry attempt already exists for this message; retry the latest failed attempt instead.',
      );
    }

    const deliveryEvents =
      await this.conversationDeliveryEventRepository.findByTenantIdAndMessageId(
        tenant.id,
        message.id,
      );
    const retryAssessment = assessWhatsappRetryOperation(
      message,
      deliveryEvents,
      this.nowProvider(),
    );

    if (retryAssessment.disposition === 'permanent') {
      throw new WhatsappMessageRetryNotAllowedError(
        input.tenantSlug,
        input.messageId,
        'the latest provider failure is classified as permanent.',
      );
    }

    if (!retryAssessment.readyNow) {
      throw new WhatsappMessageRetryNotAllowedError(
        input.tenantSlug,
        input.messageId,
        `retry cooldown is still active until ${retryAssessment.nextRetryAt.toISOString()}.`,
      );
    }

    if (!message.templateId) {
      return this.sendTenantWhatsappConversationMessageUseCase.execute({
        tenantSlug: input.tenantSlug,
        threadId: thread.id,
        body: message.body,
        retryOfMessageId: message.id,
        outboundIntentKey: message.outboundIntentKey,
        occurredAt: input.occurredAt ?? this.nowProvider(),
      });
    }

    const templateRenderSnapshot = parseWhatsappTemplateRenderSnapshot(
      message.renderedTemplateSnapshotJson,
    );

    if (!templateRenderSnapshot) {
      throw new WhatsappMessageRetryNotAllowedError(
        input.tenantSlug,
        input.messageId,
        'template retries require a persisted render snapshot, and this message was sent before that snapshot became durable.',
      );
    }

    return this.sendTenantWhatsappConversationMessageUseCase.execute({
      tenantSlug: input.tenantSlug,
      threadId: thread.id,
      templateId: templateRenderSnapshot.templateId,
      templateRenderSnapshot,
      retryOfMessageId: message.id,
      outboundIntentKey: message.outboundIntentKey,
      occurredAt: input.occurredAt ?? this.nowProvider(),
    });
  }
}
