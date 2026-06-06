import { Injectable } from '@nestjs/common';
import { AccountingBankReconciliationControlRepository } from '@saas-platform/accounting-application';
import {
  AccountingBankReconciliationControlEventType,
  AccountingBankReconciliationControlStatus,
  TenantAccountingBankReconciliationControlView,
} from '@saas-platform/accounting-domain';
import { PrismaService } from '../prisma.service';

type AccountingBankReconciliationControlRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  eventType: AccountingBankReconciliationControlEventType;
  status: AccountingBankReconciliationControlStatus;
  source: string;
  actorUserId: string | null;
  actorEmail: string | null;
  occurredAt: Date;
  reason: string | null;
  evidenceReference: string | null;
  payloadJson: string;
  blockersJson: string;
  impactChecklistJson: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAccountingBankReconciliationControlRepository
  implements AccountingBankReconciliationControlRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    command: Parameters<AccountingBankReconciliationControlRepository['save']>[0],
  ): Promise<TenantAccountingBankReconciliationControlView> {
    const record = await this.delegate.create({
      data: {
        id: command.id,
        tenantId: command.tenantId,
        tenantSlug: command.tenantSlug,
        period: command.period,
        year: command.year,
        eventType: command.eventType,
        status: command.status,
        source: command.source,
        actorUserId: command.actorUserId ?? null,
        actorEmail: command.actorEmail ?? null,
        occurredAt: command.occurredAt,
        reason: command.reason ?? null,
        evidenceReference: command.evidenceReference ?? null,
        payloadJson: JSON.stringify(command.payload),
        blockersJson: JSON.stringify(command.blockers),
        impactChecklistJson: JSON.stringify(command.impactChecklist),
      },
    });

    return this.toView(record as AccountingBankReconciliationControlRow);
  }

  async listByPeriod(
    command: Parameters<
      AccountingBankReconciliationControlRepository['listByPeriod']
    >[0],
  ): Promise<TenantAccountingBankReconciliationControlView[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantSlug: command.tenantSlug,
        period: command.period,
        year: command.year,
      },
      orderBy: [{ occurredAt: 'asc' }, { id: 'asc' }],
    });

    return records.map((record: AccountingBankReconciliationControlRow) =>
      this.toView(record),
    );
  }

  private toView(
    record: AccountingBankReconciliationControlRow,
  ): TenantAccountingBankReconciliationControlView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      eventType: record.eventType,
      status: record.status,
      source: record.source,
      actorUserId: record.actorUserId,
      actorEmail: record.actorEmail,
      occurredAt: record.occurredAt,
      reason: record.reason,
      evidenceReference: record.evidenceReference,
      payload: JSON.parse(record.payloadJson),
      blockers: JSON.parse(record.blockersJson),
      impactChecklist: JSON.parse(record.impactChecklistJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).accountingBankReconciliationControl;
  }
}
