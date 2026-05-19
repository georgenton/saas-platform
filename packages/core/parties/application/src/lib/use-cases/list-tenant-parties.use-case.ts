import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Party } from '@saas-platform/parties-domain';
import { PartyDirectoryRepository } from '../ports/party-directory.repository';

export class ListTenantPartiesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly partyDirectoryRepository: PartyDirectoryRepository,
  ) {}

  async execute(tenantSlug: string): Promise<Party[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.partyDirectoryRepository.findByTenantId(tenant.id);
  }
}
