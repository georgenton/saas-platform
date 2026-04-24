export interface FeatureFlagProps {
  id: string;
  tenantId: string;
  key: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class FeatureFlag {
  private constructor(private readonly props: FeatureFlagProps) {}

  static create(props: FeatureFlagProps): FeatureFlag {
    return new FeatureFlag(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get key(): string {
    return this.props.key;
  }

  get enabled(): boolean {
    return this.props.enabled;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): FeatureFlagProps {
    return { ...this.props };
  }
}
