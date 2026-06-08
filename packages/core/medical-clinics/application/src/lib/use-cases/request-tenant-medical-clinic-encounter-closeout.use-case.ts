import { TenantMedicalClinicEncounterCloseout } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  clinicalGuardrails,
  defaultAppointment,
  findAppointment,
} from './get-tenant-medical-clinic-encounter-workspace.use-case';

export class RequestTenantMedicalClinicEncounterCloseoutUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly idGenerator?: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    appointmentId: string;
  }): Promise<TenantMedicalClinicEncounterCloseout> {
    const appointment =
      (await findAppointment(
        this.operationsRepository,
        input.tenantSlug,
        input.appointmentId,
      )) ?? defaultAppointment(input.tenantSlug, input.appointmentId);
    const checklist: TenantMedicalClinicEncounterCloseout['checklist'] = [
      check(
        'appointment_completed',
        'Cita completada',
        appointment.status === 'completed' ? 'ready' : 'blocked',
        appointment.status,
      ),
      check(
        'clinical_note_review',
        'Nota clinica revisada',
        'needs_review',
        'clinical-note-draft',
      ),
      check(
        'treatment_follow_up',
        'Seguimiento definido',
        appointment.reminderStatus === 'ready' ? 'ready' : 'needs_review',
        'growth-reminder-bridge',
      ),
      check(
        'prescription_boundary',
        'Receta/indicaciones con limite claro',
        'needs_review',
        'prescription-readiness-packet',
      ),
      check(
        'billing_readiness',
        'Billing readiness',
        appointment.billingStatus,
        'billing-tax-bridge',
      ),
    ];
    const blockers = [
      ...appointment.blockers,
      ...checklist
        .filter((item) => item.status === 'blocked')
        .map((item) => item.label),
    ];
    const closeoutStatus = blockers.length > 0 ? 'blocked' : 'needs_review';

    await this.recordCloseoutEvent(
      input.tenantSlug,
      input.appointmentId,
      closeoutStatus,
    );

    return {
      tenantSlug: input.tenantSlug,
      appointmentId: input.appointmentId,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      checklist,
      summary: {
        checkCount: checklist.length,
        readyCheckCount: checklist.filter((item) => item.status === 'ready')
          .length,
        blockedCheckCount: checklist.filter((item) => item.status === 'blocked')
          .length,
      },
      blockers,
      nextStep:
        closeoutStatus === 'blocked'
          ? 'Resolver blockers antes de cerrar encounter clinico.'
          : 'Enviar note/follow-up/prescription drafts a revision profesional.',
      guardrails: clinicalGuardrails(),
    };
  }

  private async recordCloseoutEvent(
    tenantSlug: string,
    appointmentId: string,
    status: 'ready' | 'needs_review' | 'blocked',
  ): Promise<void> {
    const tenantId =
      await this.operationsRepository?.getTenantIdBySlug(tenantSlug);

    if (!tenantId || !this.idGenerator) {
      return;
    }

    await this.operationsRepository?.recordEvent({
      id: this.idGenerator.generate(),
      tenantId,
      tenantSlug,
      appointmentId,
      eventType: 'encounter_closeout_requested',
      source: 'medical-clinics',
      status,
      payload: { closeoutStatus: status },
      occurredAt: this.nowProvider(),
    });
  }
}

function check(
  key: string,
  label: string,
  status: 'ready' | 'needs_review' | 'blocked',
  evidence: string,
): TenantMedicalClinicEncounterCloseout['checklist'][number] {
  return { key, label, status, evidence };
}
