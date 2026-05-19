import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { WhatsappMessageTemplateIdGenerator } from '@saas-platform/growth-application';

@Injectable()
export class UuidWhatsappMessageTemplateIdGenerator
  implements WhatsappMessageTemplateIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
