import {
  ConversationMessage,
  ConversationMessageDeliveryStatus,
  WhatsappMessageTemplate,
} from '@saas-platform/growth-domain';
import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { WhatsappMessageTemplateRepository } from '../ports/whatsapp-message-template.repository';

export interface TenantWhatsappOutboundIntentReportingView {
  outboundIntentKey: string;
  messageCount: number;
  pendingCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
}

export interface TenantWhatsappTemplateReportingView {
  templateId: string;
  templateKey: string | null;
  templateName: string | null;
  providerTemplateName: string | null;
  providerApprovalStatus: string | null;
  messageCount: number;
  pendingCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
}

export interface TenantWhatsappOutboundReportingSummaryView {
  tenantSlug: string;
  generatedAt: Date;
  totals: {
    outboundMessageCount: number;
    freeformMessageCount: number;
    templateMessageCount: number;
    approvedTemplateMessageCount: number;
    pendingCount: number;
    sentCount: number;
    deliveredCount: number;
    readCount: number;
    failedCount: number;
  };
  byIntent: TenantWhatsappOutboundIntentReportingView[];
  byTemplate: TenantWhatsappTemplateReportingView[];
}

type DeliveryCounts = {
  pendingCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
};

export class GetTenantWhatsappOutboundReportingSummaryUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationThreadRepository: ConversationThreadRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly whatsappMessageTemplateRepository: WhatsappMessageTemplateRepository,
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantWhatsappOutboundReportingSummaryView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const [threads, messages, templates] = await Promise.all([
      this.conversationThreadRepository.findByTenantIdAndChannel(
        tenant.id,
        'whatsapp',
      ),
      this.conversationMessageRepository.findByTenantId(tenant.id),
      this.whatsappMessageTemplateRepository.findByTenantId(tenant.id),
    ]);

    const whatsappThreadIds = new Set(threads.map((thread) => thread.id));
    const templateIndex = new Map(
      templates.map((template) => [template.id, template] as const),
    );
    const outboundMessages = messages.filter(
      (message) =>
        message.direction === 'outbound' &&
        whatsappThreadIds.has(message.threadId),
    );

    const byIntent = this.buildIntentViews(outboundMessages);
    const byTemplate = this.buildTemplateViews(outboundMessages, templateIndex);

    return {
      tenantSlug,
      generatedAt: new Date(),
      totals: {
        outboundMessageCount: outboundMessages.length,
        freeformMessageCount: outboundMessages.filter(
          (message) => !message.templateId,
        ).length,
        templateMessageCount: outboundMessages.filter(
          (message) => !!message.templateId,
        ).length,
        approvedTemplateMessageCount: outboundMessages.filter((message) => {
          if (!message.templateId) {
            return false;
          }

          return (
            templateIndex.get(message.templateId)?.providerApprovalStatus ===
            'approved'
          );
        }).length,
        pendingCount: this.countByStatus(outboundMessages, 'pending'),
        sentCount: this.countByStatus(outboundMessages, 'sent'),
        deliveredCount: this.countByStatus(outboundMessages, 'delivered'),
        readCount: this.countByStatus(outboundMessages, 'read'),
        failedCount: this.countByStatus(outboundMessages, 'failed'),
      },
      byIntent,
      byTemplate,
    };
  }

  private buildIntentViews(
    messages: ConversationMessage[],
  ): TenantWhatsappOutboundIntentReportingView[] {
    const intentMap = new Map<string, ConversationMessage[]>();

    for (const message of messages) {
      if (!message.outboundIntentKey) {
        continue;
      }

      const bucket = intentMap.get(message.outboundIntentKey) ?? [];
      bucket.push(message);
      intentMap.set(message.outboundIntentKey, bucket);
    }

    return [...intentMap.entries()]
      .map(([outboundIntentKey, intentMessages]) => ({
        outboundIntentKey,
        messageCount: intentMessages.length,
        ...this.buildDeliveryCounts(intentMessages),
      }))
      .sort(
        (left, right) =>
          right.messageCount - left.messageCount ||
          left.outboundIntentKey.localeCompare(right.outboundIntentKey),
      );
  }

  private buildTemplateViews(
    messages: ConversationMessage[],
    templateIndex: Map<string, WhatsappMessageTemplate>,
  ): TenantWhatsappTemplateReportingView[] {
    const templateMap = new Map<string, ConversationMessage[]>();

    for (const message of messages) {
      if (!message.templateId) {
        continue;
      }

      const bucket = templateMap.get(message.templateId) ?? [];
      bucket.push(message);
      templateMap.set(message.templateId, bucket);
    }

    return [...templateMap.entries()]
      .map(([templateId, templateMessages]) => {
        const template = templateIndex.get(templateId) ?? null;

        return {
          templateId,
          templateKey: template?.key ?? null,
          templateName: template?.toPrimitives().name ?? null,
          providerTemplateName: template?.providerTemplateName ?? null,
          providerApprovalStatus: template?.providerApprovalStatus ?? null,
          messageCount: templateMessages.length,
          ...this.buildDeliveryCounts(templateMessages),
        };
      })
      .sort(
        (left, right) =>
          right.messageCount - left.messageCount ||
          left.templateId.localeCompare(right.templateId),
      );
  }

  private buildDeliveryCounts(messages: ConversationMessage[]): DeliveryCounts {
    return {
      pendingCount: this.countByStatus(messages, 'pending'),
      sentCount: this.countByStatus(messages, 'sent'),
      deliveredCount: this.countByStatus(messages, 'delivered'),
      readCount: this.countByStatus(messages, 'read'),
      failedCount: this.countByStatus(messages, 'failed'),
    };
  }

  private countByStatus(
    messages: ConversationMessage[],
    status: ConversationMessageDeliveryStatus,
  ): number {
    return messages.filter((message) => message.deliveryStatus === status).length;
  }
}
