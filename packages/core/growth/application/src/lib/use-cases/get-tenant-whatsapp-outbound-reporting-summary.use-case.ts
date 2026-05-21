import {
  ConversationDeliveryEvent,
  ConversationMessage,
  ConversationMessageDeliveryStatus,
  WhatsappMessageTemplate,
} from '@saas-platform/growth-domain';
import { ConversationDeliveryEventRepository } from '../ports/conversation-delivery-event.repository';
import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import { ConversationThreadRepository } from '../ports/conversation-thread.repository';
import { WhatsappMessageTemplateRepository } from '../ports/whatsapp-message-template.repository';
import {
  buildFailedEventsByMessageId,
  buildLatestFailedEventsByMessageId,
  classifyWhatsappProviderFailure,
  DEFAULT_WHATSAPP_RETRY_BASE_BACKOFF_MINUTES,
  DEFAULT_WHATSAPP_RETRY_MAX_BACKOFF_MINUTES,
  assessWhatsappRetryOperation,
  WhatsappOperationalAlertSeverity,
} from '../support/whatsapp-provider-operations';

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

export interface TenantWhatsappProviderReportingView {
  provider: string;
  messageCount: number;
  pendingCount: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
}

export interface TenantWhatsappProviderErrorCodeReportingView {
  provider: string;
  providerErrorCode: string;
  failureClass: string;
  failurePhase: string;
  retryDisposition: string;
  providerTaxonomyFamily: string;
  providerTaxonomyDetail: string;
  occurrenceCount: number;
  latestFailureReason: string | null;
  latestProviderStatusDetail: string | null;
}

export interface TenantWhatsappFailureClassReportingView {
  provider: string;
  failureClass: string;
  failurePhase: string;
  messageCount: number;
  retryableCount: number;
  permanentCount: number;
}

export interface TenantWhatsappProviderTaxonomyReportingView {
  provider: string;
  providerTaxonomyFamily: string;
  providerTaxonomyDetail: string;
  failureClass: string;
  failurePhase: string;
  messageCount: number;
  retryableCount: number;
  permanentCount: number;
}

export interface TenantWhatsappRetryOperationsSummaryView {
  totalFailedMessageCount: number;
  retryableFailedMessageCount: number;
  permanentFailedMessageCount: number;
  cooldownBlockedCount: number;
  readyNowCount: number;
  defaultBaseBackoffMinutes: number;
  maxBackoffMinutes: number;
}

export interface TenantWhatsappOperationalThresholdsView {
  immediateSendRejectionRateWarning: number;
  asynchronousDeliveryFailureRateWarning: number;
  readyRetryQueueWarningCount: number;
  cooldownRetryQueueWarningCount: number;
  authOrConfigurationCriticalCount: number;
  policyBlockCriticalCount: number;
  rateLimitedWarningCount: number;
  unknownFailureWarningCount: number;
}

export interface TenantWhatsappOperationalDashboardView {
  overallStatus: 'healthy' | 'warning' | 'critical';
  immediateSendRejectionRate: number;
  asynchronousDeliveryFailureRate: number;
  readyRetryQueueCount: number;
  cooldownRetryQueueCount: number;
  permanentFailureCount: number;
  leadingFailureClass: string | null;
  leadingProvider: string | null;
  leadingProviderTaxonomyFamily: string | null;
  leadingProviderTaxonomyDetail: string | null;
}

export interface TenantWhatsappOperationalAlertView {
  key: string;
  severity: WhatsappOperationalAlertSeverity;
  title: string;
  summary: string;
  thresholdKey: string;
  observedValue: number;
  thresholdValue: number;
  thresholdUnit: 'count' | 'rate';
  provider: string | null;
  failureClass: string | null;
  providerTaxonomyFamily: string | null;
  providerTaxonomyDetail: string | null;
  affectedMessageCount: number;
  recommendedAction: string;
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
    immediateSendRejectionFailedCount: number;
    asynchronousDeliveryFailedCount: number;
    retryableFailedCount: number;
    permanentFailedCount: number;
  };
  byIntent: TenantWhatsappOutboundIntentReportingView[];
  byTemplate: TenantWhatsappTemplateReportingView[];
  byProvider: TenantWhatsappProviderReportingView[];
  byFailureClass: TenantWhatsappFailureClassReportingView[];
  byProviderTaxonomy: TenantWhatsappProviderTaxonomyReportingView[];
  topProviderErrorCodes: TenantWhatsappProviderErrorCodeReportingView[];
  retryOperations: TenantWhatsappRetryOperationsSummaryView;
  operationalThresholds: TenantWhatsappOperationalThresholdsView;
  operationalDashboard: TenantWhatsappOperationalDashboardView;
  operationalAlerts: TenantWhatsappOperationalAlertView[];
}

export const DEFAULT_TENANT_WHATSAPP_OPERATIONAL_THRESHOLDS: TenantWhatsappOperationalThresholdsView =
  {
    immediateSendRejectionRateWarning: 0.05,
    asynchronousDeliveryFailureRateWarning: 0.03,
    readyRetryQueueWarningCount: 1,
    cooldownRetryQueueWarningCount: 3,
    authOrConfigurationCriticalCount: 1,
    policyBlockCriticalCount: 1,
    rateLimitedWarningCount: 1,
    unknownFailureWarningCount: 1,
  };

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
    private readonly conversationDeliveryEventRepository: ConversationDeliveryEventRepository,
    private readonly whatsappMessageTemplateRepository: WhatsappMessageTemplateRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantWhatsappOutboundReportingSummaryView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const [threads, messages, deliveryEvents, templates] = await Promise.all([
      this.conversationThreadRepository.findByTenantIdAndChannel(
        tenant.id,
        'whatsapp',
      ),
      this.conversationMessageRepository.findByTenantId(tenant.id),
      this.conversationDeliveryEventRepository.findByTenantId(tenant.id),
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
    const outboundMessageIds = new Set(outboundMessages.map((message) => message.id));
    const outboundDeliveryEvents = deliveryEvents.filter(
      (event) => !!event.messageId && outboundMessageIds.has(event.messageId),
    );
    const failedEventsByMessageId =
      buildFailedEventsByMessageId(outboundDeliveryEvents);
    const latestFailedEventsByMessageId = buildLatestFailedEventsByMessageId(
      outboundDeliveryEvents,
    );

    const byIntent = this.buildIntentViews(outboundMessages);
    const byTemplate = this.buildTemplateViews(outboundMessages, templateIndex);
    const byProvider = this.buildProviderViews(outboundMessages);
    const byFailureClass = this.buildFailureClassViews(
      outboundMessages,
      latestFailedEventsByMessageId,
    );
    const byProviderTaxonomy = this.buildProviderTaxonomyViews(
      outboundMessages,
      latestFailedEventsByMessageId,
    );
    const topProviderErrorCodes =
      this.buildTopProviderErrorCodeViews(
        outboundMessages,
        outboundDeliveryEvents,
        latestFailedEventsByMessageId,
      );
    const retryOperations = this.buildRetryOperationsSummary(
      outboundMessages,
      failedEventsByMessageId,
      latestFailedEventsByMessageId,
    );
    const operationalThresholds =
      DEFAULT_TENANT_WHATSAPP_OPERATIONAL_THRESHOLDS;
    const operationalDashboard = this.buildOperationalDashboard(
      outboundMessages,
      byFailureClass,
      byProviderTaxonomy,
      retryOperations,
    );
    const operationalAlerts = this.buildOperationalAlerts(
      operationalThresholds,
      operationalDashboard,
      byProviderTaxonomy,
      retryOperations,
    );

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
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
        immediateSendRejectionFailedCount: byFailureClass
          .filter((item) => item.failurePhase === 'immediate_send_rejection')
          .reduce((sum, item) => sum + item.messageCount, 0),
        asynchronousDeliveryFailedCount: byFailureClass
          .filter(
            (item) => item.failurePhase === 'asynchronous_delivery_failure',
          )
          .reduce((sum, item) => sum + item.messageCount, 0),
        retryableFailedCount: retryOperations.retryableFailedMessageCount,
        permanentFailedCount: retryOperations.permanentFailedMessageCount,
      },
      byIntent,
      byTemplate,
      byProvider,
      byFailureClass,
      byProviderTaxonomy,
      topProviderErrorCodes,
      retryOperations,
      operationalThresholds,
      operationalDashboard,
      operationalAlerts,
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

  private buildProviderViews(
    messages: ConversationMessage[],
  ): TenantWhatsappProviderReportingView[] {
    const providerMap = new Map<string, ConversationMessage[]>();

    for (const message of messages) {
      const provider = message.provider ?? 'unknown';
      const bucket = providerMap.get(provider) ?? [];
      bucket.push(message);
      providerMap.set(provider, bucket);
    }

    return [...providerMap.entries()]
      .map(([provider, providerMessages]) => ({
        provider,
        messageCount: providerMessages.length,
        ...this.buildDeliveryCounts(providerMessages),
      }))
      .sort(
        (left, right) =>
          right.messageCount - left.messageCount ||
          left.provider.localeCompare(right.provider),
      );
  }

  private buildTopProviderErrorCodeViews(
    messages: ConversationMessage[],
    events: ConversationDeliveryEvent[],
    latestFailedEventsByMessageId: Map<string, ConversationDeliveryEvent>,
  ): TenantWhatsappProviderErrorCodeReportingView[] {
    const messageIndex = new Map(messages.map((message) => [message.id, message]));
    const errorMap = new Map<
      string,
      {
        provider: string;
        providerErrorCode: string;
        failureClass: string;
        failurePhase: string;
        retryDisposition: string;
        providerTaxonomyFamily: string;
        providerTaxonomyDetail: string;
        occurrenceCount: number;
        latestOccurredAt: Date;
        latestFailureReason: string | null;
        latestProviderStatusDetail: string | null;
      }
    >();

    for (const event of events) {
      if (event.deliveryStatus !== 'failed' || !event.providerErrorCode) {
        continue;
      }

      const key = `${event.provider}:${event.providerErrorCode}`;
      const existing = errorMap.get(key);

      if (!existing) {
        const message = event.messageId ? messageIndex.get(event.messageId) : null;
        const failureSemantics = message
          ? classifyWhatsappProviderFailure(message, latestFailedEventsByMessageId.get(message.id))
          : {
              failureClass: 'unknown',
              failurePhase: 'asynchronous_delivery_failure',
              retryDisposition: 'retryable',
              providerTaxonomyFamily: 'unknown',
              providerTaxonomyDetail: 'unknown',
              suggestedAlertSeverity: 'warning',
            };
        errorMap.set(key, {
          provider: event.provider,
          providerErrorCode: event.providerErrorCode,
          failureClass: failureSemantics.failureClass,
          failurePhase: failureSemantics.failurePhase,
          retryDisposition: failureSemantics.retryDisposition,
          providerTaxonomyFamily: failureSemantics.providerTaxonomyFamily,
          providerTaxonomyDetail: failureSemantics.providerTaxonomyDetail,
          occurrenceCount: 1,
          latestOccurredAt: event.occurredAt,
          latestFailureReason: event.failureReason,
          latestProviderStatusDetail: event.providerStatusDetail,
        });
        continue;
      }

      existing.occurrenceCount += 1;

      if (event.occurredAt.getTime() >= existing.latestOccurredAt.getTime()) {
        existing.latestOccurredAt = event.occurredAt;
        existing.latestFailureReason = event.failureReason;
        existing.latestProviderStatusDetail = event.providerStatusDetail;
      }
    }

    return [...errorMap.values()]
      .sort(
        (left, right) =>
          right.occurrenceCount - left.occurrenceCount ||
          right.latestOccurredAt.getTime() - left.latestOccurredAt.getTime() ||
          left.provider.localeCompare(right.provider) ||
          left.providerErrorCode.localeCompare(right.providerErrorCode),
      )
      .slice(0, 10)
      .map((item) => ({
        provider: item.provider,
        providerErrorCode: item.providerErrorCode,
        failureClass: item.failureClass,
        failurePhase: item.failurePhase,
        retryDisposition: item.retryDisposition,
        providerTaxonomyFamily: item.providerTaxonomyFamily,
        providerTaxonomyDetail: item.providerTaxonomyDetail,
        occurrenceCount: item.occurrenceCount,
        latestFailureReason: item.latestFailureReason,
        latestProviderStatusDetail: item.latestProviderStatusDetail,
      }));
  }

  private buildFailureClassViews(
    messages: ConversationMessage[],
    latestFailedEventsByMessageId: Map<string, ConversationDeliveryEvent>,
  ): TenantWhatsappFailureClassReportingView[] {
    const failureMap = new Map<
      string,
      TenantWhatsappFailureClassReportingView
    >();

    for (const message of messages) {
      if (message.deliveryStatus !== 'failed') {
        continue;
      }

      const latestFailedEvent = latestFailedEventsByMessageId.get(message.id);
      const failureSemantics = classifyWhatsappProviderFailure(
        message,
        latestFailedEvent,
      );
      const provider = message.provider ?? latestFailedEvent?.provider ?? 'unknown';
      const key = `${provider}:${failureSemantics.failureClass}:${failureSemantics.failurePhase}`;
      const existing = failureMap.get(key);

      if (!existing) {
        failureMap.set(key, {
          provider,
          failureClass: failureSemantics.failureClass,
          failurePhase: failureSemantics.failurePhase,
          messageCount: 1,
          retryableCount:
            failureSemantics.retryDisposition === 'retryable' ? 1 : 0,
          permanentCount:
            failureSemantics.retryDisposition === 'permanent' ? 1 : 0,
        });
        continue;
      }

      existing.messageCount += 1;
      if (failureSemantics.retryDisposition === 'retryable') {
        existing.retryableCount += 1;
      } else {
        existing.permanentCount += 1;
      }
    }

    return [...failureMap.values()].sort(
      (left, right) =>
        right.messageCount - left.messageCount ||
        left.provider.localeCompare(right.provider) ||
        left.failureClass.localeCompare(right.failureClass) ||
        left.failurePhase.localeCompare(right.failurePhase),
    );
  }

  private buildProviderTaxonomyViews(
    messages: ConversationMessage[],
    latestFailedEventsByMessageId: Map<string, ConversationDeliveryEvent>,
  ): TenantWhatsappProviderTaxonomyReportingView[] {
    const taxonomyMap = new Map<
      string,
      TenantWhatsappProviderTaxonomyReportingView
    >();

    for (const message of messages) {
      if (message.deliveryStatus !== 'failed') {
        continue;
      }

      const latestFailedEvent = latestFailedEventsByMessageId.get(message.id);
      const failureSemantics = classifyWhatsappProviderFailure(
        message,
        latestFailedEvent,
      );
      const provider = message.provider ?? latestFailedEvent?.provider ?? 'unknown';
      const key = [
        provider,
        failureSemantics.providerTaxonomyFamily,
        failureSemantics.providerTaxonomyDetail,
        failureSemantics.failureClass,
        failureSemantics.failurePhase,
      ].join(':');
      const existing = taxonomyMap.get(key);

      if (!existing) {
        taxonomyMap.set(key, {
          provider,
          providerTaxonomyFamily: failureSemantics.providerTaxonomyFamily,
          providerTaxonomyDetail: failureSemantics.providerTaxonomyDetail,
          failureClass: failureSemantics.failureClass,
          failurePhase: failureSemantics.failurePhase,
          messageCount: 1,
          retryableCount:
            failureSemantics.retryDisposition === 'retryable' ? 1 : 0,
          permanentCount:
            failureSemantics.retryDisposition === 'permanent' ? 1 : 0,
        });
        continue;
      }

      existing.messageCount += 1;
      if (failureSemantics.retryDisposition === 'retryable') {
        existing.retryableCount += 1;
      } else {
        existing.permanentCount += 1;
      }
    }

    return [...taxonomyMap.values()].sort(
      (left, right) =>
        right.messageCount - left.messageCount ||
        left.provider.localeCompare(right.provider) ||
        left.providerTaxonomyFamily.localeCompare(right.providerTaxonomyFamily) ||
        left.providerTaxonomyDetail.localeCompare(right.providerTaxonomyDetail),
    );
  }

  private buildRetryOperationsSummary(
    messages: ConversationMessage[],
    failedEventsByMessageId: Map<string, ConversationDeliveryEvent[]>,
    latestFailedEventsByMessageId: Map<string, ConversationDeliveryEvent>,
  ): TenantWhatsappRetryOperationsSummaryView {
    const failedMessages = messages.filter(
      (message) => message.deliveryStatus === 'failed',
    );
    let retryableFailedMessageCount = 0;
    let permanentFailedMessageCount = 0;
    let cooldownBlockedCount = 0;
    let readyNowCount = 0;
    const now = this.nowProvider();

    for (const message of failedMessages) {
      const retryAssessment = assessWhatsappRetryOperation(
        message,
        failedEventsByMessageId.get(message.id) ??
          (latestFailedEventsByMessageId.has(message.id)
            ? [latestFailedEventsByMessageId.get(message.id) as ConversationDeliveryEvent]
            : []),
        now,
      );

      if (retryAssessment.disposition === 'permanent') {
        permanentFailedMessageCount += 1;
        continue;
      }

      retryableFailedMessageCount += 1;

      if (retryAssessment.readyNow) {
        readyNowCount += 1;
      } else {
        cooldownBlockedCount += 1;
      }
    }

    return {
      totalFailedMessageCount: failedMessages.length,
      retryableFailedMessageCount,
      permanentFailedMessageCount,
      cooldownBlockedCount,
      readyNowCount,
      defaultBaseBackoffMinutes: DEFAULT_WHATSAPP_RETRY_BASE_BACKOFF_MINUTES,
      maxBackoffMinutes: DEFAULT_WHATSAPP_RETRY_MAX_BACKOFF_MINUTES,
    };
  }

  private buildOperationalDashboard(
    messages: ConversationMessage[],
    byFailureClass: TenantWhatsappFailureClassReportingView[],
    byProviderTaxonomy: TenantWhatsappProviderTaxonomyReportingView[],
    retryOperations: TenantWhatsappRetryOperationsSummaryView,
  ): TenantWhatsappOperationalDashboardView {
    const outboundMessageCount = messages.length;
    const failedCount = messages.filter(
      (message) => message.deliveryStatus === 'failed',
    ).length;
    const leadingTaxonomy = byProviderTaxonomy[0] ?? null;
    const overallStatus =
      byFailureClass.some(
        (item) =>
          item.failureClass === 'auth_or_configuration' ||
          item.failureClass === 'policy_block',
      )
        ? 'critical'
        : retryOperations.readyNowCount > 0 || failedCount > 0
          ? 'warning'
          : 'healthy';

    return {
      overallStatus,
      immediateSendRejectionRate: this.calculateRate(
        byFailureClass
          .filter((item) => item.failurePhase === 'immediate_send_rejection')
          .reduce((sum, item) => sum + item.messageCount, 0),
        outboundMessageCount,
      ),
      asynchronousDeliveryFailureRate: this.calculateRate(
        byFailureClass
          .filter(
            (item) => item.failurePhase === 'asynchronous_delivery_failure',
          )
          .reduce((sum, item) => sum + item.messageCount, 0),
        outboundMessageCount,
      ),
      readyRetryQueueCount: retryOperations.readyNowCount,
      cooldownRetryQueueCount: retryOperations.cooldownBlockedCount,
      permanentFailureCount: retryOperations.permanentFailedMessageCount,
      leadingFailureClass: leadingTaxonomy?.failureClass ?? null,
      leadingProvider: leadingTaxonomy?.provider ?? null,
      leadingProviderTaxonomyFamily:
        leadingTaxonomy?.providerTaxonomyFamily ?? null,
      leadingProviderTaxonomyDetail:
        leadingTaxonomy?.providerTaxonomyDetail ?? null,
    };
  }

  private buildOperationalAlerts(
    operationalThresholds: TenantWhatsappOperationalThresholdsView,
    operationalDashboard: TenantWhatsappOperationalDashboardView,
    byProviderTaxonomy: TenantWhatsappProviderTaxonomyReportingView[],
    retryOperations: TenantWhatsappRetryOperationsSummaryView,
  ): TenantWhatsappOperationalAlertView[] {
    const alerts: TenantWhatsappOperationalAlertView[] = [];

    if (
      operationalDashboard.immediateSendRejectionRate >=
      operationalThresholds.immediateSendRejectionRateWarning
    ) {
      alerts.push({
        key: 'immediate_send_rejection_rate',
        severity: 'warning',
        title: 'Immediate send rejection rate is elevated',
        summary: `Immediate outbound rejections reached ${(operationalDashboard.immediateSendRejectionRate * 100).toFixed(2)}% of outbound traffic.`,
        thresholdKey: 'immediateSendRejectionRateWarning',
        observedValue: operationalDashboard.immediateSendRejectionRate,
        thresholdValue:
          operationalThresholds.immediateSendRejectionRateWarning,
        thresholdUnit: 'rate',
        provider: operationalDashboard.leadingProvider,
        failureClass: operationalDashboard.leadingFailureClass,
        providerTaxonomyFamily:
          operationalDashboard.leadingProviderTaxonomyFamily,
        providerTaxonomyDetail:
          operationalDashboard.leadingProviderTaxonomyDetail,
        affectedMessageCount: Math.max(
          retryOperations.totalFailedMessageCount,
          1,
        ),
        recommendedAction:
          'Inspect provider-facing failures before throughput or template automation keeps amplifying the rejection rate.',
      });
    }

    if (
      operationalDashboard.asynchronousDeliveryFailureRate >=
      operationalThresholds.asynchronousDeliveryFailureRateWarning
    ) {
      alerts.push({
        key: 'asynchronous_delivery_failure_rate',
        severity: 'warning',
        title: 'Asynchronous delivery failure rate is elevated',
        summary: `Delivery webhook failures reached ${(operationalDashboard.asynchronousDeliveryFailureRate * 100).toFixed(2)}% of outbound traffic.`,
        thresholdKey: 'asynchronousDeliveryFailureRateWarning',
        observedValue: operationalDashboard.asynchronousDeliveryFailureRate,
        thresholdValue:
          operationalThresholds.asynchronousDeliveryFailureRateWarning,
        thresholdUnit: 'rate',
        provider: operationalDashboard.leadingProvider,
        failureClass: operationalDashboard.leadingFailureClass,
        providerTaxonomyFamily:
          operationalDashboard.leadingProviderTaxonomyFamily,
        providerTaxonomyDetail:
          operationalDashboard.leadingProviderTaxonomyDetail,
        affectedMessageCount: Math.max(
          retryOperations.totalFailedMessageCount,
          1,
        ),
        recommendedAction:
          'Review delivery-state failures and carrier/provider reachability before retry pressure grows.',
      });
    }

    for (const view of byProviderTaxonomy) {
      if (view.messageCount <= 0) {
        continue;
      }

      if (
        view.failureClass === 'auth_or_configuration' &&
        view.messageCount >=
          operationalThresholds.authOrConfigurationCriticalCount
      ) {
        alerts.push({
          key: `provider_config:${view.provider}:${view.providerTaxonomyDetail}`,
          severity: 'critical',
          title: 'Provider configuration needs attention',
          summary: `${view.messageCount} outbound failures point to provider auth or configuration issues.`,
          thresholdKey: 'authOrConfigurationCriticalCount',
          observedValue: view.messageCount,
          thresholdValue:
            operationalThresholds.authOrConfigurationCriticalCount,
          thresholdUnit: 'count',
          provider: view.provider,
          failureClass: view.failureClass,
          providerTaxonomyFamily: view.providerTaxonomyFamily,
          providerTaxonomyDetail: view.providerTaxonomyDetail,
          affectedMessageCount: view.messageCount,
          recommendedAction:
            'Review access token validity, provider permissions, and mapped phone number configuration before retrying.',
        });
        continue;
      }

      if (
        view.failureClass === 'policy_block' &&
        view.messageCount >= operationalThresholds.policyBlockCriticalCount
      ) {
        alerts.push({
          key: `policy_block:${view.provider}:${view.providerTaxonomyDetail}`,
          severity: 'critical',
          title: 'Provider policy or quality block detected',
          summary: `${view.messageCount} outbound failures were blocked by provider policy or quality enforcement.`,
          thresholdKey: 'policyBlockCriticalCount',
          observedValue: view.messageCount,
          thresholdValue: operationalThresholds.policyBlockCriticalCount,
          thresholdUnit: 'count',
          provider: view.provider,
          failureClass: view.failureClass,
          providerTaxonomyFamily: view.providerTaxonomyFamily,
          providerTaxonomyDetail: view.providerTaxonomyDetail,
          affectedMessageCount: view.messageCount,
          recommendedAction:
            'Inspect template approval, conversation-window eligibility, and quality holds before sending more traffic.',
        });
        continue;
      }

      if (
        view.failureClass === 'rate_limited' &&
        view.messageCount >= operationalThresholds.rateLimitedWarningCount
      ) {
        alerts.push({
          key: `rate_limit:${view.provider}:${view.providerTaxonomyDetail}`,
          severity: 'warning',
          title: 'Provider throttling is affecting outbound throughput',
          summary: `${view.messageCount} outbound failures were classified as provider throttling or rate limiting.`,
          thresholdKey: 'rateLimitedWarningCount',
          observedValue: view.messageCount,
          thresholdValue: operationalThresholds.rateLimitedWarningCount,
          thresholdUnit: 'count',
          provider: view.provider,
          failureClass: view.failureClass,
          providerTaxonomyFamily: view.providerTaxonomyFamily,
          providerTaxonomyDetail: view.providerTaxonomyDetail,
          affectedMessageCount: view.messageCount,
          recommendedAction:
            'Reduce burst size, watch retry queue growth, and consider staggering automation traffic.',
        });
        continue;
      }

      if (
        view.failureClass === 'unknown' &&
        view.messageCount >= operationalThresholds.unknownFailureWarningCount
      ) {
        alerts.push({
          key: `unknown_failure:${view.provider}`,
          severity: 'warning',
          title: 'Unknown provider failures need taxonomy review',
          summary: `${view.messageCount} outbound failures did not match a known provider taxonomy yet.`,
          thresholdKey: 'unknownFailureWarningCount',
          observedValue: view.messageCount,
          thresholdValue: operationalThresholds.unknownFailureWarningCount,
          thresholdUnit: 'count',
          provider: view.provider,
          failureClass: view.failureClass,
          providerTaxonomyFamily: view.providerTaxonomyFamily,
          providerTaxonomyDetail: view.providerTaxonomyDetail,
          affectedMessageCount: view.messageCount,
          recommendedAction:
            'Review payloads and provider responses to extend the taxonomy before automating recovery.',
        });
      }
    }

    if (
      retryOperations.readyNowCount >=
      operationalThresholds.readyRetryQueueWarningCount
    ) {
      alerts.push({
        key: 'retry_queue_ready',
        severity: 'warning',
        title: 'Retry queue has ready-now messages',
        summary: `${retryOperations.readyNowCount} failed outbound messages are ready for retry execution now.`,
        thresholdKey: 'readyRetryQueueWarningCount',
        observedValue: retryOperations.readyNowCount,
        thresholdValue: operationalThresholds.readyRetryQueueWarningCount,
        thresholdUnit: 'count',
        provider: null,
        failureClass: null,
        providerTaxonomyFamily: null,
        providerTaxonomyDetail: null,
        affectedMessageCount: retryOperations.readyNowCount,
        recommendedAction:
          'Run the retry-ready runner or attach a scheduler so backlog does not accumulate.',
      });
    }

    if (
      retryOperations.cooldownBlockedCount >=
      operationalThresholds.cooldownRetryQueueWarningCount
    ) {
      alerts.push({
        key: 'retry_queue_cooldown_backlog',
        severity: 'warning',
        title: 'Retry queue is accumulating in cooldown',
        summary: `${retryOperations.cooldownBlockedCount} failed outbound messages are still blocked by cooldown.`,
        thresholdKey: 'cooldownRetryQueueWarningCount',
        observedValue: retryOperations.cooldownBlockedCount,
        thresholdValue: operationalThresholds.cooldownRetryQueueWarningCount,
        thresholdUnit: 'count',
        provider: null,
        failureClass: null,
        providerTaxonomyFamily: null,
        providerTaxonomyDetail: null,
        affectedMessageCount: retryOperations.cooldownBlockedCount,
        recommendedAction:
          'Inspect whether retry cadence or provider recovery windows need tuning before backlog keeps growing.',
      });
    }

    return alerts.sort(
      (left, right) =>
        this.rankAlertSeverity(right.severity) -
          this.rankAlertSeverity(left.severity) ||
        right.affectedMessageCount - left.affectedMessageCount ||
        left.key.localeCompare(right.key),
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

  private calculateRate(numerator: number, denominator: number): number {
    if (denominator <= 0) {
      return 0;
    }

    return Number((numerator / denominator).toFixed(4));
  }

  private rankAlertSeverity(severity: WhatsappOperationalAlertSeverity): number {
    return severity === 'critical' ? 2 : 1;
  }
}
