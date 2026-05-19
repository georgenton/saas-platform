export type ConversationChannel = 'manual' | 'whatsapp';
export type ConversationThreadStatus = 'open' | 'closed';

export interface ConversationThreadProps {
  id: string;
  tenantId: string;
  leadId: string | null;
  assigneeUserId: string | null;
  subject: string;
  channel: ConversationChannel;
  externalConversationId: string | null;
  participantDisplayName: string | null;
  participantHandle: string | null;
  status: ConversationThreadStatus;
  latestMessagePreview: string | null;
  messageCount: number;
  openedAt: Date;
  closedAt: Date | null;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationThread {
  private constructor(private readonly props: ConversationThreadProps) {}

  static create(props: ConversationThreadProps): ConversationThread {
    return new ConversationThread(props);
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

  get assigneeUserId(): string | null {
    return this.props.assigneeUserId;
  }

  get subject(): string {
    return this.props.subject;
  }

  get channel(): ConversationChannel {
    return this.props.channel;
  }

  get externalConversationId(): string | null {
    return this.props.externalConversationId;
  }

  get participantDisplayName(): string | null {
    return this.props.participantDisplayName;
  }

  get participantHandle(): string | null {
    return this.props.participantHandle;
  }

  get status(): ConversationThreadStatus {
    return this.props.status;
  }

  get latestMessagePreview(): string | null {
    return this.props.latestMessagePreview;
  }

  get messageCount(): number {
    return this.props.messageCount;
  }

  get openedAt(): Date {
    return this.props.openedAt;
  }

  get closedAt(): Date | null {
    return this.props.closedAt;
  }

  get lastActivityAt(): Date {
    return this.props.lastActivityAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): ConversationThreadProps {
    return { ...this.props };
  }
}
