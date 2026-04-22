import { InvitationStatus } from '../enums/invitation-status.enum';

export interface InvitationProps {
  id: string;
  tenantId: string;
  email: string;
  roleKey: string;
  status: InvitationStatus;
  invitedByUserId: string;
  acceptedByUserId?: string | null;
  expiresAt: Date;
  acceptedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Invitation {
  private constructor(private readonly props: InvitationProps) {}

  static create(props: InvitationProps): Invitation {
    return new Invitation({
      ...props,
      email: props.email.trim().toLowerCase(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get email(): string {
    return this.props.email;
  }

  get roleKey(): string {
    return this.props.roleKey;
  }

  get status(): InvitationStatus {
    return this.props.status;
  }

  get invitedByUserId(): string {
    return this.props.invitedByUserId;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  accept(updatedAt: Date, acceptedByUserId: string): Invitation {
    return new Invitation({
      ...this.props,
      status: InvitationStatus.Accepted,
      acceptedByUserId,
      acceptedAt: updatedAt,
      updatedAt,
    });
  }

  expire(updatedAt: Date): Invitation {
    return new Invitation({
      ...this.props,
      status: InvitationStatus.Expired,
      updatedAt,
    });
  }

  cancel(updatedAt: Date): Invitation {
    return new Invitation({
      ...this.props,
      status: InvitationStatus.Cancelled,
      updatedAt,
    });
  }

  resend(updatedAt: Date, expiresAt: Date): Invitation {
    return new Invitation({
      ...this.props,
      status: InvitationStatus.Pending,
      acceptedByUserId: null,
      acceptedAt: null,
      expiresAt,
      updatedAt,
    });
  }

  toPrimitives(): InvitationProps {
    return { ...this.props };
  }
}
