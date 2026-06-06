import { TenantAccountingEvidenceAttachmentView } from '@saas-platform/accounting-domain';

export interface AccountingEvidenceAttachmentRepository {
  save(attachment: TenantAccountingEvidenceAttachmentView): Promise<void>;
  listByPeriod(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingEvidenceAttachmentView[]>;
}

export const ACCOUNTING_EVIDENCE_ATTACHMENT_REPOSITORY = Symbol(
  'ACCOUNTING_EVIDENCE_ATTACHMENT_REPOSITORY',
);
