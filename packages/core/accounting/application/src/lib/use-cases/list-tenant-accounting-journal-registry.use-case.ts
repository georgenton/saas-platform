import { TenantAccountingJournalRegistryView } from '@saas-platform/accounting-domain';
import { AccountingJournalEntryRepository } from '../ports/accounting-journal-entry.repository';

export class ListTenantAccountingJournalRegistryUseCase {
  constructor(
    private readonly accountingJournalEntryRepository: AccountingJournalEntryRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingJournalRegistryView> {
    const entries = await this.accountingJournalEntryRepository.listByPeriod({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
    });
    const balancedEntryCount = entries.filter((entry) => entry.totals.balanced)
      .length;
    const blockers = entries
      .filter((entry) => !entry.totals.balanced)
      .map((entry) => `accounting.journal_registry.unbalanced.${entry.id}`);
    const registryStatus =
      entries.length === 0
        ? 'empty'
        : blockers.length > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      registryStatus,
      entries,
      summary: {
        entryCount: entries.length,
        approvedEntryCount: entries.filter((entry) => entry.status === 'approved')
          .length,
        postedPreviewEntryCount: entries.filter(
          (entry) => entry.status === 'posted_preview',
        ).length,
        voidedEntryCount: entries.filter((entry) => entry.status === 'voided')
          .length,
        balancedEntryCount,
        totalDebitInCents: entries.reduce(
          (total, entry) => total + entry.totals.debitInCents,
          0,
        ),
        totalCreditInCents: entries.reduce(
          (total, entry) => total + entry.totals.creditInCents,
          0,
        ),
      },
      blockers,
      nextStep:
        registryStatus === 'ready'
          ? 'Usar journal registry como fuente del ledger registry.'
          : entries.length === 0
            ? 'Crear entries desde approval packets revisados.'
            : 'Corregir entries descuadrados antes de cierre contable.',
      guardrails: [
        'Registry interno de journals; no representa libro diario oficial.',
        'Los estados posted_preview son operativos y no equivalen a posteo legal.',
        'Mantener soporte y aprobaciones humanas antes de cierres formales.',
      ],
    };
  }
}
