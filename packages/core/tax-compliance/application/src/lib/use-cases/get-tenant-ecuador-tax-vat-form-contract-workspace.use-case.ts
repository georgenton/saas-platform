import {
  EcuadorTaxReadinessStatus,
  EcuadorTaxVatFormContractWorkspaceView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxFormMappingCatalogUseCase } from './get-tenant-ecuador-tax-form-mapping-catalog.use-case';
import { GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase } from './get-tenant-ecuador-tax-vat-declaration-draft-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxVatFormContractWorkspaceUseCase {
  constructor(
    private readonly getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase: GetTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase,
    private readonly getTenantEcuadorTaxFormMappingCatalogUseCase: GetTenantEcuadorTaxFormMappingCatalogUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxVatFormContractWorkspaceView> {
    const [vatWorkspace, formMappingCatalog] = await Promise.all([
      this.getTenantEcuadorTaxVatDeclarationDraftWorkspaceUseCase.execute(input),
      this.getTenantEcuadorTaxFormMappingCatalogUseCase.execute(input),
    ]);
    const ivaForm = formMappingCatalog.forms.find(
      (form) => form.formKey === 'iva',
    );
    const contractBoxes = (ivaForm?.mappings ?? []).map((mapping) => ({
      boxKey: mapping.boxKey,
      label: mapping.label,
      metricKey: mapping.metricKey,
      amountInCents: resolveMetricAmount(mapping.metricKey, vatWorkspace.summary),
      source: mapping.source,
      confidence: mapping.confidence,
      readinessStatus:
        mapping.confidence === 'high' ? ('ready' as const) : ('needs_review' as const),
      explanation: mapping.explanation,
    }));
    const blockers = [
      ...vatWorkspace.blockers,
      ...(ivaForm?.blockers ?? []),
      contractBoxes.length === 0 ? 'iva_contract.no_mapped_boxes' : null,
    ].filter((blocker): blocker is string => blocker !== null);
    const readinessStatus = resolveReadinessStatus(
      [...contractBoxes.map((box) => box.readinessStatus), vatWorkspace.readinessStatus],
      blockers,
    );
    const view: EcuadorTaxVatFormContractWorkspaceView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      readinessStatus,
      vatWorkspace,
      formMappingCatalog,
      contractBoxes,
      summary: {
        contractBoxCount: contractBoxes.length,
        highConfidenceBoxCount: contractBoxes.filter(
          (box) => box.confidence === 'high',
        ).length,
        manualOnlyBoxCount: ivaForm?.manualOnlyBoxes.length ?? 0,
        outputVatInCents: vatWorkspace.summary.outputVatInCents,
        inputVatInCents: vatWorkspace.summary.inputVatInCents,
        estimatedVatPayableInCents:
          vatWorkspace.summary.estimatedVatPayableInCents,
      },
      blockers,
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver casilleros IVA bloqueados antes de preparar declaracion.'
          : 'Revisar contrato IVA con contador y usarlo como fuente del filing asistido.',
      guardrails: [
        'Contrato IVA operativo; no es formulario oficial presentado ante SRI.',
        'Los casilleros manuales o de baja confianza requieren revision humana.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_vat_form_contract_reviewed',
        source: 'tax_vat_form_contract',
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

function resolveMetricAmount(
  metricKey: string,
  summary: EcuadorTaxVatFormContractWorkspaceView['vatWorkspace']['summary'],
): number {
  switch (metricKey) {
    case 'output_vat':
      return summary.outputVatInCents;
    case 'input_vat':
      return summary.inputVatInCents;
    case 'vat_payable':
      return summary.estimatedVatPayableInCents;
    default:
      return 0;
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
