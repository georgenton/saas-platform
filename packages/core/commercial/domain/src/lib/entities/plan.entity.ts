export type BillingCycle = 'monthly' | 'yearly';

export interface PlanProps {
  id: string;
  key: string;
  name: string;
  description: string | null;
  priceInCents: number;
  currency: string;
  billingCycle: BillingCycle;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Plan {
  private constructor(private readonly props: PlanProps) {}

  static create(props: PlanProps): Plan {
    return new Plan(props);
  }

  get id(): string {
    return this.props.id;
  }

  get key(): string {
    return this.props.key;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get priceInCents(): number {
    return this.props.priceInCents;
  }

  get currency(): string {
    return this.props.currency;
  }

  get billingCycle(): BillingCycle {
    return this.props.billingCycle;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): PlanProps {
    return { ...this.props };
  }
}
