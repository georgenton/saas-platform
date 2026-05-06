export type ElectronicSubmissionProvider = 'stub_sri' | 'sri_offline_ws';
export type ElectronicSubmissionTransmissionMode = 'sync_stub' | 'offline';
export type ElectronicSubmissionEnvironment = 'test' | 'production';

export interface ElectronicSubmissionSettingsProps {
  id: string;
  tenantId: string;
  provider: ElectronicSubmissionProvider;
  environment: ElectronicSubmissionEnvironment;
  transmissionMode: ElectronicSubmissionTransmissionMode;
  receptionUrl: string | null;
  authorizationUrl: string | null;
  credentialsSecretRef: string | null;
  timeoutMs: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ElectronicSubmissionSettings {
  private constructor(
    private readonly props: ElectronicSubmissionSettingsProps,
  ) {}

  static create(
    props: ElectronicSubmissionSettingsProps,
  ): ElectronicSubmissionSettings {
    return new ElectronicSubmissionSettings(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get provider(): ElectronicSubmissionProvider {
    return this.props.provider;
  }

  get environment(): ElectronicSubmissionEnvironment {
    return this.props.environment;
  }

  get transmissionMode(): ElectronicSubmissionTransmissionMode {
    return this.props.transmissionMode;
  }

  get receptionUrl(): string | null {
    return this.props.receptionUrl;
  }

  get authorizationUrl(): string | null {
    return this.props.authorizationUrl;
  }

  get credentialsSecretRef(): string | null {
    return this.props.credentialsSecretRef;
  }

  get timeoutMs(): number {
    return this.props.timeoutMs;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  requiresRemoteGateway(): boolean {
    return this.props.provider === 'sri_offline_ws';
  }

  hasGatewayConfigured(): boolean {
    if (!this.requiresRemoteGateway()) {
      return true;
    }

    return Boolean(this.props.receptionUrl && this.props.authorizationUrl);
  }

  toPrimitives(): ElectronicSubmissionSettingsProps {
    return { ...this.props };
  }
}
