import {
  TenantAccountingJournalEntryView,
  TenantAccountingOpeningBalanceJournalMaterializationView,
} from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingJournalEntryRepository } from '../ports/accounting-journal-entry.repository';
import { AccountingJournalEntryIdGenerator } from '../ports/id-generators';
import { RequestTenantAccountingOpeningBalanceApprovalPacketUseCase } from './request-tenant-accounting-opening-balance-approval-packet.use-case';

const OPENING_BALANCE_SOURCE = 'accounting_opening_balance';

export class CreateTenantAccountingOpeningBalanceJournalEntryUseCase {
  constructor(
    private readonly requestTenantAccountingOpeningBalanceApprovalPacketUseCase: RequestTenantAccountingOpeningBalanceApprovalPacketUseCase,
    private readonly accountingJournalEntryRepository: AccountingJournalEntryRepository,
    private readonly accountingJournalEntryIdGenerator: AccountingJournalEntryIdGenerator,
    private readonly tenantRepository: TenantRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    reviewerUserId?: string | null;
    reviewerEmail?: string | null;
    note?: string | null;
    evidenceReference?: string | null;
  }): Promise<TenantAccountingOpeningBalanceJournalMaterializationView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const [approvalPacket, existingPeriodEntries] = await Promise.all([
      this.requestTenantAccountingOpeningBalanceApprovalPacketUseCase.execute({
        ...input,
        decision: 'approve',
      }),
      this.accountingJournalEntryRepository.listByPeriod({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
      }),
    ]);
    const existingEntries = existingPeriodEntries.filter(
      (entry) =>
        entry.source === OPENING_BALANCE_SOURCE && entry.status !== 'voided',
    );
    const now = this.nowProvider();
    const blockers = [
      ...approvalPacket.blockers,
      ...(approvalPacket.approvalStatus === 'approved'
        ? []
        : ['accounting.opening_balance_materialization.approval_required']),
    ];

    if (existingEntries.length > 0) {
      return result({
        input,
        generatedAt: now,
        materializationStatus: 'already_materialized',
        approvalPacket,
        createdEntry: null,
        existingEntries,
        blockers: [],
        nextStep:
          'Usar el asiento de apertura existente; evita duplicar saldos iniciales.',
      });
    }

    if (blockers.length > 0 || !approvalPacket.workspace.suggestedAdjustment) {
      return result({
        input,
        generatedAt: now,
        materializationStatus: 'blocked',
        approvalPacket,
        createdEntry: null,
        existingEntries,
        blockers:
          approvalPacket.workspace.suggestedAdjustment === null
            ? [
                ...blockers,
                'accounting.opening_balance_materialization.no_suggested_adjustment',
              ]
            : blockers,
        nextStep:
          'Resolver approval packet antes de crear el asiento de apertura.',
      });
    }

    const adjustment = approvalPacket.workspace.suggestedAdjustment;
    const createdEntry = await this.accountingJournalEntryRepository.save({
      id: this.accountingJournalEntryIdGenerator.nextId(),
      tenantId: tenant.id,
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      source: OPENING_BALANCE_SOURCE,
      status: 'approved',
      label: adjustment.label,
      currency: adjustment.currency,
      lines: adjustment.lines.map((line) => ({
        ...line,
        notes: [...line.notes, 'Materializado desde opening balance approval.'],
      })),
      approvalStatus: approvalPacket.approvalStatus,
      approvedByUserId: approvalPacket.reviewerUserId,
      approvedByEmail: approvalPacket.reviewerEmail,
      approvedAt: approvalPacket.generatedAt,
      sourceDraftEntryKey: adjustment.adjustmentKey,
      sourceApprovalPacketKey: `opening-balance:${input.tenantSlug}:${input.period}:${approvalPacket.generatedAt.getTime()}`,
      note: approvalPacket.note,
    });

    return result({
      input,
      generatedAt: now,
      materializationStatus: 'created',
      approvalPacket,
      createdEntry,
      existingEntries: [],
      blockers: [],
      nextStep: 'Recalcular ledger registry y trial balance con apertura.',
    });
  }
}

function result(params: {
  input: {
    tenantSlug: string;
    period: string;
    year: number;
  };
  generatedAt: Date;
  materializationStatus: TenantAccountingOpeningBalanceJournalMaterializationView['materializationStatus'];
  approvalPacket: TenantAccountingOpeningBalanceJournalMaterializationView['approvalPacket'];
  createdEntry: TenantAccountingJournalEntryView | null;
  existingEntries: TenantAccountingJournalEntryView[];
  blockers: string[];
  nextStep: string;
}): TenantAccountingOpeningBalanceJournalMaterializationView {
  const entry = params.createdEntry ?? params.existingEntries[0] ?? null;
  const lineCount =
    entry?.lines.length ?? params.approvalPacket.workspace.balanceLines.length;
  const totalDebitInCents =
    entry?.totals.debitInCents ??
    params.approvalPacket.summary.totalDebitInCents;
  const totalCreditInCents =
    entry?.totals.creditInCents ??
    params.approvalPacket.summary.totalCreditInCents;

  return {
    tenantSlug: params.input.tenantSlug,
    period: params.input.period,
    year: params.input.year,
    generatedAt: params.generatedAt,
    materializationStatus: params.materializationStatus,
    approvalPacket: params.approvalPacket,
    createdEntry: params.createdEntry,
    existingEntries: params.existingEntries,
    summary: {
      createdEntryCount: params.createdEntry ? 1 : 0,
      existingEntryCount: params.existingEntries.length,
      lineCount,
      totalDebitInCents,
      totalCreditInCents,
    },
    blockers: [...new Set(params.blockers)],
    nextStep: params.nextStep,
    guardrails: [
      'Asiento de apertura interno; no es migracion contable certificada.',
      'Evita duplicados por periodo mientras el entry existente no este voided.',
      'Debe revisarse contra el contador antes de cierre profesional.',
    ],
  };
}
