import { EcuadorTaxComplianceAnnualCloseoutV5View } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase } from './get-tenant-ecuador-tax-accounting-advanced-discovery-gate.use-case';
import { GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase } from './get-tenant-ecuador-tax-annual-fiscal-year-workspace.use-case';
import { GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase } from './get-tenant-ecuador-tax-annual-income-tax-reconciliation-v2.use-case';
import { GetTenantEcuadorTaxAuditReadinessBinderUseCase } from './get-tenant-ecuador-tax-audit-readiness-binder.use-case';
import { GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase } from './get-tenant-ecuador-tax-external-accountant-annual-review-room.use-case';
import { annualGuardrails, statusFromBlockers } from './ecuador-tax-annual-readiness.helpers';

export class RequestTenantEcuadorTaxComplianceAnnualCloseoutV5UseCase {
  constructor(
    private readonly getAnnualFiscalYearWorkspaceUseCase: GetTenantEcuadorTaxAnnualFiscalYearWorkspaceUseCase,
    private readonly getAnnualIncomeTaxReconciliationUseCase: GetTenantEcuadorTaxAnnualIncomeTaxReconciliationV2UseCase,
    private readonly getAuditReadinessBinderUseCase: GetTenantEcuadorTaxAuditReadinessBinderUseCase,
    private readonly getExternalAccountantAnnualReviewRoomUseCase: GetTenantEcuadorTaxExternalAccountantAnnualReviewRoomUseCase,
    private readonly getAccountingAdvancedDiscoveryGateUseCase: GetTenantEcuadorTaxAccountingAdvancedDiscoveryGateUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    year: number;
  }): Promise<EcuadorTaxComplianceAnnualCloseoutV5View> {
    const [annual, reconciliation, binder, accountantRoom, accountingGate] =
      await Promise.all([
        this.getAnnualFiscalYearWorkspaceUseCase.execute(input),
        this.getAnnualIncomeTaxReconciliationUseCase.execute(input),
        this.getAuditReadinessBinderUseCase.execute(input),
        this.getExternalAccountantAnnualReviewRoomUseCase.execute(input),
        this.getAccountingAdvancedDiscoveryGateUseCase.execute(input),
      ]);
    const checklist: EcuadorTaxComplianceAnnualCloseoutV5View['checklist'] = [
      check('annual_workspace', 'Cierre anual fiscal', annual.workspaceStatus, `${annual.annualTotals.eventCount} eventos anuales`),
      check('income_tax', 'Renta anual reconciliada', reconciliation.reconciliationStatus, `${reconciliation.summary.rowCount} filas`),
      check('audit_binder', 'Binder de auditoria', binder.binderStatus, `${binder.summary.folderCount} carpetas`),
      check('accountant_room', 'Sala del contador', accountantRoom.roomStatus, `${accountantRoom.summary.questionCount} preguntas`),
      check('accounting_gate', 'Gate Accounting Advanced', accountingGate.gateStatus, accountingGate.recommendation.reason),
    ];
    const blockers = checklist
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);
    const closeoutStatus = statusFromBlockers(
      blockers,
      checklist.filter((item) => item.status === 'needs_review').length,
    );

    return {
      tenantSlug: input.tenantSlug,
      year: input.year,
      generatedAt: this.nowProvider(),
      closeoutStatus,
      checklist,
      decision: {
        status:
          closeoutStatus === 'blocked'
            ? 'blocked'
            : closeoutStatus === 'needs_review'
              ? 'ready_for_external_accountant_review'
              : 'ready_for_external_accountant_review',
        recommendedNextProduct: accountingGate.recommendation.nextProduct,
      },
      summary: {
        checkCount: checklist.length,
        readyCheckCount: checklist.filter((item) => item.status === 'ready')
          .length,
        needsReviewCheckCount: checklist.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedCheckCount: blockers.length,
      },
      blockers,
      nextStep: 'Cerrar anualmente con contador externo o abrir Accounting Advanced si el gate lo justifica.',
      guardrails: annualGuardrails(),
    };
  }
}

function check(
  key: string,
  label: string,
  status: EcuadorTaxComplianceAnnualCloseoutV5View['checklist'][number]['status'],
  evidence: string,
): EcuadorTaxComplianceAnnualCloseoutV5View['checklist'][number] {
  return { key, label, status, evidence };
}
