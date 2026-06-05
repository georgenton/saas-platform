import { Injectable } from '@nestjs/common';
import { AccountingJournalEntryRepository } from '@saas-platform/accounting-application';
import { TenantAccountingJournalEntryView } from '@saas-platform/accounting-domain';
import { PrismaService } from '../prisma.service';

type AccountingJournalEntryRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  source: string;
  status: TenantAccountingJournalEntryView['status'];
  label: string;
  currency: string;
  linesJson: string;
  approvalStatus: string;
  approvedByUserId: string | null;
  approvedByEmail: string | null;
  approvedAt: Date | null;
  sourceDraftEntryKey: string | null;
  sourceApprovalPacketKey: string | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAccountingJournalEntryRepository
  implements AccountingJournalEntryRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    command: Parameters<AccountingJournalEntryRepository['save']>[0],
  ): Promise<TenantAccountingJournalEntryView> {
    const record = await this.delegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        period: command.period,
        year: command.year,
        source: command.source,
        status: command.status,
        label: command.label,
        currency: command.currency,
        linesJson: JSON.stringify(command.lines),
        approvalStatus: command.approvalStatus,
        approvedByUserId: command.approvedByUserId ?? null,
        approvedByEmail: command.approvedByEmail ?? null,
        approvedAt: command.approvedAt ?? null,
        sourceDraftEntryKey: command.sourceDraftEntryKey ?? null,
        sourceApprovalPacketKey: command.sourceApprovalPacketKey ?? null,
        note: command.note ?? null,
      },
    });

    return this.toView(record as AccountingJournalEntryRow);
  }

  async listByPeriod(
    command: Parameters<AccountingJournalEntryRepository['listByPeriod']>[0],
  ): Promise<TenantAccountingJournalEntryView[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantSlug: command.tenantSlug,
        period: command.period,
        year: command.year,
        ...(command.status ? { status: command.status } : {}),
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });

    return records.map((record: AccountingJournalEntryRow) =>
      this.toView(record),
    );
  }

  private toView(
    record: AccountingJournalEntryRow,
  ): TenantAccountingJournalEntryView {
    const lines = JSON.parse(record.linesJson);
    const debitInCents = lines.reduce(
      (total: number, line: { debitInCents: number }) =>
        total + line.debitInCents,
      0,
    );
    const creditInCents = lines.reduce(
      (total: number, line: { creditInCents: number }) =>
        total + line.creditInCents,
      0,
    );

    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      source: record.source,
      status: record.status,
      label: record.label,
      currency: record.currency,
      lines,
      totals: {
        debitInCents,
        creditInCents,
        balanced: debitInCents === creditInCents,
      },
      approvalStatus: record.approvalStatus,
      approvedByUserId: record.approvedByUserId,
      approvedByEmail: record.approvedByEmail,
      approvedAt: record.approvedAt,
      sourceDraftEntryKey: record.sourceDraftEntryKey,
      sourceApprovalPacketKey: record.sourceApprovalPacketKey,
      note: record.note,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).accountingJournalEntry;
  }
}
