import {
  EcuadorTaxIncomeTaxFormContractWorkspaceView,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxFormMappingCatalogUseCase } from './get-tenant-ecuador-tax-form-mapping-catalog.use-case';
import { GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase } from './get-tenant-ecuador-tax-income-tax-evidence-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxIncomeTaxFormContractWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase: GetTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase,
    private readonly getTenantEcuadorTaxFormMappingCatalogUseCase: GetTenantEcuadorTaxFormMappingCatalogUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxIncomeTaxFormContractWorkspaceView> {
    const [incomeTaxWorkspace, formMappingCatalog] = await Promise.all([
      this.getTenantEcuadorTaxIncomeTaxEvidenceWorkspaceUseCase.execute(input),
      this.getTenantEcuadorTaxFormMappingCatalogUseCase.execute(input),
    ]);
    const contractLines = [
      {
        key: 'gross_revenue',
        label: 'Ingresos gravados estimados',
        amountInCents: incomeTaxWorkspace.summary.grossRevenueInCents,
        source: 'declaration_source_ledger',
        readinessStatus: incomeTaxWorkspace.readinessStatus,
        accountantReviewRequired: true,
        notes: ['Debe validarse contra cierre anual y actividad economica.'],
      },
      {
        key: 'deductible_expenses',
        label: 'Costos y gastos deducibles',
        amountInCents: incomeTaxWorkspace.summary.deductibleExpenseInCents,
        source: 'purchase_expense_evidence',
        readinessStatus:
          incomeTaxWorkspace.summary.nonDeductibleReviewAmountInCents > 0
            ? ('needs_review' as const)
            : incomeTaxWorkspace.readinessStatus,
        accountantReviewRequired: true,
        notes: ['La deducibilidad final depende de soporte y criterio contable.'],
      },
      {
        key: 'estimated_taxable_base',
        label: 'Base imponible estimada',
        amountInCents: incomeTaxWorkspace.summary.estimatedTaxableBaseInCents,
        source: 'derived',
        readinessStatus: incomeTaxWorkspace.readinessStatus,
        accountantReviewRequired: true,
        notes: ['Base operativa para revision, no calculo oficial definitivo.'],
      },
      {
        key: 'withholding_credit',
        label: 'Credito por retenciones',
        amountInCents: incomeTaxWorkspace.summary.withholdingCreditInCents,
        source: 'withholding_registry',
        readinessStatus:
          incomeTaxWorkspace.summary.withholdingCreditInCents > 0
            ? incomeTaxWorkspace.readinessStatus
            : ('needs_review' as const),
        accountantReviewRequired: true,
        notes: ['Cruzar retenciones con comprobantes SRI recibidos.'],
      },
    ];
    const blockers = [
      ...incomeTaxWorkspace.blockers,
      formMappingCatalog.forms.some((form) =>
        form.formKey.startsWith('income_tax'),
      )
        ? null
        : 'income_tax_contract.form_mapping_missing',
    ].filter((blocker): blocker is string => blocker !== null);
    const readinessStatus = resolveReadinessStatus(
      contractLines.map((line) => line.readinessStatus),
      blockers,
    );
    const view: EcuadorTaxIncomeTaxFormContractWorkspaceView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      incomeTaxWorkspace,
      formMappingCatalog,
      contractLines,
      summary: {
        grossRevenueInCents: incomeTaxWorkspace.summary.grossRevenueInCents,
        deductibleExpenseInCents:
          incomeTaxWorkspace.summary.deductibleExpenseInCents,
        estimatedTaxableBaseInCents:
          incomeTaxWorkspace.summary.estimatedTaxableBaseInCents,
        withholdingCreditInCents:
          incomeTaxWorkspace.summary.withholdingCreditInCents,
        accountantReviewLineCount: contractLines.filter(
          (line) => line.accountantReviewRequired,
        ).length,
      },
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Completar mapping y evidencia de renta antes de preparar revision anual.'
          : 'Enviar contrato de renta a contador para validacion de deducibilidad y creditos.',
      guardrails: [
        'Contrato de renta operativo; no reemplaza conciliacion contable ni declaracion oficial.',
        'Renta requiere revision profesional especialmente con obligacion de llevar contabilidad.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_income_tax_form_contract_reviewed',
        source: 'tax_income_tax_form_contract',
        payload: {
          readinessStatus,
          summary: view.summary,
          blockerCount: blockers.length,
        },
      });
    }

    return view;
  }
}

function resolveReadinessStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
