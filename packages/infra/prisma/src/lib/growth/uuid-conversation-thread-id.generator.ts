import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ConversationThreadIdGenerator } from '@saas-platform/growth-application';

@Injectable()
export class UuidConversationThreadIdGenerator
  implements ConversationThreadIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
