import {
  Injectable,
  Inject,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  RunTenantWhatsappOperationalMonitorUseCase,
  WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_SINK,
  WhatsappOperationalMonitorObservabilitySink,
} from '@saas-platform/growth-application';

const DEFAULT_OPERATIONAL_MONITOR_INTERVAL_MS = 60_000;
const MIN_OPERATIONAL_MONITOR_INTERVAL_MS = 10_000;
const MAX_OPERATIONAL_MONITOR_INTERVAL_MS = 3_600_000;

@Injectable()
export class GrowthWhatsappOperationalMonitorScheduler
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(
    GrowthWhatsappOperationalMonitorScheduler.name,
  );
  private intervalHandle: ReturnType<typeof setInterval> | null = null;
  private running = false;

  constructor(
    private readonly runTenantWhatsappOperationalMonitorUseCase: RunTenantWhatsappOperationalMonitorUseCase,
    @Inject(WHATSAPP_OPERATIONAL_MONITOR_OBSERVABILITY_SINK)
    private readonly whatsappOperationalMonitorObservabilitySink: WhatsappOperationalMonitorObservabilitySink,
  ) {}

  onModuleInit(): void {
    if (!this.isEnabled()) {
      return;
    }

    const tenantSlugs = this.getTenantSlugs();

    if (tenantSlugs.length === 0) {
      this.logger.warn(
        'Operational monitor scheduler is enabled but no tenant slugs were configured.',
      );
      return;
    }

    const intervalMs = this.getIntervalMs();
    this.intervalHandle = setInterval(() => {
      void this.runScheduledCycle();
    }, intervalMs);
    this.logger.log(
      `Operational monitor scheduler started for tenants [${tenantSlugs.join(
        ', ',
      )}] every ${intervalMs}ms.`,
    );
    void this.runScheduledCycle();
  }

  onModuleDestroy(): void {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  async runScheduledCycle(): Promise<void> {
    if (this.running) {
      this.logger.warn(
        'Operational monitor cycle skipped because a previous cycle is still running.',
      );
      return;
    }

    const tenantSlugs = this.getTenantSlugs();
    if (tenantSlugs.length === 0) {
      return;
    }

    this.running = true;

    try {
      for (const tenantSlug of tenantSlugs) {
        const summary =
          await this.runTenantWhatsappOperationalMonitorUseCase.execute({
            tenantSlug,
            autoRunReadyRetries: this.isAutoRunReadyRetriesEnabled(),
            retryReadyLimit: this.getRetryReadyLimit(),
            triggerSource: 'scheduler',
          });
        await this.whatsappOperationalMonitorObservabilitySink.publish({
          summary,
        });

        const baseMessage =
          `tenant=${tenantSlug} status=${summary.overallStatus} alerts=${summary.totalAlertCount} critical=${summary.criticalAlertCount} warning=${summary.warningAlertCount} readyRetryQueue=${summary.operationalDashboard.readyRetryQueueCount}`;

        if (summary.criticalAlertCount > 0) {
          this.logger.error(`Operational monitor critical state ${baseMessage}`);
          continue;
        }

        if (summary.warningAlertCount > 0) {
          this.logger.warn(`Operational monitor warning state ${baseMessage}`);
          continue;
        }

        this.logger.log(`Operational monitor healthy state ${baseMessage}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.stack ?? error.message : String(error);
      this.logger.error(`Operational monitor cycle failed: ${message}`);
    } finally {
      this.running = false;
    }
  }

  private isEnabled(): boolean {
    return this.readBooleanEnv(
      'GROWTH_WHATSAPP_OPERATIONAL_MONITOR_SCHEDULER_ENABLED',
    );
  }

  private isAutoRunReadyRetriesEnabled(): boolean {
    return this.readBooleanEnv(
      'GROWTH_WHATSAPP_OPERATIONAL_MONITOR_AUTO_RUN_READY_RETRIES',
    );
  }

  private getRetryReadyLimit(): number | null {
    const rawValue =
      process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_RETRY_READY_LIMIT?.trim();

    if (!rawValue) {
      return null;
    }

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
      return null;
    }

    return Math.min(Math.max(Math.trunc(parsed), 1), 100);
  }

  private getTenantSlugs(): string[] {
    return (
      process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_TENANT_SLUGS?.split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0) ?? []
    );
  }

  private getIntervalMs(): number {
    const rawValue =
      process.env.GROWTH_WHATSAPP_OPERATIONAL_MONITOR_INTERVAL_MS?.trim();

    if (!rawValue) {
      return DEFAULT_OPERATIONAL_MONITOR_INTERVAL_MS;
    }

    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) {
      return DEFAULT_OPERATIONAL_MONITOR_INTERVAL_MS;
    }

    return Math.min(
      Math.max(Math.trunc(parsed), MIN_OPERATIONAL_MONITOR_INTERVAL_MS),
      MAX_OPERATIONAL_MONITOR_INTERVAL_MS,
    );
  }

  private readBooleanEnv(envKey: string): boolean {
    const rawValue = process.env[envKey]?.trim().toLowerCase();
    return rawValue === '1' || rawValue === 'true' || rawValue === 'yes';
  }
}
