import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { SubscriptionIdGenerator } from '@saas-platform/commercial-application';

@Injectable()
export class UuidSubscriptionIdGenerator implements SubscriptionIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
