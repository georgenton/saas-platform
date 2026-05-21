import { Injectable } from '@nestjs/common';
import {
  CreateWhatsappOperationalMonitorRunCommand,
  WhatsappOperationalMonitorRunRecord,
  WhatsappOperationalMonitorRunRepository,
  WhatsappOperationalMonitorRunTriggerSource,
} from '@saas-platform/growth-application';
import { PrismaService } from '../prisma.service';

type MonitorRunRow = {
  id: string;
  tenantId: string;
  triggerSource: string;
  generatedAt: Date;
  autoRunReadyRetriesEnabled: boolean;
  overallStatus: 'healthy' | 'warning' | 'critical';
  totalAlertCount: number;
  criticalAlertCount: number;
  warningAlertCount: number;
  operationalThresholdsJson: string;
  operationalDashboardJson: string;
  operationalAlertsJson: string;
  retryRunnerExecuted: boolean;
  retryRunnerSummaryJson: string | null;
  createdAt: Date;
};

@Injectable()
export class PrismaWhatsappOperationalMonitorRunRepository
  implements WhatsappOperationalMonitorRunRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    command: CreateWhatsappOperationalMonitorRunCommand,
  ): Promise<WhatsappOperationalMonitorRunRecord> {
    const record = await this.delegate.create({
      data: {
        tenantId: command.tenantId,
        triggerSource: command.triggerSource,
        generatedAt: command.generatedAt,
        autoRunReadyRetriesEnabled: command.autoRunReadyRetriesEnabled,
        overallStatus: command.overallStatus,
        totalAlertCount: command.totalAlertCount,
        criticalAlertCount: command.criticalAlertCount,
        warningAlertCount: command.warningAlertCount,
        operationalThresholdsJson: JSON.stringify(command.operationalThresholds),
        operationalDashboardJson: JSON.stringify(command.operationalDashboard),
        operationalAlertsJson: JSON.stringify(command.operationalAlerts),
        retryRunnerExecuted: command.retryRunnerExecuted,
        retryRunnerSummaryJson: command.retryRunnerSummary
          ? JSON.stringify(command.retryRunnerSummary)
          : null,
      },
    });

    return this.toRecord(record as MonitorRunRow);
  }

  async findByTenantId(
    tenantId: string,
    limit?: number | null,
  ): Promise<WhatsappOperationalMonitorRunRecord[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantId,
      },
      orderBy: [{ generatedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit ?? 20,
    });

    return records.map((record) => this.toRecord(record as MonitorRunRow));
  }

  private toRecord(record: MonitorRunRow): WhatsappOperationalMonitorRunRecord {
    return {
      id: record.id,
      tenantId: record.tenantId,
      triggerSource:
        record.triggerSource as WhatsappOperationalMonitorRunTriggerSource,
      generatedAt: record.generatedAt,
      autoRunReadyRetriesEnabled: record.autoRunReadyRetriesEnabled,
      overallStatus: record.overallStatus,
      totalAlertCount: record.totalAlertCount,
      criticalAlertCount: record.criticalAlertCount,
      warningAlertCount: record.warningAlertCount,
      operationalThresholds: JSON.parse(record.operationalThresholdsJson),
      operationalDashboard: JSON.parse(record.operationalDashboardJson),
      operationalAlerts: JSON.parse(record.operationalAlertsJson),
      retryRunnerExecuted: record.retryRunnerExecuted,
      retryRunnerSummary: record.retryRunnerSummaryJson
        ? JSON.parse(record.retryRunnerSummaryJson)
        : null,
      createdAt: record.createdAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).whatsappOperationalMonitorRun;
  }
}
