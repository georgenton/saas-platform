import { Plan } from '@saas-platform/commercial-domain';
import { PlanRepository } from '../ports/plan.repository';

export class ListPlansUseCase {
  constructor(private readonly planRepository: PlanRepository) {}

  async execute(): Promise<Plan[]> {
    return this.planRepository.findAll();
  }
}
