export interface RoleProps {
  id: string;
  key: string;
  name: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Role {
  private constructor(private readonly props: RoleProps) {}

  static create(props: RoleProps): Role {
    return new Role(props);
  }

  get id(): string {
    return this.props.id;
  }

  get key(): string {
    return this.props.key;
  }

  toPrimitives(): RoleProps {
    return { ...this.props };
  }
}
