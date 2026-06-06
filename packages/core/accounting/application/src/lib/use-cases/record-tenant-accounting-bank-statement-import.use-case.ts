import { TenantAccountingBankStatementImportResultView } from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingBankStatementRepository } from '../ports/accounting-bank-statement.repository';
import {
  AccountingBankStatementBatchIdGenerator,
  AccountingBankStatementLineIdGenerator,
} from '../ports/id-generators';
import {
  AccountingBankStatementImportLineInput,
  GetTenantAccountingBankStatementImportWorkspaceUseCase,
} from './get-tenant-accounting-bank-statement-import-workspace.use-case';

export class RecordTenantAccountingBankStatementImportUseCase {
  constructor(
    private readonly accountingBankStatementRepository: AccountingBankStatementRepository,
    private readonly accountingBankStatementBatchIdGenerator: AccountingBankStatementBatchIdGenerator,
    private readonly accountingBankStatementLineIdGenerator: AccountingBankStatementLineIdGenerator,
    private readonly tenantRepository: TenantRepository,
    private readonly getTenantAccountingBankStatementImportWorkspaceUseCase: GetTenantAccountingBankStatementImportWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    source: 'manual' | 'json' | 'csv';
    originalFileName?: string | null;
    importedByUserId?: string | null;
    importedByEmail?: string | null;
    notes?: string | null;
    lines: AccountingBankStatementImportLineInput[];
  }): Promise<TenantAccountingBankStatementImportResultView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const preview =
      await this.getTenantAccountingBankStatementImportWorkspaceUseCase.execute(
        input,
      );

    if (preview.importStatus === 'blocked') {
      return {
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        generatedAt: this.nowProvider(),
        recordStatus: 'blocked',
        batch: null,
        preview,
        summary: {
          requestedLineCount: preview.summary.lineCount,
          recordedLineCount: 0,
          totalInflowInCents: preview.summary.totalInflowInCents,
          totalOutflowInCents: preview.summary.totalOutflowInCents,
        },
        blockers: preview.blockers,
        nextStep: 'Corregir preview antes de registrar extracto bancario.',
        guardrails: buildGuardrails(),
      };
    }

    const batch = await this.accountingBankStatementRepository.saveBatch({
      id: this.accountingBankStatementBatchIdGenerator.nextId(),
      tenantId: tenant.id,
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      source: input.source,
      status: 'recorded',
      importedByUserId: input.importedByUserId ?? null,
      importedByEmail: input.importedByEmail ?? null,
      importedAt: this.nowProvider(),
      originalFileName: input.originalFileName ?? null,
      notes: input.notes ?? null,
      blockers: preview.blockers,
      lines: preview.previewLines.map((line) => ({
        id: this.accountingBankStatementLineIdGenerator.nextId(),
        accountKey: line.accountKey,
        accountCode: line.accountCode,
        accountName: line.accountName,
        postedAt: line.postedAt as Date,
        description: line.description,
        direction: line.direction as 'inflow' | 'outflow',
        amountInCents: line.amountInCents,
        currency: line.currency,
        reference: line.reference,
        externalLineId: line.externalLineId,
        raw: {
          lineKey: line.lineKey,
          source: input.source,
          originalFileName: input.originalFileName ?? null,
        },
      })),
    });

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      recordStatus: 'recorded',
      batch,
      preview,
      summary: {
        requestedLineCount: preview.summary.lineCount,
        recordedLineCount: batch.lineCount,
        totalInflowInCents: batch.totalInflowInCents,
        totalOutflowInCents: batch.totalOutflowInCents,
      },
      blockers: [],
      nextStep: 'Revisar registry y correr conciliacion bancaria con evidencia externa.',
      guardrails: buildGuardrails(),
    };
  }
}

function buildGuardrails(): string[] {
  return [
    'El registro conserva evidencia operacional, no certifica el extracto bancario.',
    'No crea journals ni ajustes automaticamente.',
    'Las diferencias deben resolverse por exception packet o ajuste revisado.',
  ];
}
