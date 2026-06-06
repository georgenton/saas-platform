import { TenantAccountingBankStatementRegistryView } from '@saas-platform/accounting-domain';
import { AccountingBankStatementRepository } from '../ports/accounting-bank-statement.repository';

export class ListTenantAccountingBankStatementRegistryUseCase {
  constructor(
    private readonly accountingBankStatementRepository: AccountingBankStatementRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingBankStatementRegistryView> {
    const batches =
      await this.accountingBankStatementRepository.listByPeriod(input);
    const lines = batches.flatMap((batch) => batch.lines);
    const blockers = batches.flatMap((batch) => batch.blockers);
    const currencies = new Set(lines.map((line) => line.currency));
    const blockedBatchCount = batches.filter(
      (batch) => batch.status === 'blocked',
    ).length;
    const registryStatus =
      batches.length === 0
        ? 'empty'
        : blockers.length > 0 || blockedBatchCount > 0
          ? 'needs_review'
          : 'ready';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      registryStatus,
      batches,
      lines,
      summary: {
        batchCount: batches.length,
        lineCount: lines.length,
        totalInflowInCents: batches.reduce(
          (total, batch) => total + batch.totalInflowInCents,
          0,
        ),
        totalOutflowInCents: batches.reduce(
          (total, batch) => total + batch.totalOutflowInCents,
          0,
        ),
        blockedBatchCount,
        currencyCount: currencies.size,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        registryStatus === 'ready'
          ? 'Usar statement registry como evidencia externa para conciliacion.'
          : registryStatus === 'empty'
            ? 'Importar extractos bancarios del periodo.'
            : 'Revisar batches con blockers antes de closeout.',
      guardrails: [
        'Registry de extractos bancarios cargados por usuario.',
        'No sincroniza bancos reales ni valida autenticidad del archivo.',
        'Las lineas registradas alimentan conciliacion, no journals automaticos.',
      ],
    };
  }
}
