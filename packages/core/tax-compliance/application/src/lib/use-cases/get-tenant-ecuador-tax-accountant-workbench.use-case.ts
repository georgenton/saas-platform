import {
  EcuadorTaxAccountantWorkbenchView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxRuleCatalogUseCase } from './get-tenant-ecuador-tax-rule-catalog.use-case';
import { GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase } from './get-tenant-ecuador-tax-supplier-fiscal-readiness-workspace.use-case';
import { ListTenantEcuadorTaxAccountantReviewsUseCase } from './list-tenant-ecuador-tax-accountant-reviews.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase } from './request-tenant-ecuador-tax-income-tax-evidence-packet.use-case';
import { RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase } from './request-tenant-ecuador-tax-vat-input-output-reconciliation-packet.use-case';
import { RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase } from './request-tenant-ecuador-tax-withholding-evidence-packet.use-case';

export class GetTenantEcuadorTaxAccountantWorkbenchUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase: RequestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase,
    private readonly requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase: RequestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase,
    private readonly requestTenantEcuadorTaxWithholdingEvidencePacketUseCase: RequestTenantEcuadorTaxWithholdingEvidencePacketUseCase,
    private readonly getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase: GetTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase,
    private readonly getTenantEcuadorTaxRuleCatalogUseCase: GetTenantEcuadorTaxRuleCatalogUseCase,
    private readonly listTenantEcuadorTaxAccountantReviewsUseCase: ListTenantEcuadorTaxAccountantReviewsUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAccountantWorkbenchView> {
    const [
      vatPacket,
      incomePacket,
      withholdingPacket,
      supplierWorkspace,
      ruleCatalog,
      accountantReviews,
    ] = await Promise.all([
      this.requestTenantEcuadorTaxVatInputOutputReconciliationPacketUseCase.execute(
        { ...input, recordEvent: false },
      ),
      this.requestTenantEcuadorTaxIncomeTaxEvidencePacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.requestTenantEcuadorTaxWithholdingEvidencePacketUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxSupplierFiscalReadinessWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxRuleCatalogUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.listTenantEcuadorTaxAccountantReviewsUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
      }),
    ]);
    const ruleQuestions = ruleCatalog.rules
      .filter((rule) => rule.accountantReviewRecommended)
      .map((rule) => `Revisar regla operacional: ${rule.title}.`);
    const sections: EcuadorTaxAccountantWorkbenchView['sections'] = [
      {
        key: 'vat_input_output',
        label: 'IVA ventas/compras',
        readinessStatus: vatPacket.readinessStatus,
        blockerCount: vatPacket.blockers.length,
        questionCount: vatPacket.accountantQuestions.length,
        nextStep: vatPacket.nextStep,
      },
      {
        key: 'income_tax',
        label: 'Renta operacional',
        readinessStatus: incomePacket.readinessStatus,
        blockerCount: incomePacket.blockers.length,
        questionCount: incomePacket.accountantQuestions.length,
        nextStep: incomePacket.nextStep,
      },
      {
        key: 'withholding',
        label: 'Retenciones',
        readinessStatus: withholdingPacket.readinessStatus,
        blockerCount: withholdingPacket.blockers.length,
        questionCount: withholdingPacket.accountantQuestions.length,
        nextStep: withholdingPacket.nextStep,
      },
      {
        key: 'supplier_readiness',
        label: 'Proveedores',
        readinessStatus: supplierWorkspace.readinessStatus,
        blockerCount: supplierWorkspace.blockers.length,
        questionCount: supplierWorkspace.summary.needsReviewSupplierCount,
        nextStep: supplierWorkspace.nextStep,
      },
      {
        key: 'rule_catalog',
        label: 'Reglas fiscales',
        readinessStatus: ruleCatalog.readinessStatus,
        blockerCount: ruleCatalog.blockers.length,
        questionCount: ruleQuestions.length,
        nextStep: ruleCatalog.nextStep,
      },
    ];
    const blockers = [
      ...vatPacket.blockers,
      ...incomePacket.blockers,
      ...withholdingPacket.blockers,
      ...supplierWorkspace.blockers,
      ...ruleCatalog.blockers,
    ];
    const latestAccountantReview = accountantReviews[0] ?? null;
    const readinessStatus = resolveWorkbenchStatus(
      sections,
      latestAccountantReview?.status,
    );
    const view: EcuadorTaxAccountantWorkbenchView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      summary: {
        blockingSectionCount: sections.filter(
          (section) => section.readinessStatus === 'blocked',
        ).length,
        needsReviewSectionCount: sections.filter(
          (section) => section.readinessStatus === 'needs_review',
        ).length,
        readySectionCount: sections.filter(
          (section) => section.readinessStatus === 'ready',
        ).length,
        accountantReviewCount: accountantReviews.length,
        ruleCount: ruleCatalog.rules.length,
      },
      sections,
      blockers: [...new Set(blockers)],
      accountantQuestions: [
        ...new Set([
          ...vatPacket.accountantQuestions,
          ...incomePacket.accountantQuestions,
          ...withholdingPacket.accountantQuestions,
          ...ruleQuestions,
        ]),
      ],
      latestAccountantReview,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de pedir cierre contable del periodo.'
          : readinessStatus === 'needs_review'
            ? 'Usar este workbench para revisar IVA, renta, retenciones y proveedores con contador.'
            : 'Periodo listo para sostener aprobacion y closeout externo.',
      guardrails: [
        'Workbench fiscal coordina evidencia; no reemplaza contabilidad completa ni declaracion SRI.',
        'Ventas grandes o escenarios complejos deben escalar a contador y, luego, a producto contable dedicado.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'accountant_workbench_reviewed',
        source: 'accountant_workbench',
        payload: {
          readinessStatus,
          sectionCount: sections.length,
          blockerCount: view.blockers.length,
          accountantQuestionCount: view.accountantQuestions.length,
        },
      });
    }

    return view;
  }
}

function resolveWorkbenchStatus(
  sections: EcuadorTaxAccountantWorkbenchView['sections'],
  latestReviewStatus?: string,
): EcuadorTaxReadinessStatus {
  if (sections.some((section) => section.readinessStatus === 'blocked')) {
    return 'blocked';
  }

  if (latestReviewStatus === 'approved') {
    return 'ready';
  }

  return 'needs_review';
}
