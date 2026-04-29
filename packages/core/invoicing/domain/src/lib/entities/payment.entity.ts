export type PaymentStatus = 'posted' | 'reversed';

export interface PaymentProps {
  id: string;
  tenantId: string;
  invoiceId: string;
  amountInCents: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  reference: string | null;
  paidAt: Date;
  notes: string | null;
  reversedAt: Date | null;
  reversalReason: string | null;
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

  get status(): PaymentStatus {
    return this.props.status;
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

  get reversedAt(): Date | null {
    return this.props.reversedAt;
  }

  get reversalReason(): string | null {
    return this.props.reversalReason;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  canReverse(): boolean {
    return this.status === 'posted';
  }

  reverse(at: Date, reason: string | null): Payment {
    return Payment.create({
      ...this.props,
      status: 'reversed',
      reversedAt: at,
      reversalReason: reason,
      updatedAt: at,
    });
  }

  toPrimitives(): PaymentProps {
    return { ...this.props };
  }
}
