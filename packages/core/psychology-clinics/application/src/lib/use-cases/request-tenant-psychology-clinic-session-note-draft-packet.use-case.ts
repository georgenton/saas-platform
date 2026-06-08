import { TenantPsychologyClinicSessionNoteDraftPacket } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicIdGenerator } from '../ports/id-generators';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import {
  defaultSession,
  findSession,
  psychologyGuardrails,
} from './psychology-clinic-foundation.helpers';

export class RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly idGenerator?: PsychologyClinicIdGenerator,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
    sessionId: string;
  }): Promise<TenantPsychologyClinicSessionNoteDraftPacket> {
    const session =
      (await findSession(
        this.operationsRepository,
        input.tenantSlug,
        input.sessionId,
      )) ?? defaultSession(input.tenantSlug, input.sessionId);
    const blockers = [
      ...session.blockers,
      ...(session.status === 'completed'
        ? []
        : ['La nota requiere sesion completada o revision explicita.']),
    ];
    const packetStatus = blockers.length > 0 ? 'needs_review' : 'ready';
    const tenantId = await this.operationsRepository?.getTenantIdBySlug(
      input.tenantSlug,
    );

    if (tenantId && this.idGenerator) {
      await this.operationsRepository?.recordEvent({
        id: this.idGenerator.generate(),
        tenantId,
        tenantSlug: input.tenantSlug,
        sessionId: input.sessionId,
        eventType: 'psychology_session_note_draft_packet_requested',
        source: 'psychology-clinics',
        status: packetStatus,
        payload: { requiresTherapistReview: true },
        occurredAt: this.nowProvider(),
      });
    }

    return {
      tenantSlug: input.tenantSlug,
      sessionId: input.sessionId,
      generatedAt: this.nowProvider(),
      packetStatus,
      draftSections: {
        presentingConcern: `Motivo trabajado: ${session.serviceName}.`,
        sessionThemes: ['Tema principal pendiente de completar por terapeuta.'],
        interventions: ['Intervenciones aplicadas pendientes de revision.'],
        homeworkOrFollowUp: ['Tarea/seguimiento pendiente de definir.'],
        riskReview: 'Revision de riesgo pendiente de criterio terapeutico.',
        pendingFields: [
          'temas de sesion',
          'intervenciones',
          'seguimiento',
          'revision de riesgo',
        ],
      },
      review: {
        requiresTherapistReview: true,
        mayBeSigned: false,
        reviewerRole: 'therapist',
      },
      blockers,
      nextStep: 'Completar nota estructurada y enviar a revision terapeutica.',
      guardrails: psychologyGuardrails(),
    };
  }
}
