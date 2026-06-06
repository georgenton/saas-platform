import { TenantAccountingBankStatementImportWorkspaceView } from '@saas-platform/accounting-domain';

export interface AccountingBankStatementImportLineInput {
  accountCode?: string | null;
  accountName?: string | null;
  postedAt?: string | Date | null;
  description?: string | null;
  direction?: 'inflow' | 'outflow' | null;
  amountInCents?: number | null;
  currency?: string | null;
  reference?: string | null;
  externalLineId?: string | null;
}

export class GetTenantAccountingBankStatementImportWorkspaceUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    source: 'manual' | 'json' | 'csv';
    originalFileName?: string | null;
    lines: AccountingBankStatementImportLineInput[];
  }): Promise<TenantAccountingBankStatementImportWorkspaceView> {
    const previewLines = input.lines.map((line, index) => {
      const postedAt = parseDate(line.postedAt);
      const amountInCents = Number.isFinite(line.amountInCents)
        ? Number(line.amountInCents)
        : 0;
      const blockers = [
        ...(!line.accountCode?.trim()
          ? ['accounting.bank_statement_import.account_code_required']
          : []),
        ...(!line.accountName?.trim()
          ? ['accounting.bank_statement_import.account_name_required']
          : []),
        ...(!postedAt
          ? ['accounting.bank_statement_import.posted_at_required']
          : []),
        ...(!line.direction
          ? ['accounting.bank_statement_import.direction_required']
          : []),
        ...(amountInCents <= 0
          ? ['accounting.bank_statement_import.amount_positive_required']
          : []),
        ...(!line.currency?.trim()
          ? ['accounting.bank_statement_import.currency_required']
          : []),
        ...(!line.reference?.trim()
          ? ['accounting.bank_statement_import.reference_required']
          : []),
      ];

      return {
        lineKey: `import:${index + 1}`,
        accountKey: `bank:${line.accountCode ?? 'unknown'}`,
        accountCode: line.accountCode?.trim() ?? '',
        accountName: line.accountName?.trim() ?? '',
        postedAt,
        description: line.description?.trim() ?? 'Movimiento bancario',
        direction: line.direction ?? 'unknown' as const,
        amountInCents,
        currency: line.currency?.trim().toUpperCase() ?? '',
        reference: line.reference?.trim() ?? '',
        externalLineId: line.externalLineId?.trim() || null,
        validationStatus: blockers.length > 0 ? 'blocked' as const : 'ready' as const,
        blockers,
      };
    });
    const blockers = [
      ...(input.lines.length === 0
        ? ['accounting.bank_statement_import.no_lines']
        : []),
      ...previewLines.flatMap((line) => line.blockers),
    ];
    const currencies = new Set(
      previewLines
        .map((line) => line.currency)
        .filter((currency) => currency.length > 0),
    );
    const blockedLineCount = previewLines.filter(
      (line) => line.validationStatus === 'blocked',
    ).length;
    const importStatus =
      blockers.length > 0
        ? 'blocked'
        : currencies.size > 1
          ? 'needs_review'
          : 'ready_to_record';

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      importStatus,
      source: input.source,
      originalFileName: input.originalFileName ?? null,
      previewLines,
      summary: {
        lineCount: previewLines.length,
        validLineCount: previewLines.length - blockedLineCount,
        blockedLineCount,
        totalInflowInCents: previewLines
          .filter((line) => line.direction === 'inflow')
          .reduce((total, line) => total + line.amountInCents, 0),
        totalOutflowInCents: previewLines
          .filter((line) => line.direction === 'outflow')
          .reduce((total, line) => total + line.amountInCents, 0),
        currencyCount: currencies.size,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        importStatus === 'ready_to_record'
          ? 'Registrar batch de extracto bancario como evidencia del periodo.'
          : 'Corregir lineas bloqueadas antes de registrar el extracto.',
      guardrails: [
        'Preview de importacion; no graba lineas hasta ejecutar record.',
        'No conecta bancos reales ni certifica origen del archivo.',
        'La evidencia externa debe conservarse junto al batch importado.',
      ],
    };
  }
}

function parseDate(value: string | Date | null | undefined): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}
