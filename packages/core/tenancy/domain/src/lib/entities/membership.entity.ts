import { MembershipStatus } from '../enums/membership-status.enum';

export interface MembershipProps {
  id: string;
  tenantId: string;
  userId: string;
  status: MembershipStatus;
  invitedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Membership {
  private constructor(private readonly props: MembershipProps) {}

  static create(props: MembershipProps): Membership {
    return new Membership(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get status(): MembershipStatus {
    return this.props.status;
  }

  activate(updatedAt: Date): Membership {
    return new Membership({
      ...this.props,
      status: MembershipStatus.Active,
      updatedAt,
    });
  }

  suspend(updatedAt: Date): Membership {
    return new Membership({
      ...this.props,
      status: MembershipStatus.Suspended,
      updatedAt,
    });
  }

  remove(updatedAt: Date): Membership {
    return new Membership({
      ...this.props,
      status: MembershipStatus.Removed,
      updatedAt,
    });
  }

  toPrimitives(): MembershipProps {
    return { ...this.props };
  }
}
