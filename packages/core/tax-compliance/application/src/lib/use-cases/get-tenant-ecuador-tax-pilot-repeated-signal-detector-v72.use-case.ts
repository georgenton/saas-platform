import {
  EcuadorTaxPilotRepeatedSignalDetectorV72View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase } from './get-tenant-ecuador-tax-pilot-multi-tenant-cohort-v72.use-case';

export class GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotMultiTenantCohortV72UseCase: GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotRepeatedSignalDetectorV72View> {
    const multiTenantCohort =
      await this.getTenantEcuadorTaxPilotMultiTenantCohortV72UseCase.execute(
        input,
      );
    const gate =
      multiTenantCohort.evidenceLedger.operationsCloseout.accountingAdvancedGate;
    const repeatedSignals: EcuadorTaxPilotRepeatedSignalDetectorV72View['repeatedSignals'] =
      [
        ...gate.evidenceSignals.map((signal) => ({
          key: `gate_${signal.key}`,
          label: signal.label,
          category: 'accountant_owned_closeout' as const,
          status: signal.status,
          repetitionCount: signal.severity === 'critical' ? 2 : 1,
          severity: signal.severity,
          evidenceRefs: signal.evidenceRefs,
          recommendation: signal.rationale,
        })),
        ...multiTenantCohort.commonSignals
          .filter((signal) => signal.key.includes('accounting'))
          .map((signal) => ({
            key: `common_${signal.key}`,
            label: signal.label,
            category: 'formal_books' as const,
            status: signal.status,
            repetitionCount: signal.tenantCount + 1,
            severity:
              signal.status === 'blocked'
                ? ('critical' as const)
                : ('high' as const),
            evidenceRefs: [signal.key],
            recommendation: signal.recommendation,
          })),
      ];
    const blockers = multiTenantCohort.blockers;
    const detectorStatus = resolveStatus(
      repeatedSignals.map((signal) => signal.status),
      blockers,
    );
    const accountingAdvancedCandidateCount = repeatedSignals.filter(
      (signal) =>
        signal.repetitionCount >= 2 &&
        (signal.severity === 'critical' || signal.severity === 'high'),
    ).length;
    const shouldOpenAccountingAdvancedDiscovery =
      gate.recommendation.openAdvancedAccountingNow &&
      accountingAdvancedCandidateCount >= 1;

    return {
      ...input,
      generatedAt: this.nowProvider(),
      detectorStatus,
      multiTenantCohort,
      repeatedSignals,
      recommendation: {
        shouldOpenAccountingAdvancedDiscovery,
        reason: shouldOpenAccountingAdvancedDiscovery
          ? 'Hay senales repetidas y gate contable previo para discovery acotado.'
          : 'Aun conviene endurecer Tax Compliance y medir repeticion antes de abrir Accounting Advanced.',
        minimumEvidenceBeforeDiscovery: [
          'Dos periodos o tenants con contador owner de cierre.',
          'Evidencia de libros, bancos certificados o ajustes contables formales.',
          'Pregunta profesional que no pueda resolverse en Tax Compliance asistido.',
        ],
      },
      summary: {
        signalCount: repeatedSignals.length,
        repeatedCriticalCount: repeatedSignals.filter(
          (signal) => signal.repetitionCount >= 2 && signal.severity === 'critical',
        ).length,
        repeatedHighCount: repeatedSignals.filter(
          (signal) => signal.repetitionCount >= 2 && signal.severity === 'high',
        ).length,
        accountingAdvancedCandidateCount,
      },
      blockers: [...new Set(blockers)],
      nextStep: shouldOpenAccountingAdvancedDiscovery
        ? 'Preparar discovery de Accounting Advanced con evidencia repetida.'
        : 'Seguir operando piloto y registrar senales adicionales.',
      guardrails: [
        'El detector 7.2 identifica repeticion; no abre producto ni cambia contabilidad automaticamente.',
        'Accounting Advanced requiere evidencia formal y validacion de contador.',
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
