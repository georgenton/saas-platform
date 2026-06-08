import {
  MedicalClinicAppointmentStatus,
  TenantMedicalClinicAppointmentRecord,
} from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';

export class TransitionTenantMedicalClinicAppointmentUseCase {
  constructor(
    private readonly operationsRepository: MedicalClinicOperationsRepository,
    private readonly idGenerator: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    appointmentId: string;
    status: MedicalClinicAppointmentStatus;
    blockers?: string[];
  }): Promise<TenantMedicalClinicAppointmentRecord | null> {
    const tenantId = await this.operationsRepository.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (!tenantId) {
      throw new Error(`Tenant ${input.tenantSlug} was not found.`);
    }

    const appointment = await this.operationsRepository.transitionAppointment({
      tenantSlug: input.tenantSlug,
      appointmentId: input.appointmentId,
      status: input.status,
      reminderStatus:
        input.status === 'confirmed' || input.status === 'completed'
          ? 'ready'
          : undefined,
      billingStatus: input.status === 'completed' ? 'needs_review' : undefined,
      blockers: input.blockers,
    });

    if (!appointment) {
      return null;
    }

    await this.operationsRepository.recordEvent({
      id: this.idGenerator.generate(),
      tenantId,
      tenantSlug: input.tenantSlug,
      appointmentId: input.appointmentId,
      eventType: `appointment_${input.status}`,
      source: 'medical-clinics',
      status: input.blockers?.length ? 'blocked' : 'ready',
      payload: {
        status: input.status,
        blockers: input.blockers ?? [],
      },
      occurredAt: this.nowProvider(),
    });

    return appointment;
  }
}
