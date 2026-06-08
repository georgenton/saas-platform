import {
  EcuadorTaxAccountantFilingReviewRoomV3View,
  EcuadorTaxDeclarationFormKey,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase } from './get-tenant-ecuador-tax-accountant-handoff-room-v2.use-case';
import { GetTenantEcuadorTaxAnnexesReadinessV2UseCase } from './get-tenant-ecuador-tax-annexes-readiness-v2.use-case';
import { GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase } from './get-tenant-ecuador-tax-form-box-evidence-binder.use-case';
import { GetTenantEcuadorTaxObligationFilingWorkspaceUseCase } from './get-tenant-ecuador-tax-obligation-filing-workspace.use-case';
import { RecordTenantEcuadorTaxComplianceEventUseCase } from './record-tenant-ecuador-tax-compliance-event.use-case';

export class GetTenantEcuadorTaxAccountantFilingReviewRoomV3UseCase {
  constructor(
    private readonly getTenantEcuadorTaxObligationFilingWorkspaceUseCase: GetTenantEcuadorTaxObligationFilingWorkspaceUseCase,
    private readonly getTenantEcuadorTaxFormBoxEvidenceBinderUseCase: GetTenantEcuadorTaxFormBoxEvidenceBinderUseCase,
    private readonly getTenantEcuadorTaxAnnexesReadinessV2UseCase: GetTenantEcuadorTaxAnnexesReadinessV2UseCase,
    private readonly getTenantEcuadorTaxAccountantHandoffRoomV2UseCase: GetTenantEcuadorTaxAccountantHandoffRoomV2UseCase,
    private readonly recordTenantEcuadorTaxComplianceEventUseCase: RecordTenantEcuadorTaxComplianceEventUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
    formKey?: EcuadorTaxDeclarationFormKey;
    recordEvent?: boolean;
  }): Promise<EcuadorTaxAccountantFilingReviewRoomV3View> {
    const [obligationWorkspace, formBoxBinder, annexesReadiness, handoffRoom] =
      await Promise.all([
        this.getTenantEcuadorTaxObligationFilingWorkspaceUseCase.execute({
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
        this.getTenantEcuadorTaxAccountantHandoffRoomV2UseCase.execute(input),
      ]);
    const reviewSections: EcuadorTaxAccountantFilingReviewRoomV3View['reviewSections'] =
      [
        section(
          'obligations',
          'Obligaciones tributarias',
          obligationWorkspace.workspaceStatus,
          'operator',
          ['tax_obligation_filing_workspace'],
          obligationWorkspace.summary.accountantGateCount,
          obligationWorkspace.nextStep,
        ),
        section(
          'form_boxes',
          'Casilleros y evidencia',
          formBoxBinder.binderStatus,
          'accountant',
          formBoxBinder.boxes.map((box) => `form_box.${box.boxKey}`),
          formBoxBinder.summary.accountantRequiredBoxCount,
          formBoxBinder.nextStep,
        ),
        section(
          'annexes',
          'Anexos',
          annexesReadiness.readinessStatus,
          'accountant',
          annexesReadiness.annexes.map((annex) => `annex.${annex.key}`),
          annexesReadiness.summary.accountantQuestionCount,
          annexesReadiness.nextStep,
        ),
        section(
          'handoff',
          'Handoff profesional',
          handoffRoom.roomStatus,
          'accountant',
          handoffRoom.handoffSections.map((item) => item.key),
          handoffRoom.summary.questionCount,
          handoffRoom.nextStep,
        ),
      ];
    const blockers = [
      ...obligationWorkspace.blockers,
      ...formBoxBinder.blockers,
      ...annexesReadiness.blockers,
      ...handoffRoom.blockers,
      ...reviewSections
        .filter((section) => section.status === 'blocked')
        .map((section) => `review_room.${section.key}.blocked`),
    ];
    const roomStatus = resolveStatus(
      reviewSections.map((section) => section.status),
      blockers,
    );
    const uniqueBlockers = [...new Set(blockers)];
    const view: EcuadorTaxAccountantFilingReviewRoomV3View = {
      ...input,
      generatedAt: this.nowProvider(),
      roomStatus,
      obligationWorkspace,
      formBoxBinder,
      annexesReadiness,
      handoffRoom,
      reviewSections,
      summary: {
        sectionCount: reviewSections.length,
        readySectionCount: reviewSections.filter(
          (section) => section.status === 'ready',
        ).length,
        accountantSectionCount: reviewSections.filter(
          (section) => section.owner === 'accountant',
        ).length,
        questionCount: reviewSections.reduce(
          (total, section) => total + section.questionCount,
          0,
        ),
        blockerCount: uniqueBlockers.length,
      },
      blockers: uniqueBlockers,
      nextStep:
        roomStatus === 'ready'
          ? 'Enviar room al contador o registrar aprobacion externa para filing.'
          : 'Resolver preguntas y blockers profesionales antes de generar closeout.',
      guardrails: [
        'Review room 3.0 organiza criterio profesional; no reemplaza al contador.',
        'La aprobacion y presentacion final se registran como acciones externas.',
      ],
    };

    if (input.recordEvent ?? true) {
      await this.recordTenantEcuadorTaxComplianceEventUseCase.execute({
        tenantSlug: input.tenantSlug,
        period: input.period,
        year: input.year,
        eventType: 'tax_accountant_filing_review_room_v3_reviewed',
        source: 'tax_accountant_filing_review_room_v3',
        payload: {
          roomStatus,
          summary: view.summary,
        },
      });
    }

    return view;
  }
}

function section(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  owner: 'operator' | 'accountant' | 'system',
  evidenceRefs: string[],
  questionCount: number,
  nextAction: string,
): EcuadorTaxAccountantFilingReviewRoomV3View['reviewSections'][number] {
  return {
    key,
    label,
    status,
    owner,
    evidenceRefs,
    questionCount,
    nextAction,
  };
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
