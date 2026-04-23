import { SubscriptionStatus } from '@saas-platform/commercial-domain';
import { IsIn, IsISO8601, IsOptional, IsString } from 'class-validator';

const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  'trialing',
  'active',
  'past_due',
  'cancelled',
  'expired',
];

export class SetTenantSubscriptionRequestDto {
  @IsString()
  planKey!: string;

  @IsOptional()
  @IsIn(SUBSCRIPTION_STATUSES)
  status?: SubscriptionStatus;

  @IsOptional()
  @IsISO8601()
  startedAt?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsISO8601()
  trialEndsAt?: string;
}
