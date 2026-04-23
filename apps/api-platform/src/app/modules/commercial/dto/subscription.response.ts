import { Subscription } from '@saas-platform/commercial-domain';

export interface SubscriptionResponseDto {
  id: string;
  tenantId: string;
  planId: string;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  trialEndsAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const toSubscriptionResponseDto = (
  subscription: Subscription,
): SubscriptionResponseDto => ({
  id: subscription.id,
  tenantId: subscription.tenantId,
  planId: subscription.planId,
  status: subscription.status,
  startedAt: subscription.startedAt.toISOString(),
  expiresAt: subscription.expiresAt?.toISOString() ?? null,
  trialEndsAt: subscription.trialEndsAt?.toISOString() ?? null,
  createdAt: subscription.createdAt.toISOString(),
  updatedAt: subscription.updatedAt.toISOString(),
});
