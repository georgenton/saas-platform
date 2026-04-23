import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '@saas-platform/commercial-application';
import { Subscription } from '@saas-platform/commercial-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { tenantId },
    });

    return subscription ? this.toDomain(subscription) : null;
  }

  private toDomain(subscription: {
    id: string;
    tenantId: string;
    planId: string;
    status: string;
    startedAt: Date;
    expiresAt: Date | null;
    trialEndsAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): Subscription {
    return Subscription.create({
      id: subscription.id,
      tenantId: subscription.tenantId,
      planId: subscription.planId,
      status: subscription.status as Subscription['status'],
      startedAt: subscription.startedAt,
      expiresAt: subscription.expiresAt,
      trialEndsAt: subscription.trialEndsAt,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    });
  }
}
