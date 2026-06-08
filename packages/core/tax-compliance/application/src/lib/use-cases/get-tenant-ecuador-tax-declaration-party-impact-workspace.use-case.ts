import {
  EcuadorTaxDeclarationPartyImpactWorkspaceView,
  EcuadorTaxPartyEvidenceBridgeView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxPartyEvidenceBridgeUseCase } from './get-tenant-ecuador-tax-party-evidence-bridge.use-case';

export class GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxPartyEvidenceBridgeUseCase: GetTenantEcuadorTaxPartyEvidenceBridgeUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxDeclarationPartyImpactWorkspaceView> {
    const bridge =
      await this.getTenantEcuadorTaxPartyEvidenceBridgeUseCase.execute(input);
    const declarationImpacts: EcuadorTaxDeclarationPartyImpactWorkspaceView['declarationImpacts'] =
      [
        buildDeclarationImpact({
          declarationKey: 'iva',
          label: 'IVA',
          bridge,
          evidenceSource: 'sales_purchases_parties',
        }),
        buildDeclarationImpact({
          declarationKey: 'renta',
          label: 'Impuesto a la renta',
          bridge,
          evidenceSource: 'annual_income_expense_parties',
        }),
        buildDeclarationImpact({
          declarationKey: 'retenciones',
          label: 'Retenciones',
          bridge,
          evidenceSource: 'supplier_withholding_parties',
        }),
        buildDeclarationImpact({
          declarationKey: 'anexos',
          label: 'Anexos transaccionales',
          bridge,
          evidenceSource: 'third_party_annex_parties',
        }),
      ];
    const blockers = [
      ...bridge.blockers,
      ...declarationImpacts
        .filter((impact) => impact.readinessStatus === 'blocked')
        .map((impact) => `declaration_party_impact.${impact.declarationKey}`),
    ];
    const readinessStatus =
      blockers.length > 0
        ? 'blocked'
        : declarationImpacts.some(
              (impact) => impact.readinessStatus === 'needs_review',
            )
          ? 'needs_review'
          : 'ready';
    const accountantReviewCandidateCount = bridge.impactedParties.filter(
      (party) => ['critical', 'high'].includes(party.riskLevel),
    ).length;

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      declarationImpacts,
      partyRiskRows: bridge.impactedParties,
      summary: {
        declarationCount: declarationImpacts.length,
        blockedDeclarationCount: declarationImpacts.filter(
          (impact) => impact.readinessStatus === 'blocked',
        ).length,
        impactedPartyCount: bridge.summary.impactedPartyCount,
        accountantReviewCandidateCount,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        readinessStatus === 'ready'
          ? 'Usar impacto por declaracion para preparar formularios asistidos.'
          : 'Resolver parties bloqueantes antes de cerrar formularios del periodo.',
      guardrails: [
        'El impacto por declaracion es diagnostico; no determina automaticamente casilleros oficiales.',
        'Un tercero puede estar listo en Parties y aun no participar en un periodo sin evidencia.',
      ],
    };
  }
}

function buildDeclarationImpact(input: {
  declarationKey: 'iva' | 'renta' | 'retenciones' | 'anexos';
  label: string;
  bridge: EcuadorTaxPartyEvidenceBridgeView;
  evidenceSource: string;
}): EcuadorTaxDeclarationPartyImpactWorkspaceView['declarationImpacts'][number] {
  const impactedParties = input.bridge.impactedParties.filter((party) =>
    party.impactedObligations.includes(input.declarationKey),
  );
  const blockedParties = impactedParties.filter(
    (party) => party.riskLevel === 'critical',
  );
  const readinessStatus: EcuadorTaxReadinessStatus =
    blockedParties.length > 0
      ? 'blocked'
      : impactedParties.length > 0
        ? 'needs_review'
        : 'ready';

  return {
    declarationKey: input.declarationKey,
    label: input.label,
    impactedPartyIds: impactedParties.map((party) => party.partyId),
    blockedPartyIds: blockedParties.map((party) => party.partyId),
    readinessStatus,
    evidenceSource: input.evidenceSource,
    nextAction:
      readinessStatus === 'blocked'
        ? `Corregir terceros criticos antes de preparar ${input.label}.`
        : readinessStatus === 'needs_review'
          ? `Revisar terceros con riesgo antes de cerrar ${input.label}.`
          : `${input.label} sin bloqueos de terceros detectados.`,
  };
}
