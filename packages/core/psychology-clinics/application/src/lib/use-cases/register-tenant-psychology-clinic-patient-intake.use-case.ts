import { TenantPsychologyClinicPatientRecord } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicIdGenerator } from '../ports/id-generators';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';

export class RegisterTenantPsychologyClinicPatientIntakeUseCase {
  constructor(
    private readonly operationsRepository: PsychologyClinicOperationsRepository,
    private readonly idGenerator: PsychologyClinicIdGenerator,
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientDisplayName: string;
    identificationStatus?: TenantPsychologyClinicPatientRecord['identificationStatus'];
    contactStatus?: TenantPsychologyClinicPatientRecord['contactStatus'];
    therapyConsentStatus?: TenantPsychologyClinicPatientRecord['therapyConsentStatus'];
    messagingOptInStatus?: TenantPsychologyClinicPatientRecord['messagingOptInStatus'];
    initialRiskReviewStatus?: TenantPsychologyClinicPatientRecord['initialRiskReviewStatus'];
    presentingConcern: string;
    contact?: Partial<TenantPsychologyClinicPatientRecord['contact']>;
    emergencyContact?: Partial<
      TenantPsychologyClinicPatientRecord['emergencyContact']
    >;
    blockers?: string[];
  }): Promise<TenantPsychologyClinicPatientRecord> {
    const tenantId = await this.operationsRepository.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (!tenantId) {
      throw new Error(`Tenant "${input.tenantSlug}" was not found.`);
    }

    return this.operationsRepository.savePatient({
      id: this.idGenerator.generate(),
      tenantId,
      tenantSlug: input.tenantSlug,
      patientDisplayName: input.patientDisplayName,
      identificationStatus: input.identificationStatus ?? 'needs_review',
      contactStatus: input.contactStatus ?? 'needs_review',
      therapyConsentStatus: input.therapyConsentStatus ?? 'needs_review',
      messagingOptInStatus: input.messagingOptInStatus ?? 'needs_review',
      initialRiskReviewStatus: input.initialRiskReviewStatus ?? 'needs_review',
      presentingConcern: input.presentingConcern,
      contact: {
        email: input.contact?.email ?? null,
        phoneE164: input.contact?.phoneE164 ?? null,
        whatsappE164: input.contact?.whatsappE164 ?? null,
      },
      emergencyContact: {
        displayName: input.emergencyContact?.displayName ?? null,
        relationship: input.emergencyContact?.relationship ?? null,
        phoneE164: input.emergencyContact?.phoneE164 ?? null,
      },
      blockers: input.blockers ?? [],
    });
  }
}
