import { Injectable } from '@nestjs/common';
import { AccountingCorrectionRepository } from '@saas-platform/accounting-application';
import {
  AccountingCorrectionSource,
  AccountingCorrectionStatus,
  TenantAccountingCorrectionView,
} from '@saas-platform/accounting-domain';
import { PrismaService } from '../prisma.service';

type AccountingCorrectionRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  source: string;
  status: string;
  severity: string;
  title: string;
  detail: string;
  recommendedAction: string;
  ownerUserId: string | null;
  ownerEmail: string | null;
  evidenceReference: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAccountingCorrectionRepository
  implements AccountingCorrectionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(correction: TenantAccountingCorrectionView): Promise<void> {
    await this.delegate.upsert({
      where: { id: correction.id },
      create: correction,
      update: {
        source: correction.source,
        status: correction.status,
        severity: correction.severity,
        title: correction.title,
        detail: correction.detail,
        recommendedAction: correction.recommendedAction,
        ownerUserId: correction.ownerUserId,
        ownerEmail: correction.ownerEmail,
        evidenceReference: correction.evidenceReference,
        updatedAt: correction.updatedAt,
      },
    });
  }

  async listByPeriod(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingCorrectionView[]> {
    const records = await this.delegate.findMany({
      where: input,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: AccountingCorrectionRow) => this.toView(record));
  }

  private toView(record: AccountingCorrectionRow): TenantAccountingCorrectionView {
    return {
      ...record,
      source: record.source as AccountingCorrectionSource,
      status: record.status as AccountingCorrectionStatus,
      severity: record.severity as TenantAccountingCorrectionView['severity'],
    };
  }

  private get delegate(): any {
    return (this.prisma as any).accountingCorrection;
  }
}
