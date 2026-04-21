export interface PermissionProps {
  id: string;
  key: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Permission {
  private constructor(private readonly props: PermissionProps) {}

  static create(props: PermissionProps): Permission {
    return new Permission(props);
  }

  get id(): string {
    return this.props.id;
  }

  get key(): string {
    return this.props.key;
  }

  toPrimitives(): PermissionProps {
    return { ...this.props };
  }
}
