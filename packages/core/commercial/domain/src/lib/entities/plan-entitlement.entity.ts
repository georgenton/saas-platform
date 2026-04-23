export type EntitlementValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[]
  | boolean[]
  | Record<string, unknown>;

export interface PlanEntitlementProps {
  id: string;
  planId: string;
  key: string;
  value: EntitlementValue;
  createdAt: Date;
  updatedAt: Date;
}

export class PlanEntitlement {
  private constructor(private readonly props: PlanEntitlementProps) {}

  static create(props: PlanEntitlementProps): PlanEntitlement {
    return new PlanEntitlement(props);
  }

  get id(): string {
    return this.props.id;
  }

  get planId(): string {
    return this.props.planId;
  }

  get key(): string {
    return this.props.key;
  }

  get value(): EntitlementValue {
    return this.props.value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): PlanEntitlementProps {
    return { ...this.props };
  }
}
