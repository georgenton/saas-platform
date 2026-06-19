import { useMemo, useState } from 'react';
import styles from '../../app/app.module.css';
import type {
  ElectronicSandboxReadinessResponse,
  InvoiceDetailResponse,
} from '../../app/types';
import { StatusPill } from '../../shared/design-system/status-pill';
import {
  getLegalStatusMeta,
  getSriEvidenceValues,
  isInvoiceElectronicallyAuthorized,
} from './electronic/lifecycle';

type InvoicingElectronicStatusPanelProps = {
  actionLoading: string | null;
  canSubmitElectronicDocument: boolean;
  documentSupportDetail: string | null;
  invoiceAccessKey: string;
  invoiceAuthorizationNumber: string;
  invoiceAuthorizedAt: string;
  invoiceElectronicStatus:
    | 'pending_submission'
    | 'submitted'
    | 'authorized'
    | 'rejected';
  invoiceElectronicStatusMessage: string;
  onCheckAuthorization: () => void;
  onInvoiceAccessKeyChange: (value: string) => void;
  onInvoiceAuthorizationNumberChange: (value: string) => void;
  onInvoiceAuthorizedAtChange: (value: string) => void;
  onInvoiceElectronicStatusChange: (
    value: 'pending_submission' | 'submitted' | 'authorized' | 'rejected',
  ) => void;
  onInvoiceElectronicStatusMessageChange: (value: string) => void;
  onLoadXmlPreview: () => void;
  onPresignedInvoiceSignerNameChange: (value: string) => void;
  onPresignedInvoiceXmlChange: (value: string) => void;
  onSubmitElectronicDocument: () => void;
  onSubmitPresignedInvoiceElectronicDocument: () => void;
  onUpdateElectronicStatus: () => void;
  presignedInvoiceSignerName: string;
  presignedInvoiceXml: string;
  selectedInvoiceDetail: InvoiceDetailResponse;
  selectedInvoiceDocumentSupport:
    | ElectronicSandboxReadinessResponse['documentSupport'][number]
    | null;
};

type InvoicingTechnicalTracePanelProps = {
  formatDate: (value: string | null | undefined) => string;
  selectedInvoiceDetail: InvoiceDetailResponse;
};

export function InvoicingElectronicStatusPanel({
  actionLoading,
  canSubmitElectronicDocument,
  documentSupportDetail,
  invoiceAccessKey,
  invoiceAuthorizationNumber,
  invoiceAuthorizedAt,
  invoiceElectronicStatus,
  invoiceElectronicStatusMessage,
  onCheckAuthorization,
  onInvoiceAccessKeyChange,
  onInvoiceAuthorizationNumberChange,
  onInvoiceAuthorizedAtChange,
  onInvoiceElectronicStatusChange,
  onInvoiceElectronicStatusMessageChange,
  onLoadXmlPreview,
  onPresignedInvoiceSignerNameChange,
  onPresignedInvoiceXmlChange,
  onSubmitElectronicDocument,
  onSubmitPresignedInvoiceElectronicDocument,
  onUpdateElectronicStatus,
  presignedInvoiceSignerName,
  presignedInvoiceXml,
  selectedInvoiceDetail,
  selectedInvoiceDocumentSupport,
}: InvoicingElectronicStatusPanelProps) {
  const [showManualControl, setShowManualControl] = useState(
    selectedInvoiceDetail.electronicStatus === 'submitted' ||
      selectedInvoiceDetail.electronicStatus === 'rejected',
  );
  const [showFallbackBridge, setShowFallbackBridge] = useState(
    Boolean(presignedInvoiceXml.trim()) ||
      Boolean(
        selectedInvoiceDocumentSupport &&
          !selectedInvoiceDocumentSupport.submitSupported,
      ),
  );

  const readinessBlocked = useMemo(
    () =>
      !canSubmitElectronicDocument ||
      Boolean(
        selectedInvoiceDocumentSupport &&
          !selectedInvoiceDocumentSupport.submitSupported,
      ),
    [canSubmitElectronicDocument, selectedInvoiceDocumentSupport],
  );

  const isAuthorized = isInvoiceElectronicallyAuthorized(selectedInvoiceDetail);
  const legalStatus = getLegalStatusMeta(
    selectedInvoiceDetail.electronicStatus,
  );
  const evidenceValues = getSriEvidenceValues({
    accessKey: invoiceAccessKey,
    authorizationNumber: invoiceAuthorizationNumber,
    isAuthorized,
  });
  const nextStep = buildNextStep({
    actionLoading,
    canSubmitElectronicDocument,
    invoiceAccessKey,
    onCheckAuthorization,
    onLoadXmlPreview,
    onSubmitElectronicDocument,
    onToggleFallback: () => setShowFallbackBridge(true),
    onToggleManualControl: () => setShowManualControl(true),
    selectedInvoiceDetail,
    selectedInvoiceDocumentSupport,
  });

  return (
    <div className={styles.invoicingSRILifecycle}>
      <section
        className={`${styles.invoicingSRILegalVerdict} ${
          styles[`invoicingSRILegalVerdict${legalStatus.classSuffix}`]
        }`}
      >
        <div className={styles.invoicingSRILegalVerdictIcon} aria-hidden="true">
          {legalStatus.icon}
        </div>
        <div>
          <span className={styles.label}>Estado legal ante el SRI</span>
          <h3>{legalStatus.label}</h3>
          <p>{legalStatus.legal}</p>
        </div>
        <div className={styles.invoicingSRILegalVerdictMeta}>
          <strong>{selectedInvoiceDetail.number}</strong>
          <small>{selectedInvoiceDetail.documentCode ?? '01'} · Factura</small>
        </div>
      </section>

      <div className={styles.invoicingSRIStageCard}>
        <div className={styles.invoicingSRIStageHeader}>
          <span className={styles.label}>Ciclo de vida</span>
          <small className={styles.muted}>
            Enviado no significa autorizado. El último paso se completa solo con
            confirmación real del backend.
          </small>
        </div>
        <SRIStageStepper status={selectedInvoiceDetail.electronicStatus} />
      </div>

      <section className={styles.invoicingSRINextStepCard}>
        <div className={styles.invoicingSRINextStepHeader}>
          <span className={styles.label}>Siguiente paso recomendado</span>
          <StatusPill tone={nextStep.tone}>{nextStep.pill}</StatusPill>
        </div>
        <strong className={styles.invoicingSRINextStepTitle}>
          {nextStep.title}
        </strong>
        <p className={styles.invoicingSRINextStepDescription}>
          {nextStep.description}
        </p>
        <div className={styles.inlineActionRow}>
          {nextStep.primaryAction}
          {nextStep.secondaryAction}
        </div>
        {nextStep.footnote ? (
          <small className={styles.muted}>{nextStep.footnote}</small>
        ) : null}
      </section>

      {invoiceAccessKey.trim() ||
      invoiceAuthorizationNumber.trim() ||
      selectedInvoiceDetail.submittedAt ? (
        <section className={styles.invoicingSRIEvidenceCard}>
          <div className={styles.invoiceCardHeader}>
            <div>
              <span className={styles.label}>Evidencia</span>
              <h3>Datos de trazabilidad</h3>
            </div>
            <StatusPill tone={isAuthorized ? 'success' : 'warning'}>
              {isAuthorized ? 'Autorizado' : 'En proceso'}
            </StatusPill>
          </div>
          <div className={styles.invoicingSRICopyGrid}>
            <CopyValueCard
              copyable={evidenceValues.accessKey.copyable}
              label="Clave de acceso"
              value={evidenceValues.accessKey.value}
            />
            <CopyValueCard
              copyable={evidenceValues.authorizationNumber.copyable}
              label="No. autorización"
              value={evidenceValues.authorizationNumber.value}
            />
          </div>
          <div className={styles.invoicingSRIEvidenceGrid}>
            <div>
              <span>Enviado</span>
              <strong>
                {selectedInvoiceDetail.submittedAt ?? 'Aún no enviado'}
              </strong>
            </div>
            <div>
              <span>{isAuthorized ? 'Autorizado' : 'Referencia de envío'}</span>
              <strong>
                {isAuthorized
                  ? (selectedInvoiceDetail.authorizedAt ??
                    'Sin fecha registrada')
                  : (selectedInvoiceDetail.submissionReference ??
                    'Sin referencia')}
              </strong>
            </div>
          </div>
        </section>
      ) : null}

      {selectedInvoiceDocumentSupport &&
      !selectedInvoiceDocumentSupport.submitSupported ? (
        <div className={styles.invoicingReadinessBlockers}>
          <strong>Compatibilidad documental</strong>
          <p>{documentSupportDetail}</p>
        </div>
      ) : null}

      {selectedInvoiceDetail.electronicStatus === 'rejected' &&
      selectedInvoiceDetail.electronicStatusMessage ? (
        <div className={styles.invoicingSRIInterventionAlert}>
          <span className={styles.label}>Observación del SRI</span>
          <strong>
            El SRI devolvió este comprobante y conviene documentar la causa
            antes de cualquier nuevo intento.
          </strong>
          <p>{selectedInvoiceDetail.electronicStatusMessage}</p>
        </div>
      ) : null}

      <div className={styles.invoicingSRIDisclosureDivider}>
        <span className={styles.label}>Controles avanzados</span>
      </div>

      <section className={styles.invoicingSRIAdvancedDisclosure}>
        <button
          aria-expanded={showManualControl}
          className={styles.invoicingSRIAdvancedDisclosureTrigger}
          onClick={() => setShowManualControl((value) => !value)}
          type="button"
        >
          <span className={styles.invoicingSRIAdvancedIcon} aria-hidden="true">
            ⚙
          </span>
          <span>
            <strong>Intervención manual</strong>
            <small>
              Registrar respuesta del SRI o conciliar el estado legal. No es la
              operación diaria.
            </small>
          </span>
          <StatusPill
            tone={
              selectedInvoiceDetail.electronicStatus === 'rejected'
                ? 'danger'
                : 'default'
            }
          >
            {showManualControl ? 'Abierto' : 'Avanzado'}
          </StatusPill>
        </button>

        {showManualControl ? (
          <form
            className={`${styles.invoicingSRIFormCard} ${styles.invoicingSRIInterventionPanel}`}
            onSubmit={(event) => {
              event.preventDefault();
              onUpdateElectronicStatus();
            }}
          >
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>Control manual</span>
                <h3>Registro y conciliación</h3>
              </div>
              <StatusPill tone={readinessBlocked ? 'warning' : 'default'}>
                {readinessBlocked ? 'Con bloqueo' : 'Operación guiada'}
              </StatusPill>
            </div>

            <div className={styles.invoicingSRISectionIntro}>
              <p>
                Usa este bloque cuando necesites registrar una respuesta
                validada, corregir trazabilidad o conciliar una factura ya
                emitida con el estado legal que regresó desde el SRI.
              </p>
            </div>

            {selectedInvoiceDetail.electronicStatus === 'rejected' &&
            selectedInvoiceDetail.electronicStatusMessage ? (
              <div className={styles.invoicingSRIInterventionAlert}>
                <span className={styles.label}>Observación activa</span>
                <strong>
                  El SRI devolvió este comprobante y conviene documentar la
                  causa antes de regenerar.
                </strong>
                <p>{selectedInvoiceDetail.electronicStatusMessage}</p>
              </div>
            ) : null}

            <div className={styles.invoiceInlineGrid}>
              <label className={styles.field}>
                <span>Estado</span>
                <select
                  className={styles.selectField}
                  onChange={(event) =>
                    onInvoiceElectronicStatusChange(
                      event.target.value as
                        | 'pending_submission'
                        | 'submitted'
                        | 'authorized'
                        | 'rejected',
                    )
                  }
                  value={invoiceElectronicStatus}
                >
                  <option value="pending_submission">Pendiente de envio</option>
                  <option value="submitted">Enviado al SRI</option>
                  <option value="authorized">Autorizada</option>
                  <option value="rejected">Rechazada</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>Fecha autorizacion</span>
                <input
                  onChange={(event) =>
                    onInvoiceAuthorizedAtChange(event.target.value)
                  }
                  type="datetime-local"
                  value={invoiceAuthorizedAt}
                />
              </label>
            </div>

            <div className={styles.invoiceInlineGrid}>
              <label className={styles.field}>
                <span>Clave de acceso</span>
                <input
                  onChange={(event) =>
                    onInvoiceAccessKeyChange(event.target.value)
                  }
                  placeholder="49 digitos"
                  value={invoiceAccessKey}
                />
              </label>
              <label className={styles.field}>
                <span>No. autorizacion</span>
                <input
                  onChange={(event) =>
                    onInvoiceAuthorizationNumberChange(event.target.value)
                  }
                  placeholder="Numero de autorizacion SRI"
                  value={invoiceAuthorizationNumber}
                />
              </label>
            </div>

            <label className={styles.field}>
              <span>Mensaje SRI</span>
              <textarea
                onChange={(event) =>
                  onInvoiceElectronicStatusMessageChange(event.target.value)
                }
                placeholder="Detalle tecnico o comercial del estado electronico"
                value={invoiceElectronicStatusMessage}
              />
            </label>

            <div className={styles.inlineActionRow}>
              <button
                className={styles.secondaryButton}
                disabled={
                  actionLoading === 'invoice-electronic-status' ||
                  selectedInvoiceDetail.status === 'draft' ||
                  !canSubmitElectronicDocument
                }
                type="submit"
              >
                {actionLoading === 'invoice-electronic-status'
                  ? 'Actualizando...'
                  : 'Actualizar estado electronico'}
              </button>
            </div>
            <p className={styles.muted}>
              Puedes dejar vacia la clave de acceso para que el backend la
              genere desde el perfil fiscal y la numeracion Ecuador.
            </p>
          </form>
        ) : null}
      </section>

      <section className={styles.invoicingSRIAdvancedDisclosure}>
        <button
          aria-expanded={showFallbackBridge}
          className={styles.invoicingSRIAdvancedDisclosureTrigger}
          onClick={() => setShowFallbackBridge((value) => !value)}
          type="button"
        >
          <span className={styles.invoicingSRIAdvancedIcon} aria-hidden="true">
            ⇄
          </span>
          <span>
            <strong>Fallback XML prefirmado</strong>
            <small>Solo para pruebas de sandbox con firma externa real.</small>
          </span>
          <StatusPill tone="warning">
            {showFallbackBridge ? 'Abierto' : 'Secundario'}
          </StatusPill>
        </button>
        {showFallbackBridge ? (
          <form
            className={`${styles.invoicingSRIFormCard} ${styles.invoicingSRIFallbackPanel}`}
            onSubmit={(event) => {
              event.preventDefault();
              onSubmitPresignedInvoiceElectronicDocument();
            }}
          >
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>External signed XML</span>
                <h3>Puente para sandbox real</h3>
              </div>
              <StatusPill tone="warning">Avanzado</StatusPill>
            </div>

            <div className={styles.invoicingSRISectionIntro}>
              <p>
                Este bloque existe para validar escenarios reales de sandbox
                mientras la firma XAdES nativa del producto sigue en evolución.
                No es la ruta principal del operador.
              </p>
            </div>

            <div className={styles.invoicingSRIFallbackTagRow}>
              <StatusPill>Secundario</StatusPill>
              <small className={styles.muted}>
                Úsalo solo cuando el carril principal no aplique o cuando estés
                validando sandbox con una firma externa real.
              </small>
            </div>

            <label className={styles.field}>
              <span>Signer name</span>
              <input
                onChange={(event) =>
                  onPresignedInvoiceSignerNameChange(event.target.value)
                }
                placeholder="sandbox-signer o nombre del firmador externo"
                value={presignedInvoiceSignerName}
              />
            </label>

            <label className={styles.field}>
              <span>Signed XML</span>
              <textarea
                onChange={(event) =>
                  onPresignedInvoiceXmlChange(event.target.value)
                }
                placeholder="<factura ...><ds:Signature>...</ds:Signature></factura>"
                value={presignedInvoiceXml}
              />
            </label>

            <div className={styles.inlineActionRow}>
              <button
                className={styles.secondaryButton}
                disabled={
                  actionLoading === 'submit-invoice-electronic-document' ||
                  selectedInvoiceDetail.status === 'draft' ||
                  !canSubmitElectronicDocument
                }
                onClick={onSubmitElectronicDocument}
                type="button"
              >
                {actionLoading === 'submit-invoice-electronic-document'
                  ? 'Firmando y enviando...'
                  : 'Firmar y enviar (stub)'}
              </button>
              <button
                className={styles.secondaryButton}
                disabled={
                  actionLoading === 'check-invoice-electronic-authorization' ||
                  !canSubmitElectronicDocument ||
                  selectedInvoiceDetail.electronicStatus !== 'submitted'
                }
                onClick={onCheckAuthorization}
                type="button"
              >
                {actionLoading === 'check-invoice-electronic-authorization'
                  ? 'Consultando autorizacion...'
                  : 'Consultar autorizacion (stub)'}
              </button>
              <button
                className={styles.invoicingSRIDisclosureButtonSecondary}
                disabled={
                  actionLoading ===
                    'submit-presigned-invoice-electronic-document' ||
                  selectedInvoiceDetail.status === 'draft' ||
                  !canSubmitElectronicDocument ||
                  !presignedInvoiceXml.trim()
                }
                type="submit"
              >
                {actionLoading ===
                'submit-presigned-invoice-electronic-document'
                  ? 'Enviando XML firmado...'
                  : 'Enviar XML prefirmado'}
              </button>
            </div>

            <p className={styles.muted}>
              Este camino sirve para probar SRI sandbox con una firma real
              generada fuera del sistema, mientras la firma XAdES nativa del
              repo sigue pendiente.
            </p>
          </form>
        ) : null}
      </section>
    </div>
  );
}

export function InvoicingTechnicalTracePanel({
  formatDate,
  selectedInvoiceDetail,
}: InvoicingTechnicalTracePanelProps) {
  const [showTrace, setShowTrace] = useState(false);

  if (selectedInvoiceDetail.electronicEvents.length === 0) {
    return null;
  }

  return (
    <div className={styles.detailCard}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>Technical trace</span>
          <h3>Historial tecnico SRI</h3>
        </div>
        <StatusPill>
          {selectedInvoiceDetail.electronicEvents.length} evento
          {selectedInvoiceDetail.electronicEvents.length === 1 ? '' : 's'}
        </StatusPill>
      </div>

      <div
        className={`${styles.invoicingSRICompactCard} ${styles.invoicingSRITraceSummaryCard}`}
      >
        <p>
          Este bloque conserva evidencia técnica para soporte y diagnóstico,
          pero no debería competir visualmente con la operación diaria.
        </p>
        <div className={styles.inlineActionRow}>
          <button
            className={styles.ghostButton}
            onClick={() => setShowTrace((value) => !value)}
            type="button"
          >
            {showTrace
              ? 'Ocultar historial técnico'
              : 'Abrir historial técnico'}
          </button>
        </div>
      </div>

      {showTrace ? (
        <div className={styles.stack}>
          {selectedInvoiceDetail.electronicEvents.map((event) => (
            <div className={styles.invoicingSRITraceEventCard} key={event.id}>
              <div className={styles.invoiceCardHeader}>
                <span className={styles.muted}>
                  {event.eventType === 'submission'
                    ? 'Envio'
                    : 'Consulta de autorizacion'}
                </span>
                <StatusPill tone={providerStatusTone(event.providerStatus)}>
                  {event.providerStatus}
                </StatusPill>
              </div>
              <strong>
                {event.provider}
                {event.endpoint ? ` · ${event.endpoint}` : ''}
              </strong>
              <small>{formatDate(event.occurredAt)}</small>
              <p className={styles.invoicingSRITraceMessage}>{event.message}</p>
              {event.sriDiagnostics?.summary ? (
                <small>Diagnostico SRI: {event.sriDiagnostics.summary}</small>
              ) : null}
              <small>
                {event.soapAction
                  ? `SOAP ${event.soapAction}`
                  : 'Sin SOAP action'}
              </small>
              {event.submissionReference ? (
                <small>Ref: {event.submissionReference}</small>
              ) : null}
              {event.authorizationNumber ? (
                <small>Autorizacion: {event.authorizationNumber}</small>
              ) : null}
              {event.sriDiagnostics?.messages.length ? (
                <details className={styles.invoicingSRITraceDetails}>
                  <summary>Mensajes estructurados SRI</summary>
                  <div className={styles.stack}>
                    {event.sriDiagnostics.messages.map((message, index) => (
                      <div
                        className={styles.invoicingSRITraceNestedCard}
                        key={`${event.id}-sri-message-${index}`}
                      >
                        <small>
                          {message.identifier
                            ? `Identificador ${message.identifier}`
                            : 'Mensaje SRI'}
                        </small>
                        <strong>{message.message}</strong>
                        {message.additionalInfo.map((detail, detailIndex) => (
                          <small
                            key={`${event.id}-sri-message-${index}-detail-${detailIndex}`}
                          >
                            {detail}
                          </small>
                        ))}
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
              {event.requestPayload ? (
                <details className={styles.invoicingSRITraceDetails}>
                  <summary>Request payload</summary>
                  <pre className={styles.codeBlock}>{event.requestPayload}</pre>
                </details>
              ) : null}
              {event.responsePayload ? (
                <details className={styles.invoicingSRITraceDetails}>
                  <summary>Response payload</summary>
                  <pre className={styles.codeBlock}>
                    {event.responsePayload}
                  </pre>
                </details>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

type BuildNextStepInput = {
  actionLoading: string | null;
  canSubmitElectronicDocument: boolean;
  invoiceAccessKey: string;
  onCheckAuthorization: () => void;
  onLoadXmlPreview: () => void;
  onSubmitElectronicDocument: () => void;
  onToggleFallback: () => void;
  onToggleManualControl: () => void;
  selectedInvoiceDetail: InvoiceDetailResponse;
  selectedInvoiceDocumentSupport:
    | ElectronicSandboxReadinessResponse['documentSupport'][number]
    | null;
};

function buildNextStep({
  actionLoading,
  canSubmitElectronicDocument,
  invoiceAccessKey,
  onCheckAuthorization,
  onLoadXmlPreview,
  onSubmitElectronicDocument,
  onToggleFallback,
  onToggleManualControl,
  selectedInvoiceDetail,
  selectedInvoiceDocumentSupport,
}: BuildNextStepInput) {
  const unsupported = selectedInvoiceDocumentSupport?.submitSupported === false;
  const status = selectedInvoiceDetail.electronicStatus;
  const readinessBlocked = !canSubmitElectronicDocument;

  if (unsupported) {
    return {
      description:
        selectedInvoiceDocumentSupport?.detail ??
        'Este documento todavía necesita una ruta alternativa de operación.',
      footnote:
        'El camino normal queda bloqueado mientras el soporte siga incompleto.',
      pill: 'Compatibilidad',
      primaryAction: (
        <button
          className={styles.secondaryButton}
          onClick={onToggleFallback}
          type="button"
        >
          Ver fallback técnico
        </button>
      ),
      secondaryAction: (
        <button
          className={styles.ghostButton}
          disabled={actionLoading === 'load-invoice-xml-preview'}
          onClick={onLoadXmlPreview}
          type="button"
        >
          {actionLoading === 'load-invoice-xml-preview'
            ? 'Cargando XML...'
            : 'Ver XML preliminar'}
        </button>
      ),
      title:
        'Este tipo de comprobante aún no sigue la ruta automática del SRI.',
      tone: 'warning' as const,
    };
  }

  if (readinessBlocked) {
    return {
      description:
        'Hay un bloqueo activo en el carril electrónico. Conviene resolverlo antes de firmar, enviar o conciliar el comprobante.',
      footnote:
        'El documento se mantiene seguro; solo pausamos las acciones que podrían generar una falsa sensación de autorización.',
      pill: 'Bloqueado',
      primaryAction: (
        <button
          className={styles.primaryButton}
          onClick={onToggleManualControl}
          type="button"
        >
          Revisar intervención
        </button>
      ),
      secondaryAction: (
        <button
          className={styles.ghostButton}
          disabled={actionLoading === 'load-invoice-xml-preview'}
          onClick={onLoadXmlPreview}
          type="button"
        >
          {actionLoading === 'load-invoice-xml-preview'
            ? 'Cargando XML...'
            : 'Ver XML preliminar'}
        </button>
      ),
      title: 'Primero resolvamos el bloqueo del readiness SRI.',
      tone: 'danger' as const,
    };
  }

  if (status === 'submitted') {
    return {
      description:
        'El SRI ya recibió el comprobante. El siguiente paso correcto es consultar la autorización; todavía no debe tratarse como un documento autorizado.',
      footnote: selectedInvoiceDetail.submittedAt
        ? `Último envío registrado: ${selectedInvoiceDetail.submittedAt}. Esto no implica autorización.`
        : 'El envío está registrado, pero aún no hay confirmación de autorización.',
      pill: 'En seguimiento',
      primaryAction: (
        <button
          className={styles.primaryButton}
          disabled={
            actionLoading === 'check-invoice-electronic-authorization' ||
            !canSubmitElectronicDocument
          }
          onClick={onCheckAuthorization}
          type="button"
        >
          {actionLoading === 'check-invoice-electronic-authorization'
            ? 'Consultando autorización...'
            : 'Consultar autorización'}
        </button>
      ),
      secondaryAction: (
        <button
          className={styles.ghostButton}
          onClick={onToggleManualControl}
          type="button"
        >
          Revisar intervención
        </button>
      ),
      title: 'El SRI está procesando este comprobante.',
      tone: 'warning' as const,
    };
  }

  if (status === 'authorized') {
    return {
      description:
        'El comprobante ya es legalmente válido. Mantén visibles la clave de acceso y el número de autorización para soporte, contabilidad y tributación.',
      footnote: invoiceAccessKey.trim()
        ? 'Puedes copiar los datos de autorización desde este mismo panel.'
        : null,
      pill: 'Autorizado',
      primaryAction: (
        <button
          className={styles.secondaryButton}
          disabled={actionLoading === 'load-invoice-xml-preview'}
          onClick={onLoadXmlPreview}
          type="button"
        >
          {actionLoading === 'load-invoice-xml-preview'
            ? 'Cargando XML...'
            : 'Ver XML autorizado'}
        </button>
      ),
      secondaryAction: (
        <button
          className={styles.ghostButton}
          onClick={onToggleManualControl}
          type="button"
        >
          Ver detalle SRI
        </button>
      ),
      title: 'El comprobante ya fue autorizado por el SRI.',
      tone: 'success' as const,
    };
  }

  if (status === 'rejected') {
    return {
      description:
        'Conviene revisar la observación del SRI, corregir la causa documentada y recién después regenerar el artefacto correcto.',
      footnote:
        selectedInvoiceDetail.electronicStatusMessage ??
        'La devolución del SRI debe quedar documentada antes de cualquier nuevo intento.',
      pill: 'Rechazado',
      primaryAction: (
        <button
          className={styles.primaryButton}
          onClick={onToggleManualControl}
          type="button"
        >
          Revisar observación
        </button>
      ),
      secondaryAction: (
        <button
          className={styles.ghostButton}
          disabled={actionLoading === 'load-invoice-xml-preview'}
          onClick={onLoadXmlPreview}
          type="button"
        >
          {actionLoading === 'load-invoice-xml-preview'
            ? 'Cargando XML...'
            : 'Ver XML preliminar'}
        </button>
      ),
      title: 'El SRI devolvió este comprobante.',
      tone: 'danger' as const,
    };
  }

  return {
    description:
      'La firma, el gateway y la numeración ya permiten avanzar. El siguiente paso operativo es firmar y enviar el comprobante al SRI.',
    footnote: invoiceAccessKey.trim()
      ? 'La clave de acceso ya está preparada para el envío.'
      : 'La clave de acceso puede derivarse desde el backend al momento de operar.',
    pill: 'Listo para enviar',
    primaryAction: (
      <button
        className={styles.primaryButton}
        disabled={
          actionLoading === 'submit-invoice-electronic-document' ||
          selectedInvoiceDetail.status === 'draft' ||
          !canSubmitElectronicDocument
        }
        onClick={onSubmitElectronicDocument}
        type="button"
      >
        {actionLoading === 'submit-invoice-electronic-document'
          ? 'Firmando y enviando...'
          : 'Firmar y enviar al SRI'}
      </button>
    ),
    secondaryAction: (
      <button
        className={styles.ghostButton}
        disabled={actionLoading === 'load-invoice-xml-preview'}
        onClick={onLoadXmlPreview}
        type="button"
      >
        {actionLoading === 'load-invoice-xml-preview'
          ? 'Cargando XML...'
          : 'Ver XML preliminar'}
      </button>
    ),
    title: 'Tu siguiente paso es iniciar el envío al SRI.',
    tone: 'default' as const,
  };
}

function StatusTriad({
  accessKeyReady,
  documentStatus,
  electronicStatus,
}: {
  accessKeyReady: boolean;
  documentStatus: string;
  electronicStatus: string | null;
}) {
  const items = [
    {
      key: 'document',
      label: 'Documento',
      value: humanizeDocumentStatus(documentStatus),
      detail: 'Condición operativa interna',
      tone: 'default' as const,
    },
    {
      key: 'sri',
      label: 'Estado SRI',
      value: humanizeElectronicStatus(electronicStatus),
      detail: 'Condición legal del comprobante',
      tone: statusPillTone(electronicStatus),
    },
    {
      key: 'access-key',
      label: 'Clave de acceso',
      value: accessKeyReady ? 'Lista' : 'Derivable',
      detail: accessKeyReady
        ? 'Disponible para evidencia y soporte'
        : 'El backend puede componerla',
      tone: accessKeyReady ? 'success' : 'default',
    },
  ];

  return (
    <div className={styles.invoicingSRIStatusTriad}>
      {items.map((item) => (
        <div className={styles.invoicingSRIStatusTile} key={item.key}>
          <span className={styles.muted}>{item.label}</span>
          <div className={styles.invoiceCardHeader}>
            <strong>{item.value}</strong>
            <StatusPill tone={item.tone}>{item.label}</StatusPill>
          </div>
          <small>{item.detail}</small>
        </div>
      ))}
    </div>
  );
}

function SRIStageStepper({ status }: { status: string | null }) {
  const currentStage = sriStageIndex(status);

  return (
    <div className={styles.invoicingSRIStageStepper}>
      {['Preparado', 'Enviado al SRI', 'Autorizado'].map((label, index) => {
        const isRejected = status === 'rejected' && index === 1;
        const isDone = index < currentStage;
        const isCurrent = index === currentStage;
        const toneClass = isRejected
          ? styles.invoicingStepperNodeDanger
          : isDone
            ? styles.invoicingStepperNodeSuccess
            : isCurrent
              ? styles.invoicingStepperNodeWarning
              : styles.invoicingStepperNodeNeutral;

        return (
          <div className={styles.invoicingStepperStep} key={label}>
            <span
              className={`${styles.invoicingStepperNode} ${toneClass}`.trim()}
            >
              {isRejected ? '!' : index + 1}
            </span>
            <small>{isRejected ? 'Rechazado' : label}</small>
          </div>
        );
      })}
    </div>
  );
}

function CopyValueCard({
  copyable = true,
  label,
  value,
}: {
  copyable?: boolean;
  label: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!copyable || !value) {
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className={styles.invoicingSRICopyCard}>
      <span className={styles.muted}>{label}</span>
      <strong className={styles.invoicingSRICopyValue}>{value}</strong>
      <button
        className={styles.ghostButton}
        disabled={!copyable || !value}
        onClick={() => {
          void handleCopy();
        }}
        type="button"
      >
        {copied ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  );
}

function sriStageIndex(status: string | null) {
  switch (status) {
    case 'authorized':
      return 2;
    case 'submitted':
    case 'rejected':
      return 1;
    default:
      return 0;
  }
}

function statusPillTone(status: string | null) {
  switch (status) {
    case 'authorized':
      return 'success' as const;
    case 'submitted':
      return 'warning' as const;
    case 'rejected':
      return 'danger' as const;
    default:
      return 'default' as const;
  }
}

function providerStatusTone(status: string) {
  if (
    status.toLowerCase().includes('rechaz') ||
    status.toLowerCase().includes('error') ||
    status.toLowerCase().includes('no autorizado')
  ) {
    return 'danger' as const;
  }

  if (
    status.toLowerCase().includes('autoriz') ||
    status.toLowerCase().includes('ok')
  ) {
    return 'success' as const;
  }

  if (
    status.toLowerCase().includes('pend') ||
    status.toLowerCase().includes('proc')
  ) {
    return 'warning' as const;
  }

  return 'default' as const;
}

function humanizeElectronicStatus(status: string | null) {
  switch (status) {
    case 'pending_submission':
      return 'Pendiente de envío';
    case 'submitted':
      return 'Enviado al SRI';
    case 'authorized':
      return 'Autorizado';
    case 'rejected':
      return 'Rechazado';
    default:
      return 'Sin estado';
  }
}

function humanizeDocumentStatus(status: string) {
  switch (status) {
    case 'draft':
      return 'Borrador';
    case 'issued':
      return 'Emitida';
    case 'partially_paid':
      return 'Cobro parcial';
    case 'paid':
      return 'Pagada';
    case 'void':
      return 'Anulada';
    default:
      return status;
  }
}
