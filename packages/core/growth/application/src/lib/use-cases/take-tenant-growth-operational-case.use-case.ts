import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { GrowthOperationalCaseNotFoundError } from '../errors/growth-operational-case-not-found.error';
import {
  GrowthOperationalCaseRecord,
  GrowthOperationalCaseRepository,
} from '../ports/growth-operational-case.repository';

export interface TakeTenantGrowthOperationalCaseInput {
  tenantSlug: string;
  caseId: string;
  assignedUserId: string;
  assignedUserEmail: string | null;
}

export class TakeTenantGrowthOperationalCaseUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly growthOperationalCaseRepository: GrowthOperationalCaseRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: TakeTenantGrowthOperationalCaseInput,
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
      status: 'in_progress',
      assignedUserId: input.assignedUserId,
      assignedUserEmail: input.assignedUserEmail,
      resolvedAt: null,
      resolvedByUserId: null,
      resolvedByEmail: null,
      updatedAt: this.nowProvider(),
    });
  }
}
