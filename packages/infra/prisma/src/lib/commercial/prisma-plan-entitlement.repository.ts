import { Injectable } from '@nestjs/common';
import { PlanEntitlementRepository } from '@saas-platform/commercial-application';
import {
  EntitlementValue,
  PlanEntitlement,
} from '@saas-platform/commercial-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPlanEntitlementRepository implements PlanEntitlementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByPlanId(planId: string): Promise<PlanEntitlement[]> {
    const entitlements = await this.prisma.planEntitlement.findMany({
      where: { planId },
      orderBy: [{ key: 'asc' }],
    });

    return entitlements.map((entitlement) => this.toDomain(entitlement));
  }

  private toDomain(entitlement: {
    id: string;
    planId: string;
    key: string;
    value: unknown;
    createdAt: Date;
    updatedAt: Date;
  }): PlanEntitlement {
    return PlanEntitlement.create({
      id: entitlement.id,
      planId: entitlement.planId,
      key: entitlement.key,
      value: entitlement.value as EntitlementValue,
      createdAt: entitlement.createdAt,
      updatedAt: entitlement.updatedAt,
    });
  }
}
