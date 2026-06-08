import {
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxExternalFilingResultRecordView,
} from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxFilingHandoffUseCase } from './record-tenant-ecuador-tax-filing-handoff.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { ListTenantEcuadorTaxExternalFilingResultsUseCase } from './list-tenant-ecuador-tax-external-filing-results.use-case';

export class RecordTenantEcuadorTaxExternalFilingResultUseCase {
  constructor(
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly recordTenantEcuadorTaxFilingHandoffUseCase: RecordTenantEcuadorTaxFilingHandoffUseCase,
    private readonly listTenantEcuadorTaxExternalFilingResultsUseCase: ListTenantEcuadorTaxExternalFilingResultsUseCase,
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    obligationKey: 'iva' | 'income_tax' | 'withholding' | 'annexes';
    formKey?: EcuadorTaxDeclarationFormKey | null;
    resultStatus:
      | 'submitted_externally'
      | 'rejected_externally'
      | 'under_review'
      | 'payment_pending'
      | 'paid_externally';
    externalReference?: string | null;
    filedAt?: Date | null;
    paidAt?: Date | null;
    expectedAmountInCents?: number | null;
    paidAmountInCents?: number | null;
    currency?: string | null;
    responsibleUserId?: string | null;
    responsibleEmail?: string | null;
    evidenceRefs?: string[];
    note?: string | null;
  }): Promise<EcuadorTaxExternalFilingResultRecordView> {
    await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      eventType: 'tax_external_filing_result_recorded',
      source: 'tax_external_filing_result',
      payload: {
        obligationKey: input.obligationKey,
        formKey: input.formKey ?? null,
        resultStatus: input.resultStatus,
        externalReference: normalize(input.externalReference),
        filedAt: input.filedAt ? input.filedAt.toISOString() : null,
        paidAt: input.paidAt ? input.paidAt.toISOString() : null,
        expectedAmountInCents: input.expectedAmountInCents ?? null,
        paidAmountInCents: input.paidAmountInCents ?? null,
        currency: normalize(input.currency) ?? 'USD',
        responsibleUserId: normalize(input.responsibleUserId),
        responsibleEmail: normalize(input.responsibleEmail),
        evidenceRefs: input.evidenceRefs ?? [],
        note: normalize(input.note),
      },
    });

    await this.recordTenantEcuadorTaxFilingHandoffUseCase.execute({
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      status: toHandoffStatus(input.resultStatus),
      externalReference: input.externalReference ?? null,
      filedAt: input.filedAt ?? null,
      paidAt: input.paidAt ?? null,
      amountPaidInCents: input.paidAmountInCents ?? null,
      currency: input.currency ?? 'USD',
      responsibleUserId: input.responsibleUserId ?? null,
      responsibleEmail: input.responsibleEmail ?? null,
      note: input.note ?? null,
    });

    const results =
      await this.listTenantEcuadorTaxExternalFilingResultsUseCase.execute(
        input,
      );

    return results[0];
  }
}

function toHandoffStatus(
  status:
    | 'submitted_externally'
    | 'rejected_externally'
    | 'under_review'
    | 'payment_pending'
    | 'paid_externally',
): string {
  if (status === 'paid_externally') {
    return 'paid_externally';
  }

  if (status === 'rejected_externally') {
    return 'filing_rejected';
  }

  if (status === 'payment_pending') {
    return 'payment_pending';
  }

  return 'filed_externally';
}

function normalize(value?: string | null): string | null {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}
