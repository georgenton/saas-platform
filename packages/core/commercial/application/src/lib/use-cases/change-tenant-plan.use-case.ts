import {
  PlanNotFoundError,
} from '../errors/plan-not-found.error';
import { PlanEntitlementRepository } from '../ports/plan-entitlement.repository';
import { PlanRepository } from '../ports/plan.repository';
import { SubscriptionIdGenerator } from '../ports/subscription-id.generator';
import { TenantCommercialProvisioningRepository } from '../ports/tenant-commercial-provisioning.repository';
import { TenantCommercialSnapshot } from '../types/tenant-commercial-snapshot';
import {
  SubscriptionStatus,
} from '@saas-platform/commercial-domain';
import { TenantNotFoundError, TenantRepository } from '@saas-platform/tenancy-application';

export interface ChangeTenantPlanInput {
  tenantSlug: string;
  planKey: string;
  status: SubscriptionStatus;
  startedAt?: Date;
  expiresAt?: Date | null;
  trialEndsAt?: Date | null;
}

export class ChangeTenantPlanUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly planRepository: PlanRepository,
    private readonly planEntitlementRepository: PlanEntitlementRepository,
    private readonly subscriptionIdGenerator: SubscriptionIdGenerator,
    private readonly tenantCommercialProvisioningRepository: TenantCommercialProvisioningRepository,
  ) {}

  async execute(input: ChangeTenantPlanInput): Promise<TenantCommercialSnapshot> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const plan = await this.planRepository.findByKey(input.planKey);

    if (!plan) {
      throw new PlanNotFoundError(input.planKey);
    }

    const planEntitlements = await this.planEntitlementRepository.findByPlanId(
      plan.id,
    );

    return this.tenantCommercialProvisioningRepository.assignPlanToTenant({
      tenantId: tenant.id,
      plan,
      planEntitlements,
      subscriptionId: this.subscriptionIdGenerator.generate(),
      status: input.status,
      startedAt: input.startedAt ?? new Date(),
      expiresAt: input.expiresAt ?? null,
      trialEndsAt: input.trialEndsAt ?? null,
    });
  }
}
