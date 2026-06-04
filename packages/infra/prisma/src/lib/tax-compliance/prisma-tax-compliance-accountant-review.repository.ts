import { Injectable } from '@nestjs/common';
import { TaxComplianceAccountantReviewRepository } from '@saas-platform/tax-compliance-application';
import {
  EcuadorTaxAccountantReviewStatus,
  EcuadorTaxAccountantReviewView,
  EcuadorTaxEvidenceSummaryView,
} from '@saas-platform/tax-compliance-domain';
import { PrismaService } from '../prisma.service';

type TaxComplianceAccountantReviewRow = {
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
  evidenceSummaryJson: string;
  transitionHistoryJson: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaTaxComplianceAccountantReviewRepository
  implements TaxComplianceAccountantReviewRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(review: EcuadorTaxAccountantReviewView): Promise<void> {
    await this.delegate.upsert({
      where: {
        id: review.id,
      },
      create: this.toPersistence(review),
      update: {
        status: review.status,
        summary: review.summary,
        questionsJson: JSON.stringify(review.questions),
        evidenceSummaryJson: JSON.stringify(review.evidenceSummary),
        transitionHistoryJson: JSON.stringify(review.transitionHistory),
        updatedAt: review.updatedAt,
      },
    });
  }

  async findByTenantIdAndId(
    tenantId: string,
    reviewId: string,
  ): Promise<EcuadorTaxAccountantReviewView | null> {
    const record = await this.delegate.findFirst({
      where: {
        id: reviewId,
        tenantId,
      },
    });

    return record ? this.toView(record as TaxComplianceAccountantReviewRow) : null;
  }

  async listByTenantIdAndPeriod(
    tenantId: string,
    period: string,
  ): Promise<EcuadorTaxAccountantReviewView[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantId,
        period,
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: TaxComplianceAccountantReviewRow) =>
      this.toView(record),
    );
  }

  async findLatestByTenantIdAndPeriod(
    tenantId: string,
    period: string,
  ): Promise<EcuadorTaxAccountantReviewView | null> {
    const record = await this.delegate.findFirst({
      where: {
        tenantId,
        period,
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return record ? this.toView(record as TaxComplianceAccountantReviewRow) : null;
  }

  private toPersistence(review: EcuadorTaxAccountantReviewView) {
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
      evidenceSummaryJson: JSON.stringify(review.evidenceSummary),
      transitionHistoryJson: JSON.stringify(review.transitionHistory),
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  private toView(
    record: TaxComplianceAccountantReviewRow,
  ): EcuadorTaxAccountantReviewView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      status: record.status as EcuadorTaxAccountantReviewStatus,
      requestedByUserId: record.requestedByUserId,
      requestedByEmail: record.requestedByEmail,
      summary: record.summary,
      questions: JSON.parse(record.questionsJson),
      evidenceSummary: JSON.parse(
        record.evidenceSummaryJson,
      ) as EcuadorTaxEvidenceSummaryView,
      transitionHistory: JSON.parse(record.transitionHistoryJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).taxComplianceAccountantReview;
  }
}
