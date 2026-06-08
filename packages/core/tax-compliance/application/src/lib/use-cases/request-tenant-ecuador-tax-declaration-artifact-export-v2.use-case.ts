import {
  EcuadorTaxDeclarationArtifactExportV2View,
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase } from './get-tenant-ecuador-tax-accountant-filing-review-room-v3.use-case';
import { GetTenantEcuadorTaxAnnexesReadinessV2UseCase } from './get-tenant-ecuador-tax-annexes-readiness-v2.use-case';
import { GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase } from './get-tenant-ecuador-tax-form-box-evidence-binder.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';
import { RequestTenantEcuadorTaxDeclarationArtifactExportUseCase } from './request-tenant-ecuador-tax-declaration-artifact-export.use-case';

export class RequestTenantEcuadorTaxDeclarationArtifactExportV2UseCase {
  constructor(
    private readonly requestTenantEcuadorTaxDeclarationArtifactExportUseCase: RequestTenantEcuadorTaxDeclarationArtifactExportUseCase,
    private readonly getTenantEcuadorTaxFormBoxEvidenceBinderUseCase: GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
    private readonly getTenantEcuadorTaxAnnexesReadinessV2UseCase: GetTenantEcuadorTaxAnnexesReadinessV2UseCase,
    private readonly getTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase: GetTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxDeclarationArtifactExportV2View> {
    const [baseExport, formBoxBinder, annexesReadiness, accountantReviewRoom] =
      await Promise.all([
        this.requestTenantEcuadorTaxDeclarationArtifactExportUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxFormBoxEvidenceBinderUseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxAnnexesReadinessV2UseCase.execute({
          ...input,
          recordEvent: false,
        }),
        this.getTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase.execute({
          ...input,
          recordEvent: false,
        }),
      ]);
    const operationalArtifacts: EcuadorTaxDeclarationArtifactExportV2View['artifacts'] =
      [
        ...baseExport.artifacts,
        {
          key: 'form_box_evidence_binder_json',
          label: 'Binder de evidencia por casillero',
          format: 'json',
          supportStatus:
            formBoxBinder.binderStatus === 'blocked' ? 'blocked' : 'available',
          payload: {
            formKey: formBoxBinder.formKey,
            boxes: formBoxBinder.boxes,
            manualOnlyBoxes: formBoxBinder.manualOnlyBoxes,
            summary: formBoxBinder.summary,
          },
          blockers:
            formBoxBinder.binderStatus === 'blocked'
              ? ['artifact_export_v2.form_box_binder_blocked']
              : [],
        },
        {
          key: 'accountant_review_checklist',
          label: 'Checklist de revision contador',
          format: 'manual_checklist',
          supportStatus: 'available',
          payload: {
            sections: accountantReviewRoom.reviewSections,
            blockers: accountantReviewRoom.blockers,
            nextStep: accountantReviewRoom.nextStep,
          },
          blockers: [],
        },
        {
          key: 'annexes_readiness_json',
          label: 'Readiness anexos',
          format: 'json',
          supportStatus:
            annexesReadiness.readinessStatus === 'blocked'
              ? 'blocked'
              : 'available',
          payload: {
            annexes: annexesReadiness.annexes,
            summary: annexesReadiness.summary,
          },
          blockers:
            annexesReadiness.readinessStatus === 'blocked'
              ? ['artifact_export_v2.annexes_blocked']
              : [],
        },
      ];
    const blockers = [
      ...baseExport.artifacts.flatMap((artifact) => artifact.blockers),
      ...formBoxBinder.blockers,
      ...annexesReadiness.blockers,
      ...accountantReviewRoom.blockers,
    ];
    const readinessStatus = resolveStatus(
      [
        baseExport.readinessStatus,
        formBoxBinder.binderStatus,
        annexesReadiness.readinessStatus,
        accountantReviewRoom.roomStatus,
      ],
      blockers,
    );
    const uniqueBlockers = [...new Set(blockers)];
    const summary = {
      artifactCount: operationalArtifacts.length,
      availableArtifactCount: operationalArtifacts.filter(
        (artifact) => artifact.supportStatus === 'available',
      ).length,
      manualOnlyArtifactCount: operationalArtifacts.filter(
        (artifact) => artifact.supportStatus === 'manual_only',
      ).length,
      blockedArtifactCount: operationalArtifacts.filter(
        (artifact) => artifact.supportStatus === 'blocked',
      ).length,
    };
    const view: EcuadorTaxDeclarationArtifactExportV2View = {
      tenantSlug: input.tenantSlug,
      period: input.period,
      year: input.year,
      generatedAt: this.nowProvider(),
      formKey: baseExport.formKey,
      readinessStatus,
      baseExport,
      formBoxBinder,
      annexesReadiness,
      accountantReviewRoom,
      artifacts: operationalArtifacts,
      summary,
      blockedCapabilities: [
        ...new Set([
          ...baseExport.blockedCapabilities,
          'generate_unverified_annex_file',
          'certify_accountant_review',
        ]),
      ],
      nextStep:
        readinessStatus === 'blocked'
          ? 'Resolver blockers antes de entregar artifacts al contador.'
          : 'Entregar JSON/checklists como soporte operativo de declaracion asistida.',
      guardrails: [
        'Artifact export 2.0 genera evidencia operativa, no archivos oficiales no modelados.',
        'XML/XLSX oficiales permanecen manual-only salvo contrato tecnico SRI explicito.',
        'Exportar artifacts no registra filing, pago ni certificacion profesional.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_declaration_artifact_export_v2_requested',
        source: 'tax_declaration_artifact_export_v2',
        payload: {
          formKey: view.formKey,
          readinessStatus,
          summary,
        },
      });
    }

    return view;
  }
}

function resolveStatus(
  statuses: EcuadorTaxReadinessStatus[],
  blockers: string[],
): EcuadorTaxReadinessStatus {
  if (blockers.length > 0 || statuses.includes('blocked')) {
    return 'blocked';
  }

  return statuses.includes('needs_review') ? 'needs_review' : 'ready';
}
