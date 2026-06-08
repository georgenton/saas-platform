import { TenantMedicalClinicPrescriptionReadinessPacket } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  clinicalGuardrails,
  defaultAppointment,
  findAppointment,
} from './get-tenant-medical-clinic-encounter-workspace.use-case';

export class RequestTenantMedicalClinicPrescriptionReadinessPacketUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly idGenerator?: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    appointmentId: string;
  }): Promise<TenantMedicalClinicPrescriptionReadinessPacket> {
    const appointment =
      (await findAppointment(
        this.operationsRepository,
        input.tenantSlug,
        input.appointmentId,
      )) ?? defaultAppointment(input.tenantSlug, input.appointmentId);
    const blockers = [
      'La receta oficial requiere aprobacion y firma externa del profesional.',
      ...appointment.blockers,
    ];

    await this.recordPacketEvent(input.tenantSlug, input.appointmentId);

    return {
      tenantSlug: input.tenantSlug,
      appointmentId: input.appointmentId,
      generatedAt: this.nowProvider(),
      packetStatus: 'blocked',
      draftItems: [
        {
          label: `Indicacion draft asociada a ${appointment.serviceName}`,
          category: 'indication',
          status: 'needs_review',
          reviewNote:
            'Debe ser validada por profesional antes de entregar al paciente.',
        },
        {
          label: 'Medicacion draft',
          category: 'medication',
          status: 'blocked',
          reviewNote: 'No se sugiere medicamento automaticamente.',
        },
      ],
      approval: {
        requiresMedicalApproval: true,
        officialPrescriptionIssued: false,
        signatureStatus: 'not_supported_in_clinics',
      },
      blockers,
      nextStep:
        'Enviar packet a revision profesional; emitir receta fuera de Clinics si aplica.',
      guardrails: clinicalGuardrails(),
    };
  }

  private async recordPacketEvent(
    tenantSlug: string,
    appointmentId: string,
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
      eventType: 'prescription_readiness_packet_requested',
      source: 'medical-clinics',
      status: 'blocked',
      payload: { officialPrescriptionIssued: false },
      occurredAt: this.nowProvider(),
    });
  }
}
