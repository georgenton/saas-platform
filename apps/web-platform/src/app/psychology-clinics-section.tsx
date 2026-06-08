import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  createPsychologyClinicSession,
  fetchPsychologyClinicFoundationCloseout,
  fetchPsychologyClinicOperationsCloseout,
  fetchPsychologyClinicPatientIntakeWorkspace,
  fetchPsychologyClinicPatientTimelineWorkspace,
  fetchPsychologyClinicProductAnchor,
  fetchPsychologyClinicProfileWorkspace,
  fetchPsychologyClinicSessionSchedulingWorkspace,
  fetchPsychologyClinicTreatmentFollowUpReadiness,
  fetchPsychologyClinicTreatmentPlanWorkspace,
  registerPsychologyClinicPatientIntake,
  requestPsychologyClinicBillingTaxBridge,
  requestPsychologyClinicGrowthReminderBridge,
  requestPsychologyClinicSessionNoteDraftPacket,
  transitionPsychologyClinicSession,
} from './api';
import styles from './app.module.css';
import {
  PsychologyClinicBillingTaxBridgeResponse,
  PsychologyClinicFoundationCloseoutResponse,
  PsychologyClinicGrowthReminderBridgeResponse,
  PsychologyClinicOperationsCloseoutResponse,
  PsychologyClinicPatientIntakeWorkspaceResponse,
  PsychologyClinicPatientTimelineWorkspaceResponse,
  PsychologyClinicProductAnchorResponse,
  PsychologyClinicProfileWorkspaceResponse,
  PsychologyClinicSessionNoteDraftPacketResponse,
  PsychologyClinicSessionRecordResponse,
  PsychologyClinicSessionSchedulingWorkspaceResponse,
  PsychologyClinicTreatmentFollowUpReadinessResponse,
  PsychologyClinicTreatmentPlanWorkspaceResponse,
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
  });
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
    ],
    [patients.length, sessions.length, surface.operationsCloseout],
  );

  useEffect(() => {
    if (!token || !tenantSlug) {
      setSurface(emptySurface);
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
      ] = await Promise.all([
        fetchPsychologyClinicProductAnchor(token, tenantSlug),
        fetchPsychologyClinicFoundationCloseout(token, tenantSlug),
        fetchPsychologyClinicOperationsCloseout(token, tenantSlug),
        fetchPsychologyClinicProfileWorkspace(token, tenantSlug),
        fetchPsychologyClinicPatientIntakeWorkspace(token, tenantSlug),
        fetchPsychologyClinicSessionSchedulingWorkspace(token, tenantSlug),
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
      const [note, followUp] = await Promise.all([
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
      ]);
      setSessionSurface({ note, followUp });
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
