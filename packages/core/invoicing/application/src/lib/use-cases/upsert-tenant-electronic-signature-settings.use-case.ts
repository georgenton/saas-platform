import {
  ElectronicSignatureProvider,
  ElectronicSignatureStorageMode,
  ElectronicSignatureSettings,
} from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { ElectronicSignatureSettingsRepository } from '../ports/electronic-signature-settings.repository';

export interface UpsertTenantElectronicSignatureSettingsInput {
  tenantSlug: string;
  provider?: ElectronicSignatureProvider;
  certificateLabel: string;
  storageMode?: ElectronicSignatureStorageMode;
  certificateFingerprint?: string | null;
  pkcs12SecretRef?: string | null;
  privateKeyPasswordSecretRef?: string | null;
  subjectName?: string | null;
  isActive: boolean;
}

export class UpsertTenantElectronicSignatureSettingsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly electronicSignatureSettingsRepository: ElectronicSignatureSettingsRepository,
  ) {}

  async execute(
    input: UpsertTenantElectronicSignatureSettingsInput,
  ): Promise<ElectronicSignatureSettings> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = new Date();
    const existingSettings =
      await this.electronicSignatureSettingsRepository.findByTenantId(tenant.id);
    const provider = input.provider ?? existingSettings?.provider ?? 'stub_local';
    const settings = ElectronicSignatureSettings.create({
      id: existingSettings?.id ?? `${tenant.id}:electronic-signature-settings`,
      tenantId: tenant.id,
      provider,
      certificateLabel: input.certificateLabel.trim(),
      storageMode:
        input.storageMode ??
        existingSettings?.storageMode ??
        (provider === 'xades_pkcs12' ? 'secret_ref' : 'stub_inline'),
      certificateFingerprint: this.resolveOptionalValue(
        input.certificateFingerprint,
        existingSettings?.certificateFingerprint ?? null,
      ),
      pkcs12SecretRef: this.resolveOptionalValue(
        input.pkcs12SecretRef,
        existingSettings?.pkcs12SecretRef ?? null,
      ),
      privateKeyPasswordSecretRef: this.resolveOptionalValue(
        input.privateKeyPasswordSecretRef,
        existingSettings?.privateKeyPasswordSecretRef ?? null,
      ),
      subjectName: this.resolveOptionalValue(
        input.subjectName,
        existingSettings?.subjectName ?? null,
      ),
      isActive: input.isActive,
      createdAt: existingSettings?.createdAt ?? now,
      updatedAt: now,
    });

    await this.electronicSignatureSettingsRepository.save(settings);

    return settings;
  }

  private normalizeOptionalValue(value?: string | null): string | null {
    const normalizedValue = value?.trim();

    return normalizedValue ? normalizedValue : null;
  }

  private resolveOptionalValue(
    value: string | null | undefined,
    fallback: string | null,
  ): string | null {
    if (value === undefined) {
      return fallback;
    }

    return this.normalizeOptionalValue(value);
  }
}
