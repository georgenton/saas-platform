import {
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxExternalFilingResultRecordView,
  EcuadorTaxFilingHandoffView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxFilingHandoffUseCase } from './get-tenant-ecuador-tax-filing-handoff.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class ListTenantEcuadorTaxExternalFilingResultsUseCase {
  constructor(
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly getTenantEcuadorTaxFilingHandoffUseCase: GetTenantEcuadorTaxFilingHandoffUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxExternalFilingResultRecordView[]> {
    const [events, handoff] = await Promise.all([
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
      this.getTenantEcuadorTaxFilingHandoffUseCase.execute(input),
    ]);

    return events
      .filter(
        (event) => event.eventType === 'tax_external_filing_result_recorded',
      )
      .map((event) =>
        toExternalFilingResult(
          input,
          event.id,
          event.occurredAt,
          event.payload,
          handoff,
        ),
      );
  }
}

export function toExternalFilingResult(
  input: { tenantSlug: string; period: string; year: number },
  resultId: string,
  generatedAt: Date,
  payload: Record<string, unknown>,
  handoff: EcuadorTaxFilingHandoffView,
): EcuadorTaxExternalFilingResultRecordView {
  const resultStatus = readResultStatus(payload.resultStatus);
  const blockers = [
    !readStringOrNull(payload.externalReference)
      ? 'external_filing_result.external_reference_missing'
      : null,
    resultStatus === 'rejected_externally'
      ? 'external_filing_result.rejected_requires_resolution'
      : null,
    resultStatus === 'paid_externally' && !readDateOrNull(payload.paidAt)
      ? 'external_filing_result.payment_date_missing'
      : null,
  ].filter((blocker): blocker is string => blocker !== null);

  return {
    ...input,
    generatedAt,
    resultId,
    obligationKey: readObligationKey(payload.obligationKey),
    formKey: readFormKey(payload.formKey),
    resultStatus,
    externalReference: readStringOrNull(payload.externalReference),
    filedAt: readDateOrNull(payload.filedAt),
    paidAt: readDateOrNull(payload.paidAt),
    expectedAmountInCents: readNumberOrNull(payload.expectedAmountInCents),
    paidAmountInCents: readNumberOrNull(payload.paidAmountInCents),
    currency: readStringOrNull(payload.currency) ?? 'USD',
    responsibleUserId: readStringOrNull(payload.responsibleUserId),
    responsibleEmail: readStringOrNull(payload.responsibleEmail),
    evidenceRefs: readStringArray(payload.evidenceRefs),
    note: readStringOrNull(payload.note),
    handoff,
    blockers,
    nextStep:
      resultStatus === 'paid_externally'
        ? 'Conservar recibo de pago y cerrar certificado post-filing.'
        : resultStatus === 'submitted_externally' ||
            resultStatus === 'payment_pending'
          ? 'Registrar pago o recibo externo cuando exista soporte.'
          : resultStatus === 'rejected_externally'
            ? 'Resolver rechazo externo con contador.'
            : 'Monitorear resultado externo hasta cierre.',
    guardrails: [
      'Resultado registrado por evidencia humana; la plataforma no consulta SRI.',
      'La referencia externa no equivale a certificacion automatica.',
    ],
  };
}

function readResultStatus(
  value: unknown,
): EcuadorTaxExternalFilingResultRecordView['resultStatus'] {
  return typeof value === 'string' &&
    [
      'submitted_externally',
      'rejected_externally',
      'under_review',
      'payment_pending',
      'paid_externally',
    ].includes(value)
    ? (value as EcuadorTaxExternalFilingResultRecordView['resultStatus'])
    : 'under_review';
}

function readObligationKey(
  value: unknown,
): EcuadorTaxExternalFilingResultRecordView['obligationKey'] {
  return typeof value === 'string' &&
    ['iva', 'income_tax', 'withholding', 'annexes'].includes(value)
    ? (value as EcuadorTaxExternalFilingResultRecordView['obligationKey'])
    : 'iva';
}

function readFormKey(value: unknown): EcuadorTaxDeclarationFormKey | null {
  return typeof value === 'string' && value.trim()
    ? (value as EcuadorTaxDeclarationFormKey)
    : null;
}

function readStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function readNumberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === 'string' && item.trim().length > 0,
      )
    : [];
}

function readDateOrNull(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}
