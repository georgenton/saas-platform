import { TenantMedicalClinicClinicalNoteDraftPacket } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  clinicalGuardrails,
  defaultAppointment,
  findAppointment,
} from './get-tenant-medical-clinic-encounter-workspace.use-case';

export class RequestTenantMedicalClinicClinicalNoteDraftPacketUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly idGenerator?: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    appointmentId: string;
  }): Promise<TenantMedicalClinicClinicalNoteDraftPacket> {
    const appointment =
      (await findAppointment(
        this.operationsRepository,
        input.tenantSlug,
        input.appointmentId,
      )) ?? defaultAppointment(input.tenantSlug, input.appointmentId);
    const blockers = appointment.blockers;
    const packetStatus = blockers.length > 0 ? 'needs_review' : 'ready';

    await this.recordPacketEvent(
      input.tenantSlug,
      input.appointmentId,
      packetStatus,
    );

    return {
      tenantSlug: input.tenantSlug,
      appointmentId: input.appointmentId,
      generatedAt: this.nowProvider(),
      packetStatus,
      draftSections: {
        subjective: `Motivo referido asociado a ${appointment.serviceName}.`,
        objective:
          'Signos/hallazgos objetivos pendientes de completar por profesional.',
        assessment: 'Evaluacion clinica pendiente de criterio profesional.',
        plan: 'Plan preliminar sujeto a revision y aprobacion del profesional.',
        pendingFields: [
          'hallazgos objetivos',
          'evaluacion profesional',
          'indicaciones aprobadas',
        ],
      },
      review: {
        requiresProfessionalReview: true,
        mayBeSigned: false,
        reviewerRole: 'medical_professional',
      },
      blockers,
      nextStep: 'Completar campos clinicos y enviar a revision profesional.',
      guardrails: clinicalGuardrails(),
    };
  }

  private async recordPacketEvent(
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
      eventType: 'clinical_note_draft_packet_requested',
      source: 'medical-clinics',
      status,
      payload: { requiresProfessionalReview: true },
      occurredAt: this.nowProvider(),
    });
  }
}
