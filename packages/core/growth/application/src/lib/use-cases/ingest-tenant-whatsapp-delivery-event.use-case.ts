import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import {
  ConversationDeliveryEvent,
  ConversationMessage,
  ConversationMessageDeliveryStatus,
} from '@saas-platform/growth-domain';
import { ConversationThreadNotFoundError } from '../errors/conversation-thread-not-found.error';
import { ConversationDeliveryEventIdGenerator } from '../ports/conversation-delivery-event-id.generator';
import { ConversationDeliveryEventRepository } from '../ports/conversation-delivery-event.repository';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';

export interface IngestTenantWhatsappDeliveryEventInput {
  tenantSlug: string;
  externalMessageId: string;
  deliveryStatus: ConversationMessageDeliveryStatus;
  provider?: 'meta_cloud_api_stub' | 'meta_cloud_api';
  providerEventId?: string | null;
  payloadJson?: string | null;
  eventKey?: string | null;
  failureReason?: string | null;
  providerStatusDetail?: string | null;
  providerConversationCategory?: string | null;
  providerPricingCategory?: string | null;
  providerErrorCode?: string | null;
  occurredAt?: Date | null;
}

export class IngestTenantWhatsappDeliveryEventUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly conversationDeliveryEventRepository: ConversationDeliveryEventRepository,
    private readonly conversationDeliveryEventIdGenerator: ConversationDeliveryEventIdGenerator,
  ) {}

  async execute(
    input: IngestTenantWhatsappDeliveryEventInput,
  ): Promise<ConversationMessage> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const message =
      await this.conversationMessageRepository.findByTenantIdAndExternalMessageId(
        tenant.id,
        input.externalMessageId.trim(),
      );

    if (!message) {
      throw new ConversationThreadNotFoundError(
        input.tenantSlug,
        input.externalMessageId,
      );
    }

    const occurredAt = input.occurredAt ?? new Date();
    const provider = input.provider ?? 'meta_cloud_api_stub';
    const eventKey = this.resolveEventKey(
      input.externalMessageId,
      input.deliveryStatus,
      occurredAt,
      input.eventKey,
      input.providerEventId,
    );
    const existingEvent =
      await this.conversationDeliveryEventRepository.findByTenantIdAndProviderAndEventKey(
        tenant.id,
        provider,
        eventKey,
      );

    if (existingEvent) {
      return message;
    }

    const deliveryEvent = ConversationDeliveryEvent.create({
      id: this.conversationDeliveryEventIdGenerator.generate(),
      tenantId: tenant.id,
      messageId: message.id,
      provider,
      eventKey,
      providerEventId: this.normalizeOptionalValue(input.providerEventId),
      externalMessageId: input.externalMessageId.trim(),
      deliveryStatus: input.deliveryStatus,
      failureReason: this.normalizeOptionalValue(input.failureReason),
      providerStatusDetail: this.normalizeOptionalValue(
        input.providerStatusDetail,
      ),
      providerConversationCategory: this.normalizeOptionalValue(
        input.providerConversationCategory,
      ),
      providerPricingCategory: this.normalizeOptionalValue(
        input.providerPricingCategory,
      ),
      providerErrorCode: this.normalizeOptionalValue(input.providerErrorCode),
      payloadJson: this.normalizeOptionalValue(input.payloadJson),
      occurredAt,
      createdAt: occurredAt,
    });

    if (this.shouldIgnoreDeliveryEvent(message, input.deliveryStatus)) {
      await this.conversationDeliveryEventRepository.save(deliveryEvent);
      return message;
    }

    const updatedMessage = this.withDeliveryEvent(
      message,
      input.deliveryStatus,
      input.failureReason,
      occurredAt,
    );

    await this.conversationMessageRepository.save(updatedMessage);
    await this.conversationDeliveryEventRepository.save(deliveryEvent);

    return updatedMessage;
  }

  private shouldIgnoreDeliveryEvent(
    message: ConversationMessage,
    incomingStatus: ConversationMessageDeliveryStatus,
  ): boolean {
    if (message.deliveryStatus === incomingStatus) {
      return true;
    }

    const currentRank = this.deliveryStatusRank(message.deliveryStatus);
    const incomingRank = this.deliveryStatusRank(incomingStatus);

    return currentRank >= incomingRank;
  }

  private withDeliveryEvent(
    message: ConversationMessage,
    deliveryStatus: ConversationMessageDeliveryStatus,
    failureReason: string | null | undefined,
    occurredAt: Date,
  ): ConversationMessage {
    const data = message.toPrimitives();

    return ConversationMessage.create({
      ...data,
      deliveryStatus,
      failureReason:
        deliveryStatus === 'failed' ? this.normalizeOptionalValue(failureReason) : null,
      deliveredAt:
        deliveryStatus === 'delivered' || deliveryStatus === 'read'
          ? data.deliveredAt ?? occurredAt
          : data.deliveredAt,
      readAt: deliveryStatus === 'read' ? occurredAt : data.readAt,
    });
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }

  private resolveEventKey(
    externalMessageId: string,
    deliveryStatus: ConversationMessageDeliveryStatus,
    occurredAt: Date,
    explicitEventKey?: string | null,
    providerEventId?: string | null,
  ): string {
    const normalizedEventKey = explicitEventKey?.trim();

    if (normalizedEventKey) {
      return normalizedEventKey;
    }

    const normalizedProviderEventId = providerEventId?.trim();

    if (normalizedProviderEventId) {
      return normalizedProviderEventId;
    }

    return `${externalMessageId.trim()}:${deliveryStatus}:${occurredAt.toISOString()}`;
  }

  private deliveryStatusRank(
    status: ConversationMessageDeliveryStatus | null,
  ): number {
    switch (status) {
      case 'pending':
        return 1;
      case 'sent':
        return 2;
      case 'delivered':
        return 3;
      case 'read':
        return 4;
      case 'failed':
        return 5;
      default:
        return 0;
    }
  }
}
