import { HttpWhatsappOperationalMonitorObservabilitySink } from './http-whatsapp-operational-monitor-observability.sink';

describe('HttpWhatsappOperationalMonitorObservabilitySink', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 202,
    } as any);
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('skips publishing when no webhook url is configured', async () => {
    const sink = new HttpWhatsappOperationalMonitorObservabilitySink();

    await sink.publish({
      summary: {
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-20T12:00:00.000Z'),
      } as any,
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('publishes the operational monitor summary to the configured webhook', async () => {
    process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_WEBHOOK_URL =
      'https://observability.example.test/ingest';
    process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_AUTH_HEADER_NAME =
      'x-monitor-token';
    process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_AUTH_HEADER_VALUE =
      'secret-token';

    const sink = new HttpWhatsappOperationalMonitorObservabilitySink();

    await sink.publish({
      summary: {
        tenantSlug: 'saas-platform',
        generatedAt: new Date('2026-05-20T12:00:00.000Z'),
        overallStatus: 'warning',
        totalAlertCount: 2,
      } as any,
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://observability.example.test/ingest',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'x-monitor-token': 'secret-token',
        }),
      }),
    );
  });
});
