import {
  EcuadorTaxAiPilotDecisionExplainerV73View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase } from './get-tenant-ecuador-tax-pilot-cohort-expansion-readiness-v73.use-case';

export class RequestTenantEcuadorTaxAiPilotDecisionExplainerV73UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase: GetTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAiPilotDecisionExplainerV73View> {
    const expansionReadiness =
      await this.getTenantEcuadorTaxPilotCohortExpansionReadinessV73UseCase.execute(
        input,
      );
    const explanationCards: EcuadorTaxAiPilotDecisionExplainerV73View['explanationCards'] =
      [
        {
          key: 'operator_decision',
          label: 'Operator decision explanation',
          status: expansionReadiness.readinessStatus,
          audience: 'operator',
          promptPackVersion: 'tax-pilot-decision-v73',
          contextRefs: ['pilot_cohort_expansion_readiness_v73'],
          explanation: expansionReadiness.recommendation.reason,
          guardrail:
            'La IA explica la recomendacion; el operador decide con evidencia.',
        },
        {
          key: 'accountant_boundary',
          label: 'Accountant boundary explanation',
          status: expansionReadiness.accountantDecisionRecord.recordStatus,
          audience: 'accountant',
          promptPackVersion: 'tax-pilot-decision-v73',
          contextRefs: ['accountant_decision_record_v73'],
          explanation: expansionReadiness.accountantDecisionRecord.nextStep,
          guardrail:
            'La IA prepara contexto; el contador mantiene criterio profesional.',
        },
        {
          key: 'founder_summary',
          label: 'Founder summary',
          status: expansionReadiness.readinessStatus,
          audience: 'founder',
          promptPackVersion: 'tax-pilot-decision-v73',
          contextRefs: ['accounting_advanced_discovery_dossier_v73'],
          explanation:
            expansionReadiness.accountantDecisionRecord.discoveryDossier
              .recommendation.reason,
          guardrail:
            'No promete filing, pago, firma ni apertura automatica de Accounting Advanced.',
        },
      ];
    const blockers = expansionReadiness.blockers;
    const explainerStatus = resolveStatus(
      explanationCards.map((card) => card.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      explainerStatus,
      expansionReadiness,
      explanationCards,
      summary: {
        cardCount: explanationCards.length,
        accountantCardCount: explanationCards.filter(
          (card) => card.audience === 'accountant',
        ).length,
        blockedCardCount: explanationCards.filter(
          (card) => card.status === 'blocked',
        ).length,
        guardrailCount: explanationCards.filter((card) => card.guardrail).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        explainerStatus === 'ready'
          ? 'Usar explicador IA para comunicar decision piloto.'
          : 'Revisar explicaciones con evidencia pendiente antes de comunicar.',
      guardrails: [
        'El explicador 7.3 opera en modo sugerencia y explicacion.',
        'No reemplaza revision humana ni criterio del contador.',
      ],
    };
  }
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
