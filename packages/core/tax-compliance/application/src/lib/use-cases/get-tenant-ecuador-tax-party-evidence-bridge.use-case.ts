import {
  GetTenantPartyDirectoryCoreV2WorkspaceUseCase,
  GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
  GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
} from '@saas-platform/parties-application';
import {
  EcuadorTaxPartyEvidenceBridgeView,
  EcuadorTaxPartyHardeningRiskLevel,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';

export class GetTenantEcuadorTaxPartyEvidenceBridgeUseCase {
  constructor(
    private readonly getTenantPartyDirectoryCoreV2WorkspaceUseCase: GetTenantPartyDirectoryCoreV2WorkspaceUseCase,
    private readonly getTenantPartyDuplicateMergeReadinessWorkspaceUseCase: GetTenantPartyDuplicateMergeReadinessWorkspaceUseCase,
    private readonly getTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase: GetTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxPartyEvidenceBridgeView> {
    const [directory, duplicateReadiness, supplierCustomerReadiness] =
      await Promise.all([
        this.getTenantPartyDirectoryCoreV2WorkspaceUseCase.execute(
          input.tenantSlug,
        ),
        this.getTenantPartyDuplicateMergeReadinessWorkspaceUseCase.execute(
          input.tenantSlug,
        ),
        this.getTenantPartySupplierCustomerFiscalReadinessWorkspaceUseCase.execute(
          input.tenantSlug,
        ),
      ]);
    const duplicatePartyIds = new Set(
      duplicateReadiness.duplicateGroups.flatMap((group) => group.partyIds),
    );
    const impactedParties = directory.parties
      .filter(
        (party) =>
          party.completenessStatus !== 'complete' ||
          duplicatePartyIds.has(party.id),
      )
      .map((party) => {
        const riskLevel = resolveRiskLevel({
          missingFields: party.missingFields,
          reviewNotes: party.reviewNotes,
          duplicated: duplicatePartyIds.has(party.id),
          roles: party.roles,
        });

        return {
          partyId: party.id,
          displayName: party.displayName,
          roles: [...party.roles],
          taxpayerId: party.taxpayerId,
          riskLevel,
          impactedObligations: resolveImpactedObligations(party.roles),
          missingFields: [...party.missingFields],
          reviewNotes: [
            ...party.reviewNotes,
            ...(duplicatePartyIds.has(party.id) ? ['possible_duplicate'] : []),
          ],
          recommendedAction: buildRecommendedAction(riskLevel),
        };
      })
      .sort(
        (left, right) =>
          riskWeight(right.riskLevel) - riskWeight(left.riskLevel) ||
          left.displayName.localeCompare(right.displayName),
      );
    const criticalPartyCount = impactedParties.filter(
      (party) => party.riskLevel === 'critical',
    ).length;
    const blockers = [
      ...impactedParties
        .filter((party) => party.riskLevel === 'critical')
        .map((party) => `party.${party.partyId}.critical_tax_identity`),
      ...duplicateReadiness.duplicateGroups
        .filter((group) => group.mergeRisk === 'high')
        .map((group) => `party_duplicate.${group.key}`),
    ];
    const readinessStatus = resolveStatus({
      blockerCount: blockers.length,
      needsReviewCount: impactedParties.length,
    });

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      partyDirectoryStatus: directory.readinessStatus,
      impactedParties,
      summary: {
        totalParties: directory.summary.totalParties,
        impactedPartyCount: impactedParties.length,
        criticalPartyCount,
        duplicateGroupCount: duplicateReadiness.summary.duplicateGroupCount,
        blockedForDeclarationsCount:
          supplierCustomerReadiness.summary.blockedForDeclarationsCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready'
          ? 'Usar Parties 2.0 como evidencia confiable para IVA, renta, anexos y retenciones.'
          : 'Resolver riesgos de terceros antes de preparar declaraciones asistidas.',
      guardrails: [
        'Este bridge no valida en SRI ni corrige datos automaticamente.',
        'La participacion de una party en una declaracion depende de evidencia del periodo.',
      ],
    };
  }
}

function resolveImpactedObligations(
  roles: string[],
): Array<'iva' | 'renta' | 'retenciones' | 'anexos'> {
  const obligations = new Set<'iva' | 'renta' | 'retenciones' | 'anexos'>();

  if (roles.includes('customer')) {
    obligations.add('iva');
    obligations.add('renta');
    obligations.add('anexos');
  }

  if (roles.includes('supplier')) {
    obligations.add('iva');
    obligations.add('renta');
    obligations.add('retenciones');
    obligations.add('anexos');
  }

  if (obligations.size === 0) {
    obligations.add('renta');
  }

  return Array.from(obligations);
}

function resolveRiskLevel(input: {
  missingFields: string[];
  reviewNotes: string[];
  duplicated: boolean;
  roles: string[];
}): EcuadorTaxPartyHardeningRiskLevel {
  if (
    input.missingFields.some((field) =>
      ['taxpayer_id', 'identification_type', 'fiscal_profile'].includes(field),
    ) ||
    input.duplicated
  ) {
    return 'critical';
  }

  if (input.roles.includes('supplier') || input.reviewNotes.length > 0) {
    return 'high';
  }

  if (input.missingFields.length > 0) {
    return 'medium';
  }

  return 'low';
}

function buildRecommendedAction(
  riskLevel: EcuadorTaxPartyHardeningRiskLevel,
): string {
  if (riskLevel === 'critical') {
    return 'Corregir identidad fiscal o duplicados antes de declarar.';
  }

  if (riskLevel === 'high') {
    return 'Enviar a revision tributaria antes de usar como credito o retencion.';
  }

  return 'Completar datos fiscales pendientes en el directorio compartido.';
}

function riskWeight(riskLevel: EcuadorTaxPartyHardeningRiskLevel): number {
  return { low: 1, medium: 2, high: 3, critical: 4 }[riskLevel];
}

function resolveStatus(input: {
  blockerCount: number;
  needsReviewCount: number;
}): EcuadorTaxReadinessStatus {
  if (input.blockerCount > 0) {
    return 'blocked';
  }

  if (input.needsReviewCount > 0) {
    return 'needs_review';
  }

  return 'ready';
}
