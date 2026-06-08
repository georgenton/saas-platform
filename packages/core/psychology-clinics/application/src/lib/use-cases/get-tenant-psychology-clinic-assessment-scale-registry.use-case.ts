import { TenantPsychologyClinicAssessmentScaleRegistry } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  findPatient,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicAssessmentScaleRegistryUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantPsychologyClinicAssessmentScaleRegistry> {
    const [patient, sessions] = await Promise.all([
      findPatient(this.operationsRepository, input.tenantSlug, input.patientId),
      this.operationsRepository?.listSessions(input.tenantSlug),
    ]);
    const patientSessions = (sessions ?? []).filter(
      (session) => session.patientId === input.patientId,
    );
    const lastSession = [...patientSessions].sort(
      (left, right) => right.startsAt.getTime() - left.startsAt.getTime(),
    )[0];
    const scales: TenantPsychologyClinicAssessmentScaleRegistry['scales'] = [
      scale(
        'baseline_intake',
        'Linea base de intake',
        patient ? 'needs_review' : 'blocked',
        'intake',
        patient?.createdAt.toISOString() ?? null,
      ),
      scale(
        'progress_check',
        'Chequeo periodico de progreso',
        patientSessions.length > 1 ? 'needs_review' : 'blocked',
        'cada 4 sesiones',
        lastSession?.startsAt.toISOString() ?? null,
      ),
      scale(
        'risk_review',
        'Revision de seguridad',
        patient?.initialRiskReviewStatus === 'ready'
          ? 'needs_review'
          : 'blocked',
        'segun criterio clinico',
        patient?.updatedAt.toISOString() ?? null,
      ),
    ];
    const blockers = [
      ...(patient?.blockers ?? []),
      ...scales
        .filter((item) => item.status === 'blocked')
        .map((item) => item.label),
    ];

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: this.nowProvider(),
      registryStatus:
        blockers.length > 0
          ? 'blocked'
          : scales.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      scales,
      summary: {
        scaleCount: scales.length,
        activeScaleCount: scales.filter((item) => item.lastRecordedAt).length,
        needsReviewScaleCount: scales.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedScaleCount: scales.filter((item) => item.status === 'blocked')
          .length,
      },
      blockers,
      nextStep: 'Registrar escalas como evidencia manual, no interpretacion IA.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function scale(
  key: string,
  label: string,
  status: TenantPsychologyClinicAssessmentScaleRegistry['scales'][number]['status'],
  cadence: string,
  lastRecordedAt: string | null,
): TenantPsychologyClinicAssessmentScaleRegistry['scales'][number] {
  return {
    key,
    label,
    status,
    cadence,
    lastRecordedAt,
    interpretationPolicy: 'manual_therapist_review_only',
  };
}
