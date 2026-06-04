import { Injectable } from '@nestjs/common';
import {
  TaxCompliancePurchaseExpenseEvidenceRecordInput,
  TaxCompliancePurchaseExpenseEvidenceRepository,
} from '@saas-platform/tax-compliance-application';
import {
  EcuadorTaxPurchaseExpenseCategory,
  EcuadorTaxPurchaseExpenseEvidenceRecordView,
  EcuadorTaxPurchaseExpenseEvidenceStatus,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { PrismaService } from '../prisma.service';

type TaxCompliancePurchaseExpenseEvidenceRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  supplierPartyId: string | null;
  supplierName: string;
  supplierTaxpayerId: string | null;
  documentNumber: string | null;
  documentCode: string | null;
  issuedAt: Date | null;
  category: string;
  currency: string;
  subtotalInCents: number;
  vatInCents: number;
  totalInCents: number;
  deductible: boolean | null;
  supportReference: string | null;
  status: string;
  readinessStatus: string;
  blockersJson: string;
  reviewNotesJson: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaTaxCompliancePurchaseExpenseEvidenceRepository
  implements TaxCompliancePurchaseExpenseEvidenceRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(
    input: TaxCompliancePurchaseExpenseEvidenceRecordInput,
  ): Promise<EcuadorTaxPurchaseExpenseEvidenceRecordView> {
    const record = await this.delegate.upsert({
      where: {
        id: input.evidenceId,
      },
      create: this.toPersistence(input),
      update: {
        supplierPartyId: input.supplierPartyId,
        supplierName: input.supplierName,
        supplierTaxpayerId: input.supplierTaxpayerId,
        documentNumber: input.documentNumber,
        documentCode: input.documentCode,
        issuedAt: input.issuedAt,
        category: input.category,
        currency: input.currency,
        subtotalInCents: input.subtotalInCents,
        vatInCents: input.vatInCents,
        totalInCents: input.totalInCents,
        deductible: input.deductible,
        supportReference: input.supportReference,
        status: input.status,
        readinessStatus: input.readinessStatus,
        blockersJson: JSON.stringify(input.blockers),
        reviewNotesJson: JSON.stringify(input.reviewNotes),
        occurredAt: input.occurredAt,
        updatedAt: input.occurredAt,
      },
    });

    return this.toView(record as TaxCompliancePurchaseExpenseEvidenceRow);
  }

  async listByTenantAndPeriod(input: {
    tenantId: string;
    tenantSlug: string;
    period: string;
  }): Promise<EcuadorTaxPurchaseExpenseEvidenceRecordView[]> {
    const records = await this.delegate.findMany({
      where: {
        tenantId: input.tenantId,
        tenantSlug: input.tenantSlug,
        period: input.period,
      },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
    });

    return records.map((record: TaxCompliancePurchaseExpenseEvidenceRow) =>
      this.toView(record),
    );
  }

  private toPersistence(
    input: TaxCompliancePurchaseExpenseEvidenceRecordInput,
  ) {
    return {
      id: input.evidenceId,
      tenantId: input.tenantId,
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      supplierPartyId: input.supplierPartyId,
      supplierName: input.supplierName,
      supplierTaxpayerId: input.supplierTaxpayerId,
      documentNumber: input.documentNumber,
      documentCode: input.documentCode,
      issuedAt: input.issuedAt,
      category: input.category,
      currency: input.currency,
      subtotalInCents: input.subtotalInCents,
      vatInCents: input.vatInCents,
      totalInCents: input.totalInCents,
      deductible: input.deductible,
      supportReference: input.supportReference,
      status: input.status,
      readinessStatus: input.readinessStatus,
      blockersJson: JSON.stringify(input.blockers),
      reviewNotesJson: JSON.stringify(input.reviewNotes),
      occurredAt: input.occurredAt,
      createdAt: input.occurredAt,
      updatedAt: input.occurredAt,
    };
  }

  private toView(
    record: TaxCompliancePurchaseExpenseEvidenceRow,
  ): EcuadorTaxPurchaseExpenseEvidenceRecordView {
    return {
      evidenceId: record.id,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      supplierPartyId: record.supplierPartyId,
      supplierName: record.supplierName,
      supplierTaxpayerId: record.supplierTaxpayerId,
      documentNumber: record.documentNumber,
      documentCode: record.documentCode,
      issuedAt: record.issuedAt,
      category: record.category as EcuadorTaxPurchaseExpenseCategory,
      currency: record.currency,
      subtotalInCents: record.subtotalInCents,
      vatInCents: record.vatInCents,
      totalInCents: record.totalInCents,
      deductible: record.deductible,
      supportReference: record.supportReference,
      status: record.status as EcuadorTaxPurchaseExpenseEvidenceStatus,
      readinessStatus: record.readinessStatus as EcuadorTaxReadinessStatus,
      blockers: JSON.parse(record.blockersJson),
      reviewNotes: JSON.parse(record.reviewNotesJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).taxCompliancePurchaseExpenseEvidence;
  }
}
