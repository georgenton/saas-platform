import { TenantAccountingReconciliationExceptionResolutionPacketView } from '@saas-platform/accounting-domain';
import { RecordTenantAccountingBankReconciliationControlUseCase } from './record-tenant-accounting-bank-reconciliation-control.use-case';
import { RequestTenantAccountingReconciliationExceptionPacketUseCase } from './request-tenant-accounting-reconciliation-exception-packet.use-case';

export class RequestTenantAccountingReconciliationExceptionResolutionPacketUseCase {
  constructor(
    private readonly requestTenantAccountingReconciliationExceptionPacketUseCase: RequestTenantAccountingReconciliationExceptionPacketUseCase,
    private readonly recordTenantAccountingBankReconciliationControlUseCase: RecordTenantAccountingBankReconciliationControlUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    decision: 'prepare' | 'resolve';
    resolutionType:
      | 'create_adjustment_recommended'
      | 'mark_timing_difference'
      | 'mark_external_bank_issue'
      | 'mark_journal_review_required';
    exceptionKeys?: string[];
    actorUserId?: string | null;
    actorEmail?: string | null;
    reason?: string | null;
    evidenceReference?: string | null;
  }): Promise<TenantAccountingReconciliationExceptionResolutionPacketView> {
    const exceptionPacket =
      await this.requestTenantAccountingReconciliationExceptionPacketUseCase.execute(
        input,
      );
    const availableExceptionKeys = exceptionPacket.exceptions.map(
      (exception) => exception.exceptionKey,
    );
    const exceptionKeys =
      input.exceptionKeys && input.exceptionKeys.length > 0
        ? [...new Set(input.exceptionKeys)]
        : availableExceptionKeys;
    const unknownExceptionKeys = exceptionKeys.filter(
      (exceptionKey) => !availableExceptionKeys.includes(exceptionKey),
    );
    const blockers = [
      ...exceptionPacket.blockers,
      ...(exceptionPacket.exceptionStatus === 'blocked'
        ? ['accounting.reconciliation_exception_resolution.exception_packet_blocked']
        : []),
      ...(exceptionKeys.length === 0 && exceptionPacket.exceptions.length > 0
        ? ['accounting.reconciliation_exception_resolution.no_exceptions_selected']
        : []),
      ...(unknownExceptionKeys.length > 0
        ? ['accounting.reconciliation_exception_resolution.unknown_exceptions']
        : []),
      ...(input.decision === 'resolve' && !input.reason?.trim()
        ? ['accounting.reconciliation_exception_resolution.reason_required']
        : []),
      ...(input.decision === 'resolve' && !input.evidenceReference?.trim()
        ? ['accounting.reconciliation_exception_resolution.evidence_required']
        : []),
    ];
    const selectedExceptions = exceptionPacket.exceptions.filter((exception) =>
      exceptionKeys.includes(exception.exceptionKey),
    );
    const shouldPersist = input.decision === 'resolve' && blockers.length === 0;
    const control = shouldPersist
      ? await this.recordTenantAccountingBankReconciliationControlUseCase.execute({
          tenantSlug: input.tenantSlug,
          period: input.period,
          year: input.year,
          eventType: 'exception_resolved',
          status: 'resolved',
          source: 'reconciliation_exception_resolution_packet',
          actorUserId: input.actorUserId ?? null,
          actorEmail: input.actorEmail ?? null,
          reason: input.reason ?? null,
          evidenceReference: input.evidenceReference ?? null,
          payload: {
            resolutionType: input.resolutionType,
            resolvedExceptionCount: selectedExceptions.length,
            totalDifferenceInCents: selectedExceptions.reduce(
              (total, exception) => total + exception.differenceInCents,
              0,
            ),
          },
          impactChecklist: selectedExceptions.map(
            (exception) => `${exception.exceptionType}: ${exception.recommendation}`,
          ),
        })
      : input.decision === 'prepare' && blockers.length === 0
        ? await this.recordTenantAccountingBankReconciliationControlUseCase.execute({
            tenantSlug: input.tenantSlug,
            period: input.period,
            year: input.year,
            eventType: 'exception_resolution_prepared',
            status: 'needs_review',
            source: 'reconciliation_exception_resolution_packet',
            actorUserId: input.actorUserId ?? null,
            actorEmail: input.actorEmail ?? null,
            reason: input.reason ?? null,
            evidenceReference: input.evidenceReference ?? null,
            payload: {
              resolutionType: input.resolutionType,
              selectedExceptionCount: selectedExceptions.length,
            },
            impactChecklist: selectedExceptions.map(
              (exception) => `${exception.exceptionType}: ${exception.recommendation}`,
            ),
          })
        : null;
    const resolvedExceptionKeys = shouldPersist ? exceptionKeys : [];
    const totalDifferenceInCents = selectedExceptions.reduce(
      (total, exception) => total + exception.differenceInCents,
      0,
    );

    return {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      resolutionStatus:
        blockers.length > 0
          ? 'blocked'
          : shouldPersist
            ? 'resolved'
            : 'ready_to_resolve',
      decision: input.decision,
      resolutionType: input.resolutionType,
      exceptionKeys,
      resolvedExceptionKeys,
      exceptionPacket,
      control,
      impactChecklist: [
        {
          key: 'exceptions',
          label: 'Excepciones seleccionadas',
          status: selectedExceptions.length > 0 || exceptionPacket.exceptions.length === 0
            ? 'ready'
            : 'blocked',
          detail: `${selectedExceptions.length} excepciones seleccionadas.`,
        },
        {
          key: 'evidence',
          label: 'Evidencia de resolucion',
          status:
            input.decision === 'resolve' && !input.evidenceReference
              ? 'blocked'
              : input.decision === 'resolve'
                ? 'ready'
                : 'needs_review',
          detail: input.evidenceReference ?? 'Evidencia pendiente para resolver.',
        },
      ],
      summary: {
        requestedExceptionCount: exceptionKeys.length,
        resolvedExceptionCount: resolvedExceptionKeys.length,
        unresolvedExceptionCount:
          exceptionPacket.exceptions.length - resolvedExceptionKeys.length,
        totalDifferenceInCents,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        blockers.length > 0
          ? 'Completar seleccion, razon y evidencia antes de resolver.'
          : shouldPersist
            ? 'Excepciones marcadas como resueltas para cash closeout.'
            : 'Revisar impacto y confirmar resolucion si procede.',
      guardrails: [
        'Resolution packet no crea ajustes automaticamente.',
        'Debe conservar evidencia de soporte para cada excepcion resuelta.',
        'Ajustes contables se crean por el flujo de adjusting journal entries.',
      ],
    };
  }
}
