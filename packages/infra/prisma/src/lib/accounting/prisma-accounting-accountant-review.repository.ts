import { Injectable } from '@nestjs/common';
import { AccountingAccountantReviewRepository } from '@saas-platform/accounting-application';
import {
  AccountingAccountantReviewStatus,
  TenantAccountingAccountantReviewView,
  TenantAccountingAccountantHandoffWorkspaceView,
} from '@saas-platform/accounting-domain';
import { PrismaService } from '../prisma.service';

type AccountingAccountantReviewRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  status: string;
  requestedByUserId: string | null;
  requestedByEmail: string | null;
  summary: string;
  questionsJson: string;
  riskFlagsJson: string;
  evidenceReferencesJson: string;
  transitionHistoryJson: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAccountingAccountantReviewRepository
  implements AccountingAccountantReviewRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(review: TenantAccountingAccountantReviewView): Promise<void> {
    await this.delegate.upsert({
      where: { id: review.id },
      create: this.toPersistence(review),
      update: {
        status: review.status,
        summary: review.summary,
        questionsJson: JSON.stringify(review.questions),
        riskFlagsJson: JSON.stringify(review.riskFlags),
        evidenceReferencesJson: JSON.stringify(review.evidenceReferences),
        transitionHistoryJson: JSON.stringify(review.transitionHistory),
        updatedAt: review.updatedAt,
      },
    });
  }

  async findByTenantIdAndId(
    tenantId: string,
    reviewId: string,
  ): Promise<TenantAccountingAccountantReviewView | null> {
    const record = await this.delegate.findFirst({
      where: { id: reviewId, tenantId },
    });

    return record ? this.toView(record as AccountingAccountantReviewRow) : null;
  }

  async listByTenantIdAndPeriod(
    tenantId: string,
    period: string,
  ): Promise<TenantAccountingAccountantReviewView[]> {
    const records = await this.delegate.findMany({
      where: { tenantId, period },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: AccountingAccountantReviewRow) =>
      this.toView(record),
    );
  }

  async findLatestByTenantIdAndPeriod(
    tenantId: string,
    period: string,
  ): Promise<TenantAccountingAccountantReviewView | null> {
    const record = await this.delegate.findFirst({
      where: { tenantId, period },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return record ? this.toView(record as AccountingAccountantReviewRow) : null;
  }

  private toPersistence(review: TenantAccountingAccountantReviewView) {
    return {
      id: review.id,
      tenantId: review.tenantId,
      tenantSlug: review.tenantSlug,
      period: review.period,
      year: review.year,
      status: review.status,
      requestedByUserId: review.requestedByUserId,
      requestedByEmail: review.requestedByEmail,
      summary: review.summary,
      questionsJson: JSON.stringify(review.questions),
      riskFlagsJson: JSON.stringify(review.riskFlags),
      evidenceReferencesJson: JSON.stringify(review.evidenceReferences),
      transitionHistoryJson: JSON.stringify(review.transitionHistory),
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  private toView(
    record: AccountingAccountantReviewRow,
  ): TenantAccountingAccountantReviewView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      status: record.status as AccountingAccountantReviewStatus,
      requestedByUserId: record.requestedByUserId,
      requestedByEmail: record.requestedByEmail,
      summary: record.summary,
      questions: JSON.parse(record.questionsJson),
      riskFlags: JSON.parse(
        record.riskFlagsJson,
      ) as TenantAccountingAccountantHandoffWorkspaceView['riskFlags'],
      evidenceReferences: JSON.parse(record.evidenceReferencesJson),
      transitionHistory: JSON.parse(record.transitionHistoryJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).accountingAccountantReview;
  }
}
