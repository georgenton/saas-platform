import { WebhookEventEnvelope } from '@saas-platform/growth-domain';

export interface WebhookEventEnvelopeRepository {
  save(envelope: WebhookEventEnvelope): Promise<void>;
  findByTenantId(tenantId: string): Promise<WebhookEventEnvelope[]>;
  findByTenantIdAndId(
    tenantId: string,
    envelopeId: string,
  ): Promise<WebhookEventEnvelope | null>;
  findByTenantIdAndProviderAndEventKey(
    tenantId: string,
    provider: string,
    eventKey: string,
  ): Promise<WebhookEventEnvelope | null>;
}
