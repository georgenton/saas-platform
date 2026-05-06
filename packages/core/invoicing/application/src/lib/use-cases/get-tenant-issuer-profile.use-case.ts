import { IssuerProfile } from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { IssuerProfileNotFoundError } from '../errors/issuer-profile-not-found.error';
import { IssuerProfileRepository } from '../ports/issuer-profile.repository';

export class GetTenantIssuerProfileUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly issuerProfileRepository: IssuerProfileRepository,
  ) {}

  async execute(tenantSlug: string): Promise<IssuerProfile> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const profile = await this.issuerProfileRepository.findByTenantId(tenant.id);

    if (!profile) {
      throw new IssuerProfileNotFoundError(tenantSlug);
    }

    return profile;
  }
}
