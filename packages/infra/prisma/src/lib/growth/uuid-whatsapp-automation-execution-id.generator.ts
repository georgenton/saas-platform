import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { WhatsappAutomationExecutionIdGenerator } from '@saas-platform/growth-application';

@Injectable()
export class UuidWhatsappAutomationExecutionIdGenerator
  implements WhatsappAutomationExecutionIdGenerator
{
  generate(): string {
    return randomUUID();
  }
}

