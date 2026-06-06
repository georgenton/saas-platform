import { TenantAccountingReconciliationExceptionPacketView } from '@saas-platform/accounting-domain';
import { GetTenantAccountingBankReconciliationWorkspaceUseCase } from './get-tenant-accounting-bank-reconciliation-workspace.use-case';
import { ListTenantAccountingJournalRegistryUseCase } from './list-tenant-accounting-journal-registry.use-case';

export class RequestTenantAccountingReconciliationExceptionPacketUseCase {
  constructor(
    private readonly getTenantAccountingBankReconciliationWorkspaceUseCase: GetTenantAccountingBankReconciliationWorkspaceUseCase,
    private readonly listTenantAccountingJournalRegistryUseCase: ListTenantAccountingJournalRegistryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingReconciliationExceptionPacketView> {
    const [workspace, journalRegistry] = await Promise.all([
      this.getTenantAccountingBankReconciliationWorkspaceUseCase.execute(input),
      this.listTenantAccountingJournalRegistryUseCase.execute(input),
    ]);
    const matchedJournalEntryIds = new Set(
      workspace.candidates
        .map((candidate) => candidate.journalEntryId)
        .filter((journalEntryId): journalEntryId is string => Boolean(journalEntryId)),
    );
    const exceptions: TenantAccountingReconciliationExceptionPacketView['exceptions'] =
      [
        ...workspace.candidates
          .filter((candidate) => candidate.matchStatus === 'unmatched')
          .map((candidate) => ({
            exceptionKey: `exception:${candidate.candidateKey}`,
            exceptionType: 'bank_line_without_journal' as const,
            severity: 'warning' as const,
            statementLineKey: candidate.statementLineKey,
            journalEntryId: null,
            amountInCents: candidate.amountInCents,
            differenceInCents: candidate.amountInCents,
            recommendation: 'review_bank_statement' as const,
            rationale:
              'Linea bancaria externa no tiene journal bancario equivalente.',
          })),
        ...workspace.candidates
          .filter((candidate) => candidate.matchStatus === 'needs_review')
          .map((candidate) => ({
            exceptionKey: `exception:${candidate.candidateKey}`,
            exceptionType: 'amount_difference' as const,
            severity: 'warning' as const,
            statementLineKey: candidate.statementLineKey,
            journalEntryId: candidate.journalEntryId,
            amountInCents: candidate.amountInCents,
            differenceInCents: candidate.differenceInCents,
            recommendation: 'mark_timing_difference' as const,
            rationale:
              'Linea bancaria comparte cuenta con ledger, pero requiere revisar monto, fecha o referencia.',
          })),
        ...journalRegistry.entries
          .filter((entry) => entry.status !== 'voided')
          .filter((entry) =>
            entry.lines.some((line) =>
              line.accountCode.startsWith('101') ||
              line.accountName.toLowerCase().includes('banco') ||
              line.accountName.toLowerCase().includes('caja'),
            ),
          )
          .filter((entry) => !matchedJournalEntryIds.has(entry.id))
          .map((entry) => ({
            exceptionKey: `exception:journal:${entry.id}`,
            exceptionType: 'journal_without_bank_line' as const,
            severity: 'warning' as const,
            statementLineKey: null,
            journalEntryId: entry.id,
            amountInCents: Math.max(
              ...entry.lines.map((line) => line.debitInCents + line.creditInCents),
              0,
            ),
            differenceInCents: Math.max(
              ...entry.lines.map((line) => line.debitInCents + line.creditInCents),
              0,
            ),
            recommendation: 'review_journal' as const,
            rationale:
              'Journal bancario no tiene linea externa asociada en statement registry.',
          })),
      ];
    const criticalCount = exceptions.filter(
      (exception) => exception.severity === 'critical',
    ).length;
    const warningCount = exceptions.filter(
      (exception) => exception.severity === 'warning',
    ).length;

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      exceptionStatus:
        workspace.blockers.length > 0
          ? 'blocked'
          : exceptions.length === 0
            ? 'empty'
            : 'ready_for_review',
      workspace,
      exceptions,
      summary: {
        exceptionCount: exceptions.length,
        criticalCount,
        warningCount,
        bankLineWithoutJournalCount: exceptions.filter(
          (exception) => exception.exceptionType === 'bank_line_without_journal',
        ).length,
        journalWithoutBankLineCount: exceptions.filter(
          (exception) => exception.exceptionType === 'journal_without_bank_line',
        ).length,
        totalDifferenceInCents: exceptions.reduce(
          (total, exception) => total + exception.differenceInCents,
          0,
        ),
      },
      blockers: [...workspace.blockers],
      nextStep:
        exceptions.length === 0
          ? 'No hay excepciones de conciliacion pendientes.'
          : 'Resolver excepciones con ajuste, revision bancaria o timing difference.',
      guardrails: [
        'Exception packet no crea ajustes automaticamente.',
        'Las recomendaciones requieren revision humana antes de tocar journals.',
        'Conservar evidencia bancaria externa para cada excepcion resuelta.',
      ],
    };
  }
}
