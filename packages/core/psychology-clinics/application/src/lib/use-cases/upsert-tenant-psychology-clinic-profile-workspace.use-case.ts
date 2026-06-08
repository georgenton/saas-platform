import {
  PsychologyClinicProfileSnapshot,
  TenantPsychologyClinicProfileWorkspace,
} from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicIdGenerator } from '../ports/id-generators';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  defaultProfile,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class UpsertTenantPsychologyClinicProfileWorkspaceUseCase {
  constructor(
    private readonly operationsRepository: PsychologyClinicOperationsRepository,
    private readonly idGenerator: PsychologyClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    snapshot: Partial<PsychologyClinicProfileSnapshot>;
  }): Promise<TenantPsychologyClinicProfileWorkspace> {
    const tenantId = await this.operationsRepository.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (!tenantId) {
      throw new Error(`Tenant "${input.tenantSlug}" was not found.`);
    }

    const current =
      (await this.operationsRepository.getProfile(input.tenantSlug)) ??
      defaultProfile();
    const snapshot: PsychologyClinicProfileSnapshot = {
      ...current,
      ...input.snapshot,
      clinicProfile: {
        ...current.clinicProfile,
        ...(input.snapshot.clinicProfile ?? {}),
      },
      therapists: input.snapshot.therapists ?? current.therapists,
      serviceCatalog: input.snapshot.serviceCatalog ?? current.serviceCatalog,
      blockers: input.snapshot.blockers ?? current.blockers,
      guardrails: input.snapshot.guardrails ?? psychologyGuardrails(),
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
      ...saved,
      nextStep: 'Perfil psicologico guardado.',
    };
  }
}
