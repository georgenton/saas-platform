import {
  EcuadorTaxDeclarationArtifactExportView,
  EcuadorTaxDeclarationFormKey,
} from '@saas-platform/tax-compliance-domain';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase } from './request-tenant-ecuador-tax-declaration-form-draft-packet.use-case';

export class RequestTenantEcuadorTaxDeclarationArtifactExportUseCase {
  constructor(
    private readonly requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase: RequestTenantEcuadorTaxDeclarationFormDraftPacketUseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxDeclarationArtifactExportView> {
    const draft =
      await this.requestTenantEcuadorTaxDeclarationFormDraftPacketUseCase.execute(
        {
          ...input,
          recordEvent: false,
        },
      );
    const jsonPayload = {
      tenantSlug: draft.tenantSlug,
      period: draft.period,
      year: draft.year,
      formKey: draft.formKey,
      formLabel: draft.formLabel,
      suggestedBoxes: draft.suggestedBoxes.map((box) => ({
        boxKey: box.boxKey,
        label: box.label,
        suggestedValueInCents: box.suggestedValueInCents,
        currency: box.currency,
        readinessStatus: box.readinessStatus,
        evidenceIds: box.evidenceIds,
      })),
      manualOnlyBoxes: draft.manualOnlyBoxes,
      blockers: draft.blockers,
      generatedAt: draft.generatedAt.toISOString(),
    };
    const view: EcuadorTaxDeclarationArtifactExportView = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      formKey: draft.formKey,
      readinessStatus: draft.readinessStatus,
      exportMode: 'guided_manual',
      artifacts: [
        {
          key: 'draft_packet_json',
          label: 'Draft packet JSON',
          format: 'json',
          supportStatus: draft.readinessStatus === 'blocked' ? 'blocked' : 'available',
          payload: jsonPayload,
          blockers:
            draft.readinessStatus === 'blocked'
              ? ['artifact_export.draft_packet_blocked']
              : [],
        },
        {
          key: 'manual_entry_checklist',
          label: 'Checklist de entrada manual',
          format: 'manual_checklist',
          supportStatus: 'available',
          payload: {
            items: draft.suggestedBoxes.map((box) => ({
              boxKey: box.boxKey,
              label: box.label,
              value: box.suggestedValueInCents,
              currency: box.currency,
              reviewRequired: box.readinessStatus !== 'ready',
            })),
            manualOnlyBoxes: draft.manualOnlyBoxes,
          },
          blockers: [],
        },
        {
          key: 'official_xml',
          label: 'XML oficial SRI',
          format: 'xml',
          supportStatus: 'manual_only',
          payload: {},
          blockers: ['artifact_export.official_schema_not_modelled'],
        },
        {
          key: 'official_excel_template',
          label: 'Plantilla Excel oficial',
          format: 'xlsx',
          supportStatus: 'manual_only',
          payload: {},
          blockers: ['artifact_export.official_template_not_modelled'],
        },
      ],
      blockedCapabilities: [
        'generate_unverified_official_xml',
        'upload_to_sri',
        'submit_declaration',
        'pay_tax',
      ],
      nextStep:
        draft.readinessStatus === 'blocked'
          ? 'Resolver blockers antes de exportar el paquete de borrador.'
          : 'Descargar o copiar el packet JSON/checklist como soporte de entrada manual en SRI.',
      guardrails: [
        'Los artefactos disponibles son soporte operacional, no archivos oficiales enviados.',
        'XML/XLSX oficiales permanecen manual-only hasta modelar guias tecnicas SRI compatibles.',
        'Exportar un packet no registra presentacion ni pago.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_declaration_artifact_export_requested',
        source: 'tax_declaration_artifact_export',
        payload: {
          formKey: view.formKey,
          readinessStatus: view.readinessStatus,
          exportMode: view.exportMode,
          artifactCount: view.artifacts.length,
        },
      });
    }

    return view;
  }
}
