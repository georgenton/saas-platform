import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { GrowthOperationalCaseNotFoundError } from '../errors/growth-operational-case-not-found.error';
import {
  GrowthOperationalCaseRecord,
  GrowthOperationalCaseRepository,
} from '../ports/growth-operational-case.repository';

export interface ReleaseTenantGrowthOperationalCaseInput {
  tenantSlug: string;
  caseId: string;
}

export class ReleaseTenantGrowthOperationalCaseUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly growthOperationalCaseRepository: GrowthOperationalCaseRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: ReleaseTenantGrowthOperationalCaseInput,
  ): Promise<GrowthOperationalCaseRecord> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const existing = await this.growthOperationalCaseRepository.findByTenantIdAndId(
      tenant.id,
      input.caseId,
    );

    if (!existing) {
      throw new GrowthOperationalCaseNotFoundError(
        input.tenantSlug,
        input.caseId,
      );
    }

    return this.growthOperationalCaseRepository.save({
      ...existing,
      status: 'open',
      assignedUserId: null,
      assignedUserEmail: null,
      resolvedAt: null,
      resolvedByUserId: null,
      resolvedByEmail: null,
      updatedAt: this.nowProvider(),
    });
  }
}
