import { GetTenantPartyFiscalCleanupWorkspaceUseCase } from '@saas-platform/parties-application';
import {
  EcuadorTaxAssistedFiscalCorrectionFlowView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase } from './get-tenant-ecuador-tax-declaration-party-impact-workspace.use-case';

export class GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase {
  constructor(
    private readonly getTenantPartyFiscalCleanupWorkspaceUseCase: GetTenantPartyFiscalCleanupWorkspaceUseCase,
    private readonly getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase: GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAssistedFiscalCorrectionFlowView> {
    const [cleanupWorkspace, declarationImpact] = await Promise.all([
      this.getTenantPartyFiscalCleanupWorkspaceUseCase.execute(
        input.tenantSlug,
      ),
      this.getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase.execute(
        input,
      ),
    ]);
    const impactedByPartyId = new Map(
      declarationImpact.partyRiskRows.map((party) => [party.partyId, party]),
    );
    const affectedDeclarationsByPartyId = new Map<string, string[]>();

    for (const impact of declarationImpact.declarationImpacts) {
      for (const partyId of impact.impactedPartyIds) {
        const current = affectedDeclarationsByPartyId.get(partyId) ?? [];
        affectedDeclarationsByPartyId.set(partyId, [
          ...new Set([...current, impact.declarationKey]),
        ]);
      }
    }

    const correctionCandidates = cleanupWorkspace.priorityParties
      .filter(
        (party) =>
          party.priority === 'critical' || impactedByPartyId.has(party.id),
      )
      .map((party) => ({
        partyId: party.id,
        displayName: party.displayName,
        priority: party.priority,
        source: impactedByPartyId.has(party.id)
          ? ('tax_declaration_impact' as const)
          : ('parties_2_0' as const),
        correctionFields: [
          ...new Set([...party.missingFields, ...party.reviewNotes]),
        ],
        affectedDeclarations: affectedDeclarationsByPartyId.get(party.id) ?? [],
        suggestedPayload: {
          taxpayerId: party.taxpayerId,
          identificationType: null,
          fiscalAddress: null,
          email: null,
          taxpayerName: party.displayName,
        },
        nextAction:
          party.priority === 'critical'
            ? 'Abrir packet de correccion fiscal antes de declarar.'
            : 'Completar datos pendientes y recalcular readiness tributario.',
      }));
    const blockers = [
      ...declarationImpact.blockers,
      ...correctionCandidates
        .filter((candidate) => candidate.priority === 'critical')
        .map((candidate) => `fiscal_correction.${candidate.partyId}`),
    ];
    const flowStatus: EcuadorTaxReadinessStatus =
      blockers.length > 0
        ? 'blocked'
        : correctionCandidates.length > 0
          ? 'needs_review'
          : 'ready';
    const affectedDeclarationCount = new Set(
      correctionCandidates.flatMap(
        (candidate) => candidate.affectedDeclarations,
      ),
    ).size;

    return {
      ...input,
      generatedAt: this.nowProvider(),
      flowStatus,
      correctionCandidates,
      auditTrail: [
        {
          eventKey: 'parties_cleanup_workspace_loaded',
          source: 'parties_2_0',
          detail: `${cleanupWorkspace.summary.needsReviewParties} parties requieren revision.`,
        },
        {
          eventKey: 'declaration_party_impact_loaded',
          source: 'tax_compliance',
          detail: `${declarationImpact.summary.blockedDeclarationCount} declaraciones bloqueadas por terceros.`,
        },
      ],
      summary: {
        candidateCount: correctionCandidates.length,
        criticalCandidateCount: correctionCandidates.filter(
          (candidate) => candidate.priority === 'critical',
        ).length,
        affectedDeclarationCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        flowStatus === 'ready'
          ? 'No hay correcciones fiscales asistidas pendientes para este periodo.'
          : 'Resolver candidatos de correccion y recalcular impacto de declaraciones.',
      guardrails: [
        'Este flow prepara correcciones; no modifica parties automaticamente.',
        'Toda correccion fiscal debe conservar evidencia de fuente y operador.',
      ],
    };
  }
}
