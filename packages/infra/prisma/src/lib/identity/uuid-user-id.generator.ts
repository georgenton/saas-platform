import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UserIdGenerator } from '@saas-platform/identity-application';

@Injectable()
export class UuidUserIdGenerator implements UserIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
