import { Plan } from '@saas-platform/commercial-domain';
import { PlanNotFoundError } from '../errors/plan-not-found.error';
import { PlanRepository } from '../ports/plan.repository';

export class GetPlanByKeyUseCase {
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(planKey: string): Promise<Plan> {
    const plan = await this.planRepository.findByKey(planKey);

    if (!plan) {
      throw new PlanNotFoundError(planKey);
    }

    return plan;
  }
}
