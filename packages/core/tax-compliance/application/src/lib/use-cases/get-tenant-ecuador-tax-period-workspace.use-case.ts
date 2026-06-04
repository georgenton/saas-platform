import {
  EcuadorTaxPeriodWorkspaceStatus,
  EcuadorTaxPeriodWorkspaceView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDueMonitorUseCase } from './get-tenant-ecuador-tax-due-monitor.use-case';
import { GetTenantEcuadorTaxObligationCalendarUseCase } from './get-tenant-ecuador-tax-obligation-calendar.use-case';
import { RequestTenantEcuadorTaxDeclarationDraftPacketUseCase } from './request-tenant-ecuador-tax-declaration-draft-packet.use-case';
import { RequestTenantEcuadorTaxPeriodPreparationPacketUseCase } from './request-tenant-ecuador-tax-period-preparation-packet.use-case';
import { RequestTenantEcuadorTaxSalesBookUseCase } from './request-tenant-ecuador-tax-sales-book.use-case';

export class GetTenantEcuadorTaxPeriodWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationCalendarUseCase: GetTenantEcuadorTaxObligationCalendarUseCase,
    private readonly getTenantEcuadorTaxDueMonitorUseCase: GetTenantEcuadorTaxDueMonitorUseCase,
    private readonly requestTenantEcuadorTaxPeriodPreparationPacketUseCase: RequestTenantEcuadorTaxPeriodPreparationPacketUseCase,
    private readonly requestTenantEcuadorTaxDeclarationDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationDraftPacketUseCase,
    private readonly requestTenantEcuadorTaxSalesBookUseCase: RequestTenantEcuadorTaxSalesBookUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    asOfDate?: string;
  }): Promise<EcuadorTaxPeriodWorkspaceView> {
    const [calendar, dueMonitor, preparationPacket, declarationDraftPacket, salesBook] =
      await Promise.all([
        this.getTenantEcuadorTaxObligationCalendarUseCase.execute(
          input.tenantSlug,
          input.year,
        ),
        this.getTenantEcuadorTaxDueMonitorUseCase.execute({
          tenantSlug: input.tenantSlug,
          year: input.year,
          asOfDate: input.asOfDate,
        }),
        this.requestTenantEcuadorTaxPeriodPreparationPacketUseCase.execute(
          input.tenantSlug,
          input.period,
        ),
        this.requestTenantEcuadorTaxDeclarationDraftPacketUseCase.execute({
          tenantSlug: input.tenantSlug,
          period: input.period,
          year: input.year,
        }),
        this.requestTenantEcuadorTaxSalesBookUseCase.execute({
          tenantSlug: input.tenantSlug,
          period: input.period,
          year: input.year,
          recordEvent: false,
        }),
      ]);
    const calendarEntries = calendar.entries.filter(
      (entry) =>
        entry.period === input.period ||
        input.period.startsWith(entry.period) ||
        entry.period === String(input.year),
    );
    const blockers = [
      ...preparationPacket.blockedBy,
      ...declarationDraftPacket.declarationSections.flatMap(
        (section) => section.blockers,
      ),
      ...salesBook.blockers,
    ];
    const status = resolveWorkspaceStatus({
      blockers,
      declarationReadiness: declarationDraftPacket.readinessStatus,
      accountantRequired: declarationDraftPacket.accountantReview.required,
    });

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      status,
      taxpayerProfile: preparationPacket.taxpayerProfile,
      calendarEntries,
      dueAlerts: dueMonitor.alerts.filter(
        (alert) =>
          alert.period === input.period ||
          input.period.startsWith(alert.period) ||
          alert.period === String(input.year),
      ),
      preparationPacket,
      declarationDraftPacket,
      salesBook,
      blockers: [...new Set(blockers)],
      nextActions: buildNextActions(status, declarationDraftPacket.nextStep),
      guardrails: [
        ...calendar.guardrails,
        ...dueMonitor.guardrails,
        'Este workspace consolida informacion derivada; no persiste aprobaciones ni presentaciones.',
      ],
    };
  }
}

function resolveWorkspaceStatus(input: {
  blockers: string[];
  declarationReadiness: 'ready' | 'needs_review' | 'blocked';
  accountantRequired: boolean;
}): EcuadorTaxPeriodWorkspaceStatus {
  if (input.blockers.length > 0 || input.declarationReadiness === 'blocked') {
    return 'blocked';
  }

  if (input.declarationReadiness === 'needs_review') {
    return 'needs_review';
  }

  return input.accountantRequired
    ? 'ready_for_accountant'
    : 'ready_for_declaration';
}

function buildNextActions(
  status: EcuadorTaxPeriodWorkspaceStatus,
  declarationNextStep: string,
): string[] {
  if (status === 'blocked') {
    return [
      'Resolver blockers fiscales y evidencia incompleta antes de avanzar.',
      declarationNextStep,
    ];
  }

  if (status === 'needs_review') {
    return [
      'Enviar workspace y borrador al contador para revision.',
      declarationNextStep,
    ];
  }

  if (status === 'ready_for_accountant') {
    return [
      'Solicitar aprobacion del contador antes de preparar declaracion final.',
    ];
  }

  return ['Preparar declaracion final manteniendo aprobacion humana.'];
}
