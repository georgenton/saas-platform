import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ConversationDeliveryEventIdGenerator } from '@saas-platform/growth-application';

@Injectable()
export class UuidConversationDeliveryEventIdGenerator
  implements ConversationDeliveryEventIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
