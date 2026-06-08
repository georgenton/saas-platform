import { TenantMedicalClinicAppointmentRecord } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';

export class CreateTenantMedicalClinicAppointmentUseCase {
  constructor(
    private readonly operationsRepository: MedicalClinicOperationsRepository,
    private readonly idGenerator: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
    serviceName: string;
    professionalId: string;
    professionalName: string;
    startsAt: Date;
    amountInCents?: number | null;
    currency?: 'USD' | null;
    blockers?: string[];
  }): Promise<TenantMedicalClinicAppointmentRecord> {
    const tenantId = await this.operationsRepository.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (!tenantId) {
      throw new Error(`Tenant ${input.tenantSlug} was not found.`);
    }

    const blockers = input.blockers ?? [];
    const appointment = await this.operationsRepository.saveAppointment({
      id: this.idGenerator.generate(),
      tenantId,
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      serviceName: input.serviceName,
      professionalId: input.professionalId,
      professionalName: input.professionalName,
      startsAt: input.startsAt,
      status: 'requested',
      reminderStatus: blockers.length > 0 ? 'blocked' : 'needs_review',
      billingStatus: input.amountInCents ? 'needs_review' : 'blocked',
      amountInCents: input.amountInCents ?? null,
      currency: input.currency ?? null,
      blockers,
    });

    await this.operationsRepository.recordEvent({
      id: this.idGenerator.generate(),
      tenantId,
      tenantSlug: input.tenantSlug,
      appointmentId: appointment.id,
      eventType: 'appointment_created',
      source: 'medical-clinics',
      status: blockers.length > 0 ? 'blocked' : 'needs_review',
      payload: {
        patientId: input.patientId,
        serviceName: input.serviceName,
        professionalId: input.professionalId,
      },
      occurredAt: this.nowProvider(),
    });

    return appointment;
  }
}
