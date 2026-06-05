import {
  AccountingPeriodControlStatus,
  TenantAccountingPeriodLockRegistryView,
} from '@saas-platform/accounting-domain';
import { AccountingPeriodControlRepository } from '../ports/accounting-period-control.repository';
import { GetTenantAccountingPeriodLockReadinessUseCase } from './get-tenant-accounting-period-lock-readiness.use-case';

export class ListTenantAccountingPeriodLockRegistryUseCase {
  constructor(
    private readonly accountingPeriodControlRepository: AccountingPeriodControlRepository,
    private readonly getTenantAccountingPeriodLockReadinessUseCase: GetTenantAccountingPeriodLockReadinessUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingPeriodLockRegistryView> {
    const [controls, lockReadiness] = await Promise.all([
      this.accountingPeriodControlRepository.listByPeriod(input),
      this.getTenantAccountingPeriodLockReadinessUseCase.execute(input),
    ]);
    const latestControl = controls[controls.length - 1] ?? null;
    const registryStatus: AccountingPeriodControlStatus =
      latestControl?.status ??
      (lockReadiness.lockReadinessStatus === 'ready_to_lock'
        ? 'ready_to_lock'
        : 'open');
    const blockers = [
      ...lockReadiness.blockers,
      ...(registryStatus === 'locked'
        ? ['accounting.period_control.period_locked']
        : []),
    ];

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      registryStatus,
      latestControl,
      controls,
      lockReadiness,
      summary: {
        controlCount: controls.length,
        lockCount: controls.filter((control) => control.action === 'locked')
          .length,
        reopenCount: controls.filter((control) => control.action === 'reopened')
          .length,
        journalEntryCount: lockReadiness.summary.journalEntryCount,
        readyLockCheckCount: lockReadiness.summary.readyCheckCount,
        blockedLockCheckCount: lockReadiness.summary.blockedCheckCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        registryStatus === 'locked'
          ? 'Periodo bloqueado internamente; solicitar reopen para nuevos ajustes.'
          : lockReadiness.lockReadinessStatus === 'ready_to_lock'
            ? 'Registrar lock interno del periodo.'
            : 'Resolver readiness antes de bloquear el periodo.',
      guardrails: [
        'Lock registry es control interno de Accounting, no cierre legal de libros.',
        'No impide cambios externos fuera del modulo hasta que exista enforcement transversal.',
        'Cada lock/reopen conserva snapshot y checklist de impacto.',
      ],
    };
  }
}
