import { TenantAccountingEvidenceAttachmentView } from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingEvidenceAttachmentRepository } from '../ports/accounting-evidence-attachment.repository';
import { AccountingEvidenceAttachmentIdGenerator } from '../ports/id-generators';

export class RecordTenantAccountingEvidenceAttachmentUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly attachmentRepository: AccountingEvidenceAttachmentRepository,
    private readonly attachmentIdGenerator: AccountingEvidenceAttachmentIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: Omit<
      TenantAccountingEvidenceAttachmentView,
      'id' | 'tenantId' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<TenantAccountingEvidenceAttachmentView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = this.nowProvider();
    const attachment: TenantAccountingEvidenceAttachmentView = {
      ...input,
      id: this.attachmentIdGenerator.nextId(),
      tenantId: tenant.id,
      createdAt: now,
      updatedAt: now,
    };

    await this.attachmentRepository.save(attachment);

    return attachment;
  }
}
