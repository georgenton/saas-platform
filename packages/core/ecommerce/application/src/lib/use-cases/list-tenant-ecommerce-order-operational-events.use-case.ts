import {
  TenantEcommerceOrderOperationalEventType,
  TenantEcommerceOrderOperationalEventView,
} from '@saas-platform/ecommerce-domain';
import { EcommerceOrderDraftRepository } from '../ports/ecommerce-order-draft.repository';
import { EcommerceOrderOperationalEventRepository } from '../ports/ecommerce-order-operational-event.repository';

export type ListTenantEcommerceOrderOperationalEventsQuery = {
  eventType?: TenantEcommerceOrderOperationalEventType;
  status?: string;
  sourceWorkspace?: string;
  limit?: number;
};

export class ListTenantEcommerceOrderOperationalEventsUseCase {
  constructor(
    private readonly ecommerceOrderDraftRepository: EcommerceOrderDraftRepository,
    private readonly ecommerceOrderOperationalEventRepository: EcommerceOrderOperationalEventRepository,
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
    query: ListTenantEcommerceOrderOperationalEventsQuery = {},
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
      eventType: query.eventType,
      status: query.status?.trim() || undefined,
      sourceWorkspace: query.sourceWorkspace?.trim() || undefined,
      limit: query.limit ?? 20,
    });
  }
}
