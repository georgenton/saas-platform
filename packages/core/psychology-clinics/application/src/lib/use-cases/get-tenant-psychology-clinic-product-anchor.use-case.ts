import { TenantPsychologyClinicProductAnchorView } from '@saas-platform/psychology-clinics-domain';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicProductAnchorUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicProductAnchorView> {
    const modules = [
      module(
        'therapists',
        'Therapists',
        'Terapeutas, enfoques y licencias.',
        true,
      ),
      module(
        'patients',
        'Patients',
        'Intake, consentimiento y contacto.',
        true,
      ),
      module('sessions', 'Sessions', 'Agenda y ciclo de sesiones.', true),
      module(
        'session-notes',
        'Session Notes',
        'Notas draft revisables.',
        false,
      ),
      module(
        'treatment-tracking',
        'Treatment Tracking',
        'Seguimiento futuro.',
        false,
      ),
      module('reminders', 'Reminders', 'Bridge revisado a Growth.', false),
    ];
    const lanes: TenantPsychologyClinicProductAnchorView['lanes'] = [
      lane('profile', 'Perfil psicologico', 'needs_review', 1, '1 therapist'),
      lane('patient_intake', 'Intake pacientes', 'needs_review', 1, 'consent'),
      lane('sessions', 'Sesiones', 'needs_review', 1, 'schedule'),
      lane('notes', 'Notas draft', 'needs_review', 1, 'review'),
      lane('growth_billing', 'Growth/Billing', 'needs_review', 1, 'handoff'),
    ];

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      productKey: 'psychology-clinics',
      productName: 'Psychology Clinics',
      anchorStatus: 'needs_review',
      modules,
      lanes,
      summary: {
        moduleCount: modules.length,
        coreModuleCount: modules.filter((item) => item.isCore).length,
        readyLaneCount: lanes.filter((item) => item.status === 'ready').length,
        blockerCount: lanes.reduce(
          (total, item) => total + item.blockerCount,
          0,
        ),
      },
      guardrails: psychologyGuardrails(),
      nextStep: 'Configurar perfil, intake y primera sesion revisable.',
    };
  }
}

function module(
  key: string,
  name: string,
  description: string,
  isCore: boolean,
): TenantPsychologyClinicProductAnchorView['modules'][number] {
  return { key, name, description, isCore };
}

function lane(
  laneKey: string,
  label: string,
  status: TenantPsychologyClinicProductAnchorView['lanes'][number]['status'],
  blockerCount: number,
  primaryMetric: string,
): TenantPsychologyClinicProductAnchorView['lanes'][number] {
  return {
    laneKey,
    label,
    status,
    blockerCount,
    primaryMetric,
    nextAction: 'Completar foundation operacional.',
  };
}
