import { TenantEcommerceOrderOperationalEventView } from '@saas-platform/ecommerce-domain';
import { EcommerceOrderDraftRepository } from '../ports/ecommerce-order-draft.repository';
import { EcommerceOrderOperationalEventRepository } from '../ports/ecommerce-order-operational-event.repository';

export class ListTenantEcommerceOrderOperationalEventsUseCase {
  constructor(
    private readonly ecommerceOrderDraftRepository: EcommerceOrderDraftRepository,
    private readonly ecommerceOrderOperationalEventRepository: EcommerceOrderOperationalEventRepository,
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
    limit = 20,
  ): Promise<TenantEcommerceOrderOperationalEventView[] | null> {
    const orderDraft =
      await this.ecommerceOrderDraftRepository.findByTenantSlugAndId(
        tenantSlug,
        orderDraftId,
      );

    if (!orderDraft || orderDraft.productEntityId !== productEntityId) {
      return null;
    }

    return this.ecommerceOrderOperationalEventRepository.listLatestByOrderDraft({
      tenantSlug,
      productEntityId,
      orderDraftId,
      limit,
    });
  }
}
