export interface PlatformModuleProps {
  id: string;
  productId: string;
  key: string;
  name: string;
  description?: string | null;
  isCore: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PlatformModule {
  private constructor(private readonly props: PlatformModuleProps) {}

  static create(props: PlatformModuleProps): PlatformModule {
    return new PlatformModule(props);
  }

  get id(): string {
    return this.props.id;
  }

  get productId(): string {
    return this.props.productId;
  }

  get key(): string {
    return this.props.key;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  toPrimitives(): PlatformModuleProps {
    return { ...this.props };
  }
}
