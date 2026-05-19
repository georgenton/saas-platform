import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ConversationMessageIdGenerator } from '@saas-platform/growth-application';

@Injectable()
export class UuidConversationMessageIdGenerator
  implements ConversationMessageIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
