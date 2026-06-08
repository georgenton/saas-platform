import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  createMedicalClinicAppointment,
  fetchMedicalClinicAppointmentSchedulingWorkspace,
  fetchMedicalClinicCarePlanTaskWorkspace,
  fetchMedicalClinicClinicalEvidenceRegistry,
  fetchMedicalClinicEncounterWorkspace,
  fetchMedicalClinicPatientClinicalTimelineWorkspace,
  fetchMedicalClinicPatientIntakeWorkspace,
  fetchMedicalClinicProductAnchor,
  fetchMedicalClinicProductCloseout,
  fetchMedicalClinicProfileWorkspace,
  registerMedicalClinicPatientIntake,
  requestMedicalClinicBillingTaxBridge,
  requestMedicalClinicClinicalBoundaryCloseout,
  requestMedicalClinicClinicalNoteDraftPacket,
  requestMedicalClinicEncounterCloseout,
  requestMedicalClinicGrowthReminderBridge,
  requestMedicalClinicMedicalHistoryDraftRecord,
  requestMedicalClinicOrdersReferralReadinessPacket,
  requestMedicalClinicPrescriptionReadinessPacket,
  requestMedicalClinicRecordsCloseout,
  fetchMedicalClinicTreatmentFollowUpReadiness,
  transitionMedicalClinicAppointment,
} from './api';
import styles from './app.module.css';
import {
  MedicalClinicAppointmentRecordResponse,
  MedicalClinicAppointmentSchedulingWorkspaceResponse,
  MedicalClinicBillingTaxBridgeResponse,
  MedicalClinicCarePlanTaskWorkspaceResponse,
  MedicalClinicClinicalBoundaryCloseoutResponse,
  MedicalClinicClinicalEvidenceRegistryResponse,
  MedicalClinicClinicalNoteDraftPacketResponse,
  MedicalClinicEncounterCloseoutResponse,
  MedicalClinicEncounterWorkspaceResponse,
  MedicalClinicGrowthReminderBridgeResponse,
  MedicalClinicMedicalHistoryDraftRecordResponse,
  MedicalClinicOrdersReferralReadinessPacketResponse,
  MedicalClinicPatientClinicalTimelineWorkspaceResponse,
  MedicalClinicPatientIntakeWorkspaceResponse,
  MedicalClinicPatientRecordResponse,
  MedicalClinicPrescriptionReadinessPacketResponse,
  MedicalClinicProductAnchorResponse,
  MedicalClinicProductCloseoutResponse,
  MedicalClinicProfileWorkspaceResponse,
  MedicalClinicRecordsCloseoutResponse,
  MedicalClinicTreatmentFollowUpReadinessResponse,
} from './types';

type MedicalClinicsSectionProps = {
  token: string | null;
  tenantSlug: string | null;
  formatDate: (value: string) => string;
  humanizeKey: (value: string) => string;
};

type MedicalClinicsSurface = {
  anchor: MedicalClinicProductAnchorResponse | null;
  closeout: MedicalClinicProductCloseoutResponse | null;
  profile: MedicalClinicProfileWorkspaceResponse | null;
  intake: MedicalClinicPatientIntakeWorkspaceResponse | null;
  scheduling: MedicalClinicAppointmentSchedulingWorkspaceResponse | null;
  growthBridge: MedicalClinicGrowthReminderBridgeResponse | null;
  billingBridge: MedicalClinicBillingTaxBridgeResponse | null;
  boundary: MedicalClinicClinicalBoundaryCloseoutResponse | null;
};

type EncounterSurface = {
  encounter: MedicalClinicEncounterWorkspaceResponse | null;
  note: MedicalClinicClinicalNoteDraftPacketResponse | null;
  followUp: MedicalClinicTreatmentFollowUpReadinessResponse | null;
  prescription: MedicalClinicPrescriptionReadinessPacketResponse | null;
  orders: MedicalClinicOrdersReferralReadinessPacketResponse | null;
  closeout: MedicalClinicEncounterCloseoutResponse | null;
};

type RecordsSurface = {
  timeline: MedicalClinicPatientClinicalTimelineWorkspaceResponse | null;
  history: MedicalClinicMedicalHistoryDraftRecordResponse | null;
  evidence: MedicalClinicClinicalEvidenceRegistryResponse | null;
  carePlan: MedicalClinicCarePlanTaskWorkspaceResponse | null;
  closeout: MedicalClinicRecordsCloseoutResponse | null;
};

const emptySurface: MedicalClinicsSurface = {
  anchor: null,
  closeout: null,
  profile: null,
  intake: null,
  scheduling: null,
  growthBridge: null,
  billingBridge: null,
  boundary: null,
};

export function MedicalClinicsSection({
  token,
  tenantSlug,
  formatDate,
  humanizeKey,
}: MedicalClinicsSectionProps) {
  const [surface, setSurface] = useState<MedicalClinicsSurface>(emptySurface);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [encounterSurface, setEncounterSurface] = useState<EncounterSurface>({
    encounter: null,
    note: null,
    followUp: null,
    prescription: null,
    orders: null,
    closeout: null,
  });
  const [recordsSurface, setRecordsSurface] = useState<RecordsSurface>({
    timeline: null,
    history: null,
    evidence: null,
    carePlan: null,
    closeout: null,
  });
  const [patientName, setPatientName] = useState('Paciente Demo');
  const [triageReason, setTriageReason] = useState('Consulta general');
  const [serviceName, setServiceName] = useState('Consulta general');
  const [professionalName, setProfessionalName] = useState('Dra. Ana Paredes');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const patients = surface.intake?.intakeQueue ?? [];
  const appointments = surface.scheduling?.appointments ?? [];
  const activePatientId = selectedPatientId || patients[0]?.id || '';
  const activeAppointmentId =
    selectedAppointmentId || appointments[0]?.id || '';

  const readinessMetrics = useMemo(
    () => [
      {
        label: 'Patients',
        value: surface.closeout?.summary.patientCount ?? patients.length,
      },
      {
        label: 'Appointments',
        value:
          surface.closeout?.summary.appointmentCount ?? appointments.length,
      },
      {
        label: 'Events',
        value: surface.closeout?.summary.operationalEventCount ?? 0,
      },
      {
        label: 'Blockers',
        value: surface.closeout?.summary.blockerCount ?? 0,
      },
    ],
    [appointments.length, patients.length, surface.closeout],
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
      const [anchor, closeout, profile, intake, scheduling, boundary] =
        await Promise.all([
          fetchMedicalClinicProductAnchor(token, tenantSlug),
          fetchMedicalClinicProductCloseout(token, tenantSlug),
          fetchMedicalClinicProfileWorkspace(token, tenantSlug),
          fetchMedicalClinicPatientIntakeWorkspace(token, tenantSlug),
          fetchMedicalClinicAppointmentSchedulingWorkspace(token, tenantSlug),
          requestMedicalClinicClinicalBoundaryCloseout(token, tenantSlug),
        ]);

      setSurface({
        anchor,
        closeout,
        profile,
        intake,
        scheduling,
        growthBridge: surface.growthBridge,
        billingBridge: surface.billingBridge,
        boundary,
      });
      setSelectedPatientId(
        (current) => current || intake.intakeQueue[0]?.id || '',
      );
      setSelectedAppointmentId(
        (current) => current || scheduling.appointments[0]?.id || '',
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No se pudo cargar Medical Clinics.',
      );
    } finally {
      setLoading(false);
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
        requestMedicalClinicGrowthReminderBridge(token, tenantSlug),
        requestMedicalClinicBillingTaxBridge(token, tenantSlug),
      ]);
      setSurface((current) => ({
        ...current,
        growthBridge,
        billingBridge,
      }));
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

  async function handleRegisterPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !tenantSlug) {
      return;
    }

    setActionLoading('register-patient');
    setError(null);
    try {
      const patient = await registerMedicalClinicPatientIntake(
        token,
        tenantSlug,
        {
          patientDisplayName: patientName,
          identificationStatus: 'ready',
          contactStatus: 'ready',
          consentStatus: 'ready',
          messagingOptInStatus: 'ready',
          triageReason,
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

  async function handleCreateAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !tenantSlug || !activePatientId) {
      return;
    }

    setActionLoading('create-appointment');
    setError(null);
    try {
      const startsAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const appointment = await createMedicalClinicAppointment(
        token,
        tenantSlug,
        {
          patientId: activePatientId,
          serviceName,
          professionalId: 'professional_general_001',
          professionalName,
          startsAt,
          amountInCents: 3500,
          currency: 'USD',
        },
      );
      setSelectedAppointmentId(appointment.id);
      setMessage(`Cita creada: ${appointment.serviceName}`);
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

  async function loadEncounterPackets() {
    if (!token || !tenantSlug || !activeAppointmentId) {
      return;
    }

    setActionLoading('encounter-packets');
    setError(null);
    try {
      const [encounter, note, followUp, prescription, orders, closeout] =
        await Promise.all([
          fetchMedicalClinicEncounterWorkspace(
            token,
            tenantSlug,
            activeAppointmentId,
          ),
          requestMedicalClinicClinicalNoteDraftPacket(
            token,
            tenantSlug,
            activeAppointmentId,
          ),
          fetchMedicalClinicTreatmentFollowUpReadiness(
            token,
            tenantSlug,
            activeAppointmentId,
          ),
          requestMedicalClinicPrescriptionReadinessPacket(
            token,
            tenantSlug,
            activeAppointmentId,
          ),
          requestMedicalClinicOrdersReferralReadinessPacket(
            token,
            tenantSlug,
            activeAppointmentId,
          ),
          requestMedicalClinicEncounterCloseout(
            token,
            tenantSlug,
            activeAppointmentId,
          ),
        ]);
      setEncounterSurface({
        encounter,
        note,
        followUp,
        prescription,
        orders,
        closeout,
      });
      setMessage('Packets de encounter cargados.');
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
      const [history, timeline, evidence, carePlan, closeout] =
        await Promise.all([
          requestMedicalClinicMedicalHistoryDraftRecord(
            token,
            tenantSlug,
            activePatientId,
          ),
          fetchMedicalClinicPatientClinicalTimelineWorkspace(
            token,
            tenantSlug,
            activePatientId,
          ),
          fetchMedicalClinicClinicalEvidenceRegistry(
            token,
            tenantSlug,
            activePatientId,
          ),
          fetchMedicalClinicCarePlanTaskWorkspace(
            token,
            tenantSlug,
            activePatientId,
          ),
          requestMedicalClinicRecordsCloseout(
            token,
            tenantSlug,
            activePatientId,
          ),
        ]);
      setRecordsSurface({ history, timeline, evidence, carePlan, closeout });
      setMessage('Records longitudinales cargados.');
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

  async function completeSelectedAppointment() {
    if (!token || !tenantSlug || !activeAppointmentId) {
      return;
    }

    setActionLoading('complete-appointment');
    setError(null);
    try {
      const appointment: MedicalClinicAppointmentRecordResponse =
        await transitionMedicalClinicAppointment(
          token,
          tenantSlug,
          activeAppointmentId,
          {
            status: 'completed',
            blockers: [],
          },
        );
      setMessage(`Cita completada: ${appointment.id}`);
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
            <span className={styles.label}>Medical Clinics</span>
            <h2>Command center</h2>
          </div>
        </div>
        <div className={styles.emptyState}>
          <p>Selecciona un tenant para operar Medical Clinics.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.adminPanel}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>Medical Clinics</span>
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
              <span className={styles.label}>Product closeout</span>
              <h3>{surface.anchor?.productName ?? 'Medical Clinics'}</h3>
            </div>
            <StatusPill
              status={surface.closeout?.closeoutStatus ?? 'needs_review'}
            />
          </div>
          <div className={styles.stack}>
            {(surface.closeout?.closedLayers ?? []).map((layer) => (
              <div className={styles.assistCueCard} key={layer.key}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{layer.label}</strong>
                  <StatusPill status={layer.status} />
                </div>
                <small>{layer.evidence}</small>
              </div>
            ))}
            <small className={styles.muted}>{surface.closeout?.nextStep}</small>
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Clinic operations</span>
              <h3>
                {surface.profile?.clinicProfile.tradeName ?? 'Perfil operativo'}
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
              <span className={styles.label}>Patient operations</span>
              <h3>Intake y pacientes</h3>
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
                onChange={(event) => setTriageReason(event.target.value)}
                value={triageReason}
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
                  {patient.triageReason} · {humanizeKey(patient.consentStatus)}
                </small>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Appointments</span>
              <h3>Citas y encounter</h3>
            </div>
            <StatusPill
              status={surface.scheduling?.workspaceStatus ?? 'needs_review'}
            />
          </div>
          <form className={styles.formGrid} onSubmit={handleCreateAppointment}>
            <label className={styles.field}>
              <span>Servicio</span>
              <input
                onChange={(event) => setServiceName(event.target.value)}
                value={serviceName}
              />
            </label>
            <label className={styles.field}>
              <span>Profesional</span>
              <input
                onChange={(event) => setProfessionalName(event.target.value)}
                value={professionalName}
              />
            </label>
            <button
              className={styles.primaryButton}
              disabled={
                !activePatientId || actionLoading === 'create-appointment'
              }
              type="submit"
            >
              {actionLoading === 'create-appointment'
                ? 'Creando...'
                : 'Crear cita'}
            </button>
          </form>
          <div className={styles.stack}>
            {appointments.map((appointment) => (
              <button
                className={`${styles.selectorCard} ${
                  activeAppointmentId === appointment.id
                    ? styles.selectorCardActive
                    : ''
                }`}
                key={appointment.id}
                onClick={() => setSelectedAppointmentId(appointment.id)}
                type="button"
              >
                <span>{appointment.patientDisplayName}</span>
                <small>
                  {appointment.serviceName} · {humanizeKey(appointment.status)}{' '}
                  · {formatDate(appointment.startsAt)}
                </small>
              </button>
            ))}
          </div>
          <div className={styles.inlineActions}>
            <button
              className={styles.secondaryButton}
              disabled={
                !activeAppointmentId || actionLoading === 'complete-appointment'
              }
              onClick={() => void completeSelectedAppointment()}
              type="button"
            >
              Completar cita
            </button>
            <button
              className={styles.secondaryButton}
              disabled={
                !activeAppointmentId || actionLoading === 'encounter-packets'
              }
              onClick={() => void loadEncounterPackets()}
              type="button"
            >
              Cargar encounter
            </button>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <PacketPanel
          title="Encounter packets"
          items={[
            ['Workspace', encounterSurface.encounter?.workspaceStatus],
            ['Note draft', encounterSurface.note?.packetStatus],
            ['Follow-up', encounterSurface.followUp?.readinessStatus],
            ['Prescription', encounterSurface.prescription?.packetStatus],
            ['Orders/referrals', encounterSurface.orders?.packetStatus],
            ['Closeout', encounterSurface.closeout?.closeoutStatus],
          ]}
          humanizeKey={humanizeKey}
        />

        <div className={styles.panel}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Patient records</span>
              <h3>Timeline, evidencia y care plan</h3>
            </div>
            <button
              className={styles.secondaryButton}
              disabled={!activePatientId || actionLoading === 'records-packets'}
              onClick={() => void loadRecordsPackets()}
              type="button"
            >
              Cargar records
            </button>
          </div>
          <PacketPanel
            compact
            title="Records closeout"
            items={[
              ['Timeline', recordsSurface.timeline?.workspaceStatus],
              ['History draft', recordsSurface.history?.recordStatus],
              ['Evidence', recordsSurface.evidence?.registryStatus],
              ['Care plan', recordsSurface.carePlan?.workspaceStatus],
              ['Records closeout', recordsSurface.closeout?.closeoutStatus],
            ]}
            humanizeKey={humanizeKey}
          />
        </div>
      </div>

      <div className={styles.contentGrid}>
        <BridgePanel
          title="Growth bridge"
          status={surface.growthBridge?.bridgeStatus}
          lines={(surface.growthBridge?.reminders ?? []).map(
            (item) => `${item.patientDisplayName} · ${item.templateKey}`,
          )}
          humanizeKey={humanizeKey}
        />
        <BridgePanel
          title="Billing and Tax bridge"
          status={surface.billingBridge?.bridgeStatus}
          lines={(surface.billingBridge?.invoiceableItems ?? []).map(
            (item) => `${item.patientDisplayName} · ${item.serviceName}`,
          )}
          humanizeKey={humanizeKey}
        />
      </div>
      <div className={styles.inlineActions}>
        <button
          className={styles.secondaryButton}
          disabled={actionLoading === 'bridge-packets'}
          onClick={() => void loadBridgePackets()}
          type="button"
        >
          {actionLoading === 'bridge-packets'
            ? 'Cargando bridges...'
            : 'Solicitar bridges'}
        </button>
      </div>
    </section>
  );
}

function PacketPanel({
  title,
  items,
  humanizeKey,
  compact = false,
}: {
  title: string;
  items: Array<[string, string | undefined]>;
  humanizeKey: (value: string) => string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? styles.stack : styles.panel}>
      {!compact ? (
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Clinical operations</span>
            <h3>{title}</h3>
          </div>
        </div>
      ) : null}
      <div className={styles.stack}>
        {items.map(([label, status]) => (
          <div className={styles.assistCueCard} key={label}>
            <div className={styles.invoiceCardHeader}>
              <strong>{label}</strong>
              <StatusPill status={status ?? 'needs_review'} />
            </div>
            <small>{humanizeKey(status ?? 'pending')}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function BridgePanel({
  title,
  status,
  lines,
  humanizeKey,
}: {
  title: string;
  status: string | undefined;
  lines: string[];
  humanizeKey: (value: string) => string;
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>Cross-product bridge</span>
          <h3>{title}</h3>
        </div>
        <StatusPill status={status ?? 'needs_review'} />
      </div>
      <div className={styles.stack}>
        {lines.length ? (
          lines.map((line) => <small key={line}>{line}</small>)
        ) : (
          <small className={styles.muted}>
            Sin items listos para este bridge todavia.
          </small>
        )}
        <small className={styles.muted}>
          {humanizeKey(status ?? 'pending')}
        </small>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'ready'
      ? styles.statusPillSuccess
      : status === 'blocked'
        ? styles.statusPillDanger
        : styles.statusPillWarning;

  return <span className={`${styles.statusPill} ${tone}`}>{status}</span>;
}
