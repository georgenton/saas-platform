import {
  ElectronicSubmissionEnvironment,
  ElectronicSubmissionProvider,
  ElectronicSubmissionSettings,
  ElectronicSubmissionTransmissionMode,
} from '@saas-platform/invoicing-domain';
import {
  TenantNotFoundError,
  TenantRepository,
} from '@saas-platform/tenancy-application';
import { ElectronicSubmissionSettingsRepository } from '../ports/electronic-submission-settings.repository';

export interface UpsertTenantElectronicSubmissionSettingsInput {
  tenantSlug: string;
  provider?: ElectronicSubmissionProvider;
  environment?: ElectronicSubmissionEnvironment;
  transmissionMode?: ElectronicSubmissionTransmissionMode;
  receptionUrl?: string | null;
  authorizationUrl?: string | null;
  credentialsSecretRef?: string | null;
  timeoutMs: number;
  isActive: boolean;
}

export class UpsertTenantElectronicSubmissionSettingsUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly electronicSubmissionSettingsRepository: ElectronicSubmissionSettingsRepository,
  ) {}

  async execute(
    input: UpsertTenantElectronicSubmissionSettingsInput,
  ): Promise<ElectronicSubmissionSettings> {
    const tenant = await this.tenantRepository.findBySlug(input.tenantSlug);

    if (!tenant) {
      throw new TenantNotFoundError(input.tenantSlug);
    }

    const now = new Date();
    const existingSettings =
      await this.electronicSubmissionSettingsRepository.findByTenantId(
        tenant.id,
      );
    const provider =
      input.provider ?? existingSettings?.provider ?? 'stub_sri';

    const settings = ElectronicSubmissionSettings.create({
      id: existingSettings?.id ?? `${tenant.id}:electronic-submission-settings`,
      tenantId: tenant.id,
      provider,
      environment: input.environment ?? existingSettings?.environment ?? 'test',
      transmissionMode:
        input.transmissionMode ??
        existingSettings?.transmissionMode ??
        (provider === 'sri_offline_ws' ? 'offline' : 'sync_stub'),
      receptionUrl: this.resolveOptionalValue(
        input.receptionUrl,
        existingSettings?.receptionUrl ?? null,
      ),
      authorizationUrl: this.resolveOptionalValue(
        input.authorizationUrl,
        existingSettings?.authorizationUrl ?? null,
      ),
      credentialsSecretRef: this.resolveOptionalValue(
        input.credentialsSecretRef,
        existingSettings?.credentialsSecretRef ?? null,
      ),
      timeoutMs: Number.isFinite(input.timeoutMs)
        ? input.timeoutMs
        : existingSettings?.timeoutMs ?? 10000,
      isActive: input.isActive,
      createdAt: existingSettings?.createdAt ?? now,
      updatedAt: now,
    });

    await this.electronicSubmissionSettingsRepository.save(settings);

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
