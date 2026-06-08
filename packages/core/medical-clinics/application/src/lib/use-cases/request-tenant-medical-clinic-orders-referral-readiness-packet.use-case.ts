import { TenantMedicalClinicOrdersReferralReadinessPacket } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import {
  defaultAppointment,
  findAppointment,
} from './get-tenant-medical-clinic-encounter-workspace.use-case';
import {
  recordMedicalClinicEvent,
  recordsGuardrails,
} from './medical-clinic-records.helpers';

export class RequestTenantMedicalClinicOrdersReferralReadinessPacketUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly idGenerator?: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    appointmentId: string;
  }): Promise<TenantMedicalClinicOrdersReferralReadinessPacket> {
    const appointment =
      (await findAppointment(
        this.operationsRepository,
        input.tenantSlug,
        input.appointmentId,
      )) ?? defaultAppointment(input.tenantSlug, input.appointmentId);
    const blockers = appointment.blockers;
    const packetStatus = blockers.length > 0 ? 'blocked' : 'needs_review';
    const now = this.nowProvider();

    await recordMedicalClinicEvent({
      operationsRepository: this.operationsRepository,
      idGenerator: this.idGenerator,
      tenantSlug: input.tenantSlug,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      eventType: 'orders_referral_readiness_packet_requested',
      status: packetStatus,
      payload: { officialDocumentIssued: false },
      occurredAt: now,
    });

    return {
      tenantSlug: input.tenantSlug,
      appointmentId: input.appointmentId,
      generatedAt: now,
      packetStatus,
      orders: [
        order('lab-review', 'lab', 'Orden de laboratorio pendiente'),
        order('imaging-review', 'imaging', 'Imagen/estudio pendiente'),
        order('referral-review', 'referral', 'Referencia a especialista'),
        order(
          'prescription-review',
          'prescription',
          'Indicacion/prescripcion pendiente',
        ),
        order('certificate-review', 'certificate', 'Certificado pendiente'),
      ],
      professionalApproval: {
        required: true,
        officialDocumentIssued: false,
        allowedAction: 'prepare_review_packet',
      },
      blockers,
      nextStep:
        packetStatus === 'blocked'
          ? 'Resolver blockers de cita antes de preparar ordenes.'
          : 'Seleccionar ordenes aplicables y enviar a aprobacion profesional.',
      guardrails: recordsGuardrails(),
    };
  }
}

function order(
  key: string,
  category: TenantMedicalClinicOrdersReferralReadinessPacket['orders'][number]['category'],
  label: string,
): TenantMedicalClinicOrdersReferralReadinessPacket['orders'][number] {
  return {
    key,
    category,
    label,
    status: 'needs_review',
    approvalRequired: true,
  };
}
