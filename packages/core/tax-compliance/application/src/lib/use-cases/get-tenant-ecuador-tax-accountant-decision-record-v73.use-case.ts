import {
  EcuadorTaxAccountantDecisionRecordV73View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase } from './get-tenant-ecuador-tax-accounting-advanced-discovery-dossier-v73.use-case';

export class GetTenantEcuadorTaxAccountantDecisionRecordV73UseCase {
  constructor(
    private readonly getTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase: GetTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountantDecisionRecordV73View> {
    const discoveryDossier =
      await this.getTenantEcuadorTaxAccountingAdvancedDiscoveryDossierV73UseCase.execute(
        input,
      );
    const decisions: EcuadorTaxAccountantDecisionRecordV73View['decisions'] =
      discoveryDossier.dossierSections.map((section) => ({
        key: `decision_${section.key}`,
        label: section.label,
        status: section.status,
        decision:
          section.status === 'blocked'
            ? 'needs_formal_accounting'
            : section.status === 'needs_review'
              ? 'needs_more_evidence'
              : 'resolve_in_tax',
        decidedBy:
          section.status === 'ready'
            ? ('tax_operator' as const)
            : ('external_accountant' as const),
        rationale: section.risk,
        evidenceRefs: section.evidenceRefs,
        nextAction:
          section.status === 'ready'
            ? 'Mantener dentro de Tax Compliance.'
            : 'Solicitar criterio explicito del contador antes del closeout.',
      }));
    const blockers = discoveryDossier.blockers;
    const recordStatus = resolveStatus(
      decisions.map((decision) => decision.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      recordStatus,
      discoveryDossier,
      decisions,
      summary: {
        decisionCount: decisions.length,
        formalAccountingCount: decisions.filter(
          (decision) => decision.decision === 'needs_formal_accounting',
        ).length,
        resolveInTaxCount: decisions.filter(
          (decision) => decision.decision === 'resolve_in_tax',
        ).length,
        needsMoreEvidenceCount: decisions.filter(
          (decision) => decision.decision === 'needs_more_evidence',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        recordStatus === 'ready'
          ? 'Usar decision record para cerrar continuidad Tax.'
          : 'Completar criterio profesional antes de decidir producto siguiente.',
      guardrails: [
        'El decision record captura criterio; no reemplaza firma ni responsabilidad profesional.',
        'Las decisiones son evidencia de frontera producto, no declaracion oficial.',
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
