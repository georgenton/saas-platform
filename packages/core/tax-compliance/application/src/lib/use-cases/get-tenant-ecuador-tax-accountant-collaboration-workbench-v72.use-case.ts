import {
  EcuadorTaxAccountantCollaborationWorkbenchV72View,
  EcuadorTaxReadinessStatus,
  EcuadorTaxReviewPriority,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase } from './get-tenant-ecuador-tax-pilot-repeated-signal-detector-v72.use-case';

export class GetTenantEcuadorTaxAccountantCollaborationWorkbenchV72UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase: GetTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountantCollaborationWorkbenchV72View> {
    const signalDetector =
      await this.getTenantEcuadorTaxPilotRepeatedSignalDetectorV72UseCase.execute(
        input,
      );
    const slaItems =
      signalDetector.multiTenantCohort.evidenceLedger.operationsCloseout
        .slaTracker.slaItems;
    const collaborationItems: EcuadorTaxAccountantCollaborationWorkbenchV72View['collaborationItems'] =
      [
        ...slaItems.map((item) => ({
          key: `sla_${item.key}`,
          label: item.label,
          status: item.status,
          owner: item.owner,
          priority: item.priority,
          question: item.expectedResponse,
          expectedAnswer:
            item.owner === 'accountant'
              ? 'Respuesta profesional trazable con evidencia o criterio.'
              : 'Accion operativa cerrada con referencia de evidencia.',
          dueBucket: item.ageBucket,
          evidenceRefs: item.evidenceRefs,
          resolutionAction:
            item.status === 'ready'
              ? 'Mantener como evidencia cerrada del piloto.'
              : 'Resolver pendiente antes del closeout 7.2.',
        })),
        ...signalDetector.repeatedSignals.map((signal) => ({
          key: `signal_${signal.key}`,
          label: signal.label,
          status: signal.status,
          owner: 'accountant' as const,
          priority: priorityFromSeverity(signal.severity),
          question: signal.recommendation,
          expectedAnswer:
            'Confirmar si la senal exige contabilidad formal o puede resolverse en Tax Compliance.',
          dueBucket:
            signal.status === 'blocked'
              ? ('over_three_days' as const)
              : ('one_to_three_days' as const),
          evidenceRefs: signal.evidenceRefs,
          resolutionAction:
            'Adjuntar criterio del contador al gate antes de abrir discovery.',
        })),
      ];
    const blockers = signalDetector.blockers;
    const workbenchStatus = resolveStatus(
      collaborationItems.map((item) => item.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      workbenchStatus,
      signalDetector,
      collaborationItems,
      summary: {
        itemCount: collaborationItems.length,
        accountantOwnedCount: collaborationItems.filter(
          (item) => item.owner === 'accountant',
        ).length,
        unresolvedCount: collaborationItems.filter(
          (item) => item.status !== 'ready',
        ).length,
        criticalCount: collaborationItems.filter(
          (item) => item.priority === 'critical',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        workbenchStatus === 'ready'
          ? 'Cerrar respuestas del contador como evidencia del piloto.'
          : 'Resolver preguntas abiertas con owner y evidencia antes de ampliar piloto.',
      guardrails: [
        'El workbench organiza preguntas/respuestas; no reemplaza criterio del contador.',
        'Las respuestas se usan como evidencia operativa, no como certificacion contable.',
      ],
    };
  }
}

function priorityFromSeverity(
  severity: 'critical' | 'high' | 'medium' | 'low',
): EcuadorTaxReviewPriority {
  if (severity === 'critical') {
    return 'critical';
  }

  return severity === 'high' ? 'high' : 'normal';
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
