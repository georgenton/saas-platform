import {
  TenantEcommerceOrderOperationalEventType,
  TenantEcommerceOrderOperationalEventView,
} from '@saas-platform/ecommerce-domain';

export interface EcommerceOrderOperationalEventRepository {
  record(command: {
    id: string;
    tenantId: string;
    tenantSlug: string;
    productEntityId: string;
    orderDraftId: string;
    dedupeKey: string;
    eventType: TenantEcommerceOrderOperationalEventType;
    sourceWorkspace: string;
    status: string;
    summary: string;
    payload: Record<string, unknown>;
    occurredAt: Date;
  }): Promise<TenantEcommerceOrderOperationalEventView>;

  listLatestByOrderDraft(command: {
    tenantSlug: string;
    productEntityId: string;
    orderDraftId: string;
    eventType?: TenantEcommerceOrderOperationalEventType;
    status?: string;
    sourceWorkspace?: string;
    limit?: number;
  }): Promise<TenantEcommerceOrderOperationalEventView[]>;
}
