import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OpportunityIdGenerator } from '@saas-platform/growth-application';

@Injectable()
export class UuidOpportunityIdGenerator implements OpportunityIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
