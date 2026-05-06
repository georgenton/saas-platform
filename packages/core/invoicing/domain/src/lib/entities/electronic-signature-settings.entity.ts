export type ElectronicSignatureProvider = 'stub_local' | 'xades_pkcs12';
export type ElectronicSignatureStorageMode = 'stub_inline' | 'secret_ref';

export interface ElectronicSignatureSettingsProps {
  id: string;
  tenantId: string;
  provider: ElectronicSignatureProvider;
  certificateLabel: string;
  storageMode: ElectronicSignatureStorageMode;
  certificateFingerprint: string | null;
  pkcs12SecretRef: string | null;
  privateKeyPasswordSecretRef: string | null;
  subjectName: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ElectronicSignatureSettings {
  private constructor(
    private readonly props: ElectronicSignatureSettingsProps,
  ) {}

  static create(
    props: ElectronicSignatureSettingsProps,
  ): ElectronicSignatureSettings {
    return new ElectronicSignatureSettings(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get provider(): ElectronicSignatureProvider {
    return this.props.provider;
  }

  get certificateLabel(): string {
    return this.props.certificateLabel;
  }

  get storageMode(): ElectronicSignatureStorageMode {
    return this.props.storageMode;
  }

  get certificateFingerprint(): string | null {
    return this.props.certificateFingerprint;
  }

  get pkcs12SecretRef(): string | null {
    return this.props.pkcs12SecretRef;
  }

  get privateKeyPasswordSecretRef(): string | null {
    return this.props.privateKeyPasswordSecretRef;
  }

  get subjectName(): string | null {
    return this.props.subjectName;
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

  requiresSecretReferences(): boolean {
    return this.props.provider === 'xades_pkcs12';
  }

  hasSigningMaterialConfigured(): boolean {
    if (this.props.provider === 'stub_local') {
      return true;
    }

    return Boolean(
      this.props.pkcs12SecretRef && this.props.privateKeyPasswordSecretRef,
    );
  }

  toPrimitives(): ElectronicSignatureSettingsProps {
    return { ...this.props };
  }
}
