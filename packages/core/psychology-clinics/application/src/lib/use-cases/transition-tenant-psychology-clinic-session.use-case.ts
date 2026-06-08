import {
  PsychologyClinicSessionStatus,
  TenantPsychologyClinicSessionRecord,
} from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicIdGenerator } from '../ports/id-generators';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';

export class TransitionTenantPsychologyClinicSessionUseCase {
  constructor(
    private readonly operationsRepository: PsychologyClinicOperationsRepository,
    private readonly idGenerator: PsychologyClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    sessionId: string;
    status: PsychologyClinicSessionStatus;
    blockers?: string[];
  }): Promise<TenantPsychologyClinicSessionRecord | null> {
    const session = await this.operationsRepository.transitionSession(input);
    const tenantId = await this.operationsRepository.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (session && tenantId) {
      await this.operationsRepository.recordEvent({
        id: this.idGenerator.generate(),
        tenantId,
        tenantSlug: input.tenantSlug,
        sessionId: input.sessionId,
        eventType: 'psychology_session_transitioned',
        source: 'psychology-clinics',
        status: input.status === 'completed' ? 'ready' : 'needs_review',
        payload: { status: input.status },
        occurredAt: this.nowProvider(),
      });
    }

    return session;
  }
}
