import { TenantAccountingExternalCloseoutRecordView } from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingExternalCloseoutRecordRepository } from '../ports/accounting-external-closeout-record.repository';
import { AccountingExternalCloseoutRecordIdGenerator } from '../ports/id-generators';

export class RecordTenantAccountingExternalCloseoutRecordUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly externalCloseoutRecordRepository: AccountingExternalCloseoutRecordRepository,
    private readonly externalCloseoutRecordIdGenerator: AccountingExternalCloseoutRecordIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: Omit<
      TenantAccountingExternalCloseoutRecordView,
      'id' | 'tenantId' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<TenantAccountingExternalCloseoutRecordView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = this.nowProvider();
    const record: TenantAccountingExternalCloseoutRecordView = {
      ...input,
      id: this.externalCloseoutRecordIdGenerator.nextId(),
      tenantId: tenant.id,
      createdAt: now,
      updatedAt: now,
    };

    await this.externalCloseoutRecordRepository.save(record);

    return record;
  }
}
