import { PrismaClient } from '@prisma/client';
import {
  apiRequest,
  getArg,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

const prisma = new PrismaClient();

async function fetchCollectorEvents(collectorBaseUrl) {
  const response = await fetch(`${collectorBaseUrl}/events`);

  if (!response.ok) {
    throw new Error(
      `Collector events fetch failed (${response.status}): ${response.statusText}`,
    );
  }

  return response.json();
}

function findMatchingTaxonomy(summary, expectedFamily, expectedDetail) {
  return (
    summary.byProviderTaxonomy.find(
      (item) =>
        item.providerTaxonomyFamily === expectedFamily &&
        item.providerTaxonomyDetail === expectedDetail,
    ) ?? null
  );
}

function findMatchingErrorCode(summary, providerErrorCode) {
  return (
    summary.topProviderErrorCodes.find(
      (item) => item.providerErrorCode === providerErrorCode,
    ) ?? null
  );
}

async function main() {
  loadDotEnv();

  const baseUrl = normalizeBaseUrl(
    getArg('base-url', 'http://127.0.0.1:3000/api'),
  );
  const tenantSlug = getArg('tenant-slug', 'saas-platform-local');
  const collectorBaseUrl = normalizeBaseUrl(
    getArg('collector-base-url', 'http://127.0.0.1:4011'),
  );
  const token = resolveToken();
  const providerErrorCode = getArg('provider-error-code', '131053');
  const providerStatusDetail = getArg(
    'provider-status-detail',
    'pair_rate_limit',
  );
  const failureReason = getArg(
    'failure-reason',
    'Pair rate limit reached for this recipient.',
  );
  const expectedTaxonomyFamily = getArg(
    'expected-taxonomy-family',
    'throughput_limit',
  );
  const expectedTaxonomyDetail = getArg(
    'expected-taxonomy-detail',
    'meta_pair_rate_limit',
  );
  const expectedAlertKeyPrefix = getArg('expected-alert-key-prefix', 'rate_limit:');
  const occurredAtBase = new Date();
  const suffix = `${occurredAtBase.getTime()}`;
  const outboundOccurredAt = new Date(occurredAtBase.getTime() - 60 * 1000);
  const failedOccurredAt = new Date(occurredAtBase.getTime() - 30 * 1000);
  const externalConversationId = `wa_taxonomy_conv_${suffix}`;
  const externalOutboundMessageId = `wamid.taxonomy.outbound.${suffix}`;
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug: tenantSlug,
    },
  });

  if (!tenant) {
    throw new Error(`Tenant ${tenantSlug} was not found in the local database.`);
  }

  const threadId = `thread_taxonomy_smoke_${suffix}`;
  const outboundMessageId = `message_taxonomy_smoke_${suffix}`;

  await prisma.conversationThread.create({
    data: {
      id: threadId,
      tenantId: tenant.id,
      leadId: null,
      assigneeUserId: null,
      subject: `Taxonomy Smoke ${suffix}`,
      channel: 'whatsapp',
      externalConversationId,
      participantDisplayName: `Taxonomy Smoke ${suffix}`,
      participantHandle: '+593999000111',
      status: 'open',
      latestMessagePreview: 'Seguimos con tu caso, gracias por la paciencia.',
      messageCount: 1,
      openedAt: outboundOccurredAt,
      closedAt: null,
      lastActivityAt: failedOccurredAt,
      createdAt: outboundOccurredAt,
      updatedAt: failedOccurredAt,
    },
  });

  await prisma.conversationMessage.create({
    data: {
      id: outboundMessageId,
      tenantId: tenant.id,
      threadId,
      direction: 'outbound',
      body: 'Seguimos con tu caso, gracias por la paciencia.',
      templateId: null,
      retryOfMessageId: null,
      renderedTemplateSnapshotJson: null,
      outboundIntentKey: 'follow_up',
      provider: 'meta_cloud_api_stub',
      deliveryStatus: 'failed',
      externalMessageId: externalOutboundMessageId,
      failureReason,
      deliveredAt: null,
      readAt: null,
      createdAt: outboundOccurredAt,
    },
  });

  await prisma.conversationDeliveryEvent.create({
    data: {
      id: `delivery_event_taxonomy_smoke_${suffix}`,
      tenantId: tenant.id,
      messageId: outboundMessageId,
      externalMessageId: externalOutboundMessageId,
      provider: 'meta_cloud_api_stub',
      providerEventId: null,
      eventKey: `taxonomy-smoke:${providerErrorCode}:${suffix}`,
      deliveryStatus: 'failed',
      failureReason,
      providerStatusDetail,
      providerConversationCategory: null,
      providerPricingCategory: null,
      providerErrorCode,
      payloadJson: JSON.stringify({
        mode: 'taxonomy_smoke',
        providerErrorCode,
      }),
      occurredAt: failedOccurredAt,
      createdAt: failedOccurredAt,
    },
  });

  const outboundSummary = await apiRequest({
    baseUrl,
    path: `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/outbound-summary`,
    token,
    method: 'GET',
  });

  const taxonomyEntry = findMatchingTaxonomy(
    outboundSummary,
    expectedTaxonomyFamily,
    expectedTaxonomyDetail,
  );
  if (!taxonomyEntry) {
    throw new Error(
      `Outbound summary is missing taxonomy ${expectedTaxonomyFamily}/${expectedTaxonomyDetail}.`,
    );
  }

  const errorCodeEntry = findMatchingErrorCode(
    outboundSummary,
    providerErrorCode,
  );
  if (!errorCodeEntry) {
    throw new Error(
      `Outbound summary is missing providerErrorCode ${providerErrorCode}.`,
    );
  }

  const before = await fetchCollectorEvents(collectorBaseUrl);
  const monitorSummary = await apiRequest({
    baseUrl,
    path: `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/monitor`,
    token,
    method: 'POST',
    body: {
      occurredAt: occurredAtBase.toISOString(),
      autoRunReadyRetries: false,
      retryReadyLimit: 25,
    },
  });
  const after = await fetchCollectorEvents(collectorBaseUrl);

  if (after.count <= before.count) {
    throw new Error(
      'No new observability event was captured after running the taxonomy smoke monitor.',
    );
  }

  const latestEvent = after.events.at(-1);
  const latestSummary = latestEvent?.body?.summary ?? null;

  if (
    latestSummary?.operationalDashboard?.leadingProviderTaxonomyFamily !==
    expectedTaxonomyFamily
  ) {
    throw new Error(
      `Collector leading taxonomy family=${latestSummary?.operationalDashboard?.leadingProviderTaxonomyFamily}, expected ${expectedTaxonomyFamily}.`,
    );
  }

  if (
    latestSummary?.operationalDashboard?.leadingProviderTaxonomyDetail !==
    expectedTaxonomyDetail
  ) {
    throw new Error(
      `Collector leading taxonomy detail=${latestSummary?.operationalDashboard?.leadingProviderTaxonomyDetail}, expected ${expectedTaxonomyDetail}.`,
    );
  }

  const alertMatch =
    latestSummary?.operationalAlerts?.find(
      (item) =>
        item.key?.startsWith(expectedAlertKeyPrefix) &&
        item.providerTaxonomyFamily === expectedTaxonomyFamily &&
        item.providerTaxonomyDetail === expectedTaxonomyDetail,
    ) ?? null;

  if (!alertMatch) {
    throw new Error(
      `Collector operational alerts are missing a ${expectedAlertKeyPrefix} alert for ${expectedTaxonomyDetail}.`,
    );
  }

  printSection('Seeded Failure');
  printLine('tenantSlug', tenantSlug);
  printLine('threadId', threadId);
  printLine('outboundMessageId', outboundMessageId);
  printLine('providerErrorCode', providerErrorCode);

  printSection('Outbound Summary Taxonomy');
  printLine('providerTaxonomyFamily', taxonomyEntry.providerTaxonomyFamily);
  printLine('providerTaxonomyDetail', taxonomyEntry.providerTaxonomyDetail);
  printLine('failureClass', taxonomyEntry.failureClass);
  printLine('failurePhase', taxonomyEntry.failurePhase);
  printLine('errorCodeOccurrenceCount', errorCodeEntry.occurrenceCount);

  printSection('Operational Monitor Summary');
  printLine('overallStatus', monitorSummary.overallStatus);
  printLine('totalAlertCount', monitorSummary.totalAlertCount);
  printLine(
    'leadingProviderTaxonomyFamily',
    monitorSummary.operationalDashboard.leadingProviderTaxonomyFamily,
  );
  printLine(
    'leadingProviderTaxonomyDetail',
    monitorSummary.operationalDashboard.leadingProviderTaxonomyDetail,
  );

  printSection('Collector Delivery');
  printLine('eventsBefore', before.count);
  printLine('eventsAfter', after.count);
  printLine('latestEventType', latestEvent?.body?.eventType ?? null);

  printSection('Result');
  printLine('status', 'ok');
}

main()
  .catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
