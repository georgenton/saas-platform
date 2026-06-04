import { EcuadorTaxFilingHandoffView } from '@saas-platform/tax-compliance-domain';
import {
  GetTenantEcuadorTaxFilingHandoffUseCase,
  readFilingHandoffStatus,
} from './get-tenant-ecuador-tax-filing-handoff.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class RecordTenantEcuadorTaxFilingHandoffUseCase {
  constructor(
    private readonly getTenantEcuadorTaxFilingHandoffUseCase: GetTenantEcuadorTaxFilingHandoffUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    status: string;
    externalReference?: string | null;
    filedAt?: Date | null;
    paidAt?: Date | null;
    amountPaidInCents?: number | null;
    currency?: string | null;
    responsibleUserId?: string | null;
    responsibleEmail?: string | null;
    note?: string | null;
  }): Promise<EcuadorTaxFilingHandoffView> {
    const status = readFilingHandoffStatus(input.status);

    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      eventType: 'tax_filing_handoff_recorded',
      source: 'tax_filing_handoff',
      payload: {
        status,
        externalReference: normalizeOptional(input.externalReference),
        filedAt: input.filedAt ? input.filedAt.toISOString() : null,
        paidAt: input.paidAt ? input.paidAt.toISOString() : null,
        amountPaidInCents:
          typeof input.amountPaidInCents === 'number'
            ? input.amountPaidInCents
            : null,
        currency: normalizeOptional(input.currency) ?? 'USD',
        responsibleUserId: normalizeOptional(input.responsibleUserId),
        responsibleEmail: normalizeOptional(input.responsibleEmail),
        note: normalizeOptional(input.note),
      },
    });

    return this.getTenantEcuadorTaxFilingHandoffUseCase.execute(input);
  }
}

function normalizeOptional(value?: string | null): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}
