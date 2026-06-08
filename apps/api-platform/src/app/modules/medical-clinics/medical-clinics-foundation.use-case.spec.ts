import {
  GetTenantMedicalClinicAppointmentSchedulingWorkspaceUseCase,
  GetTenantMedicalClinicPatientIntakeWorkspaceUseCase,
  GetTenantMedicalClinicProductAnchorUseCase,
  GetTenantMedicalClinicProfileWorkspaceUseCase,
  RequestTenantMedicalClinicBillingTaxBridgeUseCase,
  RequestTenantMedicalClinicGrowthReminderBridgeUseCase,
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
});
