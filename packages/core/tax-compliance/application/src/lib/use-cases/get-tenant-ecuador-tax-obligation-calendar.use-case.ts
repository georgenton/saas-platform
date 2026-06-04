import {
  EcuadorTaxCalendarEntryView,
  EcuadorTaxObligationCalendarView,
  EcuadorTaxObligationFrequency,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxObligationMatrixUseCase } from './get-tenant-ecuador-tax-obligation-matrix.use-case';

const DUE_DAY_BY_NINTH_DIGIT: Record<string, number> = {
  '1': 10,
  '2': 12,
  '3': 14,
  '4': 16,
  '5': 18,
  '6': 20,
  '7': 22,
  '8': 24,
  '9': 26,
  '0': 28,
};

export class GetTenantEcuadorTaxObligationCalendarUseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationMatrixUseCase: GetTenantEcuadorTaxObligationMatrixUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    year: number,
  ): Promise<EcuadorTaxObligationCalendarView> {
    const matrix =
      await this.getTenantEcuadorTaxObligationMatrixUseCase.execute(tenantSlug);
    const ninthDigit = getNinthDigit(matrix.taxpayerProfile.taxpayerId);
    const standardDueDay = ninthDigit
      ? DUE_DAY_BY_NINTH_DIGIT[ninthDigit]
      : null;
    const dueDay = matrix.taxpayerProfile.specialTaxpayerCode
      ? 9
      : standardDueDay;

    const entries = matrix.obligations.flatMap((obligation) => {
      if (!obligation.applies) {
        return [];
      }

      return buildEntries({
        year,
        dueDay,
        frequency: obligation.frequency,
        obligation: {
          key: obligation.key,
          label: obligation.label,
          readinessStatus: obligation.readinessStatus,
          notes: obligation.notes,
        },
      });
    });

    return {
      tenantSlug,
      year,
      generatedAt: this.nowProvider(),
      taxpayerProfile: matrix.taxpayerProfile,
      ninthDigit,
      entries,
      guardrails: [
        ...matrix.guardrails,
        'Las fechas se calculan como calendario operacional estimado; fines de semana, feriados, Galapagos, sector publico y resoluciones especiales requieren verificacion adicional.',
        'Contribuyente especial se modela con vencimiento dia 9 segun regla general publicada por SRI, pero puede requerir excepciones por obligacion.',
      ],
    };
  }
}

function buildEntries(input: {
  year: number;
  dueDay: number | null;
  frequency: EcuadorTaxObligationFrequency;
  obligation: {
    key: EcuadorTaxCalendarEntryView['obligationKey'];
    label: string;
    readinessStatus: EcuadorTaxCalendarEntryView['readinessStatus'];
    notes: string[];
  };
}): EcuadorTaxCalendarEntryView[] {
  if (input.frequency === 'monthly') {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const periodMonth = monthIndex + 1;
      const dueMonth = periodMonth === 12 ? 1 : periodMonth + 1;
      const dueYear =
        periodMonth === 12 ? input.year + 1 : input.year;

      return buildEntry({
        ...input,
        period: `${input.year}-${pad2(periodMonth)}`,
        dueYear,
        dueMonth,
      });
    });
  }

  if (input.frequency === 'semiannual') {
    return [
      buildEntry({
        ...input,
        period: `${input.year}-S1`,
        dueYear: input.year,
        dueMonth: 7,
      }),
      buildEntry({
        ...input,
        period: `${input.year}-S2`,
        dueYear: input.year + 1,
        dueMonth: 1,
      }),
    ];
  }

  if (input.frequency === 'annual') {
    return [
      buildEntry({
        ...input,
        period: `${input.year}`,
        dueYear: input.year + 1,
        dueMonth: 3,
      }),
    ];
  }

  return [
    {
      obligationKey: input.obligation.key,
      label: input.obligation.label,
      period: `${input.year}`,
      frequency: input.frequency,
      dueDate: null,
      dueDay: null,
      source: 'sri_rule_of_thumb',
      readinessStatus: 'needs_review',
      notes: [
        ...input.obligation.notes,
        'Esta obligacion requiere calendario especifico antes de asignar vencimiento.',
      ],
    },
  ];
}

function buildEntry(input: {
  year: number;
  dueDay: number | null;
  frequency: EcuadorTaxObligationFrequency;
  obligation: {
    key: EcuadorTaxCalendarEntryView['obligationKey'];
    label: string;
    readinessStatus: EcuadorTaxCalendarEntryView['readinessStatus'];
    notes: string[];
  };
  period: string;
  dueYear: number;
  dueMonth: number;
}): EcuadorTaxCalendarEntryView {
  return {
    obligationKey: input.obligation.key,
    label: input.obligation.label,
    period: input.period,
    frequency: input.frequency,
    dueDate: input.dueDay
      ? `${input.dueYear}-${pad2(input.dueMonth)}-${pad2(input.dueDay)}`
      : null,
    dueDay: input.dueDay,
    source: 'sri_rule_of_thumb',
    readinessStatus: input.dueDay
      ? input.obligation.readinessStatus
      : 'blocked',
    notes: input.dueDay
      ? [...input.obligation.notes]
      : [
          ...input.obligation.notes,
          'No se pudo derivar vencimiento porque falta RUC o noveno digito.',
        ],
  };
}

function getNinthDigit(taxpayerId: string | null): string | null {
  const normalized = taxpayerId?.replace(/\D/g, '') ?? '';

  if (normalized.length < 9) {
    return null;
  }

  return normalized[8] ?? null;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}
