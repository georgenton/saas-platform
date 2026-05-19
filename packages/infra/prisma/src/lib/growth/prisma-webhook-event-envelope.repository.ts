import { Injectable } from '@nestjs/common';
import { WebhookEventEnvelopeRepository } from '@saas-platform/growth-application';
import {
  WebhookEventChannel,
  WebhookEventEnvelope,
  WebhookEventEnvelopeStatus,
  WebhookEventProvider,
} from '@saas-platform/growth-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaWebhookEventEnvelopeRepository
  implements WebhookEventEnvelopeRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(envelope: WebhookEventEnvelope): Promise<void> {
    const data = envelope.toPrimitives();

    await this.webhookEventEnvelopeDelegate.upsert({
      where: { id: data.id },
      update: {
        providerEventId: data.providerEventId,
        payloadHash: data.payloadHash,
        signatureHeader: data.signatureHeader,
        objectType: data.objectType,
        externalAccountId: data.externalAccountId,
        externalPhoneNumberId: data.externalPhoneNumberId,
        status: data.status,
        replayCount: data.replayCount,
        lastReplayedAt: data.lastReplayedAt,
        processedInboundMessages: data.processedInboundMessages,
        processedDeliveryEvents: data.processedDeliveryEvents,
        failureReason: data.failureReason,
        payloadJson: data.payloadJson,
        receivedAt: data.receivedAt,
        processedAt: data.processedAt,
        updatedAt: data.updatedAt,
      },
      create: {
        id: data.id,
        tenantId: data.tenantId,
        provider: data.provider,
        channel: data.channel,
        eventKey: data.eventKey,
        providerEventId: data.providerEventId,
        payloadHash: data.payloadHash,
        signatureHeader: data.signatureHeader,
        objectType: data.objectType,
        externalAccountId: data.externalAccountId,
        externalPhoneNumberId: data.externalPhoneNumberId,
        status: data.status,
        replayCount: data.replayCount,
        lastReplayedAt: data.lastReplayedAt,
        processedInboundMessages: data.processedInboundMessages,
        processedDeliveryEvents: data.processedDeliveryEvents,
        failureReason: data.failureReason,
        payloadJson: data.payloadJson,
        receivedAt: data.receivedAt,
        processedAt: data.processedAt,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
  }

  async findByTenantId(tenantId: string): Promise<WebhookEventEnvelope[]> {
    const envelopes = await this.webhookEventEnvelopeDelegate.findMany({
      where: {
        tenantId,
      },
      orderBy: [{ receivedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return envelopes.map((envelope) => this.toDomain(envelope as any));
  }

  async findByTenantIdAndId(
    tenantId: string,
    envelopeId: string,
  ): Promise<WebhookEventEnvelope | null> {
    const envelope = await this.webhookEventEnvelopeDelegate.findFirst({
      where: {
        tenantId,
        id: envelopeId,
      },
    });

    return envelope ? this.toDomain(envelope as any) : null;
  }

  async findByTenantIdAndProviderAndEventKey(
    tenantId: string,
    provider: string,
    eventKey: string,
  ): Promise<WebhookEventEnvelope | null> {
    const envelope = await this.webhookEventEnvelopeDelegate.findFirst({
      where: {
        tenantId,
        provider,
        eventKey,
      },
    });

    return envelope ? this.toDomain(envelope as any) : null;
  }

  private toDomain(record: {
    id: string;
    tenantId: string;
    provider: string;
    channel: string;
    eventKey: string;
    providerEventId: string | null;
    payloadHash: string;
    signatureHeader: string | null;
    objectType: string | null;
    externalAccountId: string | null;
    externalPhoneNumberId: string | null;
    status: string;
    replayCount: number;
    lastReplayedAt: Date | null;
    processedInboundMessages: number;
    processedDeliveryEvents: number;
    failureReason: string | null;
    payloadJson: string;
    receivedAt: Date;
    processedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): WebhookEventEnvelope {
    return WebhookEventEnvelope.create({
      id: record.id,
      tenantId: record.tenantId,
      provider: record.provider as WebhookEventProvider,
      channel: record.channel as WebhookEventChannel,
      eventKey: record.eventKey,
      providerEventId: record.providerEventId,
      payloadHash: record.payloadHash,
      signatureHeader: record.signatureHeader,
      objectType: record.objectType,
      externalAccountId: record.externalAccountId,
      externalPhoneNumberId: record.externalPhoneNumberId,
      status: record.status as WebhookEventEnvelopeStatus,
      replayCount: record.replayCount,
      lastReplayedAt: record.lastReplayedAt,
      processedInboundMessages: record.processedInboundMessages,
      processedDeliveryEvents: record.processedDeliveryEvents,
      failureReason: record.failureReason,
      payloadJson: record.payloadJson,
      receivedAt: record.receivedAt,
      processedAt: record.processedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private get prismaClient(): PrismaService {
    return this.prisma;
  }

  private get webhookEventEnvelopeDelegate(): any {
    return (this.prismaClient as any).webhookEventEnvelope;
  }
}
