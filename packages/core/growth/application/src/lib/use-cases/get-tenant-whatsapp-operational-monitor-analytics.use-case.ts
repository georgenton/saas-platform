import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { WhatsappOperationalMonitorRunRepository } from '../ports/whatsapp-operational-monitor-run.repository';

export interface TenantWhatsappOperationalAlertFrequencyView {
  alertKey: string;
  title: string;
  severity: 'warning' | 'critical';
  occurrenceCount: number;
  lastSeenAt: Date;
}

export interface TenantWhatsappOperationalThresholdCalibrationView {
  thresholdKey:
    | 'immediateSendRejectionRateWarning'
    | 'asynchronousDeliveryFailureRateWarning'
    | 'readyRetryQueueWarningCount'
    | 'cooldownRetryQueueWarningCount';
  thresholdUnit: 'rate' | 'count';
  sampleCount: number;
  currentValue: number;
  recommendedValue: number;
  p50Observed: number;
  p95Observed: number;
  maxObserved: number;
  direction: 'raise' | 'lower' | 'keep';
  confidence: 'low' | 'medium' | 'high';
  rationale: string;
}

export interface TenantWhatsappOperationalMonitorAnalyticsView {
  tenantSlug: string;
  generatedAt: Date;
  runCount: number;
  windowStartAt: Date | null;
  windowEndAt: Date | null;
  latestOverallStatus: 'healthy' | 'warning' | 'critical' | null;
  statusCounts: {
    healthy: number;
    warning: number;
    critical: number;
  };
  triggerSourceCounts: {
    manual: number;
    scheduler: number;
  };
  alertFrequency: TenantWhatsappOperationalAlertFrequencyView[];
  thresholdCalibration: TenantWhatsappOperationalThresholdCalibrationView[];
}

type ThresholdSeriesDefinition = {
  thresholdKey:
    | 'immediateSendRejectionRateWarning'
    | 'asynchronousDeliveryFailureRateWarning'
    | 'readyRetryQueueWarningCount'
    | 'cooldownRetryQueueWarningCount';
  thresholdUnit: 'rate' | 'count';
  currentValueSelector: (run: any) => number;
  observedValueSelector: (run: any) => number;
};

const THRESHOLD_SERIES: ThresholdSeriesDefinition[] = [
  {
    thresholdKey: 'immediateSendRejectionRateWarning',
    thresholdUnit: 'rate',
    currentValueSelector: (run) =>
      run.operationalThresholds.immediateSendRejectionRateWarning,
    observedValueSelector: (run) =>
      run.operationalDashboard.immediateSendRejectionRate,
  },
  {
    thresholdKey: 'asynchronousDeliveryFailureRateWarning',
    thresholdUnit: 'rate',
    currentValueSelector: (run) =>
      run.operationalThresholds.asynchronousDeliveryFailureRateWarning,
    observedValueSelector: (run) =>
      run.operationalDashboard.asynchronousDeliveryFailureRate,
  },
  {
    thresholdKey: 'readyRetryQueueWarningCount',
    thresholdUnit: 'count',
    currentValueSelector: (run) =>
      run.operationalThresholds.readyRetryQueueWarningCount,
    observedValueSelector: (run) =>
      run.operationalDashboard.readyRetryQueueCount,
  },
  {
    thresholdKey: 'cooldownRetryQueueWarningCount',
    thresholdUnit: 'count',
    currentValueSelector: (run) =>
      run.operationalThresholds.cooldownRetryQueueWarningCount,
    observedValueSelector: (run) =>
      run.operationalDashboard.cooldownRetryQueueCount,
  },
];

export class GetTenantWhatsappOperationalMonitorAnalyticsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly whatsappOperationalMonitorRunRepository: WhatsappOperationalMonitorRunRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    limit?: number | null,
  ): Promise<TenantWhatsappOperationalMonitorAnalyticsView> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const runs = await this.whatsappOperationalMonitorRunRepository.findByTenantId(
      tenant.id,
      limit ?? 50,
    );

    const orderedRuns = [...runs].sort(
      (left, right) => right.generatedAt.getTime() - left.generatedAt.getTime(),
    );
    const latestRun = orderedRuns[0] ?? null;

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      runCount: orderedRuns.length,
      windowStartAt:
        orderedRuns.length > 0
          ? orderedRuns[orderedRuns.length - 1].generatedAt
          : null,
      windowEndAt: latestRun?.generatedAt ?? null,
      latestOverallStatus: latestRun?.overallStatus ?? null,
      statusCounts: this.buildStatusCounts(orderedRuns),
      triggerSourceCounts: this.buildTriggerSourceCounts(orderedRuns),
      alertFrequency: this.buildAlertFrequency(orderedRuns),
      thresholdCalibration: this.buildThresholdCalibration(orderedRuns),
    };
  }

  private buildStatusCounts(runs: any[]): {
    healthy: number;
    warning: number;
    critical: number;
  } {
    return runs.reduce(
      (summary, run) => {
        summary[run.overallStatus] += 1;
        return summary;
      },
      {
        healthy: 0,
        warning: 0,
        critical: 0,
      },
    );
  }

  private buildTriggerSourceCounts(runs: any[]): {
    manual: number;
    scheduler: number;
  } {
    return runs.reduce(
      (summary, run) => {
        summary[run.triggerSource] += 1;
        return summary;
      },
      {
        manual: 0,
        scheduler: 0,
      },
    );
  }

  private buildAlertFrequency(
    runs: any[],
  ): TenantWhatsappOperationalAlertFrequencyView[] {
    const frequency = new Map<string, TenantWhatsappOperationalAlertFrequencyView>();

    for (const run of runs) {
      for (const alert of run.operationalAlerts) {
        const current = frequency.get(alert.key);

        if (!current) {
          frequency.set(alert.key, {
            alertKey: alert.key,
            title: alert.title,
            severity: alert.severity,
            occurrenceCount: 1,
            lastSeenAt: run.generatedAt,
          });
          continue;
        }

        current.occurrenceCount += 1;
        if (run.generatedAt.getTime() > current.lastSeenAt.getTime()) {
          current.lastSeenAt = run.generatedAt;
          current.title = alert.title;
          current.severity = alert.severity;
        }
      }
    }

    return [...frequency.values()].sort(
      (left, right) =>
        right.occurrenceCount - left.occurrenceCount ||
        right.lastSeenAt.getTime() - left.lastSeenAt.getTime(),
    );
  }

  private buildThresholdCalibration(
    runs: any[],
  ): TenantWhatsappOperationalThresholdCalibrationView[] {
    if (runs.length === 0) {
      return [];
    }

    return THRESHOLD_SERIES.map((series) => {
      const observedValues = runs
        .map((run) => series.observedValueSelector(run))
        .filter((value) => Number.isFinite(value))
        .sort((left, right) => left - right);
      const latestRun = runs[0];
      const currentValue = series.currentValueSelector(latestRun);
      const p50Observed = percentile(observedValues, 0.5);
      const p95Observed = percentile(observedValues, 0.95);
      const maxObserved = observedValues[observedValues.length - 1] ?? 0;
      const recommendedValue = this.recommendThresholdValue(
        series.thresholdUnit,
        currentValue,
        p95Observed,
      );
      const direction =
        recommendedValue > currentValue
          ? 'raise'
          : recommendedValue < currentValue
            ? 'lower'
            : 'keep';

      return {
        thresholdKey: series.thresholdKey,
        thresholdUnit: series.thresholdUnit,
        sampleCount: observedValues.length,
        currentValue,
        recommendedValue,
        p50Observed,
        p95Observed,
        maxObserved,
        direction,
        confidence:
          observedValues.length >= 20
            ? 'high'
            : observedValues.length >= 8
              ? 'medium'
              : 'low',
        rationale:
          direction === 'keep'
            ? 'La señal histórica está alineada con el threshold actual.'
            : direction === 'raise'
              ? 'El percentil alto observado supera el threshold actual; conviene subirlo para reducir ruido operativo.'
              : 'El percentil alto observado cae muy por debajo del threshold actual; conviene bajarlo para detectar antes el desgaste.',
      };
    });
  }

  private recommendThresholdValue(
    unit: 'rate' | 'count',
    currentValue: number,
    p95Observed: number,
  ): number {
    if (unit === 'rate') {
      const recommended = roundRate(Math.max(0.005, p95Observed * 1.15));
      return recommended;
    }

    return Math.max(1, Math.ceil(p95Observed));
  }
}

function percentile(values: number[], ratio: number): number {
  if (values.length === 0) {
    return 0;
  }

  const index = Math.min(
    values.length - 1,
    Math.max(0, Math.ceil(values.length * ratio) - 1),
  );
  return values[index] ?? values[values.length - 1] ?? 0;
}

function roundRate(value: number): number {
  return Math.round(value * 1000) / 1000;
}
