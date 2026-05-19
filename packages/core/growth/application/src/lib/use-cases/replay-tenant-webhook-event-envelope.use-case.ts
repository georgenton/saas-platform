import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { WebhookEventEnvelope } from '@saas-platform/growth-domain';
import { WebhookEventEnvelopeNotFoundError } from '../errors/webhook-event-envelope-not-found.error';
import { WebhookEventEnvelopeRepository } from '../ports/webhook-event-envelope.repository';
import { ProcessTenantMetaWhatsappWebhookUseCase } from './process-tenant-meta-whatsapp-webhook.use-case';

export interface ReplayTenantWebhookEventEnvelopeResult {
  envelope: WebhookEventEnvelope;
  processedInboundMessages: number;
  processedDeliveryEvents: number;
}

export class ReplayTenantWebhookEventEnvelopeUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly webhookEventEnvelopeRepository: WebhookEventEnvelopeRepository,
    private readonly processTenantMetaWhatsappWebhookUseCase: ProcessTenantMetaWhatsappWebhookUseCase,
  ) {}

  async execute(
    tenantSlug: string,
    envelopeId: string,
  ): Promise<ReplayTenantWebhookEventEnvelopeResult> {
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

    const replayedAt = new Date();

    try {
      const payload = JSON.parse(envelope.payloadJson) as {
        object?: string;
        entry?: Array<unknown>;
      };
      const result = await this.processTenantMetaWhatsappWebhookUseCase.execute({
        tenantSlug,
        payload,
      });
      const replayedEnvelope = WebhookEventEnvelope.create({
        ...envelope.toPrimitives(),
        status: 'processed',
        replayCount: envelope.replayCount + 1,
        lastReplayedAt: replayedAt,
        processedInboundMessages: result.processedInboundMessages,
        processedDeliveryEvents: result.processedDeliveryEvents,
        failureReason: null,
        processedAt: replayedAt,
        updatedAt: replayedAt,
      });

      await this.webhookEventEnvelopeRepository.save(replayedEnvelope);

      return {
        envelope: replayedEnvelope,
        processedInboundMessages: result.processedInboundMessages,
        processedDeliveryEvents: result.processedDeliveryEvents,
      };
    } catch (error) {
      const failedEnvelope = WebhookEventEnvelope.create({
        ...envelope.toPrimitives(),
        status: 'failed',
        replayCount: envelope.replayCount + 1,
        lastReplayedAt: replayedAt,
        failureReason:
          error instanceof Error
            ? error.message
            : 'Unknown WhatsApp webhook replay failure.',
        processedAt: replayedAt,
        updatedAt: replayedAt,
      });

      await this.webhookEventEnvelopeRepository.save(failedEnvelope);
      throw error;
    }
  }
}
