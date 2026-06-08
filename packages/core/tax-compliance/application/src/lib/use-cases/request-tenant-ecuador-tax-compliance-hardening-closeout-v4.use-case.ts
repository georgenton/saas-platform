import {
  EcuadorTaxComplianceHardeningCloseoutV4View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase } from './get-tenant-ecuador-tax-accountant-review-from-party-risks.use-case';
import { GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase } from './get-tenant-ecuador-tax-assisted-fiscal-correction-flow.use-case';
import { GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase } from './get-tenant-ecuador-tax-declaration-party-impact-workspace.use-case';
import { GetTenantEcuadorTaxPartyEvidenceBridgeUseCase } from './get-tenant-ecuador-tax-party-evidence-bridge.use-case';
import { GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase } from './get-tenant-ecuador-tax-sri-taxpayer-validation-readiness.use-case';
import { RequestTenantEcuadorTaxComplianceProductCloseoutV3UseCase } from './request-tenant-ecuador-tax-compliance-product-closeout-v3.use-case';

export class RequestTenantEcuadorTaxComplianceHardeningCloseoutV4UseCase {
  constructor(
    private readonly getTenantEcuadorTaxPartyEvidenceBridgeUseCase: GetTenantEcuadorTaxPartyEvidenceBridgeUseCase,
    private readonly getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase: GetTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase,
    private readonly getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase: GetTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase,
    private readonly getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase: GetTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase,
    private readonly getTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase: GetTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase,
    private readonly requestTenantEcuadorTaxComplianceProductCloseoutV3UseCase: RequestTenantEcuadorTaxComplianceProductCloseoutV3UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxComplianceHardeningCloseoutV4View> {
    const [
      partyEvidenceBridge,
      taxpayerValidationReadiness,
      declarationPartyImpact,
      assistedFiscalCorrectionFlow,
      accountantReviewFromPartyRisks,
      productCloseoutV3,
    ] = await Promise.all([
      this.getTenantEcuadorTaxPartyEvidenceBridgeUseCase.execute(input),
      this.getTenantEcuadorTaxSriTaxpayerValidationReadinessUseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxDeclarationPartyImpactWorkspaceUseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxAssistedFiscalCorrectionFlowUseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxAccountantReviewFromPartyRisksUseCase.execute(
        input,
      ),
      this.requestTenantEcuadorTaxComplianceProductCloseoutV3UseCase.execute(
        input,
      ),
    ]);
    const hardeningChecklist = [
      checklistItem(
        'party_evidence_bridge',
        'Parties 2.0 evidence bridge',
        partyEvidenceBridge.readinessStatus,
        [
          `${partyEvidenceBridge.summary.impactedPartyCount} parties con impacto tributario.`,
        ],
      ),
      checklistItem(
        'sri_taxpayer_validation_readiness',
        'SRI taxpayer validation readiness',
        taxpayerValidationReadiness.readinessStatus,
        [
          `${taxpayerValidationReadiness.summary.readyCandidateCount}/${taxpayerValidationReadiness.summary.candidateCount} candidatos listos.`,
        ],
      ),
      checklistItem(
        'declaration_party_impact',
        'Declaration party impact',
        declarationPartyImpact.readinessStatus,
        [
          `${declarationPartyImpact.summary.blockedDeclarationCount} declaraciones bloqueadas.`,
        ],
      ),
      checklistItem(
        'assisted_fiscal_correction_flow',
        'Assisted fiscal correction flow',
        assistedFiscalCorrectionFlow.flowStatus,
        [
          `${assistedFiscalCorrectionFlow.summary.candidateCount} candidatos de correccion.`,
        ],
      ),
      checklistItem(
        'accountant_review_from_party_risks',
        'Accountant review from party risks',
        accountantReviewFromPartyRisks.escalationStatus,
        [
          `${accountantReviewFromPartyRisks.summary.suggestedQuestionCount} preguntas sugeridas.`,
        ],
      ),
      checklistItem(
        'tax_product_closeout_v3',
        'Tax Compliance product closeout v3',
        productCloseoutV3.closeoutStatus === 'mvp_operable'
          ? 'ready'
          : productCloseoutV3.closeoutStatus === 'blocked'
            ? 'blocked'
            : 'needs_review',
        [productCloseoutV3.nextStep],
      ),
    ];
    const blockers = [
      ...partyEvidenceBridge.blockers,
      ...taxpayerValidationReadiness.blockers,
      ...declarationPartyImpact.blockers,
      ...assistedFiscalCorrectionFlow.blockers,
      ...accountantReviewFromPartyRisks.blockers,
      ...productCloseoutV3.blockers,
    ];
    const closeoutStatus =
      blockers.length > 0
        ? 'blocked'
        : hardeningChecklist.some((item) => item.status === 'needs_review')
          ? 'needs_party_cleanup'
          : 'tax_hardened';
    const uniqueBlockers = [...new Set(blockers)];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      partyEvidenceBridge,
      taxpayerValidationReadiness,
      declarationPartyImpact,
      assistedFiscalCorrectionFlow,
      accountantReviewFromPartyRisks,
      productCloseoutV3,
      hardeningChecklist,
      summary: {
        checklistCount: hardeningChecklist.length,
        readyChecklistCount: hardeningChecklist.filter(
          (item) => item.status === 'ready',
        ).length,
        blockerCount: uniqueBlockers.length,
        partyRiskCount: partyEvidenceBridge.summary.impactedPartyCount,
        accountantTriggerCount:
          accountantReviewFromPartyRisks.summary.triggerCount,
      },
      recommendedNextProduct:
        closeoutStatus === 'tax_hardened'
          ? 'tax_compliance_hardening'
          : partyEvidenceBridge.summary.duplicateGroupCount > 0
            ? 'parties_persistence'
            : 'accounting_advanced_discovery',
      blockers: uniqueBlockers,
      nextStep:
        closeoutStatus === 'tax_hardened'
          ? 'Mantener hardening tributario y diferir Accounting Advanced.'
          : closeoutStatus === 'needs_party_cleanup'
            ? 'Cerrar limpieza de Parties antes de ampliar producto tributario.'
            : 'Resolver blockers de terceros, validacion o contador antes del siguiente producto.',
      guardrails: [
        'Closeout 4.0 endurece Tax Compliance con Parties; no declara, paga ni valida oficialmente en SRI.',
        'Accounting Advanced solo debe abrirse si los blockers exigen libros, bancos certificados o ledger formal.',
      ],
    };
  }
}

function checklistItem(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidence: string[],
): EcuadorTaxComplianceHardeningCloseoutV4View['hardeningChecklist'][number] {
  return {
    key,
    label,
    status,
    evidence,
  };
}
