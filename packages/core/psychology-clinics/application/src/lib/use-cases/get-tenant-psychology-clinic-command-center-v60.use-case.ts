import {
  PsychologyClinicReadinessStatus,
  TenantPsychologyClinicCommandCenterV60,
} from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';
import { GetTenantPsychologyClinicCloseoutV5UseCase } from './get-tenant-psychology-clinic-closeout-v5.use-case';
import { GetTenantPsychologyClinicOperationsCloseoutUseCase } from './get-tenant-psychology-clinic-operations-closeout.use-case';
import { GetTenantPsychologyClinicProductAnchorUseCase } from './get-tenant-psychology-clinic-product-anchor.use-case';
import { GetTenantPsychologyClinicProductReadinessReportUseCase } from './get-tenant-psychology-clinic-product-readiness-report.use-case';

export class GetTenantPsychologyClinicCommandCenterV60UseCase {
  constructor(
    private readonly getTenantPsychologyClinicProductAnchorUseCase: GetTenantPsychologyClinicProductAnchorUseCase,
    private readonly getTenantPsychologyClinicOperationsCloseoutUseCase: GetTenantPsychologyClinicOperationsCloseoutUseCase,
    private readonly getTenantPsychologyClinicProductReadinessReportUseCase: GetTenantPsychologyClinicProductReadinessReportUseCase,
    private readonly getTenantPsychologyClinicCloseoutV5UseCase: GetTenantPsychologyClinicCloseoutV5UseCase,
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicCommandCenterV60> {
    const [anchor, operationsCloseout, readinessReport, productCloseout, patients, sessions] =
      await Promise.all([
        this.getTenantPsychologyClinicProductAnchorUseCase.execute(input),
        this.getTenantPsychologyClinicOperationsCloseoutUseCase.execute(input),
        this.getTenantPsychologyClinicProductReadinessReportUseCase.execute(input),
        this.getTenantPsychologyClinicCloseoutV5UseCase.execute(input),
        this.operationsRepository?.listPatients(input.tenantSlug),
        this.operationsRepository?.listSessions(input.tenantSlug),
      ]);
    const commandTiles: TenantPsychologyClinicCommandCenterV60['commandTiles'] =
      [
        tile(
          'anchor',
          'Product anchor',
          anchor.anchorStatus,
          `${anchor.summary.readyLaneCount}/${anchor.summary.moduleCount} lanes`,
          anchor.nextStep,
        ),
        tile(
          'operations',
          'Operations closeout',
          operationsCloseout.closeoutStatus,
          `${operationsCloseout.summary.patientCount} patients`,
          operationsCloseout.nextStep,
        ),
        tile(
          'product_readiness',
          'Product readiness',
          readinessReport.reportStatus,
          `${readinessReport.sections.length} sections`,
          readinessReport.nextStep,
        ),
        tile(
          'product_closeout',
          'Closeout V5',
          productCloseout.closeoutStatus,
          `${productCloseout.summary.blockedCheckCount} blockers`,
          productCloseout.nextStep,
        ),
        tile(
          'patients',
          'Patient privacy',
          (patients ?? []).some((patient) => patient.therapyConsentStatus === 'blocked')
            ? 'blocked'
            : (patients ?? []).some(
                  (patient) =>
                    patient.therapyConsentStatus !== 'ready' ||
                    patient.initialRiskReviewStatus !== 'ready',
                )
              ? 'needs_review'
              : 'ready',
          `${patients?.length ?? 0} patients`,
          'Revisar consentimiento, opt-in y riesgo inicial antes de operar.',
        ),
        tile(
          'sessions',
          'Sessions and treatment',
          (sessions ?? []).some((session) => session.blockers.length > 0)
            ? 'blocked'
            : (sessions ?? []).some(
                  (session) =>
                    session.reminderStatus !== 'ready' ||
                    session.billingStatus !== 'ready',
                )
              ? 'needs_review'
              : 'ready',
          `${sessions?.length ?? 0} sessions`,
          'Mantener revision terapeutica antes de cerrar sesiones.',
        ),
      ];
    const blockers = [
      ...operationsCloseout.remainingGaps,
      ...readinessReport.blockers,
      ...productCloseout.blockers,
    ];
    const commandStatus = resolveStatus(
      commandTiles.map((entry) => entry.status),
      blockers,
    );

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      commandStatus,
      commandTiles,
      summary: {
        tileCount: commandTiles.length,
        readyTileCount: commandTiles.filter((entry) => entry.status === 'ready')
          .length,
        blockerCount: new Set(blockers).size,
        patientCount: patients?.length ?? operationsCloseout.summary.patientCount,
        sessionCount: sessions?.length ?? operationsCloseout.summary.sessionCount,
      },
      nextStep:
        commandStatus === 'ready'
          ? 'Operar Psychology Clinics como MVP con colas y handoffs revisados.'
          : 'Resolver privacy, consent, risk, sessions o closeout antes del piloto.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function tile(
  key: string,
  label: string,
  status: PsychologyClinicReadinessStatus,
  metric: string,
  nextAction: string,
): TenantPsychologyClinicCommandCenterV60['commandTiles'][number] {
  return { key, label, status, metric, nextAction };
}

function resolveStatus(
  statuses: PsychologyClinicReadinessStatus[],
  blockers: string[],
): PsychologyClinicReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
