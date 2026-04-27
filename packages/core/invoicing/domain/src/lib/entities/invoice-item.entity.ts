export interface InvoiceItemProps {
  id: string;
  tenantId: string;
  invoiceId: string;
  position: number;
  description: string;
  quantity: number;
  unitPriceInCents: number;
  lineTotalInCents: number;
  createdAt: Date;
  updatedAt: Date;
}

export class InvoiceItem {
  private constructor(private readonly props: InvoiceItemProps) {}

  static create(props: InvoiceItemProps): InvoiceItem {
    return new InvoiceItem(props);
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

  get position(): number {
    return this.props.position;
  }

  get description(): string {
    return this.props.description;
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get unitPriceInCents(): number {
    return this.props.unitPriceInCents;
  }

  get lineTotalInCents(): number {
    return this.props.lineTotalInCents;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): InvoiceItemProps {
    return { ...this.props };
  }
}
