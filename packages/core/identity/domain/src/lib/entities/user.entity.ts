import { AuthProvider } from '../enums/auth-provider.enum';

export interface UserProps {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  authProvider: AuthProvider;
  externalAuthId?: string | null;
  preferredTenantId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static create(props: UserProps): User {
    return new User({
      ...props,
      email: props.email.trim().toLowerCase(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get authProvider(): AuthProvider {
    return this.props.authProvider;
  }

  get preferredTenantId(): string | null {
    return this.props.preferredTenantId ?? null;
  }

  setPreferredTenant(updatedAt: Date, preferredTenantId?: string | null): User {
    return new User({
      ...this.props,
      preferredTenantId: preferredTenantId ?? null,
      updatedAt,
    });
  }

  toPrimitives(): UserProps {
    return { ...this.props };
  }
}
