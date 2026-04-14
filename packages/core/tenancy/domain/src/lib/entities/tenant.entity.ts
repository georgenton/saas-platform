import { TenantStatus } from '../enums/tenant-status.enum';

export interface TenantProps {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Tenant {
  private constructor(private readonly props: TenantProps) {}

  static create(props: TenantProps): Tenant {
    return new Tenant(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get status(): TenantStatus {
    return this.props.status;
  }

  activate(updatedAt: Date): Tenant {
    return new Tenant({
      ...this.props,
      status: TenantStatus.Active,
      updatedAt,
    });
  }

  suspend(updatedAt: Date): Tenant {
    return new Tenant({
      ...this.props,
      status: TenantStatus.Suspended,
      updatedAt,
    });
  }

  cancel(updatedAt: Date): Tenant {
    return new Tenant({
      ...this.props,
      status: TenantStatus.Cancelled,
      updatedAt,
    });
  }

  toPrimitives(): TenantProps {
    return { ...this.props };
  }
}
