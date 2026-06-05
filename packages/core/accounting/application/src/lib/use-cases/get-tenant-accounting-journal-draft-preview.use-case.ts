import { TenantAccountingJournalDraftPreviewView } from '@saas-platform/accounting-domain';
import { RequestTenantEcuadorTaxAccountingBridgePreviewUseCase } from '@saas-platform/tax-compliance-application';
import { GetTenantAccountingChartOfAccountsWorkspaceUseCase } from './get-tenant-accounting-chart-of-accounts-workspace.use-case';

export class GetTenantAccountingJournalDraftPreviewUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxAccountingBridgePreviewUseCase: RequestTenantEcuadorTaxAccountingBridgePreviewUseCase,
    private readonly getTenantAccountingChartOfAccountsWorkspaceUseCase: GetTenantAccountingChartOfAccountsWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingJournalDraftPreviewView> {
    const [bridgePreview, chartWorkspace] = await Promise.all([
      this.requestTenantEcuadorTaxAccountingBridgePreviewUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantAccountingChartOfAccountsWorkspaceUseCase.execute(input),
    ]);
    const accountByHint = new Map(
      chartWorkspace.accounts
        .filter((account) => account.mappedAccountHint)
        .map((account) => [account.mappedAccountHint, account] as const),
    );
    const draftEntries = bridgePreview.entries.map((entry) => {
      const account = accountByHint.get(entry.accountHint) ?? null;
      const cashAccount = chartWorkspace.accounts.find(
        (candidate) => candidate.code === '101.01',
      );
      const primaryLine = {
        lineKey: `${entry.key}:primary`,
        accountCode: account?.code ?? null,
        accountName: account?.name ?? null,
        debitInCents: entry.debitInCents,
        creditInCents: entry.creditInCents,
        sourceEntryKey: entry.key,
        accountHint: entry.accountHint,
        notes: entry.notes,
      };
      const balancingLine = {
        lineKey: `${entry.key}:balancing`,
        accountCode: cashAccount?.code ?? null,
        accountName: cashAccount?.name ?? null,
        debitInCents: entry.creditInCents,
        creditInCents: entry.debitInCents,
        sourceEntryKey: entry.key,
        accountHint: 'Caja y bancos',
        notes: ['Contrapartida tecnica para mantener el preview balanceado.'],
      };
      const lines = [primaryLine, balancingLine];
      const totals = {
        debitInCents: lines.reduce((total, line) => total + line.debitInCents, 0),
        creditInCents: lines.reduce(
          (total, line) => total + line.creditInCents,
          0,
        ),
        balanced:
          lines.reduce((total, line) => total + line.debitInCents, 0) ===
          lines.reduce((total, line) => total + line.creditInCents, 0),
      };
      const blockers = [
        ...(!account ? [`accounting.journal.unmapped_hint.${entry.key}`] : []),
        ...(!cashAccount ? ['accounting.journal.missing_cash_seed'] : []),
      ];

      return {
        draftEntryKey: `draft:${entry.key}`,
        label: entry.label,
        source: entry.source,
        currency: entry.currency,
        lines,
        totals,
        blockers,
      };
    });
    const blockers = [
      ...chartWorkspace.blockers,
      ...draftEntries.flatMap((entry) => entry.blockers),
    ];
    const readinessStatus =
      blockers.length > 0
        ? 'blocked'
        : chartWorkspace.readinessStatus === 'needs_review'
          ? 'needs_review'
          : 'ready';
    const journalStatus =
      blockers.length > 0
        ? 'needs_mapping'
        : readinessStatus === 'ready'
          ? 'ready_for_review'
          : 'blocked';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      journalStatus,
      draftEntries,
      summary: {
        draftEntryCount: draftEntries.length,
        draftLineCount: draftEntries.reduce(
          (total, entry) => total + entry.lines.length,
          0,
        ),
        balancedDraftCount: draftEntries.filter((entry) => entry.totals.balanced)
          .length,
        needsMappingDraftCount: draftEntries.filter(
          (entry) => entry.blockers.length > 0,
        ).length,
        totalDebitInCents: draftEntries.reduce(
          (total, entry) => total + entry.totals.debitInCents,
          0,
        ),
        totalCreditInCents: draftEntries.reduce(
          (total, entry) => total + entry.totals.creditInCents,
          0,
        ),
      },
      blockers: [...new Set(blockers)],
      nextStep:
        blockers.length > 0
          ? 'Completar mapping de cuentas antes de revisar borradores contables.'
          : 'Revisar borradores con contador antes de cualquier futuro posteo.',
      guardrails: [
        'Preview de borradores: no postea, no abre diario oficial y no afecta libros.',
        'Las contrapartidas son tecnicas para revision, no politica contable final.',
        'El posteo formal debe vivir en un slice posterior con aprobacion explicita.',
      ],
    };
  }
}
