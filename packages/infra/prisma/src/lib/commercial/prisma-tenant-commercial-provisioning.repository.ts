import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  AssignPlanToTenantParams,
  TenantCommercialProvisioningRepository,
} from '@saas-platform/commercial-application';
import {
  Entitlement,
  EntitlementValue,
  Subscription,
} from '@saas-platform/commercial-domain';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaTenantCommercialProvisioningRepository
  implements TenantCommercialProvisioningRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async assignPlanToTenant(
    params: AssignPlanToTenantParams,
  ): Promise<{ subscription: Subscription; entitlements: Entitlement[] }> {
    return this.prisma.$transaction(async (tx) => {
      const existingSubscription = await tx.subscription.findUnique({
        where: { tenantId: params.tenantId },
      });

      const subscription = existingSubscription
        ? await tx.subscription.update({
            where: { tenantId: params.tenantId },
            data: {
              planId: params.plan.id,
              status: params.status,
              startedAt: params.startedAt,
              expiresAt: params.expiresAt,
              trialEndsAt: params.trialEndsAt,
            },
          })
        : await tx.subscription.create({
            data: {
              id: params.subscriptionId,
              tenantId: params.tenantId,
              planId: params.plan.id,
              status: params.status,
              startedAt: params.startedAt,
              expiresAt: params.expiresAt,
              trialEndsAt: params.trialEndsAt,
            },
          });

      await tx.entitlement.deleteMany({
        where: {
          tenantId: params.tenantId,
          source: 'plan',
        },
      });

      if (params.planEntitlements.length > 0) {
        await tx.entitlement.createMany({
          data: params.planEntitlements.map((entitlement) => ({
            id: `entitlement_${params.tenantId}_${entitlement.key}`,
            tenantId: params.tenantId,
            key: entitlement.key,
            value: entitlement.value as Prisma.InputJsonValue,
            source: 'plan',
          })),
        });
      }

      const entitlements = await tx.entitlement.findMany({
        where: { tenantId: params.tenantId },
        orderBy: [{ key: 'asc' }],
      });

      return {
        subscription: this.toSubscription(subscription),
        entitlements: entitlements.map((entitlement) =>
          this.toEntitlement(entitlement),
        ),
      };
    });
  }

  private toSubscription(subscription: {
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

  private toEntitlement(entitlement: {
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
