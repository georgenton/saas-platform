import {
  EcuadorTaxAccountingAdvancedEvidenceGateV71View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPilotLearningBacklogV71UseCase } from './get-tenant-ecuador-tax-pilot-learning-backlog-v71.use-case';
import { RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase } from './request-tenant-ecuador-tax-pilot-closeout-decision-packet-v70.use-case';

export class GetTenantEcuadorTaxAccountingAdvancedEvidenceGateV71UseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase: RequestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase,
    private readonly getTenantEcuadorTaxPilotLearningBacklogV71UseCase: GetTenantEcuadorTaxPilotLearningBacklogV71UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountingAdvancedEvidenceGateV71View> {
    const [priorDecisionPacket, learningBacklog] = await Promise.all([
      this.requestTenantEcuadorTaxPilotCloseoutDecisionPacketV70UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxPilotLearningBacklogV71UseCase.execute(input),
    ]);
    const evidenceSignals: EcuadorTaxAccountingAdvancedEvidenceGateV71View['evidenceSignals'] =
      [
        ...priorDecisionPacket.decisionLanes
          .filter((lane) => lane.owner === 'accounting_advanced')
          .map((lane) => ({
            key: `decision_${lane.key}`,
            label: lane.label,
            status: lane.status,
            severity:
              lane.status === 'blocked'
                ? ('critical' as const)
                : ('high' as const),
            evidenceRefs: lane.evidenceRefs,
            rationale: lane.action,
          })),
        ...learningBacklog.learningItems
          .filter((item) => item.target === 'accounting_advanced')
          .map((item) => ({
            key: `learning_${item.key}`,
            label: item.label,
            status: item.status,
            severity:
              item.priority === 'critical'
                ? ('critical' as const)
                : ('high' as const),
            evidenceRefs: item.sourceRefs,
            rationale: item.recommendation,
          })),
      ];
    const blockers = [...priorDecisionPacket.blockers, ...learningBacklog.blockers];
    const gateStatus = resolveStatus(
      evidenceSignals.map((entry) => entry.status),
      blockers,
    );
    const openAdvancedAccountingNow =
      priorDecisionPacket.decision.openAdvancedAccountingNow &&
      learningBacklog.summary.accountingAdvancedCount > 0 &&
      evidenceSignals.some(
        (signal) => signal.severity === 'critical' || signal.status === 'blocked',
      );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      gateStatus,
      priorDecisionPacket,
      learningBacklog,
      evidenceSignals,
      recommendation: {
        nextProduct: openAdvancedAccountingNow
          ? 'accounting-advanced'
          : 'tax-compliance-ec',
        openAdvancedAccountingNow,
        reason: openAdvancedAccountingNow
          ? 'El piloto repite senales contables criticas y justifica discovery acotado.'
          : 'Las senales actuales deben endurecer Tax Compliance antes de abrir contabilidad avanzada.',
        requiredRepeatedSignals: [
          'Necesidad de libros o asientos formales fuera del alcance tributario.',
          'Dependencia de bancos certificados o conciliacion contable completa.',
          'Responsabilidad recurrente del contador para cierre mensual/anual.',
        ],
      },
      summary: {
        signalCount: evidenceSignals.length,
        criticalSignalCount: evidenceSignals.filter(
          (signal) => signal.severity === 'critical',
        ).length,
        accountingAdvancedBacklogCount:
          learningBacklog.summary.accountingAdvancedCount,
        blockedSignalCount: evidenceSignals.filter(
          (signal) => signal.status === 'blocked',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep: openAdvancedAccountingNow
        ? 'Preparar discovery acotado de Accounting Advanced con evidencia del piloto.'
        : 'Continuar hardening piloto dentro de Tax Compliance EC.',
      guardrails: [
        'El gate 7.1 protege el limite entre Tax Compliance y Accounting Advanced.',
        'No abre contabilidad avanzada por volumen; exige evidencia repetida y contador.',
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
