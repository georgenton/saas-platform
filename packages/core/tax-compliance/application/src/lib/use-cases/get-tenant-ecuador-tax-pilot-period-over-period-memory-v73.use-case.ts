import {
  EcuadorTaxPilotPeriodOverPeriodMemoryV73View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { RequestTenantEcuadorTaxPilotCloseoutV72UseCase } from './request-tenant-ecuador-tax-pilot-closeout-v72.use-case';

export class GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase {
  constructor(
    private readonly requestTenantEcuadorTaxPilotCloseoutV72UseCase: RequestTenantEcuadorTaxPilotCloseoutV72UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPilotPeriodOverPeriodMemoryV73View> {
    const pilotCloseout =
      await this.requestTenantEcuadorTaxPilotCloseoutV72UseCase.execute({
        ...input,
        recordEvent: false,
      });
    const memoryRows: EcuadorTaxPilotPeriodOverPeriodMemoryV73View['memoryRows'] =
      [
        ...pilotCloseout.repeatedSignalDetector.repeatedSignals.map(
          (signal) => ({
            key: `signal_${signal.key}`,
            label: signal.label,
            status: signal.status,
            previousPeriodStatus: null,
            movement:
              signal.repetitionCount >= 2
                ? ('repeated' as const)
                : ('new' as const),
            owner: 'accountant' as const,
            evidenceRefs: signal.evidenceRefs,
            recommendation: signal.recommendation,
          }),
        ),
        ...pilotCloseout.evidenceLedger.persistedRecords
          .filter((record) => record.status !== 'ready')
          .map((record) => ({
            key: `record_${record.key}`,
            label: record.summary,
            status: record.status,
            previousPeriodStatus: null,
            movement: 'stable' as const,
            owner:
              record.recordType === 'accounting_gate'
                ? ('accountant' as const)
                : ('tax_compliance' as const),
            evidenceRefs: record.sourceRefs,
            recommendation:
              record.recordType === 'accounting_gate'
                ? 'Confirmar criterio profesional antes de abrir discovery.'
                : 'Resolver memoria operativa antes de ampliar piloto.',
          })),
      ];
    const blockers = pilotCloseout.blockers;
    const memoryStatus = resolveStatus(
      memoryRows.map((row) => row.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      memoryStatus,
      pilotCloseout,
      memoryRows,
      summary: {
        rowCount: memoryRows.length,
        repeatedCount: memoryRows.filter((row) => row.movement === 'repeated')
          .length,
        resolvedCount: memoryRows.filter((row) => row.movement === 'resolved')
          .length,
        worsenedCount: memoryRows.filter((row) => row.movement === 'worsened')
          .length,
        accountantOwnedCount: memoryRows.filter(
          (row) => row.owner === 'accountant',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        memoryStatus === 'ready'
          ? 'Usar memoria entre periodos para decidir expansion piloto.'
          : 'Resolver senales repetidas o estables antes de escalar decision.',
      guardrails: [
        'La memoria 7.3 compara senales; no decide contabilidad automaticamente.',
        'Las senales sin periodo anterior se tratan como memoria inicial controlada.',
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
