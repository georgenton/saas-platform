import { TenantAccountingBankReconciliationControlRegistryView } from '@saas-platform/accounting-domain';
import { AccountingBankReconciliationControlRepository } from '../ports/accounting-bank-reconciliation-control.repository';

export class ListTenantAccountingBankReconciliationControlRegistryUseCase {
  constructor(
    private readonly accountingBankReconciliationControlRepository: AccountingBankReconciliationControlRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingBankReconciliationControlRegistryView> {
    const controls =
      await this.accountingBankReconciliationControlRepository.listByPeriod(input);
    const blockers = controls.flatMap((control) => control.blockers);
    const blockedControlCount = controls.filter(
      (control) => control.status === 'blocked',
    ).length;
    const needsReviewControlCount = controls.filter(
      (control) => control.status === 'needs_review',
    ).length;
    const registryStatus =
      controls.length === 0
        ? 'empty'
        : blockedControlCount > 0
          ? 'blocked'
          : needsReviewControlCount > 0 || blockers.length > 0
            ? 'needs_review'
            : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      registryStatus,
      controls,
      latestControl: controls.at(-1) ?? null,
      summary: {
        controlCount: controls.length,
        matchApprovedCount: controls.filter(
          (control) => control.eventType === 'match_packet_approved',
        ).length,
        exceptionPacketCount: controls.filter(
          (control) => control.eventType === 'exception_packet_requested',
        ).length,
        exceptionResolvedCount: controls.filter(
          (control) => control.eventType === 'exception_resolved',
        ).length,
        blockedControlCount,
        needsReviewControlCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        registryStatus === 'ready'
          ? 'Usar control registry como evidencia de cash closeout.'
          : registryStatus === 'empty'
            ? 'Registrar controles de match o excepciones de conciliacion.'
            : 'Resolver controles bancarios pendientes antes del lock.',
      guardrails: [
        'Registry de controles operacionales de conciliacion bancaria.',
        'No modifica extractos, journals ni saldos.',
        'Los controles soportan auditoria interna, no cierre legal.',
      ],
    };
  }
}
