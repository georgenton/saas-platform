import {
  ConversationDeliveryEvent,
  ConversationMessage,
} from '@saas-platform/growth-domain';

export type WhatsappRetryDisposition = 'retryable' | 'permanent';
export type WhatsappProviderFailurePhase =
  | 'immediate_send_rejection'
  | 'asynchronous_delivery_failure';
export type WhatsappProviderFailureClass =
  | 'rate_limited'
  | 'recipient_issue'
  | 'policy_block'
  | 'auth_or_configuration'
  | 'provider_transient'
  | 'unknown';
export type WhatsappProviderTaxonomyFamily =
  | 'throughput_limit'
  | 'recipient_reachability'
  | 'template_policy'
  | 'quality_enforcement'
  | 'auth_token'
  | 'permission_scope'
  | 'phone_number_configuration'
  | 'platform_transient'
  | 'unknown';
export type WhatsappProviderTaxonomyDetail =
  | 'meta_api_throttle'
  | 'meta_pair_rate_limit'
  | 'meta_recipient_unreachable'
  | 'meta_reengagement_restriction'
  | 'meta_template_not_approved'
  | 'meta_quality_hold'
  | 'meta_account_block'
  | 'meta_access_token_invalid'
  | 'meta_missing_permission'
  | 'meta_phone_number_id_invalid'
  | 'meta_platform_error'
  | 'provider_unavailable'
  | 'unknown';
export type WhatsappOperationalAlertSeverity = 'warning' | 'critical';

export interface WhatsappProviderFailureSemantics {
  failureClass: WhatsappProviderFailureClass;
  failurePhase: WhatsappProviderFailurePhase;
  retryDisposition: WhatsappRetryDisposition;
  providerTaxonomyFamily: WhatsappProviderTaxonomyFamily;
  providerTaxonomyDetail: WhatsappProviderTaxonomyDetail;
  suggestedAlertSeverity: WhatsappOperationalAlertSeverity;
}

export interface WhatsappRetryAssessment {
  disposition: WhatsappRetryDisposition;
  failedAttemptCount: number;
  backoffMinutes: number;
  nextRetryAt: Date;
  readyNow: boolean;
}

export const DEFAULT_WHATSAPP_RETRY_BASE_BACKOFF_MINUTES = 5;
export const DEFAULT_WHATSAPP_RETRY_MAX_BACKOFF_MINUTES = 180;

export const buildLatestFailedEventsByMessageId = (
  events: ConversationDeliveryEvent[],
): Map<string, ConversationDeliveryEvent> => {
  const latestByMessageId = new Map<string, ConversationDeliveryEvent>();

  for (const event of events) {
    if (!event.messageId || event.deliveryStatus !== 'failed') {
      continue;
    }

    const current = latestByMessageId.get(event.messageId);

    if (!current || event.occurredAt.getTime() >= current.occurredAt.getTime()) {
      latestByMessageId.set(event.messageId, event);
    }
  }

  return latestByMessageId;
};

export const buildFailedEventsByMessageId = (
  events: ConversationDeliveryEvent[],
): Map<string, ConversationDeliveryEvent[]> => {
  const eventsByMessageId = new Map<string, ConversationDeliveryEvent[]>();

  for (const event of events) {
    if (!event.messageId || event.deliveryStatus !== 'failed') {
      continue;
    }

    const bucket = eventsByMessageId.get(event.messageId) ?? [];
    bucket.push(event);
    eventsByMessageId.set(event.messageId, bucket);
  }

  return eventsByMessageId;
};

export const classifyWhatsappRetryDisposition = (
  message: ConversationMessage,
  latestFailedEvent: ConversationDeliveryEvent | undefined,
): WhatsappRetryDisposition => {
  return classifyWhatsappProviderFailure(message, latestFailedEvent)
    .retryDisposition;
};

export const classifyWhatsappProviderFailure = (
  message: ConversationMessage,
  latestFailedEvent: ConversationDeliveryEvent | undefined,
): WhatsappProviderFailureSemantics => {
  const combinedReason = [
    latestFailedEvent?.failureReason,
    latestFailedEvent?.providerStatusDetail,
    message.failureReason,
  ]
    .filter((value) => !!value)
    .join(' ')
    .toLowerCase();
  const errorCode = latestFailedEvent?.providerErrorCode?.trim() ?? null;
  const failurePhase =
    latestFailedEvent?.eventKey?.startsWith('outbound:') ||
    (!latestFailedEvent && !message.externalMessageId)
      ? 'immediate_send_rejection'
      : 'asynchronous_delivery_failure';

  if (
    errorCode &&
    ['4', '80007', '130429', '131053'].includes(errorCode)
  ) {
    const providerTaxonomyDetail =
      errorCode === '131053' ? 'meta_pair_rate_limit' : 'meta_api_throttle';
    return {
      failureClass: 'rate_limited',
      failurePhase,
      retryDisposition: 'retryable',
      providerTaxonomyFamily: 'throughput_limit',
      providerTaxonomyDetail,
      suggestedAlertSeverity: 'warning',
    };
  }

  if (
    errorCode === '131026' ||
    combinedReason.includes('recipient_unreachable') ||
    combinedReason.includes('undeliverable') ||
    combinedReason.includes('invalid phone') ||
    combinedReason.includes('not a whatsapp user')
  ) {
    return {
      failureClass: 'recipient_issue',
      failurePhase,
      retryDisposition: 'permanent',
      providerTaxonomyFamily: 'recipient_reachability',
      providerTaxonomyDetail: 'meta_recipient_unreachable',
      suggestedAlertSeverity: 'warning',
    };
  }

  if (
    (errorCode && ['131047', '131048', '470', '368'].includes(errorCode)) ||
    combinedReason.includes('not approved') ||
    combinedReason.includes('policy') ||
    combinedReason.includes('blocked') ||
    combinedReason.includes('restricted') ||
    combinedReason.includes('quality')
  ) {
    const providerTaxonomyFamily =
      errorCode === '131048' || errorCode === '368'
        ? 'quality_enforcement'
        : 'template_policy';
    const providerTaxonomyDetail =
      errorCode === '131047'
        ? 'meta_reengagement_restriction'
        : errorCode === '131048'
          ? 'meta_quality_hold'
          : errorCode === '368'
            ? 'meta_account_block'
            : errorCode === '470'
              ? 'meta_reengagement_restriction'
              : combinedReason.includes('quality')
                ? 'meta_quality_hold'
                : combinedReason.includes('blocked')
                  ? 'meta_account_block'
                  : combinedReason.includes('restricted')
                    ? 'meta_reengagement_restriction'
                    : 'meta_template_not_approved';
    return {
      failureClass: 'policy_block',
      failurePhase,
      retryDisposition: 'permanent',
      providerTaxonomyFamily,
      providerTaxonomyDetail,
      suggestedAlertSeverity: 'critical',
    };
  }

  if (
    errorCode === '190' ||
    combinedReason.includes('oauth') ||
    combinedReason.includes('permission') ||
    combinedReason.includes('access token') ||
    combinedReason.includes('unauthorized') ||
    combinedReason.includes('forbidden') ||
    combinedReason.includes('phone number id')
  ) {
    const providerTaxonomyFamily =
      errorCode === '190'
        ? 'auth_token'
        : combinedReason.includes('phone number id')
          ? 'phone_number_configuration'
          : 'permission_scope';
    const providerTaxonomyDetail =
      errorCode === '190'
        ? 'meta_access_token_invalid'
        : combinedReason.includes('phone number id')
          ? 'meta_phone_number_id_invalid'
          : 'meta_missing_permission';
    return {
      failureClass: 'auth_or_configuration',
      failurePhase,
      retryDisposition: 'permanent',
      providerTaxonomyFamily,
      providerTaxonomyDetail,
      suggestedAlertSeverity: 'critical',
    };
  }

  if (
    errorCode === '131000' ||
    combinedReason.includes('temporary') ||
    combinedReason.includes('transient') ||
    combinedReason.includes('timeout') ||
    combinedReason.includes('unavailable') ||
    combinedReason.includes('internal')
  ) {
    const providerTaxonomyDetail =
      errorCode === '131000'
        ? 'meta_platform_error'
        : 'provider_unavailable';
    return {
      failureClass: 'provider_transient',
      failurePhase,
      retryDisposition: 'retryable',
      providerTaxonomyFamily: 'platform_transient',
      providerTaxonomyDetail,
      suggestedAlertSeverity: 'warning',
    };
  }

  return {
    failureClass: 'unknown',
    failurePhase,
    retryDisposition: 'retryable',
    providerTaxonomyFamily: 'unknown',
    providerTaxonomyDetail: 'unknown',
    suggestedAlertSeverity: 'warning',
  };
};

export const assessWhatsappRetryOperation = (
  message: ConversationMessage,
  failedEvents: ConversationDeliveryEvent[],
  now: Date,
  baseBackoffMinutes = DEFAULT_WHATSAPP_RETRY_BASE_BACKOFF_MINUTES,
  maxBackoffMinutes = DEFAULT_WHATSAPP_RETRY_MAX_BACKOFF_MINUTES,
): WhatsappRetryAssessment => {
  const latestFailedEvent = [...failedEvents]
    .filter((event) => event.deliveryStatus === 'failed')
    .sort((left, right) => left.occurredAt.getTime() - right.occurredAt.getTime())
    .at(-1);
  const disposition = classifyWhatsappRetryDisposition(
    message,
    latestFailedEvent,
  );
  const failedAttemptCount = Math.max(
    failedEvents.filter((event) => event.deliveryStatus === 'failed').length,
    1,
  );
  const backoffMinutes = Math.min(
    baseBackoffMinutes * 2 ** Math.max(failedAttemptCount - 1, 0),
    maxBackoffMinutes,
  );
  const lastFailureAt =
    latestFailedEvent?.occurredAt ??
    message.readAt ??
    message.deliveredAt ??
    message.createdAt;
  const nextRetryAt = new Date(
    lastFailureAt.getTime() + backoffMinutes * 60 * 1000,
  );

  return {
    disposition,
    failedAttemptCount,
    backoffMinutes,
    nextRetryAt,
    readyNow: nextRetryAt.getTime() <= now.getTime(),
  };
};
