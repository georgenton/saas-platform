import {
  EcuadorTaxAccountingAdvancedDiscoveryDossierV73View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase } from './get-tenant-ecuador-tax-pilot-period-over-period-memory-v73.use-case';

export class GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase: GetTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountingAdvancedDiscoveryDossierV73View> {
    const periodMemory =
      await this.getTenantEcuadorTaxPilotPeriodOverPeriodMemoryV73UseCase.execute(
        input,
      );
    const accountingRows = periodMemory.memoryRows.filter(
      (row) => row.owner === 'accountant' || row.key.includes('accounting'),
    );
    const dossierSections: EcuadorTaxAccountingAdvancedDiscoveryDossierV73View['dossierSections'] =
      accountingRows.length > 0
        ? accountingRows.map((row) => ({
            key: `dossier_${row.key}`,
            label: row.label,
            status: row.status,
            evidenceRefs: row.evidenceRefs,
            accountantQuestion:
              'Esta senal exige contabilidad formal o puede resolverse en Tax Compliance?',
            minimumScope:
              row.status === 'blocked'
                ? 'Discovery de cierre contable y conciliacion bancaria.'
                : 'Revision de frontera Tax/Accounting con contador externo.',
            risk: row.recommendation,
          }))
        : [
            {
              key: 'dossier_no_formal_accounting_signal',
              label: 'Sin senal contable formal repetida',
              status: 'ready',
              evidenceRefs: ['pilot_period_over_period_memory_v73'],
              accountantQuestion:
                'Confirmar que Tax Compliance puede continuar sin Accounting Advanced.',
              minimumScope: 'Sin discovery contable por ahora.',
              risk: 'Abrir Accounting Advanced sin presion formal agregaria complejidad prematura.',
            },
          ];
    const blockers = periodMemory.blockers;
    const dossierStatus = resolveStatus(
      dossierSections.map((section) => section.status),
      blockers,
    );
    const shouldPrepareDiscovery =
      periodMemory.pilotCloseout.repeatedSignalDetector.recommendation
        .shouldOpenAccountingAdvancedDiscovery &&
      dossierSections.some((section) => section.status !== 'ready');

    return {
      ...input,
      generatedAt: this.nowProvider(),
      dossierStatus,
      periodMemory,
      dossierSections,
      recommendation: {
        shouldPrepareDiscovery,
        discoveryScope: shouldPrepareDiscovery
          ? 'ledger_closeout_discovery'
          : 'none',
        reason: shouldPrepareDiscovery
          ? 'La memoria del piloto sostiene senales contables repetidas para discovery.'
          : 'La evidencia actual favorece continuar Tax Compliance antes de abrir discovery.',
      },
      summary: {
        sectionCount: dossierSections.length,
        readySectionCount: dossierSections.filter(
          (section) => section.status === 'ready',
        ).length,
        blockedSectionCount: dossierSections.filter(
          (section) => section.status === 'blocked',
        ).length,
        accountingSignalCount: accountingRows.length,
      },
      blockers: [...new Set(blockers)],
      nextStep: shouldPrepareDiscovery
        ? 'Preparar dossier minimo para discovery Accounting Advanced.'
        : 'Mantener el dossier como evidencia de no-apertura por ahora.',
      guardrails: [
        'El dossier 7.3 prepara decision; no crea Accounting Advanced.',
        'Toda pregunta contable requiere criterio de contador externo.',
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
