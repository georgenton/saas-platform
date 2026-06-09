import { EcuadorTaxAccountingBoundaryAiReviewView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase } from './get-tenant-ecuador-tax-accounting-advanced-gate-v2.use-case';
import { GetTenantEcuadorTaxProfessionalHandoffV6UseCase } from './get-tenant-ecuador-tax-professional-handoff-v6.use-case';

export class GetTenantEcuadorTaxAccountingBoundaryAiReviewUseCase {
  constructor(
    private readonly getProfessionalHandoffUseCase: GetTenantEcuadorTaxProfessionalHandoffV6UseCase,
    private readonly getAccountingAdvancedGateV2UseCase: GetTenantEcuadorTaxAccountingAdvancedGateV2UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountingBoundaryAiReviewView> {
    const [professionalHandoff, accountingAdvancedGate] = await Promise.all([
      this.getProfessionalHandoffUseCase.execute(input),
      this.getAccountingAdvancedGateV2UseCase.execute(input),
    ]);
    const boundaryLanes: EcuadorTaxAccountingBoundaryAiReviewView['boundaryLanes'] =
      [
        lane(
          'tax_declaration_preparation',
          'Preparacion tributaria asistida',
          'tax_compliance',
          professionalHandoff.handoffStatus,
          'Tax Compliance prepara evidencia, formularios asistidos y handoff externo.',
          ['file_sri_declaration', 'pay_tax_obligation'],
        ),
        lane(
          'accounting_foundation_evidence',
          'Evidencia Accounting Foundation',
          'accounting_foundation',
          professionalHandoff.annualCloseout.closeoutStatus,
          'Accounting Foundation aporta evidencia operativa, no certificacion legal.',
          ['certify_legal_books', 'sign_financial_statements'],
        ),
        lane(
          'accounting_advanced_discovery',
          'Discovery Accounting Advanced',
          'accounting_advanced',
          accountingAdvancedGate.gateStatus,
          accountingAdvancedGate.recommendation.reason,
          ['create_official_books', 'certify_bank_feeds'],
        ),
        lane(
          'external_accountant_judgment',
          'Criterio profesional externo',
          'external_accountant',
          professionalHandoff.decision.accountantRequired
            ? 'needs_review'
            : 'ready',
          'El contador valida criterio profesional, filing, certificacion y escalamiento.',
          ['replace_accountant_judgment', 'approve_tax_filing'],
        ),
      ];
    const blockers = [
      ...professionalHandoff.blockers,
      ...accountingAdvancedGate.blockers,
      ...boundaryLanes
        .filter((item) => item.status === 'blocked')
        .map((item) => item.key),
    ];

    return {
      ...input,
      generatedAt: this.nowProvider(),
      reviewStatus:
        blockers.length > 0
          ? 'blocked'
          : boundaryLanes.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      professionalHandoff,
      accountingAdvancedGate,
      boundaryLanes,
      assistantInstructions: {
        allowedOutputs: [
          'owner_explanation',
          'accountant_question_pack',
          'boundary_summary',
          'advanced_accounting_gate_explanation',
        ],
        blockedOutputs: [
          'official_sri_filing',
          'journal_entry_creation',
          'legal_book_certification',
          'financial_statement_signature',
          'accountant_replacement',
        ],
        requiredReview:
          'Tax/accounting boundary suggestions require operator and accountant review before external use.',
      },
      summary: {
        laneCount: boundaryLanes.length,
        blockedLaneCount: boundaryLanes.filter(
          (item) => item.status === 'blocked',
        ).length,
        accountantRequired: professionalHandoff.decision.accountantRequired,
        openAdvancedAccountingNow:
          accountingAdvancedGate.recommendation.openAdvancedAccountingNow,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        accountingAdvancedGate.recommendation.openAdvancedAccountingNow
          ? 'Usar el asistente para explicar el gate y preparar preguntas de discovery con el contador.'
          : 'Usar el asistente para explicar frontera Tax/Accounting y mantener Tax Compliance asistido.',
      guardrails: [
        'AI no declara, no paga, no crea asientos, no firma estados financieros y no reemplaza contador.',
        'AI solo explica la frontera y prepara preguntas revisables.',
      ],
    };
  }
}

function lane(
  key: string,
  label: string,
  owner: EcuadorTaxAccountingBoundaryAiReviewView['boundaryLanes'][number]['owner'],
  status: EcuadorTaxAccountingBoundaryAiReviewView['boundaryLanes'][number]['status'],
  explanation: string,
  blockedAutomation: string[],
): EcuadorTaxAccountingBoundaryAiReviewView['boundaryLanes'][number] {
  return { key, label, owner, status, explanation, blockedAutomation };
}
