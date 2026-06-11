import {
  EcuadorTaxPilotMultiTenantCohortV72View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase } from './get-tenant-ecuador-tax-pilot-evidence-persistence-ledger-v72.use-case';

export class GetTenantEcuadorTaxPilotMultiTenantCohortV72UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase: GetTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotMultiTenantCohortV72View> {
    const evidenceLedger =
      await this.getTenantEcuadorTaxPilotEvidencePersistenceLedgerV72UseCase.execute(
        input,
      );
    const member =
      evidenceLedger.operationsCloseout.cohortRegistry.cohortMembers[0];
    const blockerCount = evidenceLedger.blockers.length;
    const repeatedSignalCount =
      evidenceLedger.operationsCloseout.accountingAdvancedGate.summary.signalCount;
    const readinessScore = Math.max(
      0,
      100 -
        blockerCount * 25 -
        evidenceLedger.operationsCloseout.analyticsDashboard.summary
          .criticalFeedbackCount *
          10,
    );
    const cohortRows: EcuadorTaxPilotMultiTenantCohortV72View['cohortRows'] = [
      {
        key: member?.key ?? `${input.tenantSlug}_${input.period}`,
        tenantSlug: input.tenantSlug,
        period: input.period,
        serviceMode:
          member?.serviceMode ??
          evidenceLedger.operationsCloseout.cohortRegistry.pilotCloseout
            .readinessRoom.pilotDecision.mode,
        status: member?.status ?? 'active',
        accountantInLoop:
          evidenceLedger.operationsCloseout.cohortRegistry.summary
            .accountantInLoopCount > 0,
        blockerCount,
        criticalFeedbackCount:
          evidenceLedger.operationsCloseout.analyticsDashboard.summary
            .criticalFeedbackCount,
        repeatedSignalCount,
        readinessScore,
      },
    ];
    const commonSignals: EcuadorTaxPilotMultiTenantCohortV72View['commonSignals'] =
      evidenceLedger.persistedRecords
        .filter((record) => record.status !== 'ready')
        .map((record) => ({
          key: `common_${record.key}`,
          label: record.summary,
          tenantCount: 1,
          status: record.status,
          recommendation:
            record.recordType === 'accounting_gate'
              ? 'Confirmar si esta senal se repite antes de abrir Accounting Advanced.'
              : 'Convertir esta senal en accion de hardening piloto.',
        }));
    const blockers = evidenceLedger.blockers;
    const cohortStatus = resolveStatus(
      [
        evidenceLedger.ledgerStatus,
        ...commonSignals.map((signal) => signal.status),
      ],
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      cohortStatus,
      evidenceLedger,
      cohortRows,
      commonSignals,
      summary: {
        tenantCount: cohortRows.length,
        blockedTenantCount: cohortRows.filter((row) => row.status === 'blocked')
          .length,
        accountantInLoopTenantCount: cohortRows.filter(
          (row) => row.accountantInLoop,
        ).length,
        averageReadinessScore: readinessScore,
        commonSignalCount: commonSignals.length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        cohortStatus === 'ready'
          ? 'Ampliar cohorte piloto de forma controlada con metricas comparables.'
          : 'Resolver senales comunes antes de agregar mas tenants al piloto.',
      guardrails: [
        'La cohorte multi-tenant 7.2 compara pilotos; no mezcla datos fiscales entre tenants.',
        'Cada fila conserva ownership por tenant y periodo.',
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
