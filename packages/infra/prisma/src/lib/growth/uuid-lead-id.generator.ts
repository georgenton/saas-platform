import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { LeadIdGenerator } from '@saas-platform/growth-application';

@Injectable()
export class UuidLeadIdGenerator implements LeadIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
