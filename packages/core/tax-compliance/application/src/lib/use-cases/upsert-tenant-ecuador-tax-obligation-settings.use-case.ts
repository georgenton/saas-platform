import {
  EcuadorTaxObligationFrequency,
  EcuadorTaxObligationKey,
  EcuadorTaxpayerRegime,
} from '@saas-platform/tax-compliance-domain';
import {
  CONFIGURATION_PERIOD,
  GetTenantEcuadorTaxObligationSettingsUseCase,
} from './get-tenant-ecuador-tax-obligation-settings.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class UpsertTenantEcuadorTaxObligationSettingsUseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationSettingsUseCase: GetTenantEcuadorTaxObligationSettingsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
  ) {}

  async execute(input: {
    tenantSlug: string;
    regime?: EcuadorTaxpayerRegime;
    accountingObligated?: boolean | null;
    specialTaxpayerCode?: string | null;
    ninthDigit?: string | null;
    obligations?: Array<{
      key: EcuadorTaxObligationKey;
      applies: boolean;
      frequency: EcuadorTaxObligationFrequency;
      notes?: string[];
    }>;
    updatedByUserId?: string | null;
    updatedByEmail?: string | null;
  }) {
    const current = await this.getTenantEcuadorTaxObligationSettingsUseCase.execute({
      tenantSlug: input.tenantSlug,
    });
    const payload = {
      regime: input.regime ?? current.regime,
      accountingObligated:
        input.accountingObligated !== undefined
          ? input.accountingObligated
          : current.accountingObligated,
      specialTaxpayerCode:
        input.specialTaxpayerCode !== undefined
          ? normalizeOptional(input.specialTaxpayerCode)
          : current.specialTaxpayerCode,
      ninthDigit:
        input.ninthDigit !== undefined
          ? normalizeOptional(input.ninthDigit)
          : current.ninthDigit,
      obligations: input.obligations ?? current.obligations,
      updatedByUserId: normalizeOptional(input.updatedByUserId),
      updatedByEmail: normalizeOptional(input.updatedByEmail),
    };

    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: CONFIGURATION_PERIOD,
      year: new Date().getUTCFullYear(),
      eventType: 'tax_obligation_settings_upserted',
      source: 'tax_obligation_settings',
      payload,
    });

    return this.getTenantEcuadorTaxObligationSettingsUseCase.execute({
      tenantSlug: input.tenantSlug,
    });
  }
}

function normalizeOptional(value?: string | null): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}
