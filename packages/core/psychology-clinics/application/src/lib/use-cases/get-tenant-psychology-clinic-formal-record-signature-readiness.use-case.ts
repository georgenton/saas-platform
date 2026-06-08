import { TenantPsychologyClinicFormalRecordSignatureReadiness } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicFormalRecordSignatureReadinessUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicFormalRecordSignatureReadiness> {
    const [sessions, events] = await Promise.all([
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const completedSessionCount =
      sessions?.filter((session) => session.status === 'completed').length ?? 0;
    const noteReviewCount =
      events?.filter((event) => event.eventType.includes('note')).length ?? 0;
    const stages: TenantPsychologyClinicFormalRecordSignatureReadiness['signatureStages'] =
      [
        stage(
          'reviewed_note',
          'Nota revisada por terapeuta',
          noteReviewCount > 0 ? 'needs_review' : 'blocked',
          `${noteReviewCount} note events`,
          'therapist',
        ),
        stage(
          'signer_identity',
          'Identidad del firmante clinico',
          completedSessionCount > 0 ? 'needs_review' : 'blocked',
          `${completedSessionCount} completed sessions`,
          'clinic_admin',
        ),
        stage(
          'audit_lock',
          'Bloqueo y auditoria posterior',
          'needs_review',
          'lock policy pending',
          'external_ehr',
        ),
        stage(
          'legal_validation',
          'Validacion legal externa',
          'needs_review',
          'external validation required',
          'external_ehr',
        ),
      ];
    const blockers = stages
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      readinessStatus:
        blockers.length > 0
          ? 'blocked'
          : stages.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      signatureStages: stages,
      signaturePolicy: {
        automaticSignatureAllowed: false,
        locksAfterSignature: true,
        legalRecordRequiresExternalValidation: true,
        therapistIsSigner: true,
      },
      summary: {
        stageCount: stages.length,
        readyStageCount: stages.filter((item) => item.status === 'ready')
          .length,
        needsReviewStageCount: stages.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedStageCount: blockers.length,
      },
      blockers,
      nextStep: 'Definir firma formal solo como contrato revisado y auditado.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function stage(
  key: string,
  label: string,
  status: TenantPsychologyClinicFormalRecordSignatureReadiness['signatureStages'][number]['status'],
  evidence: string,
  owner: TenantPsychologyClinicFormalRecordSignatureReadiness['signatureStages'][number]['owner'],
): TenantPsychologyClinicFormalRecordSignatureReadiness['signatureStages'][number] {
  return { key, label, status, evidence, owner };
}
