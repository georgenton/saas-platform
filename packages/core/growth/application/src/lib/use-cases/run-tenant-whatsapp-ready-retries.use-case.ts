import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import {
  ConversationDeliveryEvent,
  ConversationMessage,
} from '@saas-platform/growth-domain';
import { ConversationDeliveryEventRepository } from '../ports/conversation-delivery-event.repository';
import { ConversationMessageRepository } from '../ports/conversation-message.repository';
import {
  assessWhatsappRetryOperation,
  buildFailedEventsByMessageId,
  buildLatestFailedEventsByMessageId,
} from '../support/whatsapp-provider-operations';
import { RetryTenantWhatsappFailedConversationMessageUseCase } from './retry-tenant-whatsapp-failed-conversation-message.use-case';

export interface RunTenantWhatsappReadyRetriesInput {
  tenantSlug: string;
  limit?: number | null;
  occurredAt?: Date | null;
}

export interface TenantWhatsappRetryRunnerExecutionView {
  sourceMessageId: string;
  sourceExternalMessageId: string | null;
  disposition: 'retryable' | 'permanent';
  status: 'retried' | 'skipped_cooldown' | 'skipped_permanent';
  failedAttemptCount: number;
  backoffMinutes: number;
  nextRetryAt: Date;
  retryMessageId: string | null;
  retryExternalMessageId: string | null;
}

export interface TenantWhatsappRetryRunnerSummaryView {
  tenantSlug: string;
  generatedAt: Date;
  limitApplied: number;
  candidateFailedMessageCount: number;
  leafFailedMessageCount: number;
  supersededFailedMessageCount: number;
  readyNowCount: number;
  retriedCount: number;
  skippedCooldownCount: number;
  skippedPermanentCount: number;
  executions: TenantWhatsappRetryRunnerExecutionView[];
}

export class RunTenantWhatsappReadyRetriesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly conversationMessageRepository: ConversationMessageRepository,
    private readonly conversationDeliveryEventRepository: ConversationDeliveryEventRepository,
    private readonly retryTenantWhatsappFailedConversationMessageUseCase: RetryTenantWhatsappFailedConversationMessageUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: RunTenantWhatsappReadyRetriesInput,
  ): Promise<TenantWhatsappRetryRunnerSummaryView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [messages, deliveryEvents] = await Promise.all([
      this.conversationMessageRepository.findByTenantId(tenant.id),
      this.conversationDeliveryEventRepository.findByTenantId(tenant.id),
    ]);
    const now = input.occurredAt ?? this.nowProvider();
    const limitApplied = Math.min(Math.max(input.limit ?? 25, 1), 100);
    const failedCandidates = messages.filter(
      (message) =>
        message.direction === 'outbound' &&
        message.provider !== null &&
        message.deliveryStatus === 'failed',
    );
    const retryParentIds = new Set(
      messages
        .map((message) => message.retryOfMessageId)
        .filter((messageId): messageId is string => !!messageId),
    );
    const leafFailedMessages = failedCandidates.filter(
      (message) => !retryParentIds.has(message.id),
    );
    const supersededFailedMessageCount =
      failedCandidates.length - leafFailedMessages.length;
    const failedEventsByMessageId = buildFailedEventsByMessageId(deliveryEvents);
    const latestFailedEventsByMessageId =
      buildLatestFailedEventsByMessageId(deliveryEvents);
    const orderedCandidates = leafFailedMessages
      .map((message) => ({
        message,
        retryAssessment: assessWhatsappRetryOperation(
          message,
          failedEventsByMessageId.get(message.id) ??
            (latestFailedEventsByMessageId.has(message.id)
              ? [latestFailedEventsByMessageId.get(message.id) as ConversationDeliveryEvent]
              : []),
          now,
        ),
      }))
      .sort(
        (left, right) =>
          left.retryAssessment.nextRetryAt.getTime() -
            right.retryAssessment.nextRetryAt.getTime() ||
          left.message.createdAt.getTime() - right.message.createdAt.getTime(),
      )
      .slice(0, limitApplied);

    let readyNowCount = 0;
    let retriedCount = 0;
    let skippedCooldownCount = 0;
    let skippedPermanentCount = 0;
    const executions: TenantWhatsappRetryRunnerExecutionView[] = [];

    for (const candidate of orderedCandidates) {
      if (candidate.retryAssessment.disposition === 'permanent') {
        skippedPermanentCount += 1;
        executions.push(
          this.buildExecutionView(candidate.message, candidate.retryAssessment),
        );
        continue;
      }

      if (!candidate.retryAssessment.readyNow) {
        skippedCooldownCount += 1;
        executions.push(
          this.buildExecutionView(candidate.message, candidate.retryAssessment),
        );
        continue;
      }

      readyNowCount += 1;
      const retriedMessage =
        await this.retryTenantWhatsappFailedConversationMessageUseCase.execute({
          tenantSlug: input.tenantSlug,
          threadId: candidate.message.threadId,
          messageId: candidate.message.id,
          occurredAt: now,
        });
      retriedCount += 1;
      executions.push({
        ...this.buildExecutionView(candidate.message, candidate.retryAssessment),
        status: 'retried',
        retryMessageId: retriedMessage.id,
        retryExternalMessageId: retriedMessage.externalMessageId,
      });
    }

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: now,
      limitApplied,
      candidateFailedMessageCount: failedCandidates.length,
      leafFailedMessageCount: leafFailedMessages.length,
      supersededFailedMessageCount,
      readyNowCount,
      retriedCount,
      skippedCooldownCount,
      skippedPermanentCount,
      executions,
    };
  }

  private buildExecutionView(
    message: ConversationMessage,
    retryAssessment: ReturnType<typeof assessWhatsappRetryOperation>,
  ): TenantWhatsappRetryRunnerExecutionView {
    return {
      sourceMessageId: message.id,
      sourceExternalMessageId: message.externalMessageId,
      disposition: retryAssessment.disposition,
      status:
        retryAssessment.disposition === 'permanent'
          ? 'skipped_permanent'
          : 'skipped_cooldown',
      failedAttemptCount: retryAssessment.failedAttemptCount,
      backoffMinutes: retryAssessment.backoffMinutes,
      nextRetryAt: retryAssessment.nextRetryAt,
      retryMessageId: null,
      retryExternalMessageId: null,
    };
  }
}
