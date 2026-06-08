import {
  GetTenantPsychologyClinicFoundationCloseoutUseCase,
  GetTenantPsychologyClinicClinicalEvidenceRegistryUseCase,
  GetTenantPsychologyClinicOperationsCloseoutUseCase,
  GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase,
  GetTenantPsychologyClinicPatientTimelineWorkspaceUseCase,
  GetTenantPsychologyClinicPrivacyConsentControlCenterUseCase,
  GetTenantPsychologyClinicProductAnchorUseCase,
  GetTenantPsychologyClinicProfileWorkspaceUseCase,
  GetTenantPsychologyClinicRecordsCloseoutV3UseCase,
  GetTenantPsychologyClinicRecordsHardeningWorkspaceUseCase,
  GetTenantPsychologyClinicRiskSafetyReviewWorkspaceUseCase,
  GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase,
  GetTenantPsychologyClinicTreatmentFollowUpReadinessUseCase,
  GetTenantPsychologyClinicTreatmentPlanWorkspaceUseCase,
  RegisterTenantPsychologyClinicPatientIntakeUseCase,
  RequestTenantPsychologyClinicBillingTaxBridgeUseCase,
  RequestTenantPsychologyClinicGrowthReminderBridgeUseCase,
  RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase,
  RequestTenantPsychologyClinicSessionNoteReviewLoopUseCase,
  TransitionTenantPsychologyClinicSessionUseCase,
  UpsertTenantPsychologyClinicProfileWorkspaceUseCase,
  CreateTenantPsychologyClinicSessionUseCase,
} from '@saas-platform/psychology-clinics-application';

const fixedNow = new Date('2026-06-08T13:00:00.000Z');

describe('Psychology Clinics foundation use cases', () => {
  it('anchors the psychology product with modules, lanes and clinical guardrails', async () => {
    const view = await new GetTenantPsychologyClinicProductAnchorUseCase(
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
    });

    expect(view.productKey).toBe('psychology-clinics');
    expect(view.modules.map((item) => item.key)).toEqual([
      'therapists',
      'patients',
      'sessions',
      'session-notes',
      'treatment-tracking',
      'reminders',
    ]);
    expect(view.summary.coreModuleCount).toBe(3);
    expect(view.lanes.map((item) => item.laneKey)).toEqual([
      'profile',
      'patient_intake',
      'sessions',
      'notes',
      'growth_billing',
    ]);
    expect(view.guardrails.join(' ')).toContain('No diagnostica');
  });

  it('exposes default profile, intake and scheduling workspaces before persistence', async () => {
    const profile = await new GetTenantPsychologyClinicProfileWorkspaceUseCase(
      undefined,
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
    });
    const intake =
      await new GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase(
        undefined,
        () => fixedNow,
      ).execute({
        tenantSlug: 'psychology-demo',
      });
    const scheduling =
      await new GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase(
        undefined,
        () => fixedNow,
      ).execute({
        tenantSlug: 'psychology-demo',
      });

    expect(profile.workspaceStatus).toBe('needs_review');
    expect(profile.therapists[0]?.licenseStatus).toBe('pending_review');
    expect(intake.summary.patientCount).toBe(1);
    expect(intake.summary.pendingConsentCount).toBe(1);
    expect(scheduling.summary.sessionCount).toBe(0);
    expect(scheduling.workspaceStatus).toBe('needs_review');
  });

  it('persists profile, intake, sessions, note drafts and closeout evidence', async () => {
    const repository = createInMemoryPsychologyClinicRepository();
    const idGenerator = {
      generate: jest.fn(
        () => `psychology_id_${idGenerator.generate.mock.calls.length}`,
      ),
    };

    await new UpsertTenantPsychologyClinicProfileWorkspaceUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
      snapshot: {
        workspaceStatus: 'ready',
        blockers: [],
        clinicProfile: {
          legalName: 'Psicologia Persistida S.A.S.',
          tradeName: 'Psicologia Persistida',
          operatingMode: 'multi_therapist_ready',
          privacyReviewStatus: 'ready',
        },
      },
    });
    const patient =
      await new RegisterTenantPsychologyClinicPatientIntakeUseCase(
        repository,
        idGenerator,
      ).execute({
        tenantSlug: 'psychology-demo',
        patientDisplayName: 'Paciente Psicologia',
        identificationStatus: 'ready',
        contactStatus: 'ready',
        therapyConsentStatus: 'ready',
        messagingOptInStatus: 'ready',
        initialRiskReviewStatus: 'ready',
        presentingConcern: 'Ansiedad inicial',
      });
    const session = await new CreateTenantPsychologyClinicSessionUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
      patientId: patient.id,
      serviceName: 'Terapia individual',
      therapistId: 'therapist_001',
      therapistName: 'Dra. Lucia Mora',
      modality: 'teletherapy_review_required',
      startsAt: fixedNow,
    });
    await new TransitionTenantPsychologyClinicSessionUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
      sessionId: session.id,
      status: 'completed',
    });

    const notePacket =
      await new RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase(
        repository,
        idGenerator,
        () => fixedNow,
      ).execute({
        tenantSlug: 'psychology-demo',
        sessionId: session.id,
      });
    const profile = await new GetTenantPsychologyClinicProfileWorkspaceUseCase(
      repository,
      () => fixedNow,
    ).execute({ tenantSlug: 'psychology-demo' });
    const intake =
      await new GetTenantPsychologyClinicPatientIntakeWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo' });
    const scheduling =
      await new GetTenantPsychologyClinicSessionSchedulingWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo' });
    const closeout =
      await new GetTenantPsychologyClinicFoundationCloseoutUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo' });

    expect(profile.clinicProfile.tradeName).toBe('Psicologia Persistida');
    expect(intake.summary.readyPatientCount).toBe(1);
    expect(scheduling.summary.completedCount).toBe(1);
    expect(notePacket.review.requiresTherapistReview).toBe(true);
    expect(notePacket.review.mayBeSigned).toBe(false);
    expect(closeout.closeoutStatus).toBe('needs_review');
    expect(closeout.summary.blockedCheckCount).toBe(0);
    expect(closeout.recommendedNextSlice).toBe(
      'psychology-product-activation-ui',
    );
  });

  it('builds treatment, bridge, timeline and operations closeout packets', async () => {
    const repository = createInMemoryPsychologyClinicRepository();
    const idGenerator = {
      generate: jest.fn(
        () => `psychology_id_${idGenerator.generate.mock.calls.length}`,
      ),
    };
    const patient =
      await new RegisterTenantPsychologyClinicPatientIntakeUseCase(
        repository,
        idGenerator,
      ).execute({
        tenantSlug: 'psychology-demo',
        patientDisplayName: 'Paciente Operaciones',
        identificationStatus: 'ready',
        contactStatus: 'ready',
        therapyConsentStatus: 'ready',
        messagingOptInStatus: 'ready',
        initialRiskReviewStatus: 'ready',
        presentingConcern: 'Seguimiento terapeutico',
      });
    const session = await new CreateTenantPsychologyClinicSessionUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
      patientId: patient.id,
      serviceName: 'Terapia individual',
      therapistId: 'therapist_001',
      therapistName: 'Ps. Ana Morales',
      startsAt: fixedNow,
    });
    await new TransitionTenantPsychologyClinicSessionUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
      sessionId: session.id,
      status: 'completed',
    });
    await new RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
      sessionId: session.id,
    });

    const treatmentPlan =
      await new GetTenantPsychologyClinicTreatmentPlanWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo', patientId: patient.id });
    const followUp =
      await new GetTenantPsychologyClinicTreatmentFollowUpReadinessUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo', sessionId: session.id });
    const growthBridge =
      await new RequestTenantPsychologyClinicGrowthReminderBridgeUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo' });
    const billingBridge =
      await new RequestTenantPsychologyClinicBillingTaxBridgeUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo' });
    const timeline =
      await new GetTenantPsychologyClinicPatientTimelineWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo', patientId: patient.id });
    const operationsCloseout =
      await new GetTenantPsychologyClinicOperationsCloseoutUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo' });

    expect(treatmentPlan.summary.goalCount).toBe(2);
    expect(treatmentPlan.summary.taskCount).toBe(3);
    expect(followUp.suggestedFollowUp.recommendedWindow).toBe('24-72 horas');
    expect(growthBridge.handoff.growthProductKey).toBe('growth');
    expect(billingBridge.handoff.invoicingProductKey).toBe('invoicing');
    expect(billingBridge.summary.invoiceableItemCount).toBe(1);
    expect(timeline.summary.noteDraftCount).toBe(1);
    expect(operationsCloseout.productReadiness.timelineReady).toBe(true);
    expect(operationsCloseout.recommendedNextProduct).toBe(
      'psychology-records-hardening',
    );
  });

  it('builds records hardening, evidence, review, safety, privacy and closeout packets', async () => {
    const repository = createInMemoryPsychologyClinicRepository();
    const idGenerator = {
      generate: jest.fn(
        () => `psychology_id_${idGenerator.generate.mock.calls.length}`,
      ),
    };
    const patient =
      await new RegisterTenantPsychologyClinicPatientIntakeUseCase(
        repository,
        idGenerator,
      ).execute({
        tenantSlug: 'psychology-demo',
        patientDisplayName: 'Paciente Records',
        identificationStatus: 'ready',
        contactStatus: 'ready',
        therapyConsentStatus: 'ready',
        messagingOptInStatus: 'ready',
        initialRiskReviewStatus: 'ready',
        presentingConcern: 'Records longitudinales',
        emergencyContact: {
          displayName: 'Contacto Emergencia',
          phoneE164: '+593999999999',
        },
      });
    const session = await new CreateTenantPsychologyClinicSessionUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
      patientId: patient.id,
      serviceName: 'Terapia individual',
      therapistId: 'therapist_001',
      therapistName: 'Ps. Ana Morales',
      startsAt: fixedNow,
    });
    await new TransitionTenantPsychologyClinicSessionUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'psychology-demo',
      sessionId: session.id,
      status: 'completed',
    });
    await new RequestTenantPsychologyClinicSessionNoteDraftPacketUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({ tenantSlug: 'psychology-demo', sessionId: session.id });

    const records =
      await new GetTenantPsychologyClinicRecordsHardeningWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo', patientId: patient.id });
    const evidence =
      await new GetTenantPsychologyClinicClinicalEvidenceRegistryUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo', patientId: patient.id });
    const reviewLoop =
      await new RequestTenantPsychologyClinicSessionNoteReviewLoopUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo', sessionId: session.id });
    const safety =
      await new GetTenantPsychologyClinicRiskSafetyReviewWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo', patientId: patient.id });
    const privacy =
      await new GetTenantPsychologyClinicPrivacyConsentControlCenterUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo' });
    const closeout =
      await new GetTenantPsychologyClinicRecordsCloseoutV3UseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'psychology-demo' });

    expect(records.continuity.noteDraftCount).toBe(1);
    expect(evidence.summary.consentEvidenceCount).toBe(1);
    expect(reviewLoop.reviewPolicy.legalEhrRecord).toBe(false);
    expect(safety.escalation.automationAllowed).toBe(false);
    expect(privacy.summary.consentReadyCount).toBe(1);
    expect(closeout.recommendedNextProduct).toBe('psychology-ehr-discovery');
  });
});

function createInMemoryPsychologyClinicRepository() {
  const tenantId = 'tenant_psychology_demo';
  const profiles = new Map<string, any>();
  const patients = new Map<string, any[]>();
  const sessions = new Map<string, any[]>();
  const events = new Map<string, any[]>();

  return {
    async getTenantIdBySlug(tenantSlug: string) {
      return tenantSlug === 'psychology-demo' ? tenantId : null;
    },
    async getProfile(tenantSlug: string) {
      return profiles.get(tenantSlug) ?? null;
    },
    async upsertProfile(command: any) {
      profiles.set(command.tenantSlug, command.snapshot);
      return command.snapshot;
    },
    async listPatients(tenantSlug: string) {
      return patients.get(tenantSlug) ?? [];
    },
    async savePatient(command: any) {
      const now = fixedNow;
      const record = {
        id: command.id,
        tenantSlug: command.tenantSlug,
        patientDisplayName: command.patientDisplayName,
        identificationStatus: command.identificationStatus,
        contactStatus: command.contactStatus,
        therapyConsentStatus: command.therapyConsentStatus,
        messagingOptInStatus: command.messagingOptInStatus,
        initialRiskReviewStatus: command.initialRiskReviewStatus,
        presentingConcern: command.presentingConcern,
        contact: command.contact,
        emergencyContact: command.emergencyContact,
        blockers: command.blockers,
        createdAt: now,
        updatedAt: now,
      };
      patients.set(command.tenantSlug, [
        ...(patients.get(command.tenantSlug) ?? []),
        record,
      ]);
      return record;
    },
    async listSessions(tenantSlug: string) {
      return sessions.get(tenantSlug) ?? [];
    },
    async saveSession(command: any) {
      const patient = (patients.get(command.tenantSlug) ?? []).find(
        (item) => item.id === command.patientId,
      );
      const now = fixedNow;
      const record = {
        id: command.id,
        tenantSlug: command.tenantSlug,
        patientId: command.patientId,
        patientDisplayName: patient?.patientDisplayName ?? 'Paciente',
        serviceName: command.serviceName,
        therapistId: command.therapistId,
        therapistName: command.therapistName,
        modality: command.modality,
        startsAt: command.startsAt,
        status: command.status,
        reminderStatus: command.reminderStatus,
        billingStatus: command.billingStatus,
        blockers: command.blockers,
        createdAt: now,
        updatedAt: now,
      };
      sessions.set(command.tenantSlug, [
        ...(sessions.get(command.tenantSlug) ?? []),
        record,
      ]);
      return record;
    },
    async transitionSession(command: any) {
      const tenantSessions = sessions.get(command.tenantSlug) ?? [];
      const session = tenantSessions.find(
        (item) => item.id === command.sessionId,
      );
      if (!session) {
        return null;
      }
      session.status = command.status;
      session.blockers = command.blockers ?? session.blockers;
      session.updatedAt = fixedNow;
      return session;
    },
    async recordEvent(command: any) {
      const record = {
        id: command.id,
        tenantSlug: command.tenantSlug,
        sessionId: command.sessionId,
        eventType: command.eventType,
        source: command.source,
        status: command.status,
        payload: command.payload,
        occurredAt: command.occurredAt,
        createdAt: command.occurredAt,
      };
      events.set(command.tenantSlug, [
        ...(events.get(command.tenantSlug) ?? []),
        record,
      ]);
      return record;
    },
    async listEvents(tenantSlug: string) {
      return events.get(tenantSlug) ?? [];
    },
  };
}
