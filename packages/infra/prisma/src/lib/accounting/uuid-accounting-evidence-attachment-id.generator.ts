import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { AccountingEvidenceAttachmentIdGenerator } from '@saas-platform/accounting-application';

@Injectable()
export class UuidAccountingEvidenceAttachmentIdGenerator
  implements AccountingEvidenceAttachmentIdGenerator
{
  nextId(): string {
    return `accounting_evidence_attachment_${randomUUID()}`;
  }
}
