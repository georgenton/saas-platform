export interface InvoiceNumberingSettingsProps {
  id: string;
  tenantId: string;
  documentCode: string;
  establishmentCode: string;
  emissionPointCode: string;
  nextSequenceNumber: number;
  createdAt: Date;
  updatedAt: Date;
}

export class InvoiceNumberingSettings {
  private constructor(
    private readonly props: InvoiceNumberingSettingsProps,
  ) {}

  static create(
    props: InvoiceNumberingSettingsProps,
  ): InvoiceNumberingSettings {
    return new InvoiceNumberingSettings(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get documentCode(): string {
    return this.props.documentCode;
  }

  get establishmentCode(): string {
    return this.props.establishmentCode;
  }

  get emissionPointCode(): string {
    return this.props.emissionPointCode;
  }

  get nextSequenceNumber(): number {
    return this.props.nextSequenceNumber;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  reserveNextSequence(at: Date): {
    sequenceNumber: number;
    nextSettings: InvoiceNumberingSettings;
  } {
    const sequenceNumber = this.nextSequenceNumber;

    return {
      sequenceNumber,
      nextSettings: InvoiceNumberingSettings.create({
        ...this.props,
        nextSequenceNumber: sequenceNumber + 1,
        updatedAt: at,
      }),
    };
  }

  toPrimitives(): InvoiceNumberingSettingsProps {
    return { ...this.props };
  }
}
