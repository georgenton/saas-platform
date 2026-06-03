import { randomUUID } from 'node:crypto';
import {
  TenantEcommerceOrderOperationalEventType,
  TenantEcommerceOrderOperationalEventView,
} from '@saas-platform/ecommerce-domain';
import { GetTenantBySlugUseCase } from '@saas-platform/tenancy-application';
import { EcommerceOrderDraftRepository } from '../ports/ecommerce-order-draft.repository';
import { EcommerceOrderOperationalEventRepository } from '../ports/ecommerce-order-operational-event.repository';

export type RecordTenantEcommerceOrderOperationalEventCommand = {
  eventType: TenantEcommerceOrderOperationalEventType;
  sourceWorkspace: string;
  status: string;
  summary: string;
  payload?: Record<string, unknown>;
};

export class RecordTenantEcommerceOrderOperationalEventUseCase {
  constructor(
    private readonly getTenantBySlugUseCase: GetTenantBySlugUseCase,
    private readonly ecommerceOrderDraftRepository: EcommerceOrderDraftRepository,
    private readonly ecommerceOrderOperationalEventRepository: EcommerceOrderOperationalEventRepository,
    private readonly idGenerator: () => string = () => randomUUID(),
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
    orderDraftId: string,
    command: RecordTenantEcommerceOrderOperationalEventCommand,
  ): Promise<TenantEcommerceOrderOperationalEventView | null> {
    const [tenant, orderDraft] = await Promise.all([
      this.getTenantBySlugUseCase.execute(tenantSlug),
      this.ecommerceOrderDraftRepository.findByTenantSlugAndId(
        tenantSlug,
        orderDraftId,
      ),
    ]);

    if (!orderDraft || orderDraft.productEntityId !== productEntityId) {
      return null;
    }

    const occurredAt = this.nowProvider();

    return this.ecommerceOrderOperationalEventRepository.record({
      id: this.idGenerator(),
      tenantId: tenant.id,
      tenantSlug,
      productEntityId,
      orderDraftId,
      eventType: command.eventType,
      sourceWorkspace: command.sourceWorkspace.trim(),
      status: command.status.trim(),
      summary: command.summary.trim(),
      payload: command.payload ?? {},
      occurredAt,
    });
  }
}
