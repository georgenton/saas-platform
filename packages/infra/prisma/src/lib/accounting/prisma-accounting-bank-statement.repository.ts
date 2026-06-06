import { Injectable } from '@nestjs/common';
import { AccountingBankStatementRepository } from '@saas-platform/accounting-application';
import {
  TenantAccountingBankStatementBatchView,
  TenantAccountingBankStatementLineView,
} from '@saas-platform/accounting-domain';
import { PrismaService } from '../prisma.service';

type AccountingBankStatementLineRow = {
  id: string;
  batchId: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  accountKey: string;
  accountCode: string;
  accountName: string;
  postedAt: Date;
  description: string;
  direction: TenantAccountingBankStatementLineView['direction'];
  amountInCents: number;
  currency: string;
  reference: string;
  externalLineId: string | null;
  rawJson: string;
  createdAt: Date;
  updatedAt: Date;
};

type AccountingBankStatementBatchRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  source: TenantAccountingBankStatementBatchView['source'];
  status: TenantAccountingBankStatementBatchView['status'];
  importedByUserId: string | null;
  importedByEmail: string | null;
  importedAt: Date;
  originalFileName: string | null;
  notes: string | null;
  lineCount: number;
  totalInflowInCents: number;
  totalOutflowInCents: number;
  blockersJson: string;
  lines: AccountingBankStatementLineRow[];
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAccountingBankStatementRepository
  implements AccountingBankStatementRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async saveBatch(
    command: Parameters<AccountingBankStatementRepository['saveBatch']>[0],
  ): Promise<TenantAccountingBankStatementBatchView> {
    const totalInflowInCents = command.lines
      .filter((line) => line.direction === 'inflow')
      .reduce((total, line) => total + line.amountInCents, 0);
    const totalOutflowInCents = command.lines
      .filter((line) => line.direction === 'outflow')
      .reduce((total, line) => total + line.amountInCents, 0);
    const record = await this.batchDelegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        period: command.period,
        year: command.year,
        source: command.source,
        status: command.status,
        importedByUserId: command.importedByUserId ?? null,
        importedByEmail: command.importedByEmail ?? null,
        importedAt: command.importedAt,
        originalFileName: command.originalFileName ?? null,
        notes: command.notes ?? null,
        lineCount: command.lines.length,
        totalInflowInCents,
        totalOutflowInCents,
        blockersJson: JSON.stringify(command.blockers),
        lines: {
          create: command.lines.map((line) => ({
            id: line.id,
            tenantId: command.tenantId,
            tenantSlug: command.tenantSlug,
            period: command.period,
            year: command.year,
            accountKey: line.accountKey,
            accountCode: line.accountCode,
            accountName: line.accountName,
            postedAt: line.postedAt,
            description: line.description,
            direction: line.direction,
            amountInCents: line.amountInCents,
            currency: line.currency,
            reference: line.reference,
            externalLineId: line.externalLineId ?? null,
            rawJson: JSON.stringify(line.raw),
          })),
        },
      },
      include: { lines: true },
    });

    return this.toBatchView(record as AccountingBankStatementBatchRow);
  }

  async listByPeriod(
    command: Parameters<AccountingBankStatementRepository['listByPeriod']>[0],
  ): Promise<TenantAccountingBankStatementBatchView[]> {
    const records = await this.batchDelegate.findMany({
      where: {
        tenantSlug: command.tenantSlug,
        period: command.period,
        year: command.year,
      },
      include: { lines: { orderBy: [{ postedAt: 'asc' }, { id: 'asc' }] } },
      orderBy: [{ importedAt: 'asc' }, { id: 'asc' }],
    });

    return records.map((record: AccountingBankStatementBatchRow) =>
      this.toBatchView(record),
    );
  }

  private toBatchView(
    record: AccountingBankStatementBatchRow,
  ): TenantAccountingBankStatementBatchView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      source: record.source,
      status: record.status,
      importedByUserId: record.importedByUserId,
      importedByEmail: record.importedByEmail,
      importedAt: record.importedAt,
      originalFileName: record.originalFileName,
      notes: record.notes,
      lineCount: record.lineCount,
      totalInflowInCents: record.totalInflowInCents,
      totalOutflowInCents: record.totalOutflowInCents,
      blockers: JSON.parse(record.blockersJson),
      lines: record.lines.map((line) => this.toLineView(line)),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private toLineView(
    record: AccountingBankStatementLineRow,
  ): TenantAccountingBankStatementLineView {
    return {
      id: record.id,
      batchId: record.batchId,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      accountKey: record.accountKey,
      accountCode: record.accountCode,
      accountName: record.accountName,
      postedAt: record.postedAt,
      description: record.description,
      direction: record.direction,
      amountInCents: record.amountInCents,
      currency: record.currency,
      reference: record.reference,
      externalLineId: record.externalLineId,
      raw: JSON.parse(record.rawJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get batchDelegate(): any {
    return (this.prisma as any).accountingBankStatementBatch;
  }
}
