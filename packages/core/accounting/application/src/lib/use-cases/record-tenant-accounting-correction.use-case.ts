import { TenantAccountingCorrectionView } from '@saas-platform/accounting-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { AccountingCorrectionRepository } from '../ports/accounting-correction.repository';
import { AccountingCorrectionIdGenerator } from '../ports/id-generators';

export class RecordTenantAccountingCorrectionUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly correctionRepository: AccountingCorrectionRepository,
    private readonly correctionIdGenerator: AccountingCorrectionIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: Omit<
      TenantAccountingCorrectionView,
      'id' | 'tenantId' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<TenantAccountingCorrectionView> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = this.nowProvider();
    const correction: TenantAccountingCorrectionView = {
      ...input,
      id: this.correctionIdGenerator.nextId(),
      tenantId: tenant.id,
      createdAt: now,
      updatedAt: now,
    };

    await this.correctionRepository.save(correction);

    return correction;
  }
}
