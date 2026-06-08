import { TenantPsychologyClinicSessionSchedulingWorkspace } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicSessionSchedulingWorkspace> {
    const sessions = await this.operationsRepository?.listSessions(
      input.tenantSlug,
    );
    const mapped =
      sessions?.map((session) => ({
        id: session.id,
        patientDisplayName: session.patientDisplayName,
        serviceName: session.serviceName,
        therapistName: session.therapistName,
        modality: session.modality,
        startsAt: session.startsAt.toISOString(),
        status: session.status,
        reminderStatus: session.reminderStatus,
        billingStatus: session.billingStatus,
      })) ?? [];
    const blockers = mapped
      .filter((session) => session.status === 'cancelled')
      .map((session) => `Sesion cancelada: ${session.id}`);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      workspaceStatus:
        blockers.length > 0
          ? 'needs_review'
          : mapped.length > 0
            ? 'ready'
            : 'needs_review',
      sessions: mapped,
      summary: {
        sessionCount: mapped.length,
        confirmedCount: mapped.filter(
          (session) => session.status === 'confirmed',
        ).length,
        completedCount: mapped.filter(
          (session) => session.status === 'completed',
        ).length,
        needsReminderCount: mapped.filter(
          (session) => session.reminderStatus !== 'ready',
        ).length,
        billingReviewCount: mapped.filter(
          (session) => session.billingStatus !== 'ready',
        ).length,
      },
      blockers,
      nextStep: 'Agendar o completar sesiones revisables.',
      guardrails: psychologyGuardrails(),
    };
  }
}
