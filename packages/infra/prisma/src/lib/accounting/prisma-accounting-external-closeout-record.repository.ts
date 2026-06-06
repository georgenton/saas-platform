import { Injectable } from '@nestjs/common';
import { AccountingExternalCloseoutRecordRepository } from '@saas-platform/accounting-application';
import {
  AccountingExternalCloseoutStatus,
  TenantAccountingExternalCloseoutRecordView,
} from '@saas-platform/accounting-domain';
import { PrismaService } from '../prisma.service';

type AccountingExternalCloseoutRecordRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: string;
  accountantName: string;
  accountantEmail: string | null;
  confirmedByUserId: string | null;
  confirmedByEmail: string | null;
  confirmedAt: Date | null;
  evidenceReference: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAccountingExternalCloseoutRecordRepository
  implements AccountingExternalCloseoutRecordRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(record: TenantAccountingExternalCloseoutRecordView): Promise<void> {
    await this.delegate.upsert({
      where: { id: record.id },
      create: record,
      update: {
        status: record.status,
        accountantName: record.accountantName,
        accountantEmail: record.accountantEmail,
        confirmedByUserId: record.confirmedByUserId,
        confirmedByEmail: record.confirmedByEmail,
        confirmedAt: record.confirmedAt,
        evidenceReference: record.evidenceReference,
        notes: record.notes,
        updatedAt: record.updatedAt,
      },
    });
  }

  async listByPeriod(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingExternalCloseoutRecordView[]> {
    const records = await this.delegate.findMany({
      where: input,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: AccountingExternalCloseoutRecordRow) =>
      this.toView(record),
    );
  }

  private toView(
    record: AccountingExternalCloseoutRecordRow,
  ): TenantAccountingExternalCloseoutRecordView {
    return {
      ...record,
      status: record.status as AccountingExternalCloseoutStatus,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).accountingExternalCloseoutRecord;
  }
}
