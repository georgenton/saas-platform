export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'void';

export interface InvoiceProps {
  id: string;
  tenantId: string;
  customerId: string;
  number: string;
  status: InvoiceStatus;
  currency: string;
  issuedAt: Date;
  dueAt: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Invoice {
  private constructor(private readonly props: InvoiceProps) {}

  static create(props: InvoiceProps): Invoice {
    return new Invoice(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get number(): string {
    return this.props.number;
  }

  get status(): InvoiceStatus {
    return this.props.status;
  }

  get currency(): string {
    return this.props.currency;
  }

  get issuedAt(): Date {
    return this.props.issuedAt;
  }

  get dueAt(): Date | null {
    return this.props.dueAt;
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

  toPrimitives(): InvoiceProps {
    return { ...this.props };
  }
}
