import { Injectable } from '@nestjs/common';
import { AccountingEvidenceAttachmentRepository } from '@saas-platform/accounting-application';
import {
  AccountingEvidenceAttachmentStatus,
  TenantAccountingEvidenceAttachmentView,
} from '@saas-platform/accounting-domain';
import { PrismaService } from '../prisma.service';

type AccountingEvidenceAttachmentRow = {
  id: string;
  tenantId: string;
  tenantSlug: string;
  period: string;
  year: number;
  attachmentType: string;
  source: string;
  label: string;
  reference: string;
  ownerUserId: string | null;
  ownerEmail: string | null;
  status: string;
  hash: string | null;
  metadataJson: string;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class PrismaAccountingEvidenceAttachmentRepository
  implements AccountingEvidenceAttachmentRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(attachment: TenantAccountingEvidenceAttachmentView): Promise<void> {
    await this.delegate.upsert({
      where: { id: attachment.id },
      create: this.toPersistence(attachment),
      update: {
        attachmentType: attachment.attachmentType,
        source: attachment.source,
        label: attachment.label,
        reference: attachment.reference,
        ownerUserId: attachment.ownerUserId,
        ownerEmail: attachment.ownerEmail,
        status: attachment.status,
        hash: attachment.hash,
        metadataJson: JSON.stringify(attachment.metadata),
        updatedAt: attachment.updatedAt,
      },
    });
  }

  async listByPeriod(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingEvidenceAttachmentView[]> {
    const records = await this.delegate.findMany({
      where: input,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record: AccountingEvidenceAttachmentRow) =>
      this.toView(record),
    );
  }

  private toPersistence(attachment: TenantAccountingEvidenceAttachmentView) {
    return {
      ...attachment,
      metadataJson: JSON.stringify(attachment.metadata),
    };
  }

  private toView(
    record: AccountingEvidenceAttachmentRow,
  ): TenantAccountingEvidenceAttachmentView {
    return {
      id: record.id,
      tenantId: record.tenantId,
      tenantSlug: record.tenantSlug,
      period: record.period,
      year: record.year,
      attachmentType:
        record.attachmentType as TenantAccountingEvidenceAttachmentView['attachmentType'],
      source: record.source,
      label: record.label,
      reference: record.reference,
      ownerUserId: record.ownerUserId,
      ownerEmail: record.ownerEmail,
      status: record.status as AccountingEvidenceAttachmentStatus,
      hash: record.hash,
      metadata: JSON.parse(record.metadataJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private get delegate(): any {
    return (this.prisma as any).accountingEvidenceAttachment;
  }
}
