import { TenantMedicalClinicCarePlanTaskWorkspace } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  defaultPatient,
  findAppointmentsForPatient,
  findPatient,
  recordsGuardrails,
} from './medical-clinic-records.helpers';

export class GetTenantMedicalClinicCarePlanTaskWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
  }): Promise<TenantMedicalClinicCarePlanTaskWorkspace> {
    const patient =
      (await findPatient(
        this.operationsRepository,
        input.tenantSlug,
        input.patientId,
      )) ?? defaultPatient(input.tenantSlug, input.patientId);
    const appointments = await findAppointmentsForPatient(
      this.operationsRepository,
      input.tenantSlug,
      input.patientId,
    );
    const completedAppointment = appointments.find(
      (appointment) => appointment.status === 'completed',
    );
    const blockers = [
      ...patient.blockers,
      ...(completedAppointment
        ? []
        : ['Se requiere una cita completada para activar care plan tasks.']),
    ];
    const tasks: TenantMedicalClinicCarePlanTaskWorkspace['tasks'] = [
      task(
        'schedule-follow-up',
        'Agendar control sugerido',
        'clinic',
        completedAppointment ? 'needs_review' : 'blocked',
        '7-30 days',
        'needs_review',
      ),
      task(
        'patient-instructions',
        'Entregar instrucciones revisadas al paciente',
        'professional',
        'needs_review',
        'same day',
        'needs_review',
      ),
      task(
        'document-pending-evidence',
        'Completar evidencia/documentos pendientes',
        'clinic',
        patient.consentStatus === 'ready' ? 'needs_review' : 'blocked',
        'before closeout',
        'needs_review',
      ),
      task(
        'growth-follow-up',
        'Preparar recordatorio WhatsApp revisable',
        'clinic',
        patient.messagingOptInStatus === 'ready' ? 'ready' : 'needs_review',
        '24-72 hours',
        patient.messagingOptInStatus,
      ),
    ];

    return {
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      generatedAt: this.nowProvider(),
      workspaceStatus:
        blockers.length > 0
          ? 'blocked'
          : tasks.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      tasks,
      summary: {
        taskCount: tasks.length,
        readyTaskCount: tasks.filter((item) => item.status === 'ready').length,
        blockedTaskCount: tasks.filter((item) => item.status === 'blocked')
          .length,
        growthReviewCount: tasks.filter(
          (item) => item.growthBridgeStatus !== 'ready',
        ).length,
      },
      blockers,
      nextStep:
        blockers.length > 0
          ? 'Completar cita/consentimientos antes de activar tareas.'
          : 'Asignar tareas de seguimiento y revisar handoff a Growth.',
      guardrails: recordsGuardrails(),
    };
  }
}

function task(
  key: string,
  label: string,
  owner: TenantMedicalClinicCarePlanTaskWorkspace['tasks'][number]['owner'],
  status: TenantMedicalClinicCarePlanTaskWorkspace['tasks'][number]['status'],
  dueHint: string,
  growthBridgeStatus: TenantMedicalClinicCarePlanTaskWorkspace['tasks'][number]['growthBridgeStatus'],
): TenantMedicalClinicCarePlanTaskWorkspace['tasks'][number] {
  return { key, label, owner, status, dueHint, growthBridgeStatus };
}
