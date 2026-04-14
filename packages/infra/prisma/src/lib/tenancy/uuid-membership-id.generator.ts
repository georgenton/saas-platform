import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { MembershipIdGenerator } from '@saas-platform/tenancy-application';

@Injectable()
export class UuidMembershipIdGenerator implements MembershipIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
