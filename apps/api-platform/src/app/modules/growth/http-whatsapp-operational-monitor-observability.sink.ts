import { Logger } from '@nestjs/common';
import {
  PublishWhatsappOperationalMonitorSummaryCommand,
  WhatsappOperationalMonitorObservabilitySink,
} from '@saas-platform/growth-application';

const DEFAULT_OBSERVABILITY_TIMEOUT_MS = 5_000;

export class HttpWhatsappOperationalMonitorObservabilitySink
  implements WhatsappOperationalMonitorObservabilitySink
{
  private readonly logger = new Logger(
    HttpWhatsappOperationalMonitorObservabilitySink.name,
  );

  async publish(
    command: PublishWhatsappOperationalMonitorSummaryCommand,
  ): Promise<void> {
    const webhookUrl = this.getWebhookUrl();

    if (!webhookUrl) {
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          source: 'api-platform.growth.whatsapp-operational-monitor',
          eventType: 'growth.whatsapp.operational-monitor.summary',
          emittedAt: new Date().toISOString(),
          summary: command.summary,
        }),
        signal: AbortSignal.timeout(this.getTimeoutMs()),
      });

      if (!response.ok) {
        this.logger.error(
          `Observability publish failed with status ${response.status} for tenant ${command.summary.tenantSlug}.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Observability publish failed for tenant ${command.summary.tenantSlug}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  private getWebhookUrl(): string {
    return (
      process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_WEBHOOK_URL?.trim() ??
      ''
    );
  }

  private getTimeoutMs(): number {
    const rawValue =
      process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_TIMEOUT_MS?.trim();

    if (!rawValue) {
      return DEFAULT_OBSERVABILITY_TIMEOUT_MS;
    }

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
      return DEFAULT_OBSERVABILITY_TIMEOUT_MS;
    }

    return Math.max(Math.trunc(parsed), 250);
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const authHeaderName =
      process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_AUTH_HEADER_NAME?.trim();
    const authHeaderValue =
      process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_AUTH_HEADER_VALUE?.trim();

    if (authHeaderName && authHeaderValue) {
      headers[authHeaderName] = authHeaderValue;
    }

    return headers;
  }
}
