import { TenantMedicalClinicProfileWorkspace } from '@saas-platform/medical-clinics-domain';

export class GetTenantMedicalClinicProfileWorkspaceUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicProfileWorkspace> {
    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
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
      nextStep:
        'Validar RUC/party de la clinica y completar licencia del profesional pendiente.',
      guardrails: [
        'Perfil operativo; no registra habilitacion sanitaria oficial.',
        'Licencias se modelan como evidencia de revision, no como certificacion estatal.',
      ],
    };
  }
}
