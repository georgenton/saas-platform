export interface TaxRateProps {
  id: string;
  tenantId: string;
  name: string;
  percentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TaxRate {
  private constructor(private readonly props: TaxRateProps) {}

  static create(props: TaxRateProps): TaxRate {
    return new TaxRate(props);
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

  get percentage(): number {
    return this.props.percentage;
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

  toPrimitives(): TaxRateProps {
    return { ...this.props };
  }
}
