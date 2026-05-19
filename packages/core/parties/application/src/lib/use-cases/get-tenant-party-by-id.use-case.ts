import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { Party } from '@saas-platform/parties-domain';
import { PartyNotFoundError } from '../errors/party-not-found.error';
import { PartyDirectoryRepository } from '../ports/party-directory.repository';

export class GetTenantPartyByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly partyDirectoryRepository: PartyDirectoryRepository,
  ) {}

  async execute(tenantSlug: string, partyId: string): Promise<Party> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const party = await this.partyDirectoryRepository.findByTenantIdAndId(
      tenant.id,
      partyId,
    );

    if (!party) {
      throw new PartyNotFoundError(tenantSlug, partyId);
    }

    return party;
  }
}
