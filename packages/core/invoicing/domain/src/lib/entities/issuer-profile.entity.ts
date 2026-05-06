export type IssuerEnvironment = 'test' | 'production';
export type IssuerEmissionType = 'normal';

export interface IssuerProfileProps {
  id: string;
  tenantId: string;
  legalName: string;
  commercialName: string | null;
  taxId: string;
  environment: IssuerEnvironment;
  emissionType: IssuerEmissionType;
  accountingObligated: boolean;
  specialTaxpayerCode: string | null;
  rimpeTaxpayerType: string | null;
  matrixAddress: string;
  establishmentAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

export class IssuerProfile {
  private constructor(private readonly props: IssuerProfileProps) {}

  static create(props: IssuerProfileProps): IssuerProfile {
    return new IssuerProfile(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get legalName(): string {
    return this.props.legalName;
  }

  get commercialName(): string | null {
    return this.props.commercialName;
  }

  get taxId(): string {
    return this.props.taxId;
  }

  get environment(): IssuerEnvironment {
    return this.props.environment;
  }

  get emissionType(): IssuerEmissionType {
    return this.props.emissionType;
  }

  get accountingObligated(): boolean {
    return this.props.accountingObligated;
  }

  get specialTaxpayerCode(): string | null {
    return this.props.specialTaxpayerCode;
  }

  get rimpeTaxpayerType(): string | null {
    return this.props.rimpeTaxpayerType;
  }

  get matrixAddress(): string {
    return this.props.matrixAddress;
  }

  get establishmentAddress(): string {
    return this.props.establishmentAddress;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): IssuerProfileProps {
    return { ...this.props };
  }
}
