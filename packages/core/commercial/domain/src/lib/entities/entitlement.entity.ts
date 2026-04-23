import { EntitlementValue } from './plan-entitlement.entity';

export type EntitlementSource =
  | 'plan'
  | 'manual_override'
  | 'promotion'
  | 'addon';

export interface EntitlementProps {
  id: string;
  tenantId: string;
  key: string;
  value: EntitlementValue;
  source: EntitlementSource;
  createdAt: Date;
  updatedAt: Date;
}

export class Entitlement {
  private constructor(private readonly props: EntitlementProps) {}

  static create(props: EntitlementProps): Entitlement {
    return new Entitlement(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get key(): string {
    return this.props.key;
  }

  get value(): EntitlementValue {
    return this.props.value;
  }

  get source(): EntitlementSource {
    return this.props.source;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): EntitlementProps {
    return { ...this.props };
  }
}
