import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  createPsychologyClinicSession,
  fetchPsychologyClinicAssessmentScaleRegistry,
  fetchPsychologyClinicBoundaryComplianceCloseout,
  fetchPsychologyClinicClinicalAdminHardeningWorkspace,
  fetchPsychologyClinicClinicalEvidenceRegistry,
  fetchPsychologyClinicCloseoutV4,
  fetchPsychologyClinicCloseoutV5,
  fetchPsychologyClinicCommandCenterV60,
  fetchPsychologyClinicCrossProductHandoffCenterV60,
  fetchPsychologyClinicEhrDiscoveryWorkspace,
  fetchPsychologyClinicEhrIntegrationEvaluation,
  fetchPsychologyClinicExternalDocumentHandoffContracts,
  fetchPsychologyClinicFoundationCloseout,
  fetchPsychologyClinicFormalRecordSignatureReadiness,
  fetchPsychologyClinicOperationsCloseout,
  fetchPsychologyClinicOutcomesReviewWorkspace,
  fetchPsychologyClinicPatientIntakeWorkspace,
  fetchPsychologyClinicPatientPrivacyRiskQueueV60,
  fetchPsychologyClinicPatientTimelineWorkspace,
  fetchPsychologyClinicPrivacyConsentControlCenter,
  fetchPsychologyClinicProductAnchor,
  fetchPsychologyClinicProductReadinessReport,
  fetchPsychologyClinicProfileWorkspace,
  fetchPsychologyClinicRecordsCloseoutV3,
  fetchPsychologyClinicRecordsHardeningWorkspace,
  fetchPsychologyClinicRiskSafetyReviewWorkspace,
  fetchPsychologyClinicSessionSchedulingWorkspace,
  fetchPsychologyClinicSessionTreatmentQueueV60,
  fetchPsychologyClinicTreatmentFollowUpReadiness,
  fetchPsychologyClinicTreatmentPlanWorkspace,
  fetchPsychologyClinicTherapistReviewWorkQueue,
  fetchPsychologyClinicOperatingCloseoutV60,
  registerPsychologyClinicPatientIntake,
  requestPsychologyClinicBillingTaxBridge,
  requestPsychologyClinicGrowthReminderBridge,
  requestPsychologyClinicSessionNoteDraftPacket,
  requestPsychologyClinicSessionNoteReviewLoop,
  transitionPsychologyClinicSession,
} from './api';
import styles from './app.module.css';
import {
  PsychologyClinicBillingTaxBridgeResponse,
  PsychologyClinicAssessmentScaleRegistryResponse,
  PsychologyClinicBoundaryComplianceCloseoutResponse,
  PsychologyClinicClinicalAdminHardeningWorkspaceResponse,
  PsychologyClinicClinicalEvidenceRegistryResponse,
  PsychologyClinicCloseoutV4Response,
  PsychologyClinicCloseoutV5Response,
  PsychologyClinicCommandCenterV60Response,
  PsychologyClinicCrossProductHandoffCenterV60Response,
  PsychologyClinicEhrDiscoveryWorkspaceResponse,
  PsychologyClinicEhrIntegrationEvaluationResponse,
  PsychologyClinicExternalDocumentHandoffContractsResponse,
  PsychologyClinicFoundationCloseoutResponse,
  PsychologyClinicFormalRecordSignatureReadinessResponse,
  PsychologyClinicGrowthReminderBridgeResponse,
  PsychologyClinicOperationsCloseoutResponse,
  PsychologyClinicOutcomesReviewWorkspaceResponse,
  PsychologyClinicPatientIntakeWorkspaceResponse,
  PsychologyClinicPatientPrivacyRiskQueueV60Response,
  PsychologyClinicPatientTimelineWorkspaceResponse,
  PsychologyClinicPrivacyConsentControlCenterResponse,
  PsychologyClinicProductAnchorResponse,
  PsychologyClinicProductReadinessReportResponse,
  PsychologyClinicProfileWorkspaceResponse,
  PsychologyClinicRecordsCloseoutV3Response,
  PsychologyClinicRecordsHardeningWorkspaceResponse,
  PsychologyClinicRiskSafetyReviewWorkspaceResponse,
  PsychologyClinicSessionNoteDraftPacketResponse,
  PsychologyClinicSessionNoteReviewLoopResponse,
  PsychologyClinicSessionRecordResponse,
  PsychologyClinicSessionSchedulingWorkspaceResponse,
  PsychologyClinicSessionTreatmentQueueV60Response,
  PsychologyClinicTreatmentFollowUpReadinessResponse,
  PsychologyClinicTreatmentPlanWorkspaceResponse,
  PsychologyClinicTherapistReviewWorkQueueResponse,
  PsychologyClinicOperatingCloseoutV60Response,
} from './types';

type PsychologyClinicsSectionProps = {
  token: string | null;
  tenantSlug: string | null;
  formatDate: (value: string) => string;
  humanizeKey: (value: string) => string;
};

type PsychologySurface = {
  anchor: PsychologyClinicProductAnchorResponse | null;
  foundationCloseout: PsychologyClinicFoundationCloseoutResponse | null;
  operationsCloseout: PsychologyClinicOperationsCloseoutResponse | null;
  profile: PsychologyClinicProfileWorkspaceResponse | null;
  intake: PsychologyClinicPatientIntakeWorkspaceResponse | null;
  scheduling: PsychologyClinicSessionSchedulingWorkspaceResponse | null;
  growthBridge: PsychologyClinicGrowthReminderBridgeResponse | null;
  billingBridge: PsychologyClinicBillingTaxBridgeResponse | null;
};

type PatientSurface = {
  treatmentPlan: PsychologyClinicTreatmentPlanWorkspaceResponse | null;
  timeline: PsychologyClinicPatientTimelineWorkspaceResponse | null;
};

type SessionSurface = {
  note: PsychologyClinicSessionNoteDraftPacketResponse | null;
  followUp: PsychologyClinicTreatmentFollowUpReadinessResponse | null;
  reviewLoop: PsychologyClinicSessionNoteReviewLoopResponse | null;
};

type RecordsSurface = {
  hardening: PsychologyClinicRecordsHardeningWorkspaceResponse | null;
  evidence: PsychologyClinicClinicalEvidenceRegistryResponse | null;
  safety: PsychologyClinicRiskSafetyReviewWorkspaceResponse | null;
  privacy: PsychologyClinicPrivacyConsentControlCenterResponse | null;
  closeout: PsychologyClinicRecordsCloseoutV3Response | null;
};

type EhrReadinessSurface = {
  discovery: PsychologyClinicEhrDiscoveryWorkspaceResponse | null;
  signature: PsychologyClinicFormalRecordSignatureReadinessResponse | null;
  outcomes: PsychologyClinicOutcomesReviewWorkspaceResponse | null;
  assessments: PsychologyClinicAssessmentScaleRegistryResponse | null;
  handoff: PsychologyClinicExternalDocumentHandoffContractsResponse | null;
  closeout: PsychologyClinicCloseoutV4Response | null;
};

type ProductCloseoutSurface = {
  evaluation: PsychologyClinicEhrIntegrationEvaluationResponse | null;
  admin: PsychologyClinicClinicalAdminHardeningWorkspaceResponse | null;
  queue: PsychologyClinicTherapistReviewWorkQueueResponse | null;
  report: PsychologyClinicProductReadinessReportResponse | null;
  boundary: PsychologyClinicBoundaryComplianceCloseoutResponse | null;
  closeout: PsychologyClinicCloseoutV5Response | null;
};

type OperatingSurfaceV60 = {
  commandCenter: PsychologyClinicCommandCenterV60Response | null;
  privacyRiskQueue: PsychologyClinicPatientPrivacyRiskQueueV60Response | null;
  sessionTreatmentQueue: PsychologyClinicSessionTreatmentQueueV60Response | null;
  handoffCenter: PsychologyClinicCrossProductHandoffCenterV60Response | null;
  closeout: PsychologyClinicOperatingCloseoutV60Response | null;
};

const emptySurface: PsychologySurface = {
  anchor: null,
  foundationCloseout: null,
  operationsCloseout: null,
  profile: null,
  intake: null,
  scheduling: null,
  growthBridge: null,
  billingBridge: null,
};

const emptyOperatingSurfaceV60: OperatingSurfaceV60 = {
  commandCenter: null,
  privacyRiskQueue: null,
  sessionTreatmentQueue: null,
  handoffCenter: null,
  closeout: null,
};

export function PsychologyClinicsSection({
  token,
  tenantSlug,
  formatDate,
  humanizeKey,
}: PsychologyClinicsSectionProps) {
  const [surface, setSurface] = useState<PsychologySurface>(emptySurface);
  const [patientSurface, setPatientSurface] = useState<PatientSurface>({
    treatmentPlan: null,
    timeline: null,
  });
  const [sessionSurface, setSessionSurface] = useState<SessionSurface>({
    note: null,
    followUp: null,
    reviewLoop: null,
  });
  const [recordsSurface, setRecordsSurface] = useState<RecordsSurface>({
    hardening: null,
    evidence: null,
    safety: null,
    privacy: null,
    closeout: null,
  });
  const [ehrSurface, setEhrSurface] = useState<EhrReadinessSurface>({
    discovery: null,
    signature: null,
    outcomes: null,
    assessments: null,
    handoff: null,
    closeout: null,
  });
  const [productCloseoutSurface, setProductCloseoutSurface] =
    useState<ProductCloseoutSurface>({
      evaluation: null,
      admin: null,
      queue: null,
      report: null,
      boundary: null,
      closeout: null,
    });
  const [operatingSurfaceV60, setOperatingSurfaceV60] =
    useState<OperatingSurfaceV60>(emptyOperatingSurfaceV60);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [patientName, setPatientName] = useState('Paciente Psicologia');
  const [presentingConcern, setPresentingConcern] =
    useState('Ansiedad inicial');
  const [serviceName, setServiceName] = useState('Terapia individual');
  const [therapistName, setTherapistName] = useState('Ps. Ana Morales');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const patients = surface.intake?.intakeQueue ?? [];
  const sessions = surface.scheduling?.sessions ?? [];
  const activePatientId = selectedPatientId || patients[0]?.id || '';
  const activeSessionId = selectedSessionId || sessions[0]?.id || '';

  const readinessMetrics = useMemo(
    () => [
      {
        label: 'Patients',
        value:
          surface.operationsCloseout?.summary.patientCount ?? patients.length,
      },
      {
        label: 'Sessions',
        value:
          surface.operationsCloseout?.summary.sessionCount ?? sessions.length,
      },
      {
        label: 'Events',
        value: surface.operationsCloseout?.summary.operationalEventCount ?? 0,
      },
      {
        label: 'Blockers',
        value: surface.operationsCloseout?.summary.blockerCount ?? 0,
      },
      {
        label: 'Operating 6.0',
        value:
          operatingSurfaceV60.closeout?.summary.readyChecklistCount ??
          operatingSurfaceV60.commandCenter?.summary.readyTileCount ??
          0,
      },
    ],
    [
      operatingSurfaceV60.closeout,
      operatingSurfaceV60.commandCenter,
      patients.length,
      sessions.length,
      surface.operationsCloseout,
    ],
  );

  useEffect(() => {
    if (!token || !tenantSlug) {
      setSurface(emptySurface);
      setOperatingSurfaceV60(emptyOperatingSurfaceV60);
      return;
    }

    void refreshSurface();
  }, [token, tenantSlug]);

  async function refreshSurface() {
    if (!token || !tenantSlug) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [
        anchor,
        foundationCloseout,
        operationsCloseout,
        profile,
        intake,
        scheduling,
        commandCenter,
        privacyRiskQueue,
        sessionTreatmentQueue,
        handoffCenter,
        operatingCloseout,
      ] = await Promise.all([
        fetchPsychologyClinicProductAnchor(token, tenantSlug),
        fetchPsychologyClinicFoundationCloseout(token, tenantSlug),
        fetchPsychologyClinicOperationsCloseout(token, tenantSlug),
        fetchPsychologyClinicProfileWorkspace(token, tenantSlug),
        fetchPsychologyClinicPatientIntakeWorkspace(token, tenantSlug),
        fetchPsychologyClinicSessionSchedulingWorkspace(token, tenantSlug),
        fetchPsychologyClinicCommandCenterV60(token, tenantSlug),
        fetchPsychologyClinicPatientPrivacyRiskQueueV60(token, tenantSlug),
        fetchPsychologyClinicSessionTreatmentQueueV60(token, tenantSlug),
        fetchPsychologyClinicCrossProductHandoffCenterV60(token, tenantSlug),
        fetchPsychologyClinicOperatingCloseoutV60(token, tenantSlug),
      ]);

      setSurface((current) => ({
        ...current,
        anchor,
        foundationCloseout,
        operationsCloseout,
        profile,
        intake,
        scheduling,
      }));
      setOperatingSurfaceV60({
        commandCenter,
        privacyRiskQueue,
        sessionTreatmentQueue,
        handoffCenter,
        closeout: operatingCloseout,
      });
      setSelectedPatientId(
        (current) => current || intake.intakeQueue[0]?.id || '',
      );
      setSelectedSessionId(
        (current) => current || scheduling.sessions[0]?.id || '',
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No se pudo cargar Psychology Clinics.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegisterPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !tenantSlug) {
      return;
    }

    setActionLoading('register-patient');
    setError(null);
    try {
      const patient = await registerPsychologyClinicPatientIntake(
        token,
        tenantSlug,
        {
          patientDisplayName: patientName,
          identificationStatus: 'ready',
          contactStatus: 'ready',
          therapyConsentStatus: 'ready',
          messagingOptInStatus: 'ready',
          initialRiskReviewStatus: 'ready',
          presentingConcern,
        },
      );
      setSelectedPatientId(patient.id);
      setMessage(`Paciente registrado: ${patient.patientDisplayName}`);
      await refreshSurface();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !tenantSlug || !activePatientId) {
      return;
    }

    setActionLoading('create-session');
    setError(null);
    try {
      const startsAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const session = await createPsychologyClinicSession(token, tenantSlug, {
        patientId: activePatientId,
        serviceName,
        therapistId: 'therapist_demo_001',
        therapistName,
        modality: 'teletherapy_review_required',
        startsAt,
      });
      setSelectedSessionId(session.id);
      setMessage(`Sesion creada: ${session.serviceName}`);
      await refreshSurface();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function completeSelectedSession() {
    if (!token || !tenantSlug || !activeSessionId) {
      return;
    }

    setActionLoading('complete-session');
    setError(null);
    try {
      const session: PsychologyClinicSessionRecordResponse =
        await transitionPsychologyClinicSession(
          token,
          tenantSlug,
          activeSessionId,
          {
            status: 'completed',
            blockers: [],
          },
        );
      setMessage(`Sesion completada: ${session.id}`);
      await refreshSurface();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function loadSessionPackets() {
    if (!token || !tenantSlug || !activeSessionId) {
      return;
    }

    setActionLoading('session-packets');
    setError(null);
    try {
      const [note, followUp, reviewLoop] = await Promise.all([
        requestPsychologyClinicSessionNoteDraftPacket(
          token,
          tenantSlug,
          activeSessionId,
        ),
        fetchPsychologyClinicTreatmentFollowUpReadiness(
          token,
          tenantSlug,
          activeSessionId,
        ),
        requestPsychologyClinicSessionNoteReviewLoop(
          token,
          tenantSlug,
          activeSessionId,
        ),
      ]);
      setSessionSurface({ note, followUp, reviewLoop });
      setMessage('Packets de sesion cargados.');
      await refreshSurface();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function loadPatientPackets() {
    if (!token || !tenantSlug || !activePatientId) {
      return;
    }

    setActionLoading('patient-packets');
    setError(null);
    try {
      const [treatmentPlan, timeline] = await Promise.all([
        fetchPsychologyClinicTreatmentPlanWorkspace(
          token,
          tenantSlug,
          activePatientId,
        ),
        fetchPsychologyClinicPatientTimelineWorkspace(
          token,
          tenantSlug,
          activePatientId,
        ),
      ]);
      setPatientSurface({ treatmentPlan, timeline });
      setMessage('Treatment plan y timeline cargados.');
      await refreshSurface();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function loadBridgePackets() {
    if (!token || !tenantSlug) {
      return;
    }

    setActionLoading('bridge-packets');
    setError(null);
    try {
      const [growthBridge, billingBridge] = await Promise.all([
        requestPsychologyClinicGrowthReminderBridge(token, tenantSlug),
        requestPsychologyClinicBillingTaxBridge(token, tenantSlug),
      ]);
      setSurface((current) => ({ ...current, growthBridge, billingBridge }));
      setMessage('Bridge packets cargados.');
      await refreshSurface();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function loadRecordsPackets() {
    if (!token || !tenantSlug || !activePatientId) {
      return;
    }

    setActionLoading('records-packets');
    setError(null);
    try {
      const [hardening, evidence, safety, privacy, closeout] =
        await Promise.all([
          fetchPsychologyClinicRecordsHardeningWorkspace(
            token,
            tenantSlug,
            activePatientId,
          ),
          fetchPsychologyClinicClinicalEvidenceRegistry(
            token,
            tenantSlug,
            activePatientId,
          ),
          fetchPsychologyClinicRiskSafetyReviewWorkspace(
            token,
            tenantSlug,
            activePatientId,
          ),
          fetchPsychologyClinicPrivacyConsentControlCenter(token, tenantSlug),
          fetchPsychologyClinicRecordsCloseoutV3(token, tenantSlug),
        ]);
      setRecordsSurface({ hardening, evidence, safety, privacy, closeout });
      setMessage('Records 3.0 cargados.');
      await refreshSurface();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function loadEhrReadinessPackets() {
    if (!token || !tenantSlug || !activePatientId) {
      return;
    }

    setActionLoading('ehr-readiness-packets');
    setError(null);
    try {
      const [discovery, signature, outcomes, assessments, handoff, closeout] =
        await Promise.all([
          fetchPsychologyClinicEhrDiscoveryWorkspace(token, tenantSlug),
          fetchPsychologyClinicFormalRecordSignatureReadiness(
            token,
            tenantSlug,
          ),
          fetchPsychologyClinicOutcomesReviewWorkspace(
            token,
            tenantSlug,
            activePatientId,
          ),
          fetchPsychologyClinicAssessmentScaleRegistry(
            token,
            tenantSlug,
            activePatientId,
          ),
          fetchPsychologyClinicExternalDocumentHandoffContracts(
            token,
            tenantSlug,
          ),
          fetchPsychologyClinicCloseoutV4(token, tenantSlug),
        ]);
      setEhrSurface({
        discovery,
        signature,
        outcomes,
        assessments,
        handoff,
        closeout,
      });
      setMessage('EHR readiness cargado.');
      await refreshSurface();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function loadProductCloseoutPackets() {
    if (!token || !tenantSlug) {
      return;
    }

    setActionLoading('product-closeout-packets');
    setError(null);
    try {
      const [evaluation, admin, queue, report, boundary, closeout] =
        await Promise.all([
          fetchPsychologyClinicEhrIntegrationEvaluation(token, tenantSlug),
          fetchPsychologyClinicClinicalAdminHardeningWorkspace(
            token,
            tenantSlug,
          ),
          fetchPsychologyClinicTherapistReviewWorkQueue(token, tenantSlug),
          fetchPsychologyClinicProductReadinessReport(token, tenantSlug),
          fetchPsychologyClinicBoundaryComplianceCloseout(token, tenantSlug),
          fetchPsychologyClinicCloseoutV5(token, tenantSlug),
        ]);
      setProductCloseoutSurface({
        evaluation,
        admin,
        queue,
        report,
        boundary,
        closeout,
      });
      setMessage('Closeout 5.0 cargado.');
      await refreshSurface();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
      );
    } finally {
      setActionLoading(null);
    }
  }

  if (!token || !tenantSlug) {
    return (
      <section className={styles.adminPanel}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Psychology Clinics</span>
            <h2>Command center</h2>
          </div>
        </div>
        <div className={styles.emptyState}>
          <p>Selecciona un tenant para operar Psychology Clinics.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.adminPanel}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>Psychology Clinics</span>
          <h2>Command center</h2>
        </div>
        <button
          className={styles.secondaryButton}
          disabled={loading}
          onClick={() => void refreshSurface()}
          type="button"
        >
          {loading ? 'Cargando...' : 'Refrescar'}
        </button>
      </div>

      {error ? <p className={styles.errorBanner}>{error}</p> : null}
      {message ? <p className={styles.successBanner}>{message}</p> : null}

      <div className={styles.commercialMetricsGrid}>
        {readinessMetrics.map((metric) => (
          <div className={styles.commercialCard} key={metric.label}>
            <span className={styles.muted}>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>

      <div className={styles.panel}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Operating hardening 6.0</span>
            <h3>
              {humanizeKey(
                operatingSurfaceV60.closeout?.recommendedNextProduct ??
                  'psychology_clinics_operational_pilot',
              )}
            </h3>
          </div>
          <StatusPill
            status={operatingSurfaceV60.closeout?.closeoutStatus ?? 'blocked'}
          />
        </div>
        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Command tiles</span>
            <strong>
              {operatingSurfaceV60.commandCenter?.summary.readyTileCount ?? 0}/
              {operatingSurfaceV60.commandCenter?.summary.tileCount ?? 0}
            </strong>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Privacy/risk actions</span>
            <strong>
              {operatingSurfaceV60.closeout?.summary.patientActionCount ?? 0}
            </strong>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Session actions</span>
            <strong>
              {operatingSurfaceV60.closeout?.summary.sessionActionCount ?? 0}
            </strong>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Handoff lanes</span>
            <strong>
              {operatingSurfaceV60.handoffCenter?.summary.laneCount ?? 0}
            </strong>
          </div>
        </div>
        <div className={styles.contentGrid}>
          <div className={styles.stack}>
            {(operatingSurfaceV60.closeout?.closeoutChecklist ?? []).map(
              (item) => (
                <div className={styles.assistCueCard} key={item.key}>
                  <div className={styles.invoiceCardHeader}>
                    <strong>{item.label}</strong>
                    <StatusPill status={item.status} />
                  </div>
                  <small>{item.evidenceRefs.join(', ')}</small>
                </div>
              ),
            )}
          </div>
          <div className={styles.stack}>
            {(operatingSurfaceV60.handoffCenter?.lanes ?? []).map((lane) => (
              <div className={styles.assistCueCard} key={lane.key}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{lane.label}</strong>
                  <StatusPill status={lane.status} />
                </div>
                <small>
                  {humanizeKey(lane.targetProduct)} · {lane.nextAction}
                </small>
              </div>
            ))}
            <small className={styles.muted}>
              {operatingSurfaceV60.closeout?.nextStep ??
                'Cargando closeout operativo 6.0.'}
            </small>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Operations closeout</span>
              <h3>{surface.anchor?.productName ?? 'Psychology Clinics'}</h3>
            </div>
            <StatusPill
              status={
                surface.operationsCloseout?.closeoutStatus ?? 'needs_review'
              }
            />
          </div>
          <div className={styles.stack}>
            {(surface.operationsCloseout?.closedLayers ?? []).map((layer) => (
              <div className={styles.assistCueCard} key={layer.key}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{layer.label}</strong>
                  <StatusPill status={layer.status} />
                </div>
                <small>{layer.evidence}</small>
              </div>
            ))}
            <small className={styles.muted}>
              {surface.operationsCloseout?.nextStep ??
                surface.foundationCloseout?.nextStep}
            </small>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Profile</span>
              <h3>
                {surface.profile?.clinicProfile.tradeName ??
                  'Perfil psicologico'}
              </h3>
            </div>
            <StatusPill
              status={surface.profile?.workspaceStatus ?? 'needs_review'}
            />
          </div>
          <div className={styles.commercialGrid}>
            {(surface.anchor?.lanes ?? []).map((lane) => (
              <div className={styles.commercialCard} key={lane.laneKey}>
                <span className={styles.muted}>{lane.label}</span>
                <strong>{humanizeKey(lane.status)}</strong>
                <small>{lane.primaryMetric}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Patients</span>
              <h3>Intake y treatment plan</h3>
            </div>
            <StatusPill
              status={surface.intake?.workspaceStatus ?? 'needs_review'}
            />
          </div>
          <form className={styles.formGrid} onSubmit={handleRegisterPatient}>
            <label className={styles.field}>
              <span>Paciente</span>
              <input
                onChange={(event) => setPatientName(event.target.value)}
                value={patientName}
              />
            </label>
            <label className={styles.field}>
              <span>Motivo</span>
              <input
                onChange={(event) => setPresentingConcern(event.target.value)}
                value={presentingConcern}
              />
            </label>
            <button
              className={styles.primaryButton}
              disabled={actionLoading === 'register-patient'}
              type="submit"
            >
              {actionLoading === 'register-patient'
                ? 'Registrando...'
                : 'Registrar'}
            </button>
          </form>
          <div className={styles.stack}>
            {patients.map((patient) => (
              <button
                className={`${styles.selectorCard} ${
                  activePatientId === patient.id
                    ? styles.selectorCardActive
                    : ''
                }`}
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                type="button"
              >
                <span>{patient.patientDisplayName}</span>
                <small>
                  {patient.presentingConcern} ·{' '}
                  {humanizeKey(patient.therapyConsentStatus)}
                </small>
              </button>
            ))}
          </div>
          <button
            className={styles.secondaryButton}
            disabled={!activePatientId || actionLoading === 'patient-packets'}
            onClick={() => void loadPatientPackets()}
            type="button"
          >
            {actionLoading === 'patient-packets'
              ? 'Cargando...'
              : 'Cargar treatment/timeline'}
          </button>
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Sessions</span>
              <h3>Agenda y nota draft</h3>
            </div>
            <StatusPill
              status={surface.scheduling?.workspaceStatus ?? 'needs_review'}
            />
          </div>
          <form className={styles.formGrid} onSubmit={handleCreateSession}>
            <label className={styles.field}>
              <span>Servicio</span>
              <input
                onChange={(event) => setServiceName(event.target.value)}
                value={serviceName}
              />
            </label>
            <label className={styles.field}>
              <span>Terapeuta</span>
              <input
                onChange={(event) => setTherapistName(event.target.value)}
                value={therapistName}
              />
            </label>
            <button
              className={styles.primaryButton}
              disabled={!activePatientId || actionLoading === 'create-session'}
              type="submit"
            >
              {actionLoading === 'create-session' ? 'Creando...' : 'Agendar'}
            </button>
          </form>
          <div className={styles.stack}>
            {sessions.map((session) => (
              <button
                className={`${styles.selectorCard} ${
                  activeSessionId === session.id
                    ? styles.selectorCardActive
                    : ''
                }`}
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                type="button"
              >
                <span>{session.patientDisplayName}</span>
                <small>
                  {session.serviceName} · {humanizeKey(session.status)} ·{' '}
                  {formatDate(session.startsAt)}
                </small>
              </button>
            ))}
          </div>
          <div className={styles.actionRow}>
            <button
              className={styles.secondaryButton}
              disabled={
                !activeSessionId || actionLoading === 'complete-session'
              }
              onClick={() => void completeSelectedSession()}
              type="button"
            >
              Completar sesion
            </button>
            <button
              className={styles.secondaryButton}
              disabled={!activeSessionId || actionLoading === 'session-packets'}
              onClick={() => void loadSessionPackets()}
              type="button"
            >
              Cargar packets
            </button>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Treatment</span>
              <h3>Plan y follow-up</h3>
            </div>
            <StatusPill
              status={
                patientSurface.treatmentPlan?.workspaceStatus ??
                sessionSurface.followUp?.readinessStatus ??
                'needs_review'
              }
            />
          </div>
          <div className={styles.stack}>
            {(patientSurface.treatmentPlan?.goals ?? []).map((goal) => (
              <div className={styles.assistCueCard} key={goal.id}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{goal.label}</strong>
                  <StatusPill status={goal.status} />
                </div>
                <small>{goal.nextAction}</small>
              </div>
            ))}
            {(sessionSurface.followUp?.planItems ?? []).map((item) => (
              <div className={styles.assistCueCard} key={item.key}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{item.label}</strong>
                  <StatusPill status={item.status} />
                </div>
                <small>{item.evidence}</small>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Session note</span>
              <h3>Draft revisable</h3>
            </div>
            <StatusPill
              status={sessionSurface.note?.packetStatus ?? 'needs_review'}
            />
          </div>
          <div className={styles.stack}>
            <p className={styles.muted}>
              {sessionSurface.note?.draftSections.presentingConcern ??
                'Carga un packet de sesion para ver la nota draft.'}
            </p>
            {(sessionSurface.note?.draftSections.pendingFields ?? []).map(
              (field) => (
                <small className={styles.muted} key={field}>
                  {field}
                </small>
              ),
            )}
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Bridges</span>
              <h3>Growth, Billing y Tax</h3>
            </div>
            <button
              className={styles.secondaryButton}
              disabled={actionLoading === 'bridge-packets'}
              onClick={() => void loadBridgePackets()}
              type="button"
            >
              {actionLoading === 'bridge-packets'
                ? 'Cargando...'
                : 'Cargar bridges'}
            </button>
          </div>
          <div className={styles.commercialGrid}>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Growth reminders</span>
              <strong>{surface.growthBridge?.reminders.length ?? 0}</strong>
              <small>
                {humanizeKey(
                  surface.growthBridge?.bridgeStatus ?? 'needs_review',
                )}
              </small>
            </div>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Invoiceable items</span>
              <strong>
                {surface.billingBridge?.summary.invoiceableItemCount ?? 0}
              </strong>
              <small>
                {humanizeKey(
                  surface.billingBridge?.bridgeStatus ?? 'needs_review',
                )}
              </small>
            </div>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Timeline</span>
              <h3>Records operativos</h3>
            </div>
            <StatusPill
              status={
                patientSurface.timeline?.workspaceStatus ?? 'needs_review'
              }
            />
          </div>
          <div className={styles.stack}>
            {(patientSurface.timeline?.timeline ?? [])
              .slice(0, 6)
              .map((item) => (
                <div className={styles.assistCueCard} key={item.id}>
                  <div className={styles.invoiceCardHeader}>
                    <strong>{item.label}</strong>
                    <StatusPill status={item.status} />
                  </div>
                  <small>
                    {formatDate(item.occurredAt)} · {item.evidence}
                  </small>
                </div>
              ))}
            <small className={styles.muted}>
              {patientSurface.timeline?.nextStep ??
                'Carga treatment/timeline para revisar continuidad.'}
            </small>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Records 3.0</span>
              <h3>Hardening y evidencia</h3>
            </div>
            <button
              className={styles.secondaryButton}
              disabled={!activePatientId || actionLoading === 'records-packets'}
              onClick={() => void loadRecordsPackets()}
              type="button"
            >
              {actionLoading === 'records-packets'
                ? 'Cargando...'
                : 'Cargar records 3.0'}
            </button>
          </div>
          <div className={styles.stack}>
            {(recordsSurface.hardening?.recordLayers ?? []).map((layer) => (
              <div className={styles.assistCueCard} key={layer.key}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{layer.label}</strong>
                  <StatusPill status={layer.status} />
                </div>
                <small>
                  {layer.evidenceCount} evidencias · {layer.nextAction}
                </small>
              </div>
            ))}
            {(recordsSurface.evidence?.evidenceItems ?? [])
              .slice(0, 4)
              .map((item) => (
                <small className={styles.muted} key={item.id}>
                  {item.label} · {humanizeKey(item.status)}
                </small>
              ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Safety & privacy</span>
              <h3>Revision humana</h3>
            </div>
            <StatusPill
              status={
                recordsSurface.closeout?.closeoutStatus ??
                recordsSurface.privacy?.controlStatus ??
                'needs_review'
              }
            />
          </div>
          <div className={styles.commercialGrid}>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Safety signals</span>
              <strong>
                {recordsSurface.safety?.reviewSignals.length ?? 0}
              </strong>
              <small>
                {humanizeKey(
                  recordsSurface.safety?.workspaceStatus ?? 'needs_review',
                )}
              </small>
            </div>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Privacy controls</span>
              <strong>{recordsSurface.privacy?.controls.length ?? 0}</strong>
              <small>
                {humanizeKey(
                  recordsSurface.privacy?.controlStatus ?? 'needs_review',
                )}
              </small>
            </div>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Review stages</span>
              <strong>{sessionSurface.reviewLoop?.stages.length ?? 0}</strong>
              <small>
                {humanizeKey(
                  sessionSurface.reviewLoop?.reviewStatus ?? 'needs_review',
                )}
              </small>
            </div>
          </div>
          <small className={styles.muted}>
            {recordsSurface.closeout?.nextStep ??
              'Records 3.0 mantiene boundary no-EHR y review-first.'}
          </small>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>EHR readiness</span>
              <h3>Discovery y firma formal</h3>
            </div>
            <button
              className={styles.secondaryButton}
              disabled={
                !activePatientId ||
                actionLoading === 'ehr-readiness-packets'
              }
              onClick={() => void loadEhrReadinessPackets()}
              type="button"
            >
              {actionLoading === 'ehr-readiness-packets'
                ? 'Cargando...'
                : 'Cargar EHR readiness'}
            </button>
          </div>
          <div className={styles.stack}>
            {(ehrSurface.discovery?.discoveryAreas ?? []).map((area) => (
              <div className={styles.assistCueCard} key={area.key}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{area.label}</strong>
                  <StatusPill status={area.status} />
                </div>
                <small>
                  {area.evidence} · {area.nextAction}
                </small>
              </div>
            ))}
            {(ehrSurface.signature?.signatureStages ?? [])
              .slice(0, 3)
              .map((stage) => (
                <small className={styles.muted} key={stage.key}>
                  {stage.label} · {humanizeKey(stage.status)}
                </small>
              ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Clinical review</span>
              <h3>Outcomes, escalas y handoff</h3>
            </div>
            <StatusPill
              status={
                ehrSurface.closeout?.closeoutStatus ??
                ehrSurface.outcomes?.workspaceStatus ??
                'needs_review'
              }
            />
          </div>
          <div className={styles.commercialGrid}>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Outcome signals</span>
              <strong>{ehrSurface.outcomes?.outcomeSignals.length ?? 0}</strong>
              <small>
                {humanizeKey(
                  ehrSurface.outcomes?.workspaceStatus ?? 'needs_review',
                )}
              </small>
            </div>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Scales</span>
              <strong>{ehrSurface.assessments?.summary.scaleCount ?? 0}</strong>
              <small>
                {humanizeKey(
                  ehrSurface.assessments?.registryStatus ?? 'needs_review',
                )}
              </small>
            </div>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Export packets</span>
              <strong>{ehrSurface.handoff?.summary.packetCount ?? 0}</strong>
              <small>
                {humanizeKey(
                  ehrSurface.handoff?.handoffStatus ?? 'needs_review',
                )}
              </small>
            </div>
          </div>
          <small className={styles.muted}>
            {ehrSurface.closeout?.nextStep ??
              'EHR readiness prepara contratos, no firma ni diagnostica automaticamente.'}
          </small>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Closeout 5.0</span>
              <h3>Decision de producto</h3>
            </div>
            <button
              className={styles.secondaryButton}
              disabled={actionLoading === 'product-closeout-packets'}
              onClick={() => void loadProductCloseoutPackets()}
              type="button"
            >
              {actionLoading === 'product-closeout-packets'
                ? 'Cargando...'
                : 'Cargar closeout 5.0'}
            </button>
          </div>
          <div className={styles.stack}>
            {(productCloseoutSurface.evaluation?.options ?? []).map(
              (option) => (
                <div className={styles.assistCueCard} key={option.key}>
                  <div className={styles.invoiceCardHeader}>
                    <strong>{option.label}</strong>
                    <StatusPill status={option.status} />
                  </div>
                  <small>
                    {option.rationale} · {option.nextAction}
                  </small>
                </div>
              ),
            )}
            {(productCloseoutSurface.closeout?.checklist ?? [])
              .slice(0, 4)
              .map((item) => (
                <small className={styles.muted} key={item.key}>
                  {item.label} · {humanizeKey(item.status)}
                </small>
              ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Admin & boundary</span>
              <h3>Revision final</h3>
            </div>
            <StatusPill
              status={
                productCloseoutSurface.closeout?.closeoutStatus ??
                productCloseoutSurface.report?.reportStatus ??
                'needs_review'
              }
            />
          </div>
          <div className={styles.commercialGrid}>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Admin controls</span>
              <strong>
                {productCloseoutSurface.admin?.summary.controlCount ?? 0}
              </strong>
              <small>
                {humanizeKey(
                  productCloseoutSurface.admin?.workspaceStatus ??
                    'needs_review',
                )}
              </small>
            </div>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Review queue</span>
              <strong>
                {productCloseoutSurface.queue?.summary.itemCount ?? 0}
              </strong>
              <small>
                {humanizeKey(
                  productCloseoutSurface.queue?.queueStatus ?? 'needs_review',
                )}
              </small>
            </div>
            <div className={styles.commercialCard}>
              <span className={styles.muted}>Next product</span>
              <strong>
                {productCloseoutSurface.closeout?.decision
                  .recommendedNextProduct ?? 'tax-compliance-ec'}
              </strong>
              <small>
                {productCloseoutSurface.closeout?.decision.status ??
                  'pending'}
              </small>
            </div>
          </div>
          <small className={styles.muted}>
            {productCloseoutSurface.boundary?.nextStep ??
              productCloseoutSurface.closeout?.nextStep ??
              'Closeout 5.0 decide pausa MVP y difiere integracion EHR externa.'}
          </small>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'ready'
      ? styles.statusActive
      : status === 'blocked'
        ? styles.statusInactive
        : styles.statusTrial;

  return (
    <span className={`${styles.statusPill} ${tone}`}>
      {status.replaceAll('_', ' ')}
    </span>
  );
}
