import { TenantAccountingExternalCloseoutRecordView } from '@saas-platform/accounting-domain';
import { AccountingExternalCloseoutRecordRepository } from '../ports/accounting-external-closeout-record.repository';

export class ListTenantAccountingExternalCloseoutRecordsUseCase {
  constructor(
    private readonly externalCloseoutRecordRepository: AccountingExternalCloseoutRecordRepository,
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<TenantAccountingExternalCloseoutRecordView[]> {
    return this.externalCloseoutRecordRepository.listByPeriod(input);
  }
}
