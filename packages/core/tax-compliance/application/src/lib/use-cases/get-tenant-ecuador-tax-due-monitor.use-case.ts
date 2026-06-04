import {
  EcuadorTaxDueMonitorView,
  EcuadorTaxReviewPriority,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase } from './get-tenant-ecuador-tax-calendar-review-workspace.use-case';

export class GetTenantEcuadorTaxDueMonitorUseCase {
  constructor(
    private readonly getTenantEcuadorTaxCalendarReviewWorkspaceUseCase: GetTenantEcuadorTaxCalendarReviewWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    year: number;
    asOfDate?: string;
    windowDays?: number;
  }): Promise<EcuadorTaxDueMonitorView> {
    const windowDays = input.windowDays ?? 15;
    const workspace =
      await this.getTenantEcuadorTaxCalendarReviewWorkspaceUseCase.execute(
        input.tenantSlug,
        input.year,
        input.asOfDate,
      );

    const alerts = workspace.priorityEntries
      .filter(
        (entry) =>
          entry.dueStatus === 'overdue' ||
          entry.dueStatus === 'unscheduled' ||
          (entry.daysUntilDue !== null && entry.daysUntilDue <= windowDays),
      )
      .map((entry) => ({
        obligationKey: entry.obligationKey,
        label: entry.label,
        period: entry.period,
        dueDate: entry.dueDate,
        dueStatus: entry.dueStatus,
        daysUntilDue: entry.daysUntilDue,
        severity: entry.reviewPriority,
        message: buildAlertMessage(entry.reviewPriority, entry.label, entry.period),
      }));

    return {
      tenantSlug: input.tenantSlug,
      year: input.year,
      generatedAt: this.nowProvider(),
      asOfDate: workspace.asOfDate,
      windowDays,
      alerts,
      summary: {
        overdueCount: alerts.filter((alert) => alert.dueStatus === 'overdue')
          .length,
        dueSoonCount: alerts.filter((alert) => alert.dueStatus === 'due_soon')
          .length,
        unscheduledCount: alerts.filter(
          (alert) => alert.dueStatus === 'unscheduled',
        ).length,
      },
      guardrails: [
        ...workspace.guardrails,
        'El monitor solo alerta obligaciones derivadas del calendario operacional actual.',
      ],
    };
  }
}

function buildAlertMessage(
  severity: EcuadorTaxReviewPriority,
  label: string,
  period: string,
): string {
  if (severity === 'critical') {
    return `${label} ${period} requiere atencion critica antes de continuar.`;
  }

  if (severity === 'high') {
    return `${label} ${period} debe revisarse dentro de la ventana operativa.`;
  }

  return `${label} ${period} esta en monitoreo operativo.`;
}
