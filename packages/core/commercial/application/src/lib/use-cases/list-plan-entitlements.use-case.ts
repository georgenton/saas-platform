import { PlanEntitlement } from '@saas-platform/commercial-domain';
import { PlanNotFoundError } from '../errors/plan-not-found.error';
import { PlanEntitlementRepository } from '../ports/plan-entitlement.repository';
import { PlanRepository } from '../ports/plan.repository';

export class ListPlanEntitlementsUseCase {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly planEntitlementRepository: PlanEntitlementRepository,
  ) {}

  async execute(planKey: string): Promise<PlanEntitlement[]> {
    const plan = await this.planRepository.findByKey(planKey);

    if (!plan) {
      throw new PlanNotFoundError(planKey);
    }

    return this.planEntitlementRepository.findByPlanId(plan.id);
  }
}
