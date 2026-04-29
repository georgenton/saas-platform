export interface PaymentProps {
  id: string;
  tenantId: string;
  invoiceId: string;
  amountInCents: number;
  currency: string;
  method: string;
  reference: string | null;
  paidAt: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment {
  private constructor(private readonly props: PaymentProps) {}

  static create(props: PaymentProps): Payment {
    return new Payment(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get invoiceId(): string {
    return this.props.invoiceId;
  }

  get amountInCents(): number {
    return this.props.amountInCents;
  }

  get currency(): string {
    return this.props.currency;
  }

  get method(): string {
    return this.props.method;
  }

  get reference(): string | null {
    return this.props.reference;
  }

  get paidAt(): Date {
    return this.props.paidAt;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): PaymentProps {
    return { ...this.props };
  }
}
