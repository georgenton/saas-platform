import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TenantIdGenerator } from '@saas-platform/tenancy-application';

@Injectable()
export class UuidTenantIdGenerator implements TenantIdGenerator {
  generate(): string {
    return randomUUID();
  }
}
