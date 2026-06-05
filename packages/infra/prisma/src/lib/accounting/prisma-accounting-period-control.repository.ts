import { Injectable } from '@nestjs/common';
import { AccountingPeriodControlRepository } from '@saas-platform/accounting-application';
import {
  AccountingPeriodControlAction,
  AccountingPeriodControlStatus,
  TenantAccountingPeriodControlView,
} from '@saas-platform/accounting-domain';
import { PrismaService } from '../prisma.service';

type AccountingPeriodControlRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: AccountingPeriodControlStatus;
  action: AccountingPeriodControlAction;
  actionByUserId: string | null;
  actionByEmail: string | null;
  actionAt: Date;
  reason: string | null;
  evidenceReference: string | null;
  blockersJson: string;
  snapshotJson: string;
  impactChecklistJson: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAccountingPeriodControlRepository
  implements AccountingPeriodControlRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    command: Parameters<AccountingPeriodControlRepository['save']>[0],
  ): Promise<TenantAccountingPeriodControlView> {
    const record = await this.delegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        period: command.period,
        year: command.year,
        status: command.status,
        action: command.action,
        actionByUserId: command.actionByUserId ?? null,
        actionByEmail: command.actionByEmail ?? null,
        actionAt: command.actionAt,
        reason: command.reason ?? null,
        evidenceReference: command.evidenceReference ?? null,
        blockersJson: JSON.stringify(command.blockers),
        snapshotJson: JSON.stringify(command.snapshot),
        impactChecklistJson: JSON.stringify(command.impactChecklist),
      },
    });

    return this.toView(record as AccountingPeriodControlRow);
  }

  async listByPeriod(
    command: Parameters<AccountingPeriodControlRepository['listByPeriod']>[0],
  ): Promise<TenantAccountingPeriodControlView[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantSlug: command.tenantSlug,
        period: command.period,
        year: command.year,
      },
      orderBy: [{ actionAt: 'asc' }, { id: 'asc' }],
    });

    return records.map((record: AccountingPeriodControlRow) =>
      this.toView(record),
    );
  }

  private toView(
    record: AccountingPeriodControlRow,
  ): TenantAccountingPeriodControlView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      status: record.status,
      action: record.action,
      actionByUserId: record.actionByUserId,
      actionByEmail: record.actionByEmail,
      actionAt: record.actionAt,
      reason: record.reason,
      evidenceReference: record.evidenceReference,
      blockers: JSON.parse(record.blockersJson),
      snapshot: JSON.parse(record.snapshotJson),
      impactChecklist: JSON.parse(record.impactChecklistJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).accountingPeriodControl;
  }
}
