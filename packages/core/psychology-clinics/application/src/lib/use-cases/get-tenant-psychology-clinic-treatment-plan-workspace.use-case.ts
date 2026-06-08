import { TenantPsychologyClinicTreatmentPlanWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  findPatient,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicTreatmentPlanWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantPsychologyClinicTreatmentPlanWorkspace> {
    const patient = await findPatient(
      this.operationsRepository,
      input.tenantSlug,
      input.patientId,
    );
    const sessions =
      (await this.operationsRepository?.listSessions(input.tenantSlug)) ?? [];
    const patientSessions = sessions.filter(
      (session) => session.patientId === input.patientId,
    );
    const blockers = [
      ...(patient?.blockers ?? []),
      ...(patient?.therapyConsentStatus === 'ready'
        ? []
        : ['Consentimiento terapeutico pendiente.']),
      ...(patient?.initialRiskReviewStatus === 'ready'
        ? []
        : ['Revision de riesgo inicial pendiente.']),
    ];
    const goals: TenantPsychologyClinicTreatmentPlanWorkspace['goals'] = [
      {
        id: 'goal_presenting_concern',
        label: `Clarificar motivo: ${patient?.presentingConcern ?? 'motivo pendiente'}`,
        status: patient ? 'needs_review' : 'blocked',
        reviewCadence: 'cada 2-4 sesiones',
        nextAction: 'Terapeuta define objetivo clinico observable.',
      },
      {
        id: 'goal_session_continuity',
        label: 'Mantener continuidad terapeutica revisable',
        status: patientSessions.length > 0 ? 'ready' : 'needs_review',
        reviewCadence: 'semanal',
        nextAction: 'Confirmar agenda y seguimiento.',
      },
    ];
    const careTasks: TenantPsychologyClinicTreatmentPlanWorkspace['careTasks'] =
      [
        task(
          'task_review_consent',
          'Validar consentimiento y privacidad',
          'front_desk',
          patient?.therapyConsentStatus ?? 'blocked',
          'antes de proxima sesion',
        ),
        task(
          'task_therapist_plan_review',
          'Redactar plan terapeutico revisable',
          'therapist',
          'needs_review',
          'despues de primera sesion',
        ),
        task(
          'task_patient_follow_up',
          'Definir seguimiento o tarea para paciente',
          'patient',
          patientSessions.some((session) => session.status === 'completed')
            ? 'needs_review'
            : 'blocked',
          '24-72 horas',
        ),
      ];

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: this.nowProvider(),
      workspaceStatus:
        blockers.length > 0
          ? 'blocked'
          : goals.every((goal) => goal.status === 'ready')
            ? 'ready'
            : 'needs_review',
      patient: {
        id: input.patientId,
        displayName: patient?.patientDisplayName ?? 'Paciente no encontrado',
        presentingConcern: patient?.presentingConcern ?? 'Pendiente',
        therapyConsentStatus: patient?.therapyConsentStatus ?? 'blocked',
        initialRiskReviewStatus: patient?.initialRiskReviewStatus ?? 'blocked',
      },
      goals,
      careTasks,
      summary: {
        goalCount: goals.length,
        readyGoalCount: goals.filter((goal) => goal.status === 'ready').length,
        taskCount: careTasks.length,
        blockedTaskCount: careTasks.filter((task) => task.status === 'blocked')
          .length,
        growthReviewCount: careTasks.filter(
          (task) => task.growthBridgeStatus !== 'ready',
        ).length,
      },
      blockers,
      nextStep:
        'Terapeuta revisa objetivos y tareas antes de activar follow-up.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function task(
  id: string,
  label: string,
  owner: TenantPsychologyClinicTreatmentPlanWorkspace['careTasks'][number]['owner'],
  status: TenantPsychologyClinicTreatmentPlanWorkspace['careTasks'][number]['status'],
  dueWindow: string,
): TenantPsychologyClinicTreatmentPlanWorkspace['careTasks'][number] {
  return {
    id,
    label,
    owner,
    status,
    dueWindow,
    growthBridgeStatus: status === 'ready' ? 'needs_review' : status,
  };
}
