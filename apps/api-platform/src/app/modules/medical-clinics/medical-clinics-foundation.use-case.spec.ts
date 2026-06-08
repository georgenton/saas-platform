import {
  CreateTenantMedicalClinicAppointmentUseCase,
  GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
  GetTenantMedicalClinicCarePlanTaskWorkspaceUseCase,
  GetTenantMedicalClinicClinicalEvidenceRegistryUseCase,
  GetTenantMedicalClinicEncounterWorkspaceUseCase,
  GetTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase,
  GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
  GetTenantMedicalClinicProductCloseoutUseCase,
  GetTenantMedicalClinicProductAnchorUseCase,
  GetTenantMedicalClinicProfileWorkspaceUseCase,
  GetTenantMedicalClinicTreatmentFollowUpReadinessUseCase,
  RegisterTenantMedicalClinicPatientIntakeUseCase,
  RequestTenantMedicalClinicBillingTaxBridgeUseCase,
  RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase,
  RequestTenantMedicalClinicClinicalNoteDraftPacketUseCase,
  RequestTenantMedicalClinicEncounterCloseoutUseCase,
  RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
  RequestTenantMedicalClinicMedicalHistoryDraftRecordUseCase,
  RequestTenantMedicalClinicOrdersReferralReadinessPacketUseCase,
  RequestTenantMedicalClinicPrescriptionReadinessPacketUseCase,
  RequestTenantMedicalClinicRecordsCloseoutUseCase,
  UpsertTenantMedicalClinicProfileWorkspaceUseCase,
} from '@saas-platform/medical-clinics-application';

const fixedNow = new Date('2026-06-07T12:00:00.000Z');

describe('Medical Clinics foundation use cases', () => {
  it('anchors the product with modules, lanes and guardrails', async () => {
    const view = await new GetTenantMedicalClinicProductAnchorUseCase(
      () => fixedNow,
    ).execute({
      tenantSlug: 'clinic-demo',
    });

    expect(view.productKey).toBe('medical-clinics');
    expect(view.modules).toHaveLength(5);
    expect(view.summary.coreModuleCount).toBe(3);
    expect(view.lanes.map((item) => item.laneKey)).toEqual([
      'clinic_profile',
      'patient_intake',
      'appointments',
      'growth_reminders',
      'billing_tax',
    ]);
    expect(view.guardrails.join(' ')).toContain('no emite facturas');
  });

  it('exposes clinic profile and service catalog readiness', async () => {
    const workspace = await new GetTenantMedicalClinicProfileWorkspaceUseCase(
      undefined,
      () => fixedNow,
    ).execute({
      tenantSlug: 'clinic-demo',
    });

    expect(workspace.workspaceStatus).toBe('needs_review');
    expect(workspace.careLocations[0]?.roomCount).toBe(3);
    expect(workspace.professionals).toHaveLength(2);
    expect(workspace.serviceCatalog.map((item) => item.billingMode)).toContain(
      'invoiceable_service',
    );
  });

  it('keeps patient intake blocked until consent is complete', async () => {
    const workspace =
      await new GetTenantMedicalClinicPatientIntakeWorkspaceUseCase(
        undefined,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
      });

    expect(workspace.workspaceStatus).toBe('blocked');
    expect(workspace.summary.patientCount).toBe(3);
    expect(workspace.summary.pendingConsentCount).toBe(2);
    expect(workspace.blockers[0]).toContain('Consentimiento');
  });

  it('summarizes appointment scheduling with reminder and billing readiness', async () => {
    const workspace =
      await new GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase(
        undefined,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
      });

    expect(workspace.summary.appointmentCount).toBe(3);
    expect(workspace.summary.confirmedCount).toBe(1);
    expect(workspace.summary.needsReminderCount).toBe(3);
    expect(workspace.availability[0]?.availableSlotCount).toBeGreaterThan(0);
  });

  it('builds a Growth reminder bridge without sending messages', async () => {
    const bridge =
      await new RequestTenantMedicalClinicGrowthReminderBridgeUseCase(
        undefined,
        undefined,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
      });

    expect(bridge.channel).toBe('whatsapp');
    expect(bridge.handoff.growthProductKey).toBe('growth');
    expect(bridge.handoff.requiresHumanReview).toBe(true);
    expect(bridge.guardrails.join(' ')).toContain('No envia mensajes');
  });

  it('builds a billing and tax bridge without issuing invoices', async () => {
    const bridge = await new RequestTenantMedicalClinicBillingTaxBridgeUseCase(
      undefined,
      undefined,
      () => fixedNow,
    ).execute({
      tenantSlug: 'clinic-demo',
    });

    expect(bridge.bridgeStatus).toBe('blocked');
    expect(bridge.handoff.invoicingProductKey).toBe('invoicing');
    expect(bridge.handoff.taxComplianceProductKey).toBe('tax-compliance-ec');
    expect(bridge.summary.invoiceableItemCount).toBe(2);
    expect(bridge.guardrails.join(' ')).toContain(
      'no emite comprobantes electronicos',
    );
  });

  it('uses persisted profile, patient and appointment operations when a repository is provided', async () => {
    const repository: any = createInMemoryMedicalClinicRepository();
    const idGenerator = {
      generate: jest.fn(() => `id_${idGenerator.generate.mock.calls.length}`),
    };

    await new UpsertTenantMedicalClinicProfileWorkspaceUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'clinic-demo',
      snapshot: {
        workspaceStatus: 'ready',
        blockers: [],
        clinicProfile: {
          legalName: 'Clinica Persistida S.A.S.',
          tradeName: 'Clinica Persistida',
          rucStatus: 'linked',
          operatingMode: 'single_location',
        },
      },
    });
    const patient = await new RegisterTenantMedicalClinicPatientIntakeUseCase(
      repository,
      idGenerator,
    ).execute({
      tenantSlug: 'clinic-demo',
      patientDisplayName: 'Paciente Persistido',
      identificationStatus: 'ready',
      contactStatus: 'ready',
      consentStatus: 'ready',
      messagingOptInStatus: 'ready',
      triageReason: 'Consulta general',
    });
    await new CreateTenantMedicalClinicAppointmentUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'clinic-demo',
      patientId: patient.id,
      serviceName: 'Consulta general',
      professionalId: 'professional_general_001',
      professionalName: 'Dra. Ana Paredes',
      startsAt: fixedNow,
      amountInCents: 3500,
      currency: 'USD',
    });

    const profile = await new GetTenantMedicalClinicProfileWorkspaceUseCase(
      repository,
      () => fixedNow,
    ).execute({ tenantSlug: 'clinic-demo' });
    const intake =
      await new GetTenantMedicalClinicPatientIntakeWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'clinic-demo' });
    const appointments =
      await new GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({ tenantSlug: 'clinic-demo' });

    expect(profile.clinicProfile.tradeName).toBe('Clinica Persistida');
    expect(intake.summary.patientCount).toBe(1);
    expect(intake.summary.readyPatientCount).toBe(1);
    expect(appointments.summary.appointmentCount).toBe(1);
    expect(appointments.appointments[0]?.patientDisplayName).toBe(
      'Paciente Persistido',
    );
  });

  it('builds clinical encounter packets with professional-review boundaries', async () => {
    const repository: any = createInMemoryMedicalClinicRepository();
    const idGenerator = {
      generate: jest.fn(() => `id_${idGenerator.generate.mock.calls.length}`),
    };
    const patient = await new RegisterTenantMedicalClinicPatientIntakeUseCase(
      repository,
      idGenerator,
    ).execute({
      tenantSlug: 'clinic-demo',
      patientDisplayName: 'Paciente Clinico',
      identificationStatus: 'ready',
      contactStatus: 'ready',
      consentStatus: 'ready',
      messagingOptInStatus: 'ready',
      triageReason: 'Consulta general',
    });
    const appointment = await new CreateTenantMedicalClinicAppointmentUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'clinic-demo',
      patientId: patient.id,
      serviceName: 'Consulta general',
      professionalId: 'professional_general_001',
      professionalName: 'Dra. Ana Paredes',
      startsAt: fixedNow,
      amountInCents: 3500,
      currency: 'USD',
    });

    const encounter = await new GetTenantMedicalClinicEncounterWorkspaceUseCase(
      repository,
      () => fixedNow,
    ).execute({
      tenantSlug: 'clinic-demo',
      appointmentId: appointment.id,
    });
    const note =
      await new RequestTenantMedicalClinicClinicalNoteDraftPacketUseCase(
        repository,
        idGenerator,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
        appointmentId: appointment.id,
      });
    const followUp =
      await new GetTenantMedicalClinicTreatmentFollowUpReadinessUseCase(
        repository,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
        appointmentId: appointment.id,
      });
    const prescription =
      await new RequestTenantMedicalClinicPrescriptionReadinessPacketUseCase(
        repository,
        idGenerator,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
        appointmentId: appointment.id,
      });
    const closeout =
      await new RequestTenantMedicalClinicEncounterCloseoutUseCase(
        repository,
        idGenerator,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
        appointmentId: appointment.id,
      });
    const boundary =
      await new RequestTenantMedicalClinicClinicalBoundaryCloseoutUseCase(
        () => fixedNow,
      ).execute({ tenantSlug: 'clinic-demo' });

    expect(encounter.appointment.patientDisplayName).toBe('Paciente Clinico');
    expect(note.review.requiresProfessionalReview).toBe(true);
    expect(note.review.mayBeSigned).toBe(false);
    expect(followUp.suggestedFollowUp.recommendedWindow).toBe('7-30 days');
    expect(prescription.approval.officialPrescriptionIssued).toBe(false);
    expect(closeout.summary.checkCount).toBe(5);
    expect(boundary.explicitlyExcludedCapabilities).toContain(
      'diagnostico automatico',
    );
    expect(repository.recordEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'clinical_note_draft_packet_requested',
      }),
    );
  });

  it('builds patient records workspaces without creating a legal EHR', async () => {
    const repository: any = createInMemoryMedicalClinicRepository();
    const idGenerator = {
      generate: jest.fn(() => `id_${idGenerator.generate.mock.calls.length}`),
    };
    const patient = await new RegisterTenantMedicalClinicPatientIntakeUseCase(
      repository,
      idGenerator,
    ).execute({
      tenantSlug: 'clinic-demo',
      patientDisplayName: 'Paciente Longitudinal',
      identificationStatus: 'ready',
      contactStatus: 'ready',
      consentStatus: 'ready',
      messagingOptInStatus: 'ready',
      triageReason: 'Control general',
    });
    const appointment = await new CreateTenantMedicalClinicAppointmentUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'clinic-demo',
      patientId: patient.id,
      serviceName: 'Control general',
      professionalId: 'professional_general_001',
      professionalName: 'Dra. Ana Paredes',
      startsAt: fixedNow,
      amountInCents: 3500,
      currency: 'USD',
    });
    appointment.status = 'completed';
    appointment.billingStatus = 'ready';

    const history =
      await new RequestTenantMedicalClinicMedicalHistoryDraftRecordUseCase(
        repository,
        idGenerator,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
        patientId: patient.id,
      });
    const orders =
      await new RequestTenantMedicalClinicOrdersReferralReadinessPacketUseCase(
        repository,
        idGenerator,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
        appointmentId: appointment.id,
      });
    const timeline =
      await new GetTenantMedicalClinicPatientClinicalTimelineWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
        patientId: patient.id,
      });
    const evidence =
      await new GetTenantMedicalClinicClinicalEvidenceRegistryUseCase(
        repository,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
        patientId: patient.id,
      });
    const carePlan =
      await new GetTenantMedicalClinicCarePlanTaskWorkspaceUseCase(
        repository,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
        patientId: patient.id,
      });
    const closeout = await new RequestTenantMedicalClinicRecordsCloseoutUseCase(
      repository,
      idGenerator,
      () => fixedNow,
    ).execute({
      tenantSlug: 'clinic-demo',
      patientId: patient.id,
    });
    const productCloseout =
      await new GetTenantMedicalClinicProductCloseoutUseCase(
        repository,
        () => fixedNow,
      ).execute({
        tenantSlug: 'clinic-demo',
      });

    expect(history.provenance.mayBecomeLegalRecord).toBe(false);
    expect(orders.professionalApproval.officialDocumentIssued).toBe(false);
    expect(timeline.summary.appointmentCount).toBe(1);
    expect(timeline.summary.clinicalEventCount).toBeGreaterThanOrEqual(2);
    expect(evidence.summary.evidenceCount).toBeGreaterThanOrEqual(2);
    expect(carePlan.summary.taskCount).toBe(4);
    expect(closeout.summary.checkCount).toBe(7);
    expect(closeout.summary.blockedCheckCount).toBe(0);
    expect(closeout.guardrails.join(' ')).toContain(
      'no son historia clinica legal firmada',
    );
    expect(productCloseout.productReadiness.recordsReady).toBe(true);
    expect(productCloseout.recommendedNextProduct).toBe(
      'psychology-clinics-foundation',
    );
    expect(repository.recordEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'records_closeout_requested',
      }),
    );
  });
});

function createInMemoryMedicalClinicRepository() {
  const state: any = {
    profile: null,
    patients: [],
    appointments: [],
    events: [],
  };

  return {
    getTenantIdBySlug: jest.fn(async () => 'tenant_001'),
    getProfile: jest.fn(async () => state.profile),
    upsertProfile: jest.fn(async (command) => {
      state.profile = command.snapshot;
      return state.profile;
    }),
    listPatients: jest.fn(async () => state.patients),
    savePatient: jest.fn(async (command) => {
      const patient = {
        ...command,
        createdAt: fixedNow,
        updatedAt: fixedNow,
      };
      state.patients.push(patient);
      return patient;
    }),
    listAppointments: jest.fn(async () => state.appointments),
    saveAppointment: jest.fn(async (command) => {
      const patient = state.patients.find(
        (item) => item.id === command.patientId,
      );
      const appointment = {
        ...command,
        patientDisplayName: patient?.patientDisplayName ?? 'Paciente',
        createdAt: fixedNow,
        updatedAt: fixedNow,
      };
      state.appointments.push(appointment);
      return appointment;
    }),
    transitionAppointment: jest.fn(async () => null),
    recordEvent: jest.fn(async (command) => {
      const event = {
        ...command,
        createdAt: fixedNow,
      };
      state.events.push(event);
      return event;
    }),
    listEvents: jest.fn(async () => state.events),
  };
}
