import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { WebhookEventEnvelope } from '@saas-platform/growth-domain';
import { WebhookEventEnvelopeNotFoundError } from '../errors/webhook-event-envelope-not-found.error';
import { WebhookEventEnvelopeRepository } from '../ports/webhook-event-envelope.repository';

export class GetTenantWebhookEventEnvelopeByIdUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly webhookEventEnvelopeRepository: WebhookEventEnvelopeRepository,
  ) {}

  async execute(
    tenantSlug: string,
    envelopeId: string,
  ): Promise<WebhookEventEnvelope> {
    const tenant = await this.tenantRepository.findBySlug(tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(tenantSlug);
    }

    const envelope =
      await this.webhookEventEnvelopeRepository.findByTenantIdAndId(
        tenant.id,
        envelopeId,
      );

    if (!envelope) {
      throw new WebhookEventEnvelopeNotFoundError(tenantSlug, envelopeId);
    }

    return envelope;
  }
}
