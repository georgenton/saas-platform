import { TenantPsychologyClinicExternalDocumentHandoffContracts } from '@saas-platform/psychology-clinics-domain';
import { PsychologyClinicOperationsRepository } from '../ports/psychology-clinic-operations.repository';
import { psychologyGuardrails } from './psychology-clinic-foundation.helpers';

export class GetTenantPsychologyClinicExternalDocumentHandoffContractsUseCase {
  constructor(
    private readonly operationsRepository?: PsychologyClinicOperationsRepository,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(input: {
    tenantSlug: string;
  }): Promise<TenantPsychologyClinicExternalDocumentHandoffContracts> {
    const [patients, sessions, events] = await Promise.all([
      this.operationsRepository?.listPatients(input.tenantSlug),
      this.operationsRepository?.listSessions(input.tenantSlug),
      this.operationsRepository?.listEvents(input.tenantSlug),
    ]);
    const consentReadyCount =
      patients?.filter((patient) => patient.therapyConsentStatus === 'ready')
        .length ?? 0;
    const completedSessionCount =
      sessions?.filter((session) => session.status === 'completed').length ?? 0;
    const noteDraftCount =
      events?.filter((event) => event.eventType.includes('note_draft'))
        .length ?? 0;
    const packets: TenantPsychologyClinicExternalDocumentHandoffContracts['exportPackets'] =
      [
        packet(
          'patient_summary',
          'Resumen de paciente',
          consentReadyCount > 0 ? 'needs_review' : 'blocked',
          [`${consentReadyCount} consents ready`],
          'external_ehr',
        ),
        packet(
          'session_history',
          'Historial de sesiones',
          completedSessionCount > 0 ? 'needs_review' : 'blocked',
          [`${completedSessionCount} completed sessions`],
          'document_management',
        ),
        packet(
          'reviewed_notes',
          'Notas revisadas exportables',
          noteDraftCount > 0 ? 'needs_review' : 'blocked',
          [`${noteDraftCount} note drafts pending review`],
          'clinical_archive',
        ),
        packet(
          'audit_privacy',
          'Auditoria y privacidad',
          consentReadyCount > 0 ? 'needs_review' : 'blocked',
          ['consent, privacy and review metadata'],
          'external_ehr',
        ),
      ];
    const blockers = packets
      .filter((item) => item.status === 'blocked')
      .map((item) => item.label);

    return {
      tenantSlug: input.tenantSlug,
      generatedAt: this.nowProvider(),
      handoffStatus:
        blockers.length > 0
          ? 'blocked'
          : packets.some((item) => item.status === 'needs_review')
            ? 'needs_review'
            : 'ready',
      exportPackets: packets,
      handoffPolicy: {
        requiresPatientConsent: true,
        requiresTherapistApproval: true,
        containsSignedLegalRecord: false,
        binaryClinicalFilesStoredHere: false,
      },
      summary: {
        packetCount: packets.length,
        readyPacketCount: packets.filter((item) => item.status === 'ready')
          .length,
        needsReviewPacketCount: packets.filter(
          (item) => item.status === 'needs_review',
        ).length,
        blockedPacketCount: blockers.length,
      },
      blockers,
      nextStep: 'Preparar contratos de exportacion para EHR o archivo externo.',
      guardrails: psychologyGuardrails(),
    };
  }
}

function packet(
  key: string,
  label: string,
  status: TenantPsychologyClinicExternalDocumentHandoffContracts['exportPackets'][number]['status'],
  includedEvidence: string[],
  destination: TenantPsychologyClinicExternalDocumentHandoffContracts['exportPackets'][number]['destination'],
): TenantPsychologyClinicExternalDocumentHandoffContracts['exportPackets'][number] {
  return { key, label, status, includedEvidence, destination };
}
