import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import {
  ConversationDeliveryEvent,
  ConversationMessage,
  ConversationThread,
} from '@saas-platform/growth-domain';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { ConversationDeliveryEventIdGenerator } from '../ports/conversation-delivery-event-id.generator';
import { ConversationDeliveryEventRepository } from '../ports/conversation-delivery-event.repository';
import { WhatsappConversationRecipientUnavailableError } from '../errors/whatsapp-conversation-recipient-unavailable.error';
import { WhatsappMessageTemplateNotFoundError } from '../errors/whatsapp-message-template-not-found.error';
import { WhatsappOutboundMessageContentUnresolvedError } from '../errors/whatsapp-outbound-message-content-unresolved.error';
import { ConversationMessageIdGenerator } from '../ports/conversation-message-id.generator';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { WhatsappMessageTemplateRepository } from '../ports/whatsapp-message-template.repository';
import { WhatsappOutboundMessageGateway } from '../ports/whatsapp-outbound-message-gateway';
import {
  buildPersistedWhatsappTemplateRenderSnapshot,
  PersistedWhatsappTemplateRenderSnapshot,
  serializeWhatsappTemplateRenderSnapshot,
} from '../support/whatsapp-template-render-snapshot';

export interface SendTenantWhatsappConversationMessageInput {
  tenantSlug: string;
  threadId: string;
  body?: string | null;
  templateId?: string | null;
  templateVariables?: Record<string, string | number | boolean | null> | null;
  templateRenderSnapshot?: PersistedWhatsappTemplateRenderSnapshot | null;
  retryOfMessageId?: string | null;
  outboundIntentKey?: string | null;
  externalMessageId?: string | null;
  occurredAt?: Date | null;
}

export class SendTenantWhatsappConversationMessageUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly conversationMessageIdGenerator: ConversationMessageIdGenerator,
    private readonly conversationDeliveryEventRepository: ConversationDeliveryEventRepository,
    private readonly conversationDeliveryEventIdGenerator: ConversationDeliveryEventIdGenerator,
    private readonly whatsappMessageTemplateRepository: WhatsappMessageTemplateRepository,
    private readonly whatsappOutboundMessageGateway: WhatsappOutboundMessageGateway,
  ) {}

  async execute(
    input: SendTenantWhatsappConversationMessageInput,
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
      throw new ConversationThreadNotFoundError(
        input.tenantSlug,
        input.threadId,
      );
    }

    const occurredAt = input.occurredAt ?? new Date();
    const recipientHandle = this.normalizeOptionalValue(
      thread.participantHandle,
    );

    if (!recipientHandle) {
      throw new WhatsappConversationRecipientUnavailableError(
        input.tenantSlug,
        thread.id,
      );
    }

    const {
      resolvedBody,
      templateId,
      renderedTemplateSnapshot,
      outboundIntentKey,
      providerTemplate,
    } = await this.resolveMessageContent(tenant.id, input, thread.id);

    const outboundResult = await this.whatsappOutboundMessageGateway.send({
      tenantSlug: input.tenantSlug,
      threadId: thread.id,
      recipientHandle,
      body: resolvedBody,
      template: providerTemplate,
    });
    const message = ConversationMessage.create({
      id: this.conversationMessageIdGenerator.generate(),
      tenantId: tenant.id,
      threadId: thread.id,
      direction: 'outbound',
      body: resolvedBody,
      templateId,
      retryOfMessageId: this.normalizeOptionalValue(input.retryOfMessageId),
      renderedTemplateSnapshotJson: renderedTemplateSnapshot
        ? serializeWhatsappTemplateRenderSnapshot(renderedTemplateSnapshot)
        : null,
      outboundIntentKey,
      provider: outboundResult.provider,
      deliveryStatus: outboundResult.deliveryStatus,
      externalMessageId:
        outboundResult.externalMessageId ??
        this.normalizeOptionalValue(input.externalMessageId),
      failureReason: outboundResult.failureReason,
      deliveredAt:
        outboundResult.deliveryStatus === 'delivered' ||
        outboundResult.deliveryStatus === 'read'
          ? occurredAt
          : null,
      readAt:
        outboundResult.deliveryStatus === 'read' ? occurredAt : null,
      createdAt: occurredAt,
    });

    const deliveryEvent = ConversationDeliveryEvent.create({
      id: this.conversationDeliveryEventIdGenerator.generate(),
      tenantId: tenant.id,
      messageId: message.id,
      provider: outboundResult.provider,
      eventKey: this.buildInitialDeliveryEventKey(message),
      providerEventId: message.externalMessageId,
      externalMessageId:
        message.externalMessageId ?? `internal:${message.id}`,
      deliveryStatus: message.deliveryStatus ?? 'pending',
      failureReason: outboundResult.failureReason,
      providerStatusDetail: outboundResult.providerStatusDetail,
      providerConversationCategory: outboundResult.providerConversationCategory,
      providerPricingCategory: outboundResult.providerPricingCategory,
      providerErrorCode: outboundResult.providerErrorCode,
      payloadJson: outboundResult.providerResponseJson,
      occurredAt,
      createdAt: occurredAt,
    });

    await this.conversationMessageRepository.save(message);
    await this.conversationDeliveryEventRepository.save(deliveryEvent);
    await this.conversationThreadRepository.save(
      this.withOutboundActivity(thread, message.body, occurredAt),
    );

    return message;
  }

  private withOutboundActivity(
    thread: ConversationThread,
    body: string,
    occurredAt: Date,
  ): ConversationThread {
    const data = thread.toPrimitives();

    return ConversationThread.create({
      ...data,
      assigneeUserId: data.assigneeUserId,
      latestMessagePreview: body.slice(0, 160),
      messageCount: data.messageCount + 1,
      lastActivityAt: occurredAt,
      updatedAt: occurredAt,
    });
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }

  private buildInitialDeliveryEventKey(message: ConversationMessage): string {
    return `outbound:${message.externalMessageId ?? message.id}:${
      message.deliveryStatus ?? 'pending'
    }`;
  }

  private async resolveMessageContent(
    tenantId: string,
    input: SendTenantWhatsappConversationMessageInput,
    threadId: string,
  ): Promise<{
    resolvedBody: string;
    templateId: string | null;
    renderedTemplateSnapshot: PersistedWhatsappTemplateRenderSnapshot | null;
    outboundIntentKey: string | null;
    providerTemplate:
      | {
          providerTemplateName: string;
          languageCode: string;
          bodyParameterValues: string[];
        }
      | null;
  }> {
    const templateId = this.normalizeOptionalValue(input.templateId);
    const templateRenderSnapshot = input.templateRenderSnapshot ?? null;
    const directBody = this.normalizeOptionalValue(input.body);
    const directIntentKey = this.normalizeOptionalValue(input.outboundIntentKey);

    if (!templateId && !templateRenderSnapshot && !directBody) {
      throw new WhatsappOutboundMessageContentUnresolvedError(
        input.tenantSlug,
        threadId,
        'provide either a non-empty body or a templateId.',
      );
    }

    if (templateRenderSnapshot) {
      return {
        resolvedBody: templateRenderSnapshot.renderedBody,
        templateId: templateRenderSnapshot.templateId,
        renderedTemplateSnapshot: templateRenderSnapshot,
        outboundIntentKey:
          directIntentKey ?? templateRenderSnapshot.templateIntentKey,
        providerTemplate:
          templateRenderSnapshot.providerApprovalStatus === 'approved' &&
          templateRenderSnapshot.providerTemplateName
            ? {
                providerTemplateName:
                  templateRenderSnapshot.providerTemplateName,
                languageCode: templateRenderSnapshot.templateLanguageCode,
                bodyParameterValues: [
                  ...templateRenderSnapshot.bodyParameterValues,
                ],
              }
            : null,
      };
    }

    if (!templateId) {
      return {
        resolvedBody: directBody as string,
        templateId: null,
        renderedTemplateSnapshot: null,
        outboundIntentKey: directIntentKey,
        providerTemplate: null,
      };
    }

    const template =
      await this.whatsappMessageTemplateRepository.findByTenantIdAndId(
        tenantId,
        templateId,
      );

    if (!template) {
      throw new WhatsappMessageTemplateNotFoundError(
        input.tenantSlug,
        templateId,
      );
    }

    const rendered = this.renderTemplate(
      template.toPrimitives().bodyTemplate,
      input.templateVariables ?? {},
      input.tenantSlug,
      threadId,
    );

    return {
      resolvedBody: rendered.body,
      templateId: template.id,
      renderedTemplateSnapshot: buildPersistedWhatsappTemplateRenderSnapshot(
        template,
        rendered.body,
        rendered.parameterValues,
        input.templateVariables ?? {},
      ),
      outboundIntentKey: directIntentKey ?? template.intentKey,
      providerTemplate:
        template.providerApprovalStatus === 'approved' &&
        template.providerTemplateName
          ? {
              providerTemplateName: template.providerTemplateName,
              languageCode: template.languageCode,
              bodyParameterValues: rendered.parameterValues,
            }
          : null,
    };
  }

  private renderTemplate(
    bodyTemplate: string,
    variables: Record<string, string | number | boolean | null>,
    tenantSlug: string,
    threadId: string,
  ): { body: string; parameterValues: string[] } {
    const parameterValues: string[] = [];
    const rendered = bodyTemplate.replace(
      /{{\s*([a-zA-Z0-9_]+)\s*}}/g,
      (_match, variableName: string) => {
        const value = variables[variableName];

        if (value === undefined || value === null) {
          throw new WhatsappOutboundMessageContentUnresolvedError(
            tenantSlug,
            threadId,
            `missing template variable "${variableName}".`,
          );
        }

        const normalizedValue = String(value);
        parameterValues.push(normalizedValue);
        return normalizedValue;
      },
    );
    const normalizedBody = rendered.trim();

    if (!normalizedBody) {
      throw new WhatsappOutboundMessageContentUnresolvedError(
        tenantSlug,
        threadId,
        'the resolved template body is empty.',
      );
    }

    return {
      body: normalizedBody,
      parameterValues,
    };
  }
}
