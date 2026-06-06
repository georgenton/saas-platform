import { EcuadorTaxFormMappingCatalogView } from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationFormCatalogUseCase } from './get-tenant-ecuador-tax-declaration-form-catalog.use-case';
import { GetTenantEcuadorTaxDeclarationSourceLedgerUseCase } from './get-tenant-ecuador-tax-declaration-source-ledger.use-case';

export class GetTenantEcuadorTaxFormMappingCatalogUseCase {
  constructor(
    private readonly getTenantEcuadorTaxDeclarationFormCatalogUseCase: GetTenantEcuadorTaxDeclarationFormCatalogUseCase,
    private readonly getTenantEcuadorTaxDeclarationSourceLedgerUseCase: GetTenantEcuadorTaxDeclarationSourceLedgerUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxFormMappingCatalogView> {
    const [catalog, sourceLedger] = await Promise.all([
      this.getTenantEcuadorTaxDeclarationFormCatalogUseCase.execute({
        ...input,
        recordEvent: false,
      }),
      this.getTenantEcuadorTaxDeclarationSourceLedgerUseCase.execute(input),
    ]);
    const forms = catalog.forms.map((form) => ({
      formKey: form.formKey,
      label: form.label,
      supportStatus: form.supportStatus,
      mappings: form.draftableBoxes.map((box) => mapBox(box.boxKey, box.label)),
      manualOnlyBoxes: form.manualOnlyBoxes,
      blockers: form.blockers,
    }));
    const mappings = forms.flatMap((form) => form.mappings);
    const readinessStatus =
      catalog.readinessStatus === 'blocked' ||
      sourceLedger.readinessStatus === 'blocked'
        ? 'blocked'
        : catalog.readinessStatus === 'needs_review' ||
            sourceLedger.readinessStatus === 'needs_review'
          ? 'needs_review'
          : 'ready';

    return {
      ...input,
      generatedAt: this.nowProvider(),
      readinessStatus,
      forms,
      summary: {
        formCount: forms.length,
        mappingCount: mappings.length,
        highConfidenceMappingCount: mappings.filter(
          (mapping) => mapping.confidence === 'high',
        ).length,
        manualOnlyBoxCount: forms.reduce(
          (total, form) => total + form.manualOnlyBoxes.length,
          0,
        ),
      },
      nextStep:
        readinessStatus === 'ready'
          ? 'Usar catalogo de mapeos para explicar casilleros sugeridos.'
          : 'Completar evidencia antes de confiar en mapeos de formularios.',
      guardrails: [
        'El mapping catalog explica formulas; no reemplaza instrucciones oficiales SRI.',
        'Casilleros manuales no deben completarse por IA sin evidencia deterministica.',
      ],
    };
  }
}

function mapBox(
  boxKey: string,
  label: string,
): EcuadorTaxFormMappingCatalogView['forms'][number]['mappings'][number] {
  const known: Record<
    string,
    Omit<
      EcuadorTaxFormMappingCatalogView['forms'][number]['mappings'][number],
      'boxKey' | 'label'
    >
  > = {
    taxable_sales_base: {
      metricKey: 'source_ledger.salesSubtotalInCents',
      source: 'derived',
      confidence: 'high',
      explanation: 'Base gravada sugerida desde ventas SRI/plataforma.',
    },
    output_vat: {
      metricKey: 'source_ledger.outputVatInCents',
      source: 'derived',
      confidence: 'high',
      explanation: 'IVA generado desde comprobantes emitidos.',
    },
    input_vat: {
      metricKey: 'source_ledger.inputVatInCents',
      source: 'derived',
      confidence: 'medium',
      explanation: 'IVA compras requiere confirmar credito tributario.',
    },
    business_income: {
      metricKey: 'source_ledger.salesSubtotalInCents',
      source: 'derived',
      confidence: 'medium',
      explanation: 'Ingresos de actividad desde ventas acumuladas.',
    },
    deductible_costs_expenses: {
      metricKey: 'source_ledger.purchaseSubtotalInCents',
      source: 'derived',
      confidence: 'low',
      explanation: 'Gastos requieren clasificacion de deducibilidad.',
    },
    withheld_income_tax_total: {
      metricKey: 'source_ledger.incomeTaxWithholdingInCents',
      source: 'derived',
      confidence: 'medium',
      explanation: 'Retenciones desde SRI/imports y registros operativos.',
    },
  };
  const mapping =
    known[boxKey] ??
    ({
      metricKey: 'manual_review.required',
      source: 'manual',
      confidence: 'low',
      explanation: 'Casillero requiere criterio humano.',
    } as const);

  return {
    boxKey,
    label,
    ...mapping,
  };
}
