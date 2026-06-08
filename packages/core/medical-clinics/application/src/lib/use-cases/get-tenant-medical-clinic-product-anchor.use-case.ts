import {
  MedicalClinicOperationalLane,
  TenantMedicalClinicProductAnchorView,
} from '@saas-platform/medical-clinics-domain';

export class GetTenantMedicalClinicProductAnchorUseCase {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicProductAnchorView> {
    const lanes: MedicalClinicOperationalLane[] = [
      lane('clinic_profile', 'Clinic profile', 'needs_review', 1, '1 location'),
      lane('patient_intake', 'Patient intake', 'needs_review', 1, '3 patients'),
      lane('appointments', 'Appointments', 'ready', 0, '4 scheduled'),
      lane(
        'growth_reminders',
        'Growth reminders',
        'needs_review',
        1,
        '3 queued',
      ),
      lane('billing_tax', 'Billing and tax bridge', 'blocked', 2, '2 drafts'),
    ];
    const blockerCount = lanes.reduce(
      (total, item) => total + item.blockerCount,
      0,
    );

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      productKey: 'medical-clinics',
      productName: 'Medical Clinics',
      anchorStatus: blockerCount > 0 ? 'blocked' : 'ready',
      modules: [
        {
          key: 'clinic-ops',
          name: 'Clinic Ops',
          description:
            'Perfil de clinica, profesionales, ubicaciones y servicios.',
          isCore: true,
        },
        {
          key: 'patient-intake',
          name: 'Patient Intake',
          description: 'Directorio inicial, consentimiento y cola de admision.',
          isCore: true,
        },
        {
          key: 'appointments',
          name: 'Appointments',
          description: 'Agenda, disponibilidad, estados y no-show operativo.',
          isCore: true,
        },
        {
          key: 'growth-bridge',
          name: 'Growth Bridge',
          description:
            'Recordatorios y follow-up sobre canales conversacionales.',
          isCore: false,
        },
        {
          key: 'billing-tax-bridge',
          name: 'Billing and Tax Bridge',
          description: 'Preparacion de cobro, factura y evidencia tributaria.',
          isCore: false,
        },
      ],
      lanes,
      summary: {
        moduleCount: 5,
        coreModuleCount: 3,
        readyLaneCount: lanes.filter((item) => item.status === 'ready').length,
        blockerCount,
      },
      guardrails: [
        'No gestiona historia clinica formal ni diagnosticos medicos oficiales.',
        'No reemplaza criterio medico, consentimiento legal ni regulacion sanitaria.',
        'Billing/tax prepara handoffs; no emite facturas ni declara impuestos desde Clinics.',
      ],
      nextStep:
        'Completar perfil fiscal de pacientes y reglas de cobro antes de activar handoffs de factura.',
    };
  }
}

function lane(
  laneKey: string,
  label: string,
  status: MedicalClinicOperationalLane['status'],
  blockerCount: number,
  primaryMetric: string,
): MedicalClinicOperationalLane {
  return {
    laneKey,
    label,
    status,
    blockerCount,
    primaryMetric,
    nextAction:
      status === 'ready'
        ? 'Mantener operacion y monitorear excepciones.'
        : 'Resolver datos requeridos para habilitar operacion diaria.',
  };
}
