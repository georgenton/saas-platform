import { TenantPsychologyClinicSessionRecord } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicIdGenerator } from '../ports/id-generators';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { findPatient } from './psychology-clinic-foundation.helpers';

export class CreateTenantPsychologyClinicSessionUseCase {
  constructor(
    private readonly operationsRepository: PsychologyClinicOperationsRepository,
    private readonly idGenerator: PsychologyClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientId: string;
    serviceName: string;
    therapistId: string;
    therapistName: string;
    modality?: TenantPsychologyClinicSessionRecord['modality'];
    startsAt: Date;
    blockers?: string[];
  }): Promise<TenantPsychologyClinicSessionRecord> {
    const tenantId = await this.operationsRepository.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (!tenantId) {
      throw new Error(`Tenant "${input.tenantSlug}" was not found.`);
    }

    const patient = await findPatient(
      this.operationsRepository,
      input.tenantSlug,
      input.patientId,
    );

    if (!patient) {
      throw new Error(`Psychology patient "${input.patientId}" was not found.`);
    }

    const session = await this.operationsRepository.saveSession({
      id: this.idGenerator.generate(),
      tenantId,
      tenantSlug: input.tenantSlug,
      patientId: input.patientId,
      serviceName: input.serviceName,
      therapistId: input.therapistId,
      therapistName: input.therapistName,
      modality: input.modality ?? 'in_person',
      startsAt: input.startsAt,
      status: 'confirmed',
      reminderStatus:
        patient.messagingOptInStatus === 'ready' ? 'needs_review' : 'blocked',
      billingStatus: 'needs_review',
      blockers: input.blockers ?? [],
    });

    await this.operationsRepository.recordEvent({
      id: this.idGenerator.generate(),
      tenantId,
      tenantSlug: input.tenantSlug,
      sessionId: session.id,
      eventType: 'psychology_session_created',
      source: 'psychology-clinics',
      status: 'ready',
      payload: { patientId: input.patientId },
      occurredAt: this.nowProvider(),
    });

    return session;
  }
}
