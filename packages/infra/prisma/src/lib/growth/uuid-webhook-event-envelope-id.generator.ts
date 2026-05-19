import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { WebhookEventEnvelopeIdGenerator } from '@saas-platform/growth-application';

@Injectable()
export class UuidWebhookEventEnvelopeIdGenerator
  implements WebhookEventEnvelopeIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
