import { Injectable } from '@nestjs/common';
import { EntitlementRepository } from '@saas-platform/commercial-application';
import { Entitlement, EntitlementValue } from '@saas-platform/commercial-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaEntitlementRepository implements EntitlementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string): Promise<Entitlement[]> {
    const entitlements = await this.prisma.entitlement.findMany({
      where: { tenantId },
      orderBy: [{ key: 'asc' }],
    });

    return entitlements.map((entitlement) => this.toDomain(entitlement));
  }

  private toDomain(entitlement: {
    id: string;
    tenantId: string;
    key: string;
    value: unknown;
    source: string;
    createdAt: Date;
    updatedAt: Date;
  }): Entitlement {
    return Entitlement.create({
      id: entitlement.id,
      tenantId: entitlement.tenantId,
      key: entitlement.key,
      value: entitlement.value as EntitlementValue,
      source: entitlement.source as Entitlement['source'],
      createdAt: entitlement.createdAt,
      updatedAt: entitlement.updatedAt,
    });
  }
}
