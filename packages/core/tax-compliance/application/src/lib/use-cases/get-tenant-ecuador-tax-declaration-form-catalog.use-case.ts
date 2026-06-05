import {
  EcuadorTaxDeclarationFormCatalogView,
  EcuadorTaxDeclarationFormSupportStatus,
  EcuadorTaxObligationFrequency,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxObligationMatrixUseCase } from './get-tenant-ecuador-tax-obligation-matrix.use-case';
import { GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-sri-fiscal-evidence-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxDeclarationFormCatalogUseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationMatrixUseCase: GetTenantEcuadorTaxObligationMatrixUseCase,
    private readonly getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase: GetTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxDeclarationFormCatalogView> {
    const [matrix, sriEvidence] = await Promise.all([
      this.getTenantEcuadorTaxObligationMatrixUseCase.execute(input.tenantSlug),
      this.getTenantEcuadorTaxSriFiscalEvidenceWorkspaceUseCase.execute({
        ...input,
        recordEvent: false,
      }),
    ]);
    const forms: EcuadorTaxDeclarationFormCatalogView['forms'] = [
      {
        formKey: 'iva',
        label: 'Formulario IVA',
        obligationKey: 'vat',
        supportStatus:
          sriEvidence.summary.totalVouchers > 0 ? 'draftable' : 'needs_review',
        periodicity: obligationFrequency(matrix, 'vat'),
        taxpayerCompatibility: obligationCompatibility(matrix, 'vat'),
        requiredEvidence: [
          'sri_issued_vouchers',
          'sri_received_vouchers',
          'sales_book',
          'purchase_evidence',
          'credit_debit_notes',
        ],
        draftableBoxes: [
          {
            boxKey: 'taxable_sales_base',
            label: 'Base imponible ventas gravadas',
            source: 'SRI emitidos + libro de ventas',
            calculation:
              'Suma de bases gravadas de comprobantes emitidos, menos notas de credito aplicables.',
          },
          {
            boxKey: 'output_vat',
            label: 'IVA generado en ventas',
            source: 'SRI emitidos + libro de ventas',
            calculation:
              'Suma de IVA en comprobantes emitidos autorizados del periodo.',
          },
          {
            boxKey: 'input_vat',
            label: 'IVA credito tributario compras',
            source: 'SRI recibidos + compras/gastos',
            calculation:
              'Suma de IVA de comprobantes recibidos clasificados como deducibles o con credito aplicable.',
          },
        ],
        manualOnlyBoxes: [
          'adjustments_authorized_by_accountant',
          'prior_period_carry_forward',
        ],
        blockers:
          sriEvidence.summary.totalVouchers === 0
            ? ['declaration_form_catalog.sri_evidence_missing']
            : [],
        reviewNotes: [
          'Los casilleros sugeridos deben copiarse o cargarse manualmente en SRI por un humano.',
        ],
      },
      {
        formKey: 'income_tax_natural_person',
        label: 'Impuesto a la Renta Personas Naturales',
        obligationKey: 'income_tax',
        supportStatus: incomeTaxSupportStatus(matrix.taxpayerProfile),
        periodicity: 'annual',
        taxpayerCompatibility: obligationCompatibility(matrix, 'income_tax'),
        requiredEvidence: [
          'annual_sales_summary',
          'annual_purchase_expense_summary',
          'withholding_certificates',
          'taxpayer_profile',
        ],
        draftableBoxes: [
          {
            boxKey: 'business_income',
            label: 'Ingresos de actividad economica',
            source: 'SRI emitidos + ventas plataforma',
            calculation:
              'Acumulado anual de ventas autorizadas asociadas a la actividad economica.',
          },
          {
            boxKey: 'deductible_costs_expenses',
            label: 'Costos y gastos deducibles',
            source: 'SRI recibidos + compras clasificadas',
            calculation:
              'Acumulado anual de compras/gastos marcados como deducibles y revisados.',
          },
        ],
        manualOnlyBoxes: [
          'personal_expenses',
          'family_burdens',
          'exempt_income',
          'prior_year_losses',
        ],
        blockers: [],
        reviewNotes: [
          'Renta anual requiere contexto adicional no siempre presente en comprobantes electronicos.',
        ],
      },
      {
        formKey: 'income_tax_company',
        label: 'Impuesto a la Renta Sociedades',
        obligationKey: 'income_tax',
        supportStatus: matrix.taxpayerProfile.accountingObligated
          ? 'manual_only'
          : 'needs_review',
        periodicity: 'annual',
        taxpayerCompatibility: obligationCompatibility(matrix, 'income_tax'),
        requiredEvidence: [
          'annual_sales_summary',
          'annual_purchase_expense_summary',
          'withholding_certificates',
          'accountant_review_packet',
          'future_accounting_scope',
        ],
        draftableBoxes: [],
        manualOnlyBoxes: [
          'taxable_profit',
          'tax_reconciliation_adjustments',
          'balance_sheet_fields',
          'prior_year_losses',
        ],
        blockers: matrix.taxpayerProfile.accountingObligated
          ? ['declaration_form_catalog.company_income_tax_requires_accounting']
          : [],
        reviewNotes: [
          'Renta sociedades debe esperar profundidad contable o revision especializada antes de automatizar casilleros.',
        ],
      },
      {
        formKey: 'withholding_income_tax',
        label: 'Retenciones en la fuente',
        obligationKey: 'withholding',
        supportStatus: 'draftable',
        periodicity: obligationFrequency(matrix, 'withholding'),
        taxpayerCompatibility: obligationCompatibility(matrix, 'withholding'),
        requiredEvidence: [
          'withholding_registry',
          'sri_received_withholdings',
          'sri_issued_withholdings',
        ],
        draftableBoxes: [
          {
            boxKey: 'withheld_income_tax_total',
            label: 'Total retenciones renta',
            source: 'Registro de retenciones + SRI',
            calculation:
              'Suma de retenciones de impuesto a la renta emitidas/recibidas segun obligacion.',
          },
        ],
        manualOnlyBoxes: ['special_regime_adjustments'],
        blockers: [],
        reviewNotes: [
          'Retenciones deben revisarse contra certificados y comprobantes autorizados.',
        ],
      },
      {
        formKey: 'multiple_payments',
        label: 'Formulario 106 - Multiple de pagos',
        obligationKey: 'payment',
        supportStatus: 'manual_only',
        periodicity: 'event_driven',
        taxpayerCompatibility: 'needs_review',
        requiredEvidence: ['external_filing_handoff', 'payment_instruction'],
        draftableBoxes: [],
        manualOnlyBoxes: ['payment_code', 'obligation_reference', 'amount_due'],
        blockers: [],
        reviewNotes: [
          'Pagos se registran como handoff externo, no como pago automatico.',
        ],
      },
      {
        formKey: 'multiple_declarations',
        label: 'Formulario 120 - Multiple de declaraciones',
        obligationKey: 'payment',
        supportStatus: 'manual_only',
        periodicity: 'event_driven',
        taxpayerCompatibility: 'needs_review',
        requiredEvidence: ['external_filing_handoff', 'declaration_reference'],
        draftableBoxes: [],
        manualOnlyBoxes: ['declaration_type', 'replacement_reference'],
        blockers: [],
        reviewNotes: [
          'Declaraciones multiples deben manejarse como guia manual hasta confirmar formato tecnico soportado.',
        ],
      },
    ];
    const readinessStatus = resolveCatalogStatus(forms);
    const view: EcuadorTaxDeclarationFormCatalogView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      taxpayerProfile: matrix.taxpayerProfile,
      forms,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver formularios bloqueados antes de preparar borradores de declaracion.'
          : readinessStatus === 'needs_review'
            ? 'Seleccionar el formulario aplicable y completar evidencia SRI/manual faltante.'
            : 'Preparar draft packet del formulario seleccionado con evidencia trazable.',
      guardrails: [
        'El catalogo modela formularios para preparacion y guia; no declara ante SRI.',
        'Solo generar archivos XML/JSON/Excel cuando exista guia tecnica o plantilla oficial soportada.',
        'La IA puede explicar casilleros sugeridos, pero no reemplaza revision humana o contable.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_declaration_form_catalog_reviewed',
        source: 'tax_declaration_form_catalog',
        payload: {
          readinessStatus,
          formCount: forms.length,
          draftableForms: forms.filter(
            (form) => form.supportStatus === 'draftable',
          ).length,
          manualOnlyForms: forms.filter(
            (form) => form.supportStatus === 'manual_only',
          ).length,
        },
      });
    }

    return view;
  }
}

function obligationFrequency(
  matrix: Awaited<ReturnType<GetTenantEcuadorTaxObligationMatrixUseCase['execute']>>,
  key: 'vat' | 'income_tax' | 'withholding',
): EcuadorTaxObligationFrequency {
  return (
    matrix.obligations.find((obligation) => obligation.key === key)?.frequency ??
    'unknown'
  );
}

function obligationCompatibility(
  matrix: Awaited<ReturnType<GetTenantEcuadorTaxObligationMatrixUseCase['execute']>>,
  key: 'vat' | 'income_tax' | 'withholding',
): EcuadorTaxReadinessStatus {
  const obligation = matrix.obligations.find(
    (candidate) => candidate.key === key,
  );

  if (!obligation?.applies) {
    return 'needs_review';
  }

  return obligation.readinessStatus;
}

function incomeTaxSupportStatus(input: {
  accountingObligated: boolean | null;
}): EcuadorTaxDeclarationFormSupportStatus {
  return input.accountingObligated ? 'needs_review' : 'draftable';
}

function resolveCatalogStatus(
  forms: EcuadorTaxDeclarationFormCatalogView['forms'],
): EcuadorTaxReadinessStatus {
  if (forms.some((form) => form.blockers.length > 0)) {
    return 'blocked';
  }

  if (
    forms.some(
      (form) =>
        form.supportStatus === 'needs_review' ||
        form.taxpayerCompatibility !== 'ready',
    )
  ) {
    return 'needs_review';
  }

  return 'ready';
}
