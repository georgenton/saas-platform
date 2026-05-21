import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { GrowthOperationalCaseNotFoundError } from '../errors/growth-operational-case-not-found.error';
import {
  GrowthOperationalCaseRecord,
  GrowthOperationalCaseRepository,
} from '../ports/growth-operational-case.repository';

export interface ResolveTenantGrowthOperationalCaseInput {
  tenantSlug: string;
  caseId: string;
  resolvedByUserId: string;
  resolvedByEmail: string | null;
}

export class ResolveTenantGrowthOperationalCaseUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly growthOperationalCaseRepository: GrowthOperationalCaseRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    input: ResolveTenantGrowthOperationalCaseInput,
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

    const resolvedAt = this.nowProvider();

    return this.growthOperationalCaseRepository.save({
      ...existing,
      status: 'resolved',
      assignedUserId: existing.assignedUserId ?? input.resolvedByUserId,
      assignedUserEmail: existing.assignedUserEmail ?? input.resolvedByEmail,
      resolvedAt,
      resolvedByUserId: input.resolvedByUserId,
      resolvedByEmail: input.resolvedByEmail,
      updatedAt: resolvedAt,
    });
  }
}
