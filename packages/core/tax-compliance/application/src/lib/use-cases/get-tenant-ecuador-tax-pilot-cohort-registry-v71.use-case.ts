import {
  EcuadorTaxPilotCohortRegistryV71View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { RequestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase } from './request-tenant-ecuador-tax-pilot-feedback-closeout-v70.use-case';

export class GetTenantEcuadorTaxPilotCohortRegistryV71UseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase: RequestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotCohortRegistryV71View> {
    const pilotCloseout =
      await this.requestTenantEcuadorTaxPilotFeedbackCloseoutV70UseCase.execute(
        input,
      );
    const cohortMembers: EcuadorTaxPilotCohortRegistryV71View['cohortMembers'] =
      [
        {
          key: `${input.tenantSlug}_${input.period}`,
          tenantSlug: input.tenantSlug,
          period: input.period,
          serviceMode: pilotCloseout.readinessRoom.pilotDecision.mode,
          status: memberStatus(pilotCloseout.closeoutStatus),
          accountantEmail: pilotCloseout.decisionPacket.decision.accountantRequired
            ? 'contador.extern@saas-platform.dev'
            : null,
          startedAt: pilotCloseout.generatedAt,
          blockers: pilotCloseout.blockers,
          objective:
            pilotCloseout.recommendedNextProduct ===
            'accounting_advanced_discovery'
              ? 'Validar si el piloto debe abrir discovery contable avanzado.'
              : 'Operar piloto Tax Compliance EC con evidencia y feedback trazable.',
        },
      ];
    const blockers = pilotCloseout.blockers;
    const registryStatus = resolveStatus(
      [pilotCloseout.closeoutStatus],
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      registryStatus,
      pilotCloseout,
      cohortMembers,
      summary: {
        memberCount: cohortMembers.length,
        activeCount: cohortMembers.filter((member) => member.status === 'active')
          .length,
        blockedCount: cohortMembers.filter(
          (member) => member.status === 'blocked',
        ).length,
        accountantInLoopCount: cohortMembers.filter(
          (member) => member.accountantEmail !== null,
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        registryStatus === 'blocked'
          ? 'Resolver blockers del piloto antes de ampliar la cohorte.'
          : 'Mantener cohorte piloto controlada y medir feedback operativo.',
      guardrails: [
        'La cohorte 7.1 registra operacion piloto; no habilita declaracion automatica.',
        'El contador externo permanece como responsable humano cuando el piloto lo requiere.',
      ],
    };
  }
}

function memberStatus(
  closeoutStatus: EcuadorTaxReadinessStatus,
): EcuadorTaxPilotCohortRegistryV71View['cohortMembers'][number]['status'] {
  if (closeoutStatus === 'blocked') {
    return 'blocked';
  }

  return closeoutStatus === 'ready' ? 'ready_for_iteration' : 'active';
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
