import {
  EcuadorTaxDeclarationHandoffCloseoutV6View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase } from './get-tenant-ecuador-tax-accounting-advanced-gate-v2.use-case';
import { GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase } from './get-tenant-ecuador-tax-accounting-boundary-ai-review.use-case';
import { GetTenantEcuadorTaxProfessionalHandoffV6UseCase } from './get-tenant-ecuador-tax-professional-handoff-v6.use-case';
import { RequestTenantEcuadorTaxComplianceCloseoutV2UseCase } from './request-tenant-ecuador-tax-compliance-closeout-v2.use-case';

export class GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase {
  constructor(
    private readonly requestTenantEcuadorTaxComplianceCloseoutV2UseCase: RequestTenantEcuadorTaxComplianceCloseoutV2UseCase,
    private readonly getTenantEcuadorTaxProfessionalHandoffV6UseCase: GetTenantEcuadorTaxProfessionalHandoffV6UseCase,
    private readonly getTenantEcuadorTaxAccountingAdvancedGateV2UseCase: GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
    private readonly getTenantEcuadorTaxAccountingBoundaryAiReviewUseCase: GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxDeclarationHandoffCloseoutV6View> {
    const [
      declarationCloseout,
      professionalHandoff,
      accountingAdvancedGate,
      accountingBoundaryAiReview,
    ] = await Promise.all([
      this.requestTenantEcuadorTaxComplianceCloseoutV2UseCase.execute(input),
      this.getTenantEcuadorTaxProfessionalHandoffV6UseCase.execute(input),
      this.getTenantEcuadorTaxAccountingAdvancedGateV2UseCase.execute(input),
      this.getTenantEcuadorTaxAccountingBoundaryAiReviewUseCase.execute(input),
    ]);
    const handoffLanes: EcuadorTaxDeclarationHandoffCloseoutV6View['handoffLanes'] =
      [
        lane(
          'sri_import_reconciliation',
          'SRI import and reconciliation',
          declarationCloseout.sriSourceImportCenter.centerStatus,
          'operator',
          ['sri_source_import_center_v2', 'sri_platform_reconciliation'],
          'Completar importaciones aportadas por contribuyente y explicar diferencias.',
        ),
        lane(
          'iva_declaration_draft',
          'IVA declaration draft',
          declarationCloseout.vatDeclarationWorkspace.readinessStatus,
          'tax_compliance',
          ['vat_declaration_workspace_v2', 'assisted_review_pack_v2'],
          'Preparar buckets IVA y casilleros sugeridos para revision humana.',
        ),
        lane(
          'income_tax_evidence',
          'Income tax evidence',
          declarationCloseout.incomeTaxEvidenceWorkspace.readinessStatus,
          'external_accountant',
          ['income_tax_evidence_workspace_v2', 'annual_rollup'],
          'Enviar deducibilidad, retenciones y base anual al contador.',
        ),
        lane(
          'manual_sri_walkthrough',
          'Manual SRI walkthrough',
          declarationCloseout.filingAssistant.assistantStatus,
          'operator',
          ['filing_assistant_v2'],
          'Usar guia asistida paso a paso sin login, firma, declaracion ni pago automatico.',
        ),
        lane(
          'professional_handoff',
          'Professional handoff',
          professionalHandoff.handoffStatus,
          'external_accountant',
          ['professional_handoff_v6', 'accountant_handoff_room_v2'],
          'Resolver preguntas profesionales antes de tratar el periodo como listo.',
        ),
        lane(
          'accounting_advanced_gate',
          'Accounting Advanced gate',
          accountingAdvancedGate.gateStatus,
          accountingAdvancedGate.recommendation.openAdvancedAccountingNow
            ? 'accounting_advanced'
            : 'tax_compliance',
          ['accounting_advanced_gate_v2', 'accounting_boundary_ai_review'],
          'Abrir Accounting Advanced solo cuando haya necesidad contable formal.',
        ),
      ];
    const blockers = [
      ...declarationCloseout.blockers,
      ...professionalHandoff.blockers,
      ...accountingAdvancedGate.blockers,
      ...accountingBoundaryAiReview.blockers,
    ];
    const closeoutStatus = resolveCloseoutStatus(handoffLanes, blockers);
    const decision = resolveDecision(
      declarationCloseout,
      professionalHandoff,
      accountingAdvancedGate,
      closeoutStatus,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      declarationCloseout,
      professionalHandoff,
      accountingAdvancedGate,
      accountingBoundaryAiReview,
      handoffLanes,
      decision,
      summary: {
        laneCount: handoffLanes.length,
        readyLaneCount: handoffLanes.filter((entry) => entry.status === 'ready')
          .length,
        needsReviewLaneCount: handoffLanes.filter(
          (entry) => entry.status === 'needs_review',
        ).length,
        blockedLaneCount: handoffLanes.filter(
          (entry) => entry.status === 'blocked',
        ).length,
        blockerCount: new Set(blockers).size,
        accountantOwnedLaneCount: handoffLanes.filter(
          (entry) =>
            entry.owner === 'external_accountant' ||
            entry.owner === 'accounting_advanced',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        decision.nextStep === 'open_accounting_advanced_discovery'
          ? 'Abrir discovery de Accounting Advanced con evidencia tributaria y preguntas del contador.'
          : decision.nextStep === 'send_to_external_accountant'
            ? 'Enviar closeout 6.0 al contador externo para revision profesional.'
            : 'Continuar con Tax Compliance asistido y mantener gates humanos antes del filing.',
      guardrails: [
        'Closeout 6.0 prepara evidencia, handoff y decision de servicio; no declara, firma ni paga.',
        'No almacena credenciales SRI ni automatiza captcha o ingreso al portal.',
        'AI solo explica boundaries y preguntas; no reemplaza al contador ni crea libros oficiales.',
      ],
    };
  }
}

function lane(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  owner: EcuadorTaxDeclarationHandoffCloseoutV6View['handoffLanes'][number]['owner'],
  evidenceRefs: string[],
  action: string,
): EcuadorTaxDeclarationHandoffCloseoutV6View['handoffLanes'][number] {
  return { key, label, status, owner, evidenceRefs, action };
}

function resolveCloseoutStatus(
  lanes: EcuadorTaxDeclarationHandoffCloseoutV6View['handoffLanes'],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || lanes.some((entry) => entry.status === 'blocked')) {
    return 'blocked';
  }

  if (lanes.some((entry) => entry.status === 'needs_review')) {
    return 'needs_review';
  }

  return 'ready';
}

function resolveDecision(
  declarationCloseout: EcuadorTaxDeclarationHandoffCloseoutV6View['declarationCloseout'],
  professionalHandoff: EcuadorTaxDeclarationHandoffCloseoutV6View['professionalHandoff'],
  accountingAdvancedGate: EcuadorTaxDeclarationHandoffCloseoutV6View['accountingAdvancedGate'],
  closeoutStatus: EcuadorTaxReadinessStatus,
): EcuadorTaxDeclarationHandoffCloseoutV6View['decision'] {
  if (accountingAdvancedGate.recommendation.openAdvancedAccountingNow) {
    return {
      nextStep: 'open_accounting_advanced_discovery',
      reason: accountingAdvancedGate.recommendation.reason,
      accountantRequired: true,
      openAdvancedAccountingNow: true,
    };
  }

  if (
    professionalHandoff.decision.accountantRequired ||
    declarationCloseout.summary.accountingAdvancedEscalationCount > 0 ||
    closeoutStatus !== 'ready'
  ) {
    return {
      nextStep: 'send_to_external_accountant',
      reason: professionalHandoff.decision.reason,
      accountantRequired: true,
      openAdvancedAccountingNow: false,
    };
  }

  return {
    nextStep: 'continue_assisted_tax',
    reason: 'SRI evidence, IVA, renta and filing walkthrough are ready with human gates.',
    accountantRequired: false,
    openAdvancedAccountingNow: false,
  };
}
