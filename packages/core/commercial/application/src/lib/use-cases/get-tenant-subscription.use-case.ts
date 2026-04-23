import { Subscription } from '@saas-platform/commercial-domain';
import {
  SubscriptionNotFoundError,
} from '../errors/subscription-not-found.error';
import { SubscriptionRepository } from '../ports/subscription.repository';
import { TenantRepository, TenantNotFoundError } from '@saas-platform/tenancy-application';

export class GetTenantSubscriptionUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async execute(tenantSlug: string): Promise<Subscription> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const subscription = await this.subscriptionRepository.findByTenantId(
      tenant.id,
    );

    if (!subscription) {
      throw new SubscriptionNotFoundError(tenantSlug);
    }

    return subscription;
  }
}
