import { EcuadorTaxAccountantHandoffRoomV2View } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxFilingHandoffUseCase } from './get-tenant-ecuador-tax-filing-handoff.use-case';
import { GetTenantEcuadorTaxObligationRiskMonitorUseCase } from './get-tenant-ecuador-tax-obligation-risk-monitor.use-case';

export class GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationRiskMonitorUseCase: GetTenantEcuadorTaxObligationRiskMonitorUseCase,
    private readonly getTenantEcuadorTaxFilingHandoffUseCase: GetTenantEcuadorTaxFilingHandoffUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountantHandoffRoomV2View> {
    const [riskMonitor, filingHandoff] = await Promise.all([
      this.getTenantEcuadorTaxObligationRiskMonitorUseCase.execute(input),
      this.getTenantEcuadorTaxFilingHandoffUseCase.execute(input),
    ]);
    const closeout = riskMonitor.qualityCenter.closeout;
    const handoffSections: EcuadorTaxAccountantHandoffRoomV2View['handoffSections'] =
      [
        section('sri', 'Evidencia SRI', closeout.sriSourceImportCenter.centerStatus, 'operator', closeout.sriSourceImportCenter.summary.reconciliationIssueCount, ['sri_source_import_center_v2']),
        section('vat', 'IVA', closeout.vatDeclarationWorkspace.readinessStatus, 'accountant', closeout.vatDeclarationWorkspace.reviewBuckets.length, ['vat_declaration_workspace_v2']),
        section('income_tax', 'Renta', closeout.incomeTaxEvidenceWorkspace.readinessStatus, 'accountant', closeout.incomeTaxEvidenceWorkspace.summary.accountantReviewLineCount, ['income_tax_evidence_workspace_v2']),
        section('filing', 'Filing externo', closeout.filingAssistant.assistantStatus, 'operator', closeout.filingAssistant.summary.accountantQuestionCount, ['filing_assistant_v2']),
      ];
    const blockers = [
      ...riskMonitor.blockers,
      ...filingHandoff.blockers,
      ...handoffSections
        .filter((item) => item.status === 'blocked')
        .map((item) => item.key),
    ];
    const roomStatus =
      blockers.length > 0
        ? 'blocked'
        : handoffSections.some((item) => item.status === 'needs_review')
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      roomStatus,
      riskMonitor,
      filingHandoff,
      handoffSections,
      summary: {
        sectionCount: handoffSections.length,
        readySectionCount: handoffSections.filter(
          (item) => item.status === 'ready',
        ).length,
        accountantSectionCount: handoffSections.filter(
          (item) => item.owner === 'accountant',
        ).length,
        questionCount: handoffSections.reduce(
          (total, item) => total + item.questionCount,
          0,
        ),
        blockerCount: new Set(blockers).size,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        roomStatus === 'ready'
          ? 'Enviar sala de handoff al contador o registrar filing externo.'
          : 'Resolver secciones pendientes antes del certificado de readiness.',
      guardrails: [
        'Handoff room organiza revision; no confirma declaracion presentada.',
        'Las respuestas del contador deben registrarse como evidencia externa.',
      ],
    };
  }
}

function section(
  key: string,
  label: string,
  status: 'ready' | 'needs_review' | 'blocked',
  owner: 'operator' | 'accountant' | 'system',
  questionCount: number,
  evidenceRefs: string[],
): EcuadorTaxAccountantHandoffRoomV2View['handoffSections'][number] {
  return { key, label, status, owner, questionCount, evidenceRefs };
}
