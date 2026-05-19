import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { WebhookEventEnvelope } from '@saas-platform/growth-domain';
import { WebhookEventEnvelopeRepository } from '../ports/webhook-event-envelope.repository';

export class ListTenantWebhookEventEnvelopesUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly webhookEventEnvelopeRepository: WebhookEventEnvelopeRepository,
  ) {}

  async execute(tenantSlug: string): Promise<WebhookEventEnvelope[]> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    return this.webhookEventEnvelopeRepository.findByTenantId(tenant.id);
  }
}
