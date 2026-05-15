import {
  ElectronicSignatureProvider,
  ElectronicSignatureStorageMode,
  ElectronicSignatureSettings,
} from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { ElectronicSignatureMetadataHydrationError } from '../errors/electronic-signature-metadata-hydration.error';
import { ElectronicSignatureSettingsRepository } from '../ports/electronic-signature-settings.repository';
import { ElectronicSignatureMaterialInspector } from '../ports/electronic-signature-material-inspector';

export interface UpsertTenantElectronicSignatureSettingsInput {
  tenantSlug: string;
  provider?: ElectronicSignatureProvider;
  certificateLabel: string;
  storageMode?: ElectronicSignatureStorageMode;
  certificateFingerprint?: string | null;
  pkcs12SecretRef?: string | null;
  privateKeyPasswordSecretRef?: string | null;
  subjectName?: string | null;
  hydrateMetadataFromPkcs12?: boolean;
  isActive: boolean;
}

export class UpsertTenantElectronicSignatureSettingsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly electronicSignatureSettingsRepository: ElectronicSignatureSettingsRepository,
    private readonly electronicSignatureMaterialInspector: ElectronicSignatureMaterialInspector,
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
    const certificateFingerprint = this.resolveOptionalValue(
      input.certificateFingerprint,
      existingSettings?.certificateFingerprint ?? null,
    );
    const pkcs12SecretRef = this.resolveOptionalValue(
      input.pkcs12SecretRef,
      existingSettings?.pkcs12SecretRef ?? null,
    );
    const privateKeyPasswordSecretRef = this.resolveOptionalValue(
      input.privateKeyPasswordSecretRef,
      existingSettings?.privateKeyPasswordSecretRef ?? null,
    );
    const subjectName = this.resolveOptionalValue(
      input.subjectName,
      existingSettings?.subjectName ?? null,
    );

    const baseSettings = ElectronicSignatureSettings.create({
      id: existingSettings?.id ?? `${tenant.id}:electronic-signature-settings`,
      tenantId: tenant.id,
      provider,
      certificateLabel: input.certificateLabel.trim(),
      storageMode:
        input.storageMode ??
        existingSettings?.storageMode ??
        (provider === 'xades_pkcs12' ? 'secret_ref' : 'stub_inline'),
      certificateFingerprint,
      pkcs12SecretRef,
      privateKeyPasswordSecretRef,
      subjectName,
      isActive: input.isActive,
      createdAt: existingSettings?.createdAt ?? now,
      updatedAt: now,
    });
    const hydratedMetadata = input.hydrateMetadataFromPkcs12
      ? await this.hydrateMetadataFromPkcs12(baseSettings)
      : null;
    const settings = ElectronicSignatureSettings.create({
      id: baseSettings.id,
      tenantId: baseSettings.tenantId,
      provider: baseSettings.provider,
      certificateLabel: baseSettings.certificateLabel,
      storageMode: baseSettings.storageMode,
      certificateFingerprint:
        hydratedMetadata?.certificateFingerprint ?? certificateFingerprint,
      pkcs12SecretRef: baseSettings.pkcs12SecretRef,
      privateKeyPasswordSecretRef: baseSettings.privateKeyPasswordSecretRef,
      subjectName: hydratedMetadata?.subjectName ?? subjectName,
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

  private async hydrateMetadataFromPkcs12(
    settings: ElectronicSignatureSettings,
  ): Promise<{
    certificateFingerprint: string | null;
    subjectName: string | null;
  }> {
    if (settings.provider !== 'xades_pkcs12') {
      throw new ElectronicSignatureMetadataHydrationError(
        'La hidratacion automatica solo aplica al provider xades_pkcs12.',
      );
    }

    const inspection = await this.electronicSignatureMaterialInspector.inspect({
      signatureSettings: settings,
    });

    if (inspection.status !== 'likely_usable') {
      throw new ElectronicSignatureMetadataHydrationError(inspection.detail);
    }

    return {
      certificateFingerprint:
        settings.certificateFingerprint ?? inspection.extractedFingerprint,
      subjectName: settings.subjectName ?? inspection.extractedSubjectName,
    };
  }
}
