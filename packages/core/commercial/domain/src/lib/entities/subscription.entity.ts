export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'cancelled'
  | 'expired';

export interface SubscriptionProps {
  id: string;
  tenantId: string;
  planId: string;
  status: SubscriptionStatus;
  startedAt: Date;
  expiresAt: Date | null;
  trialEndsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Subscription {
  private constructor(private readonly props: SubscriptionProps) {}

  static create(props: SubscriptionProps): Subscription {
    return new Subscription(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get planId(): string {
    return this.props.planId;
  }

  get status(): SubscriptionStatus {
    return this.props.status;
  }

  get startedAt(): Date {
    return this.props.startedAt;
  }

  get expiresAt(): Date | null {
    return this.props.expiresAt;
  }

  get trialEndsAt(): Date | null {
    return this.props.trialEndsAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): SubscriptionProps {
    return { ...this.props };
  }
}
