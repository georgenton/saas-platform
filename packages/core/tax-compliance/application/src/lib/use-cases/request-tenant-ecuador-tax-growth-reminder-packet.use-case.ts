import { EcuadorTaxGrowthReminderPacketView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDueMonitorUseCase } from './get-tenant-ecuador-tax-due-monitor.use-case';

export class RequestTenantEcuadorTaxGrowthReminderPacketUseCase {
  constructor(
    private readonly getTenantEcuadorTaxDueMonitorUseCase: GetTenantEcuadorTaxDueMonitorUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    year: number;
    asOfDate?: string;
    windowDays?: number;
  }): Promise<EcuadorTaxGrowthReminderPacketView> {
    const monitor = await this.getTenantEcuadorTaxDueMonitorUseCase.execute({
      tenantSlug: input.tenantSlug,
      year: input.year,
      asOfDate: input.asOfDate,
      windowDays: input.windowDays,
    });
    const reminders = monitor.alerts
      .filter((alert) => alert.dueStatus === 'overdue' || alert.dueStatus === 'due_soon')
      .map((alert) => ({
        key: `tax_due_${alert.obligationKey}_${alert.period}`,
        obligationKey: alert.obligationKey,
        period: alert.period,
        dueDate: alert.dueDate,
        severity:
          alert.severity === 'critical'
            ? ('critical' as const)
            : alert.dueStatus === 'overdue'
              ? ('high' as const)
              : ('normal' as const),
        channel: 'whatsapp' as const,
        suggestedMessage: buildMessage(alert.label, alert.period, alert.dueDate),
        owner: 'operator' as const,
        source: 'tax_due_monitor',
      }));
    const readinessStatus =
      reminders.some((reminder) => reminder.severity === 'critical')
        ? 'blocked'
        : reminders.length > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      year: input.year,
      generatedAt: this.nowProvider(),
      asOfDate: monitor.asOfDate,
      readinessStatus,
      reminders,
      summary: {
        reminderCount: reminders.length,
        overdueCount: monitor.summary.overdueCount,
        dueSoonCount: monitor.summary.dueSoonCount,
      },
      targetWorkspace: {
        productKey: 'growth',
        handoffMode: 'operator_assist',
      },
      nextStep:
        reminders.length > 0
          ? 'Enviar recordatorios tributarios asistidos desde Growth o seguimiento manual.'
          : 'No hay vencimientos tributarios urgentes para Growth.',
      guardrails: [
        'Packet de recordatorio: no envia mensajes automaticamente.',
        'Confirmar calendario SRI y responsabilidad humana antes de contactar clientes o equipo contable.',
      ],
    };
  }
}

function buildMessage(label: string, period: string, dueDate: string | null): string {
  const due = dueDate ? ` con vencimiento ${dueDate}` : '';

  return `Recordatorio tributario: ${label} del periodo ${period}${due}. Revisemos evidencia y responsable antes de presentar.`;
}
