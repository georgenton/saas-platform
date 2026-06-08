import {
  MedicalClinicProfileSnapshot,
  TenantMedicalClinicProfileWorkspace,
} from '@saas-platform/medical-clinics-domain';
import { MedicalClinicOperationsRepository } from '../ports/medical-clinic-operations.repository';

export class GetTenantMedicalClinicProfileWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: MedicalClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicProfileWorkspace> {
    const persisted = await this.operationsRepository?.getProfile(
      input.tenantSlug,
    );
    const snapshot = persisted ?? defaultProfileSnapshot();

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      workspaceStatus: snapshot.workspaceStatus,
      clinicProfile: snapshot.clinicProfile,
      careLocations: snapshot.careLocations,
      professionals: snapshot.professionals,
      serviceCatalog: snapshot.serviceCatalog,
      blockers: snapshot.blockers,
      nextStep:
        snapshot.workspaceStatus === 'ready'
          ? 'Perfil clinico operativo listo para intake, agenda y facturacion asistida.'
          : 'Validar RUC/party de la clinica y completar licencia del profesional pendiente.',
      guardrails: snapshot.guardrails,
    };
  }
}

export function defaultProfileSnapshot(): MedicalClinicProfileSnapshot {
  return {
    workspaceStatus: 'needs_review',
    clinicProfile: {
      legalName: 'Clinica Demo S.A.S.',
      tradeName: 'Clinica Demo',
      rucStatus: 'pending_party_link',
      operatingMode: 'single_location',
    },
    careLocations: [
      {
        id: 'location_main',
        name: 'Sede Principal',
        city: 'Quito',
        roomCount: 3,
        status: 'ready',
      },
    ],
    professionals: [
      {
        id: 'professional_general_001',
        displayName: 'Dra. Ana Paredes',
        specialty: 'Medicina general',
        licenseStatus: 'ready',
        scheduleStatus: 'ready',
      },
      {
        id: 'professional_pediatrics_001',
        displayName: 'Dr. Mateo Rivas',
        specialty: 'Pediatria',
        licenseStatus: 'pending_review',
        scheduleStatus: 'needs_review',
      },
    ],
    serviceCatalog: [
      {
        id: 'service_general_consultation',
        name: 'Consulta general',
        category: 'Consulta',
        defaultDurationMinutes: 30,
        billingMode: 'invoiceable_service',
        status: 'ready',
      },
      {
        id: 'service_pediatric_consultation',
        name: 'Consulta pediatrica',
        category: 'Consulta',
        defaultDurationMinutes: 40,
        billingMode: 'invoiceable_service',
        status: 'needs_review',
      },
    ],
    blockers: ['Vincular party fiscal de la clinica antes de facturacion.'],
    guardrails: [
      'Perfil operativo; no registra habilitacion sanitaria oficial.',
      'Licencias se modelan como evidencia de revision, no como certificacion estatal.',
    ],
  };
}
