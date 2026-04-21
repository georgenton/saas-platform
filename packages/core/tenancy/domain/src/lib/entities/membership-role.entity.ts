export interface MembershipRoleProps {
  id: string;
  membershipId: string;
  roleId: string;
  createdAt: Date;
}

export class MembershipRole {
  private constructor(private readonly props: MembershipRoleProps) {}

  static create(props: MembershipRoleProps): MembershipRole {
    return new MembershipRole(props);
  }

  get id(): string {
    return this.props.id;
  }

  toPrimitives(): MembershipRoleProps {
    return { ...this.props };
  }
}
