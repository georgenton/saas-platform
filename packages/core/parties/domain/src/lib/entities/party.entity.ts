export type PartyKind = 'organization' | 'person' | 'unknown';
export type PartyRole = 'customer' | 'supplier' | 'patient' | 'lead';
export type PartySourceContext = 'invoicing_customer';
export type PartyFiscalCountry = 'EC';
export type PartyFiscalCompletenessStatus = 'complete' | 'needs_review';

export interface PartyFiscalProfile {
  country: PartyFiscalCountry;
  taxpayerId: string | null;
  taxpayerName: string;
  identificationType: string | null;
  fiscalAddress: string | null;
  email: string | null;
  roles: PartyRole[];
  completenessStatus: PartyFiscalCompletenessStatus;
  missingFields: string[];
  reviewNotes: string[];
}

export interface PartyProps {
  id: string;
  tenantId: string;
  displayName: string;
  email: string | null;
  taxId: string | null;
  identificationType: string | null;
  identification: string | null;
  billingAddress: string | null;
  roles: PartyRole[];
  kind: PartyKind;
  sourceContext: PartySourceContext;
  fiscalProfile?: PartyFiscalProfile | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Party {
  private constructor(private readonly props: PartyProps) {}

  static create(props: PartyProps): Party {
    return new Party(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get email(): string | null {
    return this.props.email;
  }

  get taxId(): string | null {
    return this.props.taxId;
  }

  get identificationType(): string | null {
    return this.props.identificationType;
  }

  get identification(): string | null {
    return this.props.identification;
  }

  get billingAddress(): string | null {
    return this.props.billingAddress;
  }

  get roles(): PartyRole[] {
    return [...this.props.roles];
  }

  get kind(): PartyKind {
    return this.props.kind;
  }

  get sourceContext(): PartySourceContext {
    return this.props.sourceContext;
  }

  get fiscalProfile(): PartyFiscalProfile | null {
    return this.props.fiscalProfile ?? null;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): PartyProps {
    return {
      ...this.props,
      roles: [...this.props.roles],
      fiscalProfile: this.props.fiscalProfile
        ? {
            ...this.props.fiscalProfile,
            roles: [...this.props.fiscalProfile.roles],
            missingFields: [...this.props.fiscalProfile.missingFields],
            reviewNotes: [...this.props.fiscalProfile.reviewNotes],
          }
        : null,
    };
  }
}
