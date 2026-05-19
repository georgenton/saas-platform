import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { WhatsappAutomationRuleIdGenerator } from '@saas-platform/growth-application';

@Injectable()
export class UuidWhatsappAutomationRuleIdGenerator
  implements WhatsappAutomationRuleIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}
