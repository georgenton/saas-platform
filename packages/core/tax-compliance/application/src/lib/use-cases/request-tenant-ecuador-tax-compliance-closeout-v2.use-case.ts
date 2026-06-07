import { EcuadorTaxComplianceCloseoutV2View } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase } from './get-tenant-ecuador-tax-accountant-escalation-service-boundary.use-case';
import { GetTenantEcuadorTaxCommandCenterV2UseCase } from './get-tenant-ecuador-tax-command-center-v2.use-case';
import { GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase } from './get-tenant-ecuador-tax-income-tax-evidence-workspace-v2.use-case';
import { GetTenantEcuadorTaxSriSourceImportCenterV2UseCase } from './get-tenant-ecuador-tax-sri-source-import-center-v2.use-case';
import { GetTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase } from './get-tenant-ecuador-tax-vat-declaration-workspace-v2.use-case';
import { RequestTenantEcuadorTaxFilingAssistantV2UseCase } from './request-tenant-ecuador-tax-filing-assistant-v2.use-case';

export class RequestTenantEcuadorTaxComplianceCloseoutV2UseCase {
  constructor(
    private readonly getTenantEcuadorTaxSriSourceImportCenterV2UseCase: GetTenantEcuadorTaxSriSourceImportCenterV2UseCase,
    private readonly getTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase: GetTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase,
    private readonly getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase,
    private readonly requestTenantEcuadorTaxFilingAssistantV2UseCase: RequestTenantEcuadorTaxFilingAssistantV2UseCase,
    private readonly getTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase: GetTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase,
    private readonly getTenantEcuadorTaxCommandCenterV2UseCase: GetTenantEcuadorTaxCommandCenterV2UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxComplianceCloseoutV2View> {
    const [
      sriSourceImportCenter,
      vatDeclarationWorkspace,
      incomeTaxEvidenceWorkspace,
      filingAssistant,
      escalationBoundary,
      commandCenter,
    ] = await Promise.all([
      this.getTenantEcuadorTaxSriSourceImportCenterV2UseCase.execute(input),
      this.getTenantEcuadorTaxVatDeclarationWorkspaceV2UseCase.execute(input),
      this.getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceV2UseCase.execute(
        input,
      ),
      this.requestTenantEcuadorTaxFilingAssistantV2UseCase.execute({
        ...input,
        formKey: 'iva',
      }),
      this.getTenantEcuadorTaxAccountantEscalationServiceBoundaryUseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxCommandCenterV2UseCase.execute(input),
    ]);
    const checklist: EcuadorTaxComplianceCloseoutV2View['checklist'] = [
      item(
        'sri_source_import_center',
        'SRI Source Import Center 2.0',
        sriSourceImportCenter.centerStatus,
        ['sri_evidence_intake_v2', 'sri_platform_reconciliation'],
      ),
      item(
        'vat_declaration_workspace',
        'IVA Declaration Workspace 2.0',
        vatDeclarationWorkspace.readinessStatus,
        ['vat_declaration_workspace_v2', 'form_boxes'],
      ),
      item(
        'income_tax_evidence_workspace',
        'Income Tax Evidence Workspace 2.0',
        incomeTaxEvidenceWorkspace.readinessStatus,
        ['income_tax_workspace_v2', 'annual_rollup', 'accounting_evidence'],
      ),
      item(
        'filing_assistant',
        'Tax Filing Assistant 2.0',
        filingAssistant.assistantStatus,
        ['ai_filing_assistant', 'assisted_review_pack_v2'],
      ),
      item(
        'escalation_boundary',
        'Accountant Escalation & Service Boundary',
        escalationBoundary.escalationStatus === 'accounting_advanced_required'
          ? 'blocked'
          : escalationBoundary.escalationStatus ===
              'accountant_review_required'
            ? 'needs_review'
            : 'ready',
        ['accountant_escalation_rules', 'accounting_boundary_closeout'],
      ),
      item(
        'command_center',
        'Tax Compliance Command Center 2.0',
        commandCenter.commandStatus === 'blocked'
          ? 'blocked'
          : commandCenter.commandStatus === 'ready' ||
              commandCenter.commandStatus === 'externally_filed'
            ? 'ready'
            : 'needs_review',
        ['command_center_v2'],
      ),
    ];
    const blockers = [
      ...sriSourceImportCenter.blockers,
      ...vatDeclarationWorkspace.blockers,
      ...incomeTaxEvidenceWorkspace.blockers,
      ...filingAssistant.blockers,
      ...escalationBoundary.blockers,
      ...commandCenter.blockers,
    ];
    const closeoutStatus =
      blockers.length > 0 || checklist.some((entry) => entry.status === 'blocked')
        ? 'blocked'
        : checklist.some((entry) => entry.status === 'needs_review')
          ? 'needs_review'
          : 'ready_for_next_product';
    const accountingAdvancedEscalationCount =
      escalationBoundary.summary.accountingAdvancedRuleCount;

    return {
      ...input,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      sriSourceImportCenter,
      vatDeclarationWorkspace,
      incomeTaxEvidenceWorkspace,
      filingAssistant,
      escalationBoundary,
      commandCenter,
      checklist,
      summary: {
        checklistCount: checklist.length,
        readyChecklistCount: checklist.filter(
          (entry) => entry.status === 'ready',
        ).length,
        blockerCount: new Set(blockers).size,
        taxComplianceSurfaceCount: 6,
        accountingAdvancedEscalationCount,
      },
      recommendedNextStep:
        escalationBoundary.escalationStatus === 'accounting_advanced_required'
          ? 'accounting_advanced_discovery'
          : closeoutStatus === 'ready_for_next_product'
            ? 'tax_compliance_hardening'
            : 'parties_2_0',
      blockers: [...new Set(blockers)],
      nextStep:
        closeoutStatus === 'ready_for_next_product'
          ? 'Tax Compliance EC 2.0 queda listo para hardening operativo.'
          : 'Resolver items pendientes antes de cerrar Tax Compliance EC 2.0.',
      guardrails: [
        'Closeout 2.0 no declara ni paga automaticamente.',
        'El contador conserva decision final de formularios, deducibilidad y escalamiento contable.',
      ],
    };
  }
}

function item(
  key: string,
  label: string,
  status: EcuadorTaxComplianceCloseoutV2View['checklist'][number]['status'],
  evidence: string[],
): EcuadorTaxComplianceCloseoutV2View['checklist'][number] {
  return { key, label, status, evidence };
}
