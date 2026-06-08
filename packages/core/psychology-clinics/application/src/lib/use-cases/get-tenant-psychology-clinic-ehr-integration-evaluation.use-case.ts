import { TenantPsychologyClinicEhrIntegrationEvaluation } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicEhrIntegrationEvaluationUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicEhrIntegrationEvaluation> {
    const [patients, sessions, events] = await Promise.all([
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const patientCount = patients?.length ?? 0;
    const completedSessionCount =
      sessions?.filter((session) => session.status === 'completed').length ?? 0;
    const noteDraftCount =
      events?.filter((event) => event.eventType.includes('note_draft'))
        .length ?? 0;
    const options: TenantPsychologyClinicEhrIntegrationEvaluation['options'] = [
      option(
        'external_ehr',
        'External EHR',
        completedSessionCount > 0 && noteDraftCount > 0
          ? 'needs_review'
          : 'blocked',
        `${completedSessionCount} completed sessions, ${noteDraftCount} note drafts`,
        'Run vendor and legal review before integration work.',
      ),
      option(
        'document_management',
        'Document management',
        patientCount > 0 ? 'needs_review' : 'blocked',
        `${patientCount} patients available`,
        'Evaluate export-only document archive for reviewed packets.',
      ),
      option(
        'clinical_archive',
        'Clinical archive',
        noteDraftCount > 0 ? 'needs_review' : 'blocked',
        `${noteDraftCount} draft candidates`,
        'Keep archive external until signature/legal boundaries are resolved.',
      ),
    ];
    const blockers = options
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      evaluationStatus:
        blockers.length > 0
          ? 'blocked'
          : options.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      options,
      decision: {
        recommendedOption:
          blockers.length > 0 ? 'pause_after_mvp' : 'external_ehr_discovery',
        integrationBuiltNow: false,
        requiresLegalReview: true,
      },
      blockers,
      nextStep: 'Decidir integracion externa sin construir EHR propio.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function option(
  key: TenantPsychologyClinicEhrIntegrationEvaluation['options'][number]['key'],
  label: string,
  status: TenantPsychologyClinicEhrIntegrationEvaluation['options'][number]['status'],
  rationale: string,
  nextAction: string,
): TenantPsychologyClinicEhrIntegrationEvaluation['options'][number] {
  return { key, label, status, rationale, nextAction };
}
