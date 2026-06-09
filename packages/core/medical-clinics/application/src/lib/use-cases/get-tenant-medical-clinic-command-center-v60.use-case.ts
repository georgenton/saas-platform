import {
  MedicalClinicReadinessStatus,
  TenantMedicalClinicCommandCenterV60,
} from '@saas-platform/medical-clinics-domain';
import { GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase } from './get-tenant-medical-clinic-appointment-scheduling-workspace.use-case';
import { GetTenantMedicalClinicPatientIntakeWorkspaceUseCase } from './get-tenant-medical-clinic-patient-intake-workspace.use-case';
import { GetTenantMedicalClinicProductAnchorUseCase } from './get-tenant-medical-clinic-product-anchor.use-case';
import { GetTenantMedicalClinicProductCloseoutUseCase } from './get-tenant-medical-clinic-product-closeout.use-case';
import { GetTenantMedicalClinicProfileWorkspaceUseCase } from './get-tenant-medical-clinic-profile-workspace.use-case';
import { RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase } from './request-tenant-medical-clinic-clinical-boundary-closeout.use-case';

export class GetTenantMedicalClinicCommandCenterV60UseCase {
  constructor(
    private readonly getTenantMedicalClinicProductAnchorUseCase: GetTenantMedicalClinicProductAnchorUseCase,
    private readonly getTenantMedicalClinicProductCloseoutUseCase: GetTenantMedicalClinicProductCloseoutUseCase,
    private readonly getTenantMedicalClinicProfileWorkspaceUseCase: GetTenantMedicalClinicProfileWorkspaceUseCase,
    private readonly getTenantMedicalClinicPatientIntakeWorkspaceUseCase: GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
    private readonly getTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase: GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
    private readonly requestTenantMedicalClinicClinicalBoundaryCloseoutUseCase: RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantMedicalClinicCommandCenterV60> {
    const [anchor, productCloseout, profile, intake, scheduling, boundary] =
      await Promise.all([
        this.getTenantMedicalClinicProductAnchorUseCase.execute(input),
        this.getTenantMedicalClinicProductCloseoutUseCase.execute(input),
        this.getTenantMedicalClinicProfileWorkspaceUseCase.execute(input),
        this.getTenantMedicalClinicPatientIntakeWorkspaceUseCase.execute(input),
        this.getTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase.execute(
          input,
        ),
        this.requestTenantMedicalClinicClinicalBoundaryCloseoutUseCase.execute(
          input,
        ),
      ]);
    const commandTiles: TenantMedicalClinicCommandCenterV60['commandTiles'] = [
      tile(
        'anchor',
        'Product anchor',
        anchor.anchorStatus,
        `${anchor.summary.readyLaneCount}/${anchor.summary.moduleCount} lanes`,
        anchor.nextStep,
      ),
      tile(
        'profile',
        'Clinic profile',
        profile.workspaceStatus,
        `${profile.professionals.length} profesionales`,
        profile.nextStep,
      ),
      tile(
        'patients',
        'Patient intake',
        intake.workspaceStatus,
        `${intake.summary.readyPatientCount}/${intake.summary.patientCount} ready`,
        intake.nextStep,
      ),
      tile(
        'appointments',
        'Appointment scheduling',
        scheduling.workspaceStatus,
        `${scheduling.summary.appointmentCount} citas`,
        scheduling.nextStep,
      ),
      tile(
        'product_closeout',
        'Product closeout',
        productCloseout.closeoutStatus,
        `${productCloseout.summary.blockerCount} blockers`,
        productCloseout.nextStep,
      ),
      tile(
        'clinical_boundary',
        'Clinical boundary',
        boundary.boundaryStatus,
        `${boundary.requiredHumanControls.length} controles`,
        'Mantener controles humanos antes de ampliar capacidades clinicas.',
      ),
    ];
    const blockers = [
      ...profile.blockers,
      ...intake.blockers,
      ...scheduling.blockers,
      ...productCloseout.remainingGaps,
    ];
    const commandStatus = resolveStatus(
      commandTiles.map((entry) => entry.status),
      blockers,
    );

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      commandStatus,
      anchor,
      productCloseout,
      profile,
      intake,
      scheduling,
      boundary,
      commandTiles,
      summary: {
        tileCount: commandTiles.length,
        readyTileCount: commandTiles.filter((entry) => entry.status === 'ready')
          .length,
        blockerCount: blockers.length,
        patientCount: intake.summary.patientCount,
        appointmentCount: scheduling.summary.appointmentCount,
      },
      nextStep:
        commandStatus === 'ready'
          ? 'Operar Medical Clinics como producto activado con colas y handoffs.'
          : 'Resolver blockers de perfil, pacientes, citas o closeout antes del piloto.',
      guardrails: [
        'Command center coordina operacion; no crea historia clinica legal.',
        'No diagnostica, prescribe, firma documentos ni reemplaza juicio medico.',
      ],
    };
  }
}

function tile(
  key: string,
  label: string,
  status: MedicalClinicReadinessStatus,
  metric: string,
  nextAction: string,
): TenantMedicalClinicCommandCenterV60['commandTiles'][number] {
  return { key, label, status, metric, nextAction };
}

function resolveStatus(
  statuses: MedicalClinicReadinessStatus[],
  blockers: string[],
): MedicalClinicReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
