import { TenantMedicalClinicPatientRecord } from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';

export class RegisterTenantMedicalClinicPatientIntakeUseCase {
  constructor(
    private readonly operationsRepository: MedicalClinicOperationsRepository,
    private readonly idGenerator: MedicalClinicIdGenerator,
  ) {}

  async execute(input: {
    tenantSlug: string;
    patientDisplayName: string;
    identificationStatus?: TenantMedicalClinicPatientRecord['identificationStatus'];
    contactStatus?: TenantMedicalClinicPatientRecord['contactStatus'];
    consentStatus?: TenantMedicalClinicPatientRecord['consentStatus'];
    messagingOptInStatus?: TenantMedicalClinicPatientRecord['messagingOptInStatus'];
    triageReason: string;
    contact?: Partial<TenantMedicalClinicPatientRecord['contact']>;
    representative?: Partial<
      TenantMedicalClinicPatientRecord['representative']
    >;
    blockers?: string[];
  }): Promise<TenantMedicalClinicPatientRecord> {
    const tenantId = await this.operationsRepository.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (!tenantId) {
      throw new Error(`Tenant ${input.tenantSlug} was not found.`);
    }

    return this.operationsRepository.savePatient({
      id: this.idGenerator.generate(),
      tenantId,
      tenantSlug: input.tenantSlug,
      patientDisplayName: input.patientDisplayName,
      identificationStatus: input.identificationStatus ?? 'needs_review',
      contactStatus: input.contactStatus ?? 'needs_review',
      consentStatus: input.consentStatus ?? 'needs_review',
      messagingOptInStatus: input.messagingOptInStatus ?? 'needs_review',
      triageReason: input.triageReason,
      contact: {
        email: input.contact?.email ?? null,
        phoneE164: input.contact?.phoneE164 ?? null,
        whatsappE164: input.contact?.whatsappE164 ?? null,
      },
      representative: {
        displayName: input.representative?.displayName ?? null,
        relationship: input.representative?.relationship ?? null,
        identification: input.representative?.identification ?? null,
      },
      blockers: input.blockers ?? [],
    });
  }
}
