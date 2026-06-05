import { TenantAccountingAuditTrailWorkspaceView } from '@saas-platform/accounting-domain';
import { AccountingPeriodControlRepository } from '../ports/accounting-period-control.repository';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';

export class GetTenantAccountingAuditTrailWorkspaceUseCase {
  constructor(
    private readonly accountingPeriodControlRepository: AccountingPeriodControlRepository,
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingAuditTrailWorkspaceView> {
    const [journalRegistry, controls] = await Promise.all([
      this.listTenantAccountingJournalRegistryUseCase.execute(input),
      this.accountingPeriodControlRepository.listByPeriod(input),
    ]);
    const journalEvents: TenantAccountingAuditTrailWorkspaceView['timeline'] =
      journalRegistry.entries.map((entry) => ({
        eventKey: `journal:${entry.id}`,
        eventType: entry.source === 'accounting_adjustment'
          ? 'adjusting_journal_entry_created'
          : 'journal_entry_created',
        source: 'journal_registry',
        status: entry.status,
        actorEmail: entry.approvedByEmail,
        occurredAt: entry.createdAt,
        summary: `${entry.label}: ${entry.totals.debitInCents}/${entry.totals.creditInCents}`,
        metadata: {
          journalEntryId: entry.id,
          source: entry.source,
          balanced: entry.totals.balanced,
          debitInCents: entry.totals.debitInCents,
          creditInCents: entry.totals.creditInCents,
        },
      }));
    const controlEvents: TenantAccountingAuditTrailWorkspaceView['timeline'] =
      controls.map((control) => ({
        eventKey: `control:${control.id}`,
        eventType: `period_${control.action}`,
        source: 'period_control',
        status: control.status,
        actorEmail: control.actionByEmail,
        occurredAt: control.actionAt,
        summary: control.reason ?? control.action,
        metadata: {
          controlId: control.id,
          action: control.action,
          evidenceReference: control.evidenceReference,
          blockerCount: control.blockers.length,
        },
      }));
    const timeline = [...journalEvents, ...controlEvents].sort(
      (left, right) => left.occurredAt.getTime() - right.occurredAt.getTime(),
    );
    const blockers = [
      ...journalRegistry.blockers,
      ...(timeline.length === 0 ? ['accounting.audit_trail.empty'] : []),
    ];
    const auditStatus =
      timeline.length === 0
        ? 'empty'
        : blockers.length > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      auditStatus,
      timeline,
      summary: {
        eventCount: timeline.length,
        journalEventCount: journalEvents.length,
        controlEventCount: controlEvents.length,
        lockedCount: controls.filter((control) => control.action === 'locked')
          .length,
        reopenedCount: controls.filter((control) => control.action === 'reopened')
          .length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        auditStatus === 'ready'
          ? 'Usar audit trail como bitacora del cierre interno.'
          : 'Generar journals o controles de periodo para completar la bitacora.',
      guardrails: [
        'Audit trail consolida eventos internos disponibles; no es auditoria externa certificada.',
        'No modifica journal entries ni controles de periodo.',
        'Debe conservarse junto a evidencia fuente y revisiones profesionales.',
      ],
    };
  }
}
