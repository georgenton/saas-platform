export interface CustomerProps {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  taxId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer {
  private constructor(private readonly props: CustomerProps) {}

  static create(props: CustomerProps): Customer {
    return new Customer(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string | null {
    return this.props.email;
  }

  get taxId(): string | null {
    return this.props.taxId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): CustomerProps {
    return { ...this.props };
  }
}
