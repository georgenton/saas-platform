export type LeadStatus =
  | 'captured'
  | 'contacted'
  | 'qualified'
  | 'disqualified'
  | 'converted';

export interface LeadProps {
  id: string;
  tenantId: string;
  fullName: string;
  email: string | null;
  phoneE164: string | null;
  whatsappE164: string | null;
  source: string;
  status: LeadStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Lead {
  private constructor(private readonly props: LeadProps) {}

  static create(props: LeadProps): Lead {
    return new Lead(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get email(): string | null {
    return this.props.email;
  }

  get phoneE164(): string | null {
    return this.props.phoneE164;
  }

  get whatsappE164(): string | null {
    return this.props.whatsappE164;
  }

  get source(): string {
    return this.props.source;
  }

  get status(): LeadStatus {
    return this.props.status;
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

  toPrimitives(): LeadProps {
    return { ...this.props };
  }
}
