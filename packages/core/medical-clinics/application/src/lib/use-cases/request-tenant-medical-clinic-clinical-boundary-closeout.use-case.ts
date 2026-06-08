import { TenantMedicalClinicClinicalBoundaryCloseout } from '@saas-platform/medical-clinics-domain';
import { clinicalGuardrails } from './get-tenant-medical-clinic-encounter-workspace.use-case';

export class RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicClinicalBoundaryCloseout> {
    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      boundaryStatus: 'needs_review',
      acceptedCapabilities: [
        'encounter workspace operativo por cita',
        'clinical note draft packet para revision',
        'treatment follow-up readiness',
        'prescription readiness packet sin emision oficial',
        'encounter closeout operativo',
      ],
      explicitlyExcludedCapabilities: [
        'historia clinica legal completa',
        'diagnostico automatico',
        'receta oficial firmada',
        'firma medica o consentimiento legal certificado',
        'reemplazo de criterio profesional',
      ],
      requiredHumanControls: [
        'revision obligatoria de profesional medico',
        'aprobacion externa para receta o indicaciones oficiales',
        'consentimiento y privacidad fuera de automatismos',
      ],
      nextRecommendedSlice: 'medical-history-records',
      guardrails: clinicalGuardrails(),
    };
  }
}
