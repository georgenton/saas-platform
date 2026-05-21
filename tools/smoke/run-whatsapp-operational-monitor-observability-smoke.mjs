import {
  apiRequest,
  getArg,
  loadDotEnv,
  normalizeBaseUrl,
  printLine,
  printSection,
  resolveToken,
} from './ec-sandbox-smoke-lib.mjs';

async function fetchCollectorEvents(collectorBaseUrl) {
  const response = await fetch(`${collectorBaseUrl}/events`);

  if (!response.ok) {
    throw new Error(
      `Collector events fetch failed (${response.status}): ${response.statusText}`,
    );
  }

  return response.json();
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
  const occurredAt = getArg('occurred-at', new Date().toISOString());
  const autoRunReadyRetries = getArg('auto-run-ready-retries', 'false');
  const retryReadyLimit = Number.parseInt(getArg('retry-ready-limit', '25'), 10);

  const before = await fetchCollectorEvents(collectorBaseUrl);
  const summary = await apiRequest({
    baseUrl,
    path: `/growth/tenants/${encodeURIComponent(
      tenantSlug,
    )}/conversations/whatsapp-reporting/monitor`,
    token,
    method: 'POST',
    body: {
      occurredAt,
      autoRunReadyRetries:
        autoRunReadyRetries === 'true' ||
        autoRunReadyRetries === '1' ||
        autoRunReadyRetries === 'yes',
      retryReadyLimit,
    },
  });
  const after = await fetchCollectorEvents(collectorBaseUrl);

  printSection('Operational Monitor Summary');
  printLine('tenantSlug', summary.tenantSlug);
  printLine('overallStatus', summary.overallStatus);
  printLine('totalAlertCount', summary.totalAlertCount);
  printLine('retryRunnerExecuted', summary.retryRunnerExecuted);

  printSection('Collector Delivery');
  printLine('eventsBefore', before.count);
  printLine('eventsAfter', after.count);

  if (after.count <= before.count) {
    throw new Error(
      'No new observability events were captured by the collector after invoking the monitor endpoint.',
    );
  }

  const latestEvent = after.events.at(-1);
  const eventTenantSlug = latestEvent?.body?.summary?.tenantSlug ?? null;
  const eventType = latestEvent?.body?.eventType ?? null;

  printLine('latestEventType', eventType);
  printLine('latestEventTenantSlug', eventTenantSlug);

  if (eventTenantSlug !== summary.tenantSlug) {
    throw new Error(
      `Collector captured tenantSlug=${eventTenantSlug}, expected ${summary.tenantSlug}.`,
    );
  }

  printSection('Result');
  printLine('status', 'ok');
}

main().catch((error) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : String(error)}\n`,
  );
  process.exit(1);
});
