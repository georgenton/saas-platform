import { TenantPsychologyClinicProfileWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { defaultProfile } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicProfileWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicProfileWorkspace> {
    const profile =
      (await this.operationsRepository?.getProfile(input.tenantSlug)) ??
      defaultProfile();

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      ...profile,
      nextStep:
        profile.workspaceStatus === 'ready'
          ? 'Usar perfil para intake y sesiones.'
          : 'Validar privacidad, licencia y catalogo de servicios.',
    };
  }
}
