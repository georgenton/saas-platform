import {
  EcuadorTaxAccountantReviewFromPartyRisksView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase } from './get-tenant-ecuador-tax-assisted-fiscal-correction-flow.use-case';
import { GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase } from './get-tenant-ecuador-tax-declaration-party-impact-workspace.use-case';

export class GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase {
  constructor(
    private readonly getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase: GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
    private readonly getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase: GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountantReviewFromPartyRisksView> {
    const [declarationImpact, correctionFlow] = await Promise.all([
      this.getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase.execute(
        input,
      ),
    ]);
    const criticalPartyIds = declarationImpact.partyRiskRows
      .filter((party) => party.riskLevel === 'critical')
      .map((party) => party.partyId);
    const highRiskSupplierIds = declarationImpact.partyRiskRows
      .filter(
        (party) =>
          party.riskLevel === 'high' && party.roles.includes('supplier'),
      )
      .map((party) => party.partyId);
    const blockedDeclarationPartyIds =
      declarationImpact.declarationImpacts.flatMap(
        (impact) => impact.blockedPartyIds,
      );
    const correctionCandidateIds = correctionFlow.correctionCandidates
      .filter((candidate) => candidate.priority === 'critical')
      .map((candidate) => candidate.partyId);
    const reviewTriggers = [
      buildTrigger({
        key: 'critical_tax_identity',
        label: 'Identidad fiscal critica',
        affectedPartyIds: criticalPartyIds,
        suggestedQuestion:
          'Que RUC/cedula y razon social deben usarse para estos terceros criticos?',
      }),
      buildTrigger({
        key: 'supplier_deductibility_risk',
        label: 'Riesgo de proveedor deducible',
        affectedPartyIds: highRiskSupplierIds,
        suggestedQuestion:
          'Estos proveedores pueden usarse como soporte de credito tributario o gasto deducible?',
      }),
      buildTrigger({
        key: 'blocked_declaration_party',
        label: 'Declaracion bloqueada por tercero',
        affectedPartyIds: blockedDeclarationPartyIds,
        suggestedQuestion:
          'Que declaracion debe detenerse hasta corregir terceros bloqueantes?',
      }),
      buildTrigger({
        key: 'correction_flow_critical',
        label: 'Correccion fiscal critica pendiente',
        affectedPartyIds: correctionCandidateIds,
        suggestedQuestion:
          'Quien aprueba la correccion fiscal y cual es la evidencia fuente?',
      }),
    ];
    const blockers = reviewTriggers
      .filter((trigger) => trigger.status === 'blocked')
      .map((trigger) => `accountant_party_risk.${trigger.key}`);
    const escalationStatus: EcuadorTaxReadinessStatus =
      blockers.length > 0
        ? 'blocked'
        : reviewTriggers.some((trigger) => trigger.status === 'needs_review')
          ? 'needs_review'
          : 'ready';
    const questions = reviewTriggers
      .filter((trigger) => trigger.affectedPartyIds.length > 0)
      .map((trigger) => trigger.suggestedQuestion);

    return {
      ...input,
      generatedAt: this.nowProvider(),
      escalationStatus,
      reviewTriggers,
      suggestedReviewRequest: {
        reason:
          escalationStatus === 'ready'
            ? 'No hay riesgos de terceros que requieran contador en este periodo.'
            : 'Riesgos de terceros impactan declaraciones tributarias asistidas.',
        questions,
        evidenceReferences: [
          'tax://party-evidence-bridge',
          'tax://declaration-party-impact',
          'tax://assisted-fiscal-correction-flow',
        ],
      },
      summary: {
        triggerCount: reviewTriggers.length,
        blockingTriggerCount: reviewTriggers.filter(
          (trigger) => trigger.status === 'blocked',
        ).length,
        affectedPartyCount: new Set(
          reviewTriggers.flatMap((trigger) => trigger.affectedPartyIds),
        ).size,
        suggestedQuestionCount: questions.length,
      },
      blockers,
      nextStep:
        escalationStatus === 'ready'
          ? 'Continuar con declaracion asistida sin escalacion por terceros.'
          : 'Enviar preguntas y evidencia de terceros al contador antes de cierre.',
      guardrails: [
        'Este workspace sugiere review; no crea una solicitud persistida automaticamente.',
        'El contador debe revisar evidencia fuente cuando existan deducibilidad o identidad fiscal dudosa.',
      ],
    };
  }
}

function buildTrigger(input: {
  key: string;
  label: string;
  affectedPartyIds: string[];
  suggestedQuestion: string;
}): EcuadorTaxAccountantReviewFromPartyRisksView['reviewTriggers'][number] {
  const affectedPartyIds = [...new Set(input.affectedPartyIds)];
  const status: EcuadorTaxReadinessStatus =
    affectedPartyIds.length > 0 ? 'blocked' : 'ready';

  return {
    key: input.key,
    label: input.label,
    status,
    affectedPartyIds,
    suggestedQuestion: input.suggestedQuestion,
  };
}
