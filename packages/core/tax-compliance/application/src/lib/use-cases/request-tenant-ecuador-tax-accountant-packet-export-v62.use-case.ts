import {
  EcuadorTaxAccountantPacketExportV62View,
  EcuadorTaxReadinessStatus,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase } from './get-tenant-ecuador-tax-declaration-handoff-closeout-v6.use-case';
import { GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase } from './get-tenant-ecuador-tax-form-box-evidence-binder-v2.use-case';
import { GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase } from './get-tenant-ecuador-tax-sri-reconciliation-exception-queue-v62.use-case';

export class RequestTenantEcuadorTaxAccountantPacketExportV62UseCase {
  constructor(
    private readonly getTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase: GetTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase,
    private readonly getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase: GetTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase,
    private readonly getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase: GetTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    period: string;
    year: number;
  }): Promise<EcuadorTaxAccountantPacketExportV62View> {
    const [closeout, formBinder, exceptionQueue] = await Promise.all([
      this.getTenantEcuadorTaxDeclarationHandoffCloseoutV6UseCase.execute(
        input,
      ),
      this.getTenantEcuadorTaxFormBoxEvidenceBinderV2UseCase.execute(input),
      this.getTenantEcuadorTaxSriReconciliationExceptionQueueV62UseCase.execute(
        input,
      ),
    ]);
    const packetSections: EcuadorTaxAccountantPacketExportV62View['packetSections'] =
      [
        section(
          'period_decision',
          'Decision del periodo',
          closeout.closeoutStatus,
          ['declaration_handoff_closeout_v6'],
          [closeout.decision.reason],
          'accountant',
        ),
        section(
          'sri_exceptions',
          'Excepciones SRI/plataforma',
          exceptionQueue.queueStatus,
          exceptionQueue.exceptions.map((exception) => exception.key),
          exceptionQueue.exceptions.map(
            (exception) => exception.recommendedAction,
          ),
          'operator',
        ),
        section(
          'form_boxes',
          'Casilleros y evidencia',
          formBinder.binderStatus,
          formBinder.boxEvidenceContracts.flatMap((box) => box.evidenceRefs),
          formBinder.boxEvidenceContracts
            .filter((box) => box.reviewRequired)
            .map((box) => box.accountantQuestion),
          'accountant',
        ),
      ];
    const blockers = [
      ...closeout.blockers,
      ...formBinder.blockers,
      ...exceptionQueue.blockers,
    ];
    const packetStatus = resolveStatus(
      packetSections.map((section) => section.status),
      blockers,
    );

    return {
      ...input,
      generatedAt: this.nowProvider(),
      packetStatus,
      packetId: `tax_accountant_packet_${input.period}`,
      closeout,
      formBinder,
      exceptionQueue,
      packetSections,
      exportArtifacts: [
        artifact(
          'packet_json',
          'JSON operativo contador',
          'json',
          packetStatus,
        ),
        artifact(
          'review_checklist',
          'Checklist revision profesional',
          'checklist',
          packetStatus,
        ),
        artifact(
          'evidence_index',
          'Indice de evidencia',
          'evidence_index',
          formBinder.binderStatus,
        ),
      ],
      summary: {
        sectionCount: packetSections.length,
        questionCount: packetSections.reduce(
          (total, section) => total + section.questions.length,
          0,
        ),
        blockerCount: new Set(blockers).size,
        artifactCount: 3,
        accountantOwnedSectionCount: packetSections.filter(
          (section) => section.owner === 'accountant',
        ).length,
      },
      blockers: [...new Set(blockers)],
      nextStep:
        packetStatus === 'ready'
          ? 'Compartir packet contador como evidencia operativa del periodo.'
          : 'Resolver blockers antes de tratar el packet como listo para revision profesional.',
      guardrails: [
        'El packet exporta evidencia y preguntas; no firma, certifica ni declara.',
        'Los artefactos son operativos y manual-only para uso del contador.',
      ],
    };
  }
}

function section(
  key: string,
  label: string,
  status: EcuadorTaxReadinessStatus,
  evidenceRefs: string[],
  questions: string[],
  owner: EcuadorTaxAccountantPacketExportV62View['packetSections'][number]['owner'],
): EcuadorTaxAccountantPacketExportV62View['packetSections'][number] {
  return { key, label, status, evidenceRefs, questions, owner };
}

function artifact(
  key: string,
  label: string,
  format: EcuadorTaxAccountantPacketExportV62View['exportArtifacts'][number]['format'],
  status: EcuadorTaxReadinessStatus,
): EcuadorTaxAccountantPacketExportV62View['exportArtifacts'][number] {
  return { key, label, format, status, manualOnly: true };
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
