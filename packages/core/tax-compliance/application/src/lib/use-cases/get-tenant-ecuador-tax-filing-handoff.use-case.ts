import {
  EcuadorTaxFilingHandoffStatus,
  EcuadorTaxFilingHandoffView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxOperationalCloseoutUseCase } from './get-tenant-ecuador-tax-operational-closeout.use-case';
import { ListTenantEcuadorTaxComplianceEventsUseCase } from './list-tenant-ecuador-tax-compliance-events.use-case';

export class GetTenantEcuadorTaxFilingHandoffUseCase {
  constructor(
    private readonly getTenantEcuadorTaxOperationalCloseoutUseCase: GetTenantEcuadorTaxOperationalCloseoutUseCase,
    private readonly listTenantEcuadorTaxComplianceEventsUseCase: ListTenantEcuadorTaxComplianceEventsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxFilingHandoffView> {
    const [closeout, events] = await Promise.all([
      this.getTenantEcuadorTaxOperationalCloseoutUseCase.execute(input),
      this.listTenantEcuadorTaxComplianceEventsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        limit: 100,
      }),
    ]);
    const transitionHistory = events
      .filter((event) => event.eventType === 'tax_filing_handoff_recorded')
      .map((event) => ({
        status: readFilingHandoffStatus(event.payload.status),
        recordedAt: event.occurredAt,
        externalReference: readStringOrNull(event.payload.externalReference),
        responsibleUserId: readStringOrNull(event.payload.responsibleUserId),
        responsibleEmail: readStringOrNull(event.payload.responsibleEmail),
        note: readStringOrNull(event.payload.note),
      }));
    const latestEvent = events.find(
      (event) => event.eventType === 'tax_filing_handoff_recorded',
    );
    const status = latestEvent
      ? readFilingHandoffStatus(latestEvent.payload.status)
      : null;
    const blockers = [
      closeout.status === 'closed_operationally' ||
      closeout.status === 'ready_for_external_filing'
        ? null
        : 'filing_handoff.operational_closeout_not_ready',
      status ? null : 'filing_handoff.external_status_not_recorded',
      status === 'filing_rejected'
        ? 'filing_handoff.rejected_requires_resolution'
        : null,
      status === 'filed_externally'
        ? 'filing_handoff.payment_confirmation_pending'
        : null,
    ].filter((blocker): blocker is string => blocker !== null);

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      status,
      externalReference: latestEvent
        ? readStringOrNull(latestEvent.payload.externalReference)
        : null,
      filedAt: latestEvent ? readDateOrNull(latestEvent.payload.filedAt) : null,
      paidAt: latestEvent ? readDateOrNull(latestEvent.payload.paidAt) : null,
      amountPaidInCents: latestEvent
        ? readNumberOrNull(latestEvent.payload.amountPaidInCents)
        : null,
      currency: latestEvent ? readStringOrNull(latestEvent.payload.currency) : null,
      responsibleUserId: latestEvent
        ? readStringOrNull(latestEvent.payload.responsibleUserId)
        : null,
      responsibleEmail: latestEvent
        ? readStringOrNull(latestEvent.payload.responsibleEmail)
        : null,
      note: latestEvent ? readStringOrNull(latestEvent.payload.note) : null,
      operationalCloseoutStatus: closeout.status,
      transitionHistory,
      blockers,
      nextStep:
        status === 'paid_externally'
          ? 'Conservar comprobante de presentacion/pago externo y bloquear cambios operativos del periodo.'
          : status === 'filed_externally'
            ? 'Registrar confirmacion de pago externo cuando exista soporte.'
            : status === 'filing_rejected'
              ? 'Resolver rechazo externo con contador antes de reintentar cierre.'
              : 'Registrar el resultado de presentacion/pago externo cuando el contador complete el tramite.',
      guardrails: [
        'Handoff registra evidencia externa; no presenta formularios SRI desde la plataforma.',
        'Referencias, pagos y rechazos deben venir de soporte humano verificable.',
      ],
    };
  }
}

export function readFilingHandoffStatus(
  value: unknown,
): EcuadorTaxFilingHandoffStatus {
  return typeof value === 'string' &&
    [
      'payment_pending',
      'filed_externally',
      'paid_externally',
      'filing_rejected',
    ].includes(value)
    ? (value as EcuadorTaxFilingHandoffStatus)
    : 'payment_pending';
}

function readStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

function readNumberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function readDateOrNull(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}
