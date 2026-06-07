import { TenantAccountingOpeningBalanceControlRegistryView } from '@saas-platform/accounting-domain';
import { AccountingJournalEntryRepository } from '../ports/accounting-journal-entry.repository';
import { RequestTenantAccountingOpeningBalanceApprovalPacketUseCase } from './request-tenant-accounting-opening-balance-approval-packet.use-case';

export class GetTenantAccountingOpeningBalanceControlRegistryUseCase {
  constructor(
    private readonly requestTenantAccountingOpeningBalanceApprovalPacketUseCase: RequestTenantAccountingOpeningBalanceApprovalPacketUseCase,
    private readonly accountingJournalEntryRepository: AccountingJournalEntryRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingOpeningBalanceControlRegistryView> {
    const [approvalPacket, entries] = await Promise.all([
      this.requestTenantAccountingOpeningBalanceApprovalPacketUseCase.execute({
        ...input,
        decision: 'prepare',
      }),
      this.accountingJournalEntryRepository.listByPeriod(input),
    ]);
    const materializedJournalEntries = entries.filter(
      (entry) =>
        entry.source === 'accounting_opening_balance' &&
        entry.status !== 'voided',
    );
    const controls: TenantAccountingOpeningBalanceControlRegistryView['controls'] =
      [
        {
          controlKey: `opening-approval:${input.period}`,
          eventType:
            approvalPacket.approvalStatus === 'approved'
              ? 'approval_approved'
              : approvalPacket.approvalStatus === 'blocked'
                ? 'approval_rejected'
                : 'approval_prepared',
          status:
            approvalPacket.approvalStatus === 'blocked'
              ? 'blocked'
              : approvalPacket.approvalStatus === 'needs_review'
                ? 'needs_review'
                : 'ready',
          actorEmail: approvalPacket.reviewerEmail,
          occurredAt: approvalPacket.generatedAt,
          evidenceReference: approvalPacket.evidenceReference,
          summary: `${approvalPacket.summary.approvedLineCount}/${approvalPacket.summary.lineCount} saldos aprobados.`,
        },
        ...materializedJournalEntries.map((entry) => ({
          controlKey: `opening-journal:${entry.id}`,
          eventType: 'journal_materialized' as const,
          status: 'ready' as const,
          actorEmail: entry.approvedByEmail,
          occurredAt: entry.approvedAt ?? entry.createdAt,
          evidenceReference: entry.sourceApprovalPacketKey,
          summary: `${entry.lines.length} lineas materializadas en journal registry.`,
        })),
      ];
    const blockers = [
      ...approvalPacket.blockers,
      ...(materializedJournalEntries.length === 0
        ? ['accounting.opening_balance_control.not_materialized']
        : []),
    ];
    const registryStatus =
      blockers.length > 0
        ? 'blocked'
        : materializedJournalEntries.length > 0
          ? 'ready'
          : approvalPacket.approvalStatus === 'ready_for_approval'
            ? 'needs_review'
            : 'empty';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      registryStatus,
      latestControl: controls[controls.length - 1] ?? null,
      controls,
      approvalPacket,
      materializedJournalEntries,
      summary: {
        controlCount: controls.length,
        approvedControlCount: controls.filter(
          (control) => control.status === 'ready',
        ).length,
        materializedEntryCount: materializedJournalEntries.length,
        openingLineCount: approvalPacket.workspace.balanceLines.length,
        blockedLineCount: approvalPacket.summary.blockedLineCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        registryStatus === 'ready'
          ? 'Usar apertura materializada como base del cierre contable.'
          : 'Aprobar y materializar saldos iniciales antes de certificar cierre.',
      guardrails: [
        'Registry operacional derivado del approval packet y journal registry.',
        'No certifica saldos historicos ni reemplaza revision profesional.',
        'La materializacion oficial sigue siendo un asiento interno revisable.',
      ],
    };
  }
}
