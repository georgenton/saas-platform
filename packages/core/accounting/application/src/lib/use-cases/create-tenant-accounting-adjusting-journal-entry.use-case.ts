import {
  TenantAccountingAdjustingJournalEntryCreationResultView,
  TenantAccountingJournalEntryView,
} from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingJournalEntryRepository } from '../ports/accounting-journal-entry.repository';
import { AccountingJournalEntryIdGenerator } from '../ports/id-generators';

export class CreateTenantAccountingAdjustingJournalEntryUseCase {
  constructor(
    private readonly accountingJournalEntryRepository: AccountingJournalEntryRepository,
    private readonly accountingJournalEntryIdGenerator: AccountingJournalEntryIdGenerator,
    private readonly tenantRepository: TenantRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    adjustmentType: TenantAccountingAdjustingJournalEntryCreationResultView['adjustmentType'];
    label: string;
    currency?: string | null;
    lines: TenantAccountingJournalEntryView['lines'];
    reviewerUserId?: string | null;
    reviewerEmail?: string | null;
    note?: string | null;
  }): Promise<TenantAccountingAdjustingJournalEntryCreationResultView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const totalDebitInCents = input.lines.reduce(
      (total, line) => total + line.debitInCents,
      0,
    );
    const totalCreditInCents = input.lines.reduce(
      (total, line) => total + line.creditInCents,
      0,
    );
    const blockers = [
      ...(input.lines.length < 2
        ? ['accounting.adjusting_entry.minimum_two_lines']
        : []),
      ...(totalDebitInCents !== totalCreditInCents
        ? ['accounting.adjusting_entry.unbalanced']
        : []),
      ...input.lines.flatMap((line, index) => {
        const missing = [];

        if (!line.accountCode || !line.accountName) {
          missing.push(`accounting.adjusting_entry.line_${index + 1}.missing_account`);
        }

        if (line.debitInCents < 0 || line.creditInCents < 0) {
          missing.push(`accounting.adjusting_entry.line_${index + 1}.negative_amount`);
        }

        if (line.debitInCents > 0 && line.creditInCents > 0) {
          missing.push(`accounting.adjusting_entry.line_${index + 1}.double_sided`);
        }

        return missing;
      }),
    ];

    if (blockers.length > 0) {
      return {
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        generatedAt: this.nowProvider(),
        creationStatus: 'blocked',
        createdEntry: null,
        adjustmentType: input.adjustmentType,
        summary: {
          lineCount: input.lines.length,
          totalDebitInCents,
          totalCreditInCents,
          balanced: totalDebitInCents === totalCreditInCents,
        },
        blockers: [...new Set(blockers)],
        nextStep: 'Corregir el asiento de ajuste antes de guardarlo.',
        guardrails: buildGuardrails(),
      };
    }

    const now = this.nowProvider();
    const createdEntry = await this.accountingJournalEntryRepository.save({
      id: this.accountingJournalEntryIdGenerator.nextId(),
      tenantId: tenant.id,
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      source: 'accounting_adjustment',
      status: 'approved',
      label: input.label,
      currency: input.currency ?? 'USD',
      lines: input.lines,
      approvalStatus: 'approved_for_posting',
      approvedByUserId: input.reviewerUserId ?? null,
      approvedByEmail: input.reviewerEmail ?? null,
      approvedAt: now,
      sourceDraftEntryKey: null,
      sourceApprovalPacketKey: `adjustment:${input.tenantSlug}:${input.period}:${now.getTime()}`,
      note: input.note ?? null,
    });

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: now,
      creationStatus: 'created',
      createdEntry,
      adjustmentType: input.adjustmentType,
      summary: {
        lineCount: input.lines.length,
        totalDebitInCents,
        totalCreditInCents,
        balanced: true,
      },
      blockers: [],
      nextStep: 'Recalcular ledger registry, trial balance y closeout readiness.',
      guardrails: buildGuardrails(),
    };
  }
}

function buildGuardrails(): string[] {
  return [
    'Ajuste contable interno; no es posteo legal automatico.',
    'Solo guarda asientos balanceados y aprobados por un humano.',
    'Debe revisarse contra evidencia fuente antes de cierre formal.',
  ];
}
