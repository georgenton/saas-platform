import { Entitlement } from '@saas-platform/commercial-domain';
import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { EntitlementRepository } from '../ports/entitlement.repository';

export class ListTenantEntitlementsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly entitlementRepository: EntitlementRepository,
  ) {}

  async execute(tenantSlug: string): Promise<Entitlement[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.entitlementRepository.findByTenantId(tenant.id);
  }
}
