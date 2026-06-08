import { TenantPsychologyClinicProductReadinessReport } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicProductReadinessReportUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicProductReadinessReport> {
    const [patients, sessions, events] = await Promise.all([
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const patientCount = patients?.length ?? 0;
    const sessionCount = sessions?.length ?? 0;
    const completedSessionCount =
      sessions?.filter((session) => session.status === 'completed').length ?? 0;
    const noteDraftCount =
      events?.filter((event) => event.eventType.includes('note_draft'))
        .length ?? 0;
    const sections: TenantPsychologyClinicProductReadinessReport['sections'] = [
      section('foundation', 'Foundation', patientCount > 0 ? 'ready' : 'blocked', `${patientCount} patients`),
      section('operations', 'Operations', sessionCount > 0 ? 'ready' : 'blocked', `${sessionCount} sessions`),
      section('records', 'Records', noteDraftCount > 0 ? 'needs_review' : 'blocked', `${noteDraftCount} note drafts`),
      section('ehr_readiness', 'EHR readiness', completedSessionCount > 0 ? 'needs_review' : 'blocked', `${completedSessionCount} completed sessions`),
      section('boundaries', 'Clinical boundaries', 'ready', 'automation boundaries defined'),
    ];
    const blockers = sections
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      reportStatus:
        blockers.length > 0
          ? 'blocked'
          : sections.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      sections,
      decision: {
        productCanPauseAsMvp: blockers.length === 0,
        openExternalIntegrationNow: false,
        recommendedNextProduct: 'tax-compliance-ec',
      },
      blockers,
      nextStep: 'Usar este reporte para pausar Psychology Clinics o abrir discovery externo.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function section(
  key: string,
  label: string,
  status: TenantPsychologyClinicProductReadinessReport['sections'][number]['status'],
  evidence: string,
): TenantPsychologyClinicProductReadinessReport['sections'][number] {
  return { key, label, status, evidence };
}
