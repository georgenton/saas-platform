import { Membership } from '@saas-platform/tenancy-domain';
import { TenantNotFoundError } from '../errors/tenant-not-found.error';
import { MembershipRepository } from '../ports/membership.repository';
import { TenantRepository } from '../ports/tenant.repository';

export class ListTenantMembershipsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
  ) {}

  async execute(slug: string): Promise<Membership[]> {
    const tenant = await this.tenantRepository.findBySlug(slug);

    if (!tenant) {
      throw new TenantNotFoundError(slug);
    }

    return this.membershipRepository.findByTenantId(tenant.id);
  }
}
