import { Injectable } from '@nestjs/common';
import { PlanRepository } from '@saas-platform/commercial-application';
import { Plan } from '@saas-platform/commercial-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPlanRepository implements PlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Plan[]> {
    const plans = await this.prisma.plan.findMany({
      orderBy: [{ priceInCents: 'asc' }, { createdAt: 'asc' }],
    });

    return plans.map((plan) => this.toDomain(plan));
  }

  async findByKey(key: string): Promise<Plan | null> {
    const plan = await this.prisma.plan.findUnique({
      where: { key },
    });

    return plan ? this.toDomain(plan) : null;
  }

  private toDomain(plan: {
    id: string;
    key: string;
    name: string;
    description: string | null;
    priceInCents: number;
    currency: string;
    billingCycle: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Plan {
    return Plan.create({
      id: plan.id,
      key: plan.key,
      name: plan.name,
      description: plan.description,
      priceInCents: plan.priceInCents,
      currency: plan.currency,
      billingCycle: plan.billingCycle as Plan['billingCycle'],
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    });
  }
}
