import {
  TenantAccountingJournalEntryCreationResultView,
  TenantAccountingJournalEntryView,
} from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingJournalEntryRepository } from '../ports/accounting-journal-entry.repository';
import { AccountingJournalEntryIdGenerator } from '../ports/id-generators';
import { RequestTenantAccountingJournalDraftApprovalPacketUseCase } from './request-tenant-accounting-journal-draft-approval-packet.use-case';

export class CreateTenantAccountingJournalEntriesFromApprovalUseCase {
  constructor(
    private readonly requestTenantAccountingJournalDraftApprovalPacketUseCase: RequestTenantAccountingJournalDraftApprovalPacketUseCase,
    private readonly accountingJournalEntryRepository: AccountingJournalEntryRepository,
    private readonly accountingJournalEntryIdGenerator: AccountingJournalEntryIdGenerator,
    private readonly tenantRepository: TenantRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    draftEntryKeys?: string[];
    reviewerUserId?: string | null;
    reviewerEmail?: string | null;
    note?: string | null;
  }): Promise<TenantAccountingJournalEntryCreationResultView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const approvalPacket =
      await this.requestTenantAccountingJournalDraftApprovalPacketUseCase.execute(
        {
          tenantSlug: input.tenantSlug,
          period: input.period,
          year: input.year,
          draftEntryKeys: input.draftEntryKeys,
          decision: 'approve',
          reviewerUserId: input.reviewerUserId ?? null,
          reviewerEmail: input.reviewerEmail ?? null,
          note: input.note ?? null,
        },
      );

    if (approvalPacket.approvalStatus !== 'approved_for_posting') {
      return {
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        generatedAt: this.nowProvider(),
        creationStatus: 'blocked',
        createdEntries: [],
        approvalStatus: approvalPacket.approvalStatus,
        summary: {
          requestedDraftEntryCount:
            approvalPacket.summary.requestedDraftEntryCount,
          createdEntryCount: 0,
          blockedDraftEntryCount:
            approvalPacket.summary.blockedDraftEntryCount,
          totalDebitInCents: 0,
          totalCreditInCents: 0,
        },
        blockers: [...approvalPacket.blockers],
        nextStep: 'Resolver approval packet antes de guardar journals internos.',
        guardrails: buildGuardrails(),
      };
    }

    const sourceApprovalPacketKey = `approval:${input.tenantSlug}:${input.period}:${approvalPacket.generatedAt.toISOString()}`;
    const createdEntries: TenantAccountingJournalEntryView[] = [];

    for (const draftEntry of approvalPacket.draftEntries) {
      const entry = await this.accountingJournalEntryRepository.save({
        id: this.accountingJournalEntryIdGenerator.nextId(),
        tenantId: tenant.id,
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        source: 'accounting_journal_draft_approval_packet',
        status: 'approved',
        label: draftEntry.label,
        currency: draftEntry.currency,
        lines: draftEntry.lines.map((line) => ({
          lineKey: line.lineKey,
          accountCode: line.accountCode ?? 'UNMAPPED',
          accountName: line.accountName ?? line.accountHint,
          debitInCents: line.debitInCents,
          creditInCents: line.creditInCents,
          sourceEntryKey: line.sourceEntryKey,
          accountHint: line.accountHint,
          notes: [...line.notes],
        })),
        approvalStatus: approvalPacket.approvalStatus,
        approvedByUserId: approvalPacket.reviewerUserId,
        approvedByEmail: approvalPacket.reviewerEmail,
        approvedAt: approvalPacket.generatedAt,
        sourceDraftEntryKey: draftEntry.draftEntryKey,
        sourceApprovalPacketKey,
        note: approvalPacket.note,
      });

      createdEntries.push(entry);
    }

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      creationStatus: 'created',
      createdEntries,
      approvalStatus: approvalPacket.approvalStatus,
      summary: {
        requestedDraftEntryCount: approvalPacket.summary.requestedDraftEntryCount,
        createdEntryCount: createdEntries.length,
        blockedDraftEntryCount: approvalPacket.summary.blockedDraftEntryCount,
        totalDebitInCents: createdEntries.reduce(
          (total, entry) => total + entry.totals.debitInCents,
          0,
        ),
        totalCreditInCents: createdEntries.reduce(
          (total, entry) => total + entry.totals.creditInCents,
          0,
        ),
      },
      blockers: [],
      nextStep:
        'Usar journal registry como fuente del ledger registry; el posteo oficial queda pendiente.',
      guardrails: buildGuardrails(),
    };
  }
}

function buildGuardrails(): string[] {
  return [
    'Journal registry interno: no es diario oficial ni mayor legal.',
    'Los entries guardados preservan approval humano, pero no ejecutan posteo contable formal.',
    'La anulacion, reverso y posteo definitivo requieren slices posteriores.',
  ];
}
