import {
  TenantWhatsappOperationalAlertFrequencyView,
  TenantWhatsappOperationalMonitorAnalyticsView,
  TenantWhatsappOperationalThresholdCalibrationView,
} from '@saas-platform/growth-application';

export interface WhatsappOperationalAlertFrequencyResponseDto {
  alertKey: string;
  title: string;
  severity: 'warning' | 'critical';
  occurrenceCount: number;
  lastSeenAt: string;
}

export interface WhatsappOperationalThresholdCalibrationResponseDto {
  thresholdKey: string;
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

export interface WhatsappOperationalMonitorAnalyticsResponseDto {
  tenantSlug: string;
  generatedAt: string;
  runCount: number;
  windowStartAt: string | null;
  windowEndAt: string | null;
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
  alertFrequency: WhatsappOperationalAlertFrequencyResponseDto[];
  thresholdCalibration: WhatsappOperationalThresholdCalibrationResponseDto[];
}

const toAlertFrequencyResponseDto = (
  view: TenantWhatsappOperationalAlertFrequencyView,
): WhatsappOperationalAlertFrequencyResponseDto => ({
  alertKey: view.alertKey,
  title: view.title,
  severity: view.severity,
  occurrenceCount: view.occurrenceCount,
  lastSeenAt: view.lastSeenAt.toISOString(),
});

const toThresholdCalibrationResponseDto = (
  view: TenantWhatsappOperationalThresholdCalibrationView,
): WhatsappOperationalThresholdCalibrationResponseDto => ({
  thresholdKey: view.thresholdKey,
  thresholdUnit: view.thresholdUnit,
  sampleCount: view.sampleCount,
  currentValue: view.currentValue,
  recommendedValue: view.recommendedValue,
  p50Observed: view.p50Observed,
  p95Observed: view.p95Observed,
  maxObserved: view.maxObserved,
  direction: view.direction,
  confidence: view.confidence,
  rationale: view.rationale,
});

export const toWhatsappOperationalMonitorAnalyticsResponseDto = (
  view: TenantWhatsappOperationalMonitorAnalyticsView,
): WhatsappOperationalMonitorAnalyticsResponseDto => ({
  tenantSlug: view.tenantSlug,
  generatedAt: view.generatedAt.toISOString(),
  runCount: view.runCount,
  windowStartAt: view.windowStartAt?.toISOString() ?? null,
  windowEndAt: view.windowEndAt?.toISOString() ?? null,
  latestOverallStatus: view.latestOverallStatus,
  statusCounts: { ...view.statusCounts },
  triggerSourceCounts: { ...view.triggerSourceCounts },
  alertFrequency: view.alertFrequency.map(toAlertFrequencyResponseDto),
  thresholdCalibration: view.thresholdCalibration.map(
    toThresholdCalibrationResponseDto,
  ),
});
