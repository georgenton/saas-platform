import { Plan } from '@saas-platform/commercial-domain';

export interface PlanResponseDto {
  id: string;
  key: string;
  name: string;
  description: string | null;
  priceInCents: number;
  currency: string;
  billingCycle: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const toPlanResponseDto = (plan: Plan): PlanResponseDto => ({
  id: plan.id,
  key: plan.key,
  name: plan.name,
  description: plan.description,
  priceInCents: plan.priceInCents,
  currency: plan.currency,
  billingCycle: plan.billingCycle,
  isActive: plan.isActive,
  createdAt: plan.createdAt.toISOString(),
  updatedAt: plan.updatedAt.toISOString(),
});
