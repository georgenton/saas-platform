import {
  EcuadorTaxObligationFrequency,
  EcuadorTaxObligationKey,
  EcuadorTaxObligationSettingsView,
  EcuadorTaxpayerRegime,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxpayerProfileUseCase } from './get-tenant-ecuador-taxpayer-profile.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

const CONFIGURATION_PERIOD = 'configuration';

export class GetTenantEcuadorTaxObligationSettingsUseCase {
  constructor(
    private readonly getTenantEcuadorTaxpayerProfileUseCase: GetTenantEcuadorTaxpayerProfileUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<EcuadorTaxObligationSettingsView> {
    const [profile, events] = await Promise.all([
      this.getTenantEcuadorTaxpayerProfileUseCase.execute(input.tenantSlug),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: CONFIGURATION_PERIOD,
        limit: 25,
      }),
    ]);
    const persisted = events.find(
      (event) => event.eventType === 'tax_obligation_settings_upserted',
    );

    if (persisted) {
      return {
        tenantSlug: input.tenantSlug,
        generatedAt: this.nowProvider(),
        source: 'tax_compliance_event_ledger',
        regime: readRegime(persisted.payload.regime, profile.regime),
        accountingObligated: readBooleanOrNull(
          persisted.payload.accountingObligated,
          profile.accountingObligated,
        ),
        specialTaxpayerCode: readStringOrNull(
          persisted.payload.specialTaxpayerCode,
          profile.specialTaxpayerCode,
        ),
        ninthDigit: readStringOrNull(
          persisted.payload.ninthDigit,
          getNinthDigit(profile.taxpayerId),
        ),
        obligations: readObligations(persisted.payload.obligations),
        updatedByUserId: readStringOrNull(
          persisted.payload.updatedByUserId,
          null,
        ),
        updatedByEmail: readStringOrNull(persisted.payload.updatedByEmail, null),
        updatedAt: persisted.occurredAt,
        guardrails: [
          'Configuracion persistida como evento auditable; editarla no presenta declaraciones.',
          'La activacion y frecuencia final de obligaciones debe validarse con contador.',
        ],
      };
    }

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      source: 'heuristic_fallback',
      regime: profile.regime,
      accountingObligated: profile.accountingObligated,
      specialTaxpayerCode: profile.specialTaxpayerCode,
      ninthDigit: getNinthDigit(profile.taxpayerId),
      obligations: defaultObligations(profile.regime, profile.accountingObligated),
      updatedByUserId: null,
      updatedByEmail: null,
      updatedAt: null,
      guardrails: [
        'Fallback heuristico basado en perfil fiscal; persiste settings para convertirlo en configuracion del tenant.',
        'Las obligaciones tributarias reales pueden depender de actividad, regimen, resoluciones y criterio profesional.',
      ],
    };
  }
}

export function defaultObligations(
  regime: EcuadorTaxpayerRegime,
  accountingObligated: boolean | null,
): EcuadorTaxObligationSettingsView['obligations'] {
  const rimpeSemiannual =
    regime === 'rimpe_entrepreneur' || regime === 'rimpe_popular_business';

  return [
    {
      key: 'vat',
      applies: true,
      frequency: rimpeSemiannual ? 'semiannual' : 'monthly',
      notes: rimpeSemiannual
        ? ['RIMPE puede requerir periodicidad semestral segun el caso.']
        : ['Periodicidad mensual como punto de partida operativo.'],
    },
    {
      key: 'income_tax',
      applies: true,
      frequency: 'annual',
      notes: ['Renta se modela como obligacion anual con evidencia operacional.'],
    },
    {
      key: 'withholding',
      applies: accountingObligated !== false,
      frequency: accountingObligated === false ? 'unknown' : 'monthly',
      notes: [
        'Obligacion de retener requiere confirmacion por regimen, actividad y contraparte.',
      ],
    },
    {
      key: 'annexes',
      applies: accountingObligated !== false,
      frequency: 'unknown',
      notes: ['Anexos deben activarse con reglas especificas por contribuyente.'],
    },
  ];
}

function readObligations(value: unknown): EcuadorTaxObligationSettingsView['obligations'] {
  if (!Array.isArray(value)) {
    return defaultObligations('unknown', null);
  }

  return value.map((item) => {
    const record = item as Record<string, unknown>;

    return {
      key: readObligationKey(record.key),
      applies: typeof record.applies === 'boolean' ? record.applies : true,
      frequency: readFrequency(record.frequency),
      notes: Array.isArray(record.notes)
        ? record.notes.filter((note): note is string => typeof note === 'string')
        : [],
    };
  });
}

function readRegime(value: unknown, fallback: EcuadorTaxpayerRegime): EcuadorTaxpayerRegime {
  return typeof value === 'string' &&
    ['general', 'rimpe_entrepreneur', 'rimpe_popular_business', 'unknown'].includes(
      value,
    )
    ? (value as EcuadorTaxpayerRegime)
    : fallback;
}

function readObligationKey(value: unknown): EcuadorTaxObligationKey {
  return typeof value === 'string' &&
    ['vat', 'income_tax', 'withholding', 'annexes'].includes(value)
    ? (value as EcuadorTaxObligationKey)
    : 'vat';
}

function readFrequency(value: unknown): EcuadorTaxObligationFrequency {
  return typeof value === 'string' &&
    ['monthly', 'semiannual', 'annual', 'event_driven', 'unknown'].includes(value)
    ? (value as EcuadorTaxObligationFrequency)
    : 'unknown';
}

function readBooleanOrNull(value: unknown, fallback: boolean | null): boolean | null {
  return typeof value === 'boolean' ? value : fallback;
}

function readStringOrNull(value: unknown, fallback: string | null): string | null {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function getNinthDigit(taxpayerId: string | null): string | null {
  const normalized = taxpayerId?.replace(/\D/g, '') ?? '';

  return normalized.length >= 9 ? normalized[8] : null;
}

export { CONFIGURATION_PERIOD };
