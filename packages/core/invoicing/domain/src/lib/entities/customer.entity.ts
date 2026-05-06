export type BuyerIdentificationType = '04' | '05' | '06' | '07' | '08';

export interface CustomerProps {
  id: string;
  tenantId: string;
  name: string;
  email: string | null;
  taxId: string | null;
  identificationType?: BuyerIdentificationType | null;
  identification?: string | null;
  billingAddress?: string | null;
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

  get identificationType(): BuyerIdentificationType | null {
    return this.props.identificationType ?? null;
  }

  get identification(): string | null {
    return this.props.identification ?? null;
  }

  get billingAddress(): string | null {
    return this.props.billingAddress ?? null;
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
