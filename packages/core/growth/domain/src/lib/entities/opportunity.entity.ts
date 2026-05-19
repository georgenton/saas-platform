export type OpportunityStage =
  | 'new'
  | 'discovery'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface OpportunityProps {
  id: string;
  tenantId: string;
  leadId: string | null;
  threadId: string | null;
  assigneeUserId: string | null;
  title: string;
  stage: OpportunityStage;
  amountInCents: number | null;
  currency: string | null;
  notes: string | null;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Opportunity {
  private constructor(private readonly props: OpportunityProps) {}

  static create(props: OpportunityProps): Opportunity {
    return new Opportunity(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get leadId(): string | null {
    return this.props.leadId;
  }

  get threadId(): string | null {
    return this.props.threadId;
  }

  get assigneeUserId(): string | null {
    return this.props.assigneeUserId;
  }

  get title(): string {
    return this.props.title;
  }

  get stage(): OpportunityStage {
    return this.props.stage;
  }

  get amountInCents(): number | null {
    return this.props.amountInCents;
  }

  get currency(): string | null {
    return this.props.currency;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  get closedAt(): Date | null {
    return this.props.closedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): OpportunityProps {
    return { ...this.props };
  }
}
