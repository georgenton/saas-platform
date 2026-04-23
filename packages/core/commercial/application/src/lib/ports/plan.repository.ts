import { Plan } from '@saas-platform/commercial-domain';

export interface PlanRepository {
  findAll(): Promise<Plan[]>;
  findByKey(key: string): Promise<Plan | null>;
}
