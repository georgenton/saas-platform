import { createHash } from 'node:crypto';
import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';
import { WebhookEventEnvelope } from '@saas-platform/growth-domain';
import { WebhookEventEnvelopeIdGenerator } from '../ports/webhook-event-envelope-id.generator';
import { WebhookEventEnvelopeRepository } from '../ports/webhook-event-envelope.repository';
import {
  MetaWhatsappWebhookEntry,
  ProcessTenantMetaWhatsappWebhookResult,
  ProcessTenantMetaWhatsappWebhookUseCase,
  ProcessTenantMetaWhatsappWebhookInput,
} from './process-tenant-meta-whatsapp-webhook.use-case';

export interface ReceiveTenantMetaWhatsappWebhookInput {
  tenantSlug: string;
  provider?: 'meta_cloud_api_stub' | 'meta_cloud_api';
  payload: ProcessTenantMetaWhatsappWebhookInput['payload'];
  rawPayloadJson: string;
  signatureHeader?: string | null;
  receivedAt?: Date | null;
}

export interface ReceiveTenantMetaWhatsappWebhookResult
  extends ProcessTenantMetaWhatsappWebhookResult {
  tenantSlug: string;
  envelopeId: string;
  eventKey: string;
  duplicate: boolean;
  envelopeStatus: 'processed' | 'ignored' | 'failed';
}

export class ReceiveTenantMetaWhatsappWebhookUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly webhookEventEnvelopeRepository: WebhookEventEnvelopeRepository,
    private readonly webhookEventEnvelopeIdGenerator: WebhookEventEnvelopeIdGenerator,
    private readonly processTenantMetaWhatsappWebhookUseCase: ProcessTenantMetaWhatsappWebhookUseCase,
  ) {}

  async execute(
    input: ReceiveTenantMetaWhatsappWebhookInput,
  ): Promise<ReceiveTenantMetaWhatsappWebhookResult> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const receivedAt = input.receivedAt ?? new Date();
    const provider = input.provider ?? 'meta_cloud_api_stub';
    const eventKey = this.buildEventKey(input.payload, input.rawPayloadJson);
    const payloadHash = this.buildPayloadHash(input.rawPayloadJson);
    const existingEnvelope =
      await this.webhookEventEnvelopeRepository.findByTenantIdAndProviderAndEventKey(
        tenant.id,
        provider,
        eventKey,
      );

    if (existingEnvelope) {
      const envelopeStatus: ReceiveTenantMetaWhatsappWebhookResult['envelopeStatus'] =
        existingEnvelope.status === 'received'
          ? 'ignored'
          : existingEnvelope.status === 'processed' ||
              existingEnvelope.status === 'ignored'
            ? existingEnvelope.status
            : 'failed';

      return {
        tenantSlug: input.tenantSlug,
        envelopeId: existingEnvelope.id,
        eventKey: existingEnvelope.eventKey,
        duplicate: true,
        envelopeStatus,
        processedInboundMessages: existingEnvelope.processedInboundMessages,
        processedDeliveryEvents: existingEnvelope.processedDeliveryEvents,
      };
    }

    const metadata = this.extractRoutingMetadata(input.payload.entry ?? []);
    const envelope = WebhookEventEnvelope.create({
      id: this.webhookEventEnvelopeIdGenerator.generate(),
      tenantId: tenant.id,
      provider,
      channel: 'whatsapp',
      eventKey,
      providerEventId: this.extractProviderEventId(input.payload),
      payloadHash,
      signatureHeader: this.normalizeOptionalValue(input.signatureHeader),
      objectType: this.normalizeOptionalValue(
        (input.payload as { object?: string }).object,
      ),
      externalAccountId: metadata.externalAccountId,
      externalPhoneNumberId: metadata.externalPhoneNumberId,
      status: 'received',
      replayCount: 0,
      lastReplayedAt: null,
      processedInboundMessages: 0,
      processedDeliveryEvents: 0,
      failureReason: null,
      payloadJson: input.rawPayloadJson,
      receivedAt,
      processedAt: null,
      createdAt: receivedAt,
      updatedAt: receivedAt,
    });

    await this.webhookEventEnvelopeRepository.save(envelope);

    try {
      const result = await this.processTenantMetaWhatsappWebhookUseCase.execute({
        tenantSlug: input.tenantSlug,
        provider,
        webhookEventKey: eventKey,
        rawPayloadJson: input.rawPayloadJson,
        payload: input.payload,
      });

      const processedEnvelope = WebhookEventEnvelope.create({
        ...envelope.toPrimitives(),
        status: 'processed',
        processedInboundMessages: result.processedInboundMessages,
        processedDeliveryEvents: result.processedDeliveryEvents,
        processedAt: receivedAt,
        updatedAt: receivedAt,
      });

      await this.webhookEventEnvelopeRepository.save(processedEnvelope);

      return {
        tenantSlug: input.tenantSlug,
        envelopeId: processedEnvelope.id,
        eventKey: processedEnvelope.eventKey,
        duplicate: false,
        envelopeStatus: 'processed',
        processedInboundMessages: result.processedInboundMessages,
        processedDeliveryEvents: result.processedDeliveryEvents,
      };
    } catch (error) {
      const failedEnvelope = WebhookEventEnvelope.create({
        ...envelope.toPrimitives(),
        status: 'failed',
        failureReason:
          error instanceof Error
            ? error.message
            : 'Unknown WhatsApp webhook processing failure.',
        processedAt: receivedAt,
        updatedAt: receivedAt,
      });

      await this.webhookEventEnvelopeRepository.save(failedEnvelope);
      throw error;
    }
  }

  private buildEventKey(
    payload: ProcessTenantMetaWhatsappWebhookInput['payload'],
    rawPayloadJson: string,
  ): string {
    const messageIds: string[] = [];
    const statusIds: string[] = [];
    const accountIds: string[] = [];
    const phoneNumberIds: string[] = [];

    for (const entry of payload.entry ?? []) {
      if (entry.id?.trim()) {
        accountIds.push(entry.id.trim());
      }

      for (const change of entry.changes ?? []) {
        const phoneNumberId = change.value?.metadata?.phone_number_id?.trim();

        if (phoneNumberId) {
          phoneNumberIds.push(phoneNumberId);
        }

        for (const message of change.value?.messages ?? []) {
          if (message.id?.trim()) {
            messageIds.push(message.id.trim());
          }
        }

        for (const status of change.value?.statuses ?? []) {
          if (status.id?.trim()) {
            statusIds.push(status.id.trim());
          }
        }
      }
    }

    const canonicalFingerprint = JSON.stringify({
      object: (payload as { object?: string }).object ?? null,
      accountIds: [...new Set(accountIds)].sort(),
      phoneNumberIds: [...new Set(phoneNumberIds)].sort(),
      messageIds: [...new Set(messageIds)].sort(),
      statusIds: [...new Set(statusIds)].sort(),
    });

    if (
      messageIds.length > 0 ||
      statusIds.length > 0 ||
      accountIds.length > 0 ||
      phoneNumberIds.length > 0
    ) {
      return this.hash(canonicalFingerprint);
    }

    return this.hash(rawPayloadJson);
  }

  private buildPayloadHash(rawPayloadJson: string): string {
    return this.hash(rawPayloadJson);
  }

  private extractProviderEventId(
    payload: ProcessTenantMetaWhatsappWebhookInput['payload'],
  ): string | null {
    const messageIds: string[] = [];
    const statusIds: string[] = [];

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        for (const message of change.value?.messages ?? []) {
          if (message.id?.trim()) {
            messageIds.push(message.id.trim());
          }
        }

        for (const status of change.value?.statuses ?? []) {
          if (status.id?.trim()) {
            statusIds.push(status.id.trim());
          }
        }
      }
    }

    const uniqueMessageIds = [...new Set(messageIds)].sort();
    const uniqueStatusIds = [...new Set(statusIds)].sort();

    if (uniqueMessageIds.length === 1 && uniqueStatusIds.length === 0) {
      return `message:${uniqueMessageIds[0]}`;
    }

    if (uniqueMessageIds.length === 0 && uniqueStatusIds.length === 1) {
      return `status:${uniqueStatusIds[0]}`;
    }

    if (uniqueMessageIds.length > 0 || uniqueStatusIds.length > 0) {
      return `batch:${this.hash(
        JSON.stringify({
          messageIds: uniqueMessageIds,
          statusIds: uniqueStatusIds,
        }),
      ).slice(0, 16)}`;
    }

    return null;
  }

  private hash(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private extractRoutingMetadata(entries: MetaWhatsappWebhookEntry[]): {
    externalAccountId: string | null;
    externalPhoneNumberId: string | null;
  } {
    for (const entry of entries) {
      const externalAccountId = this.normalizeOptionalValue(entry.id);

      for (const change of entry.changes ?? []) {
        const externalPhoneNumberId = this.normalizeOptionalValue(
          change.value?.metadata?.phone_number_id,
        );

        if (externalPhoneNumberId || externalAccountId) {
          return {
            externalAccountId,
            externalPhoneNumberId,
          };
        }
      }

      if (externalAccountId) {
        return {
          externalAccountId,
          externalPhoneNumberId: null,
        };
      }
    }

    return {
      externalAccountId: null,
      externalPhoneNumberId: null,
    };
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }
}
