import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InvitationIdGenerator } from '@saas-platform/tenancy-application';

@Injectable()
export class UuidInvitationIdGenerator implements InvitationIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
