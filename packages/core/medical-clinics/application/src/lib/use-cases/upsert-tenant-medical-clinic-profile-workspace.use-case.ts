import {
  MedicalClinicProfileSnapshot,
  TenantMedicalClinicProfileWorkspace,
} from '@saas-platform/medical-clinics-domain';
import { MedicalClinicIdGenerator } from '../ports/id-generators';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';
import { defaultProfileSnapshot } from './get-tenant-medical-clinic-profile-workspace.use-case';

export class UpsertTenantMedicalClinicProfileWorkspaceUseCase {
  constructor(
    private readonly operationsRepository: MedicalClinicOperationsRepository,
    private readonly idGenerator: MedicalClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    snapshot: Partial<MedicalClinicProfileSnapshot>;
  }): Promise<TenantMedicalClinicProfileWorkspace> {
    const tenantId = await this.operationsRepository.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (!tenantId) {
      throw new Error(`Tenant ${input.tenantSlug} was not found.`);
    }

    const base = defaultProfileSnapshot();
    const snapshot: MedicalClinicProfileSnapshot = {
      ...base,
      ...input.snapshot,
      clinicProfile: {
        ...base.clinicProfile,
        ...input.snapshot.clinicProfile,
      },
      careLocations: input.snapshot.careLocations ?? base.careLocations,
      professionals: input.snapshot.professionals ?? base.professionals,
      serviceCatalog: input.snapshot.serviceCatalog ?? base.serviceCatalog,
      blockers: input.snapshot.blockers ?? base.blockers,
      guardrails: input.snapshot.guardrails ?? base.guardrails,
    };

    const saved = await this.operationsRepository.upsertProfile({
      id: this.idGenerator.generate(),
      tenantId,
      tenantSlug: input.tenantSlug,
      snapshot,
    });

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      workspaceStatus: saved.workspaceStatus,
      clinicProfile: saved.clinicProfile,
      careLocations: saved.careLocations,
      professionals: saved.professionals,
      serviceCatalog: saved.serviceCatalog,
      blockers: saved.blockers,
      nextStep:
        saved.workspaceStatus === 'ready'
          ? 'Perfil persistido listo para agenda y bridges operativos.'
          : 'Revisar datos persistidos pendientes antes de activar agenda completa.',
      guardrails: saved.guardrails,
    };
  }
}
