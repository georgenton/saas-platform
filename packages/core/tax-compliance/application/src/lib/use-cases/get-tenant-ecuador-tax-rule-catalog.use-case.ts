import { EcuadorTaxRuleCatalogView } from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxRuleCatalogUseCase {
  constructor(
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxRuleCatalogView> {
    const view: EcuadorTaxRuleCatalogView = {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      country: 'EC',
      readinessStatus: 'needs_review',
      rules: [
        {
          ruleKey: 'ec.vat.input_credit.requires_valid_purchase_support',
          obligationKey: 'vat',
          title: 'Credito IVA requiere soporte de compra valido',
          appliesToCategory: null,
          appliesWhen: [
            'purchase_expense_evidence.status_is_ready',
            'supplier_taxpayer_id_present',
            'document_code_supports_vat_credit',
          ],
          operationalEffect:
            'Permite considerar IVA de compras como credito tributario operativo.',
          accountantReviewRecommended: true,
          evidenceInputs: [
            'purchase_expense_evidence',
            'supplier_fiscal_readiness',
            'taxpayer_profile',
          ],
          guardrails: [
            'No reemplaza validacion de comprobante ni reglas oficiales SRI.',
          ],
        },
        {
          ruleKey: 'ec.income_tax.deductible_expense.category_review',
          obligationKey: 'income_tax',
          title: 'Deducibilidad depende de categoria y sustento',
          appliesToCategory: 'services',
          appliesWhen: [
            'expense_is_related_to_business_activity',
            'supplier_data_complete',
            'support_reference_present',
          ],
          operationalEffect:
            'Incluye subtotal como gasto deducible estimado para evidencia de renta.',
          accountantReviewRecommended: true,
          evidenceInputs: [
            'purchase_expense_evidence.category',
            'purchase_expense_evidence.deductible',
            'accountant_review',
          ],
          guardrails: [
            'La deducibilidad final requiere criterio contable y tributario.',
          ],
        },
        {
          ruleKey: 'ec.withholding.sales_candidate.requires_source_invoice',
          obligationKey: 'withholding',
          title: 'Retencion operativa debe nacer de factura fuente',
          appliesToCategory: null,
          appliesWhen: [
            'sales_book_document_authorized_or_reviewed',
            'candidate_has_invoice_id',
            'withholding_obligation_scheduled',
          ],
          operationalEffect:
            'Permite preparar input para borrador de comprobante de retencion en Invoicing.',
          accountantReviewRecommended: true,
          evidenceInputs: [
            'withholding_evidence_packet.salesCandidates',
            'invoicing.sourceInvoiceId',
            'tax_rate',
          ],
          guardrails: [
            'El bridge no emite automaticamente; porcentaje y codigo se validan antes de emitir.',
          ],
        },
        {
          ruleKey: 'ec.withholding.purchase_candidate.requires_supplier_review',
          obligationKey: 'withholding',
          title:
            'Compras candidatas requieren revision de proveedor y concepto',
          appliesToCategory: 'services',
          appliesWhen: [
            'purchase_evidence_has_supplier_taxpayer_id',
            'category_may_require_withholding',
            'supplier_readiness_not_blocked',
          ],
          operationalEffect:
            'Marca compra como candidata a retencion, pero no crea borrador sin documento fuente en Invoicing.',
          accountantReviewRecommended: true,
          evidenceInputs: [
            'purchase_expense_evidence',
            'supplier_fiscal_readiness',
            'withholding_obligation',
          ],
          guardrails: [
            'Compras externas al libro de Invoicing quedan como evidencia para contador.',
          ],
        },
      ],
      blockers: [],
      nextStep:
        'Usar estas reglas como explicacion operativa dentro de IVA, renta y retenciones antes de automatizar emision.',
      guardrails: [
        'Catalogo 1.0 es deterministico y operacional; no sustituye normativa oficial ni criterio profesional.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_rule_catalog_reviewed',
        source: 'tax_rule_catalog',
        payload: {
          readinessStatus: view.readinessStatus,
          ruleCount: view.rules.length,
          obligationKeys: [
            ...new Set(view.rules.map((rule) => rule.obligationKey)),
          ],
        },
      });
    }

    return view;
  }
}
