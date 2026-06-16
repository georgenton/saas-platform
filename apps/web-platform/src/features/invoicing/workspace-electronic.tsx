import { useMemo, useState } from 'react';
import styles from '../../app/app.module.css';
import type {
  ElectronicSandboxReadinessResponse,
  InvoiceDetailResponse,
} from '../../app/types';
import { StatusPill } from '../../shared/design-system/status-pill';

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
    value:
      | 'pending_submission'
      | 'submitted'
      | 'authorized'
      | 'rejected',
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
  const [showFallbackBridge, setShowFallbackBridge] = useState(false);

  const electronicStageTone =
    selectedInvoiceDetail.electronicStatus === 'authorized'
      ? 'success'
      : selectedInvoiceDetail.electronicStatus === 'rejected'
        ? 'danger'
        : selectedInvoiceDetail.electronicStatus === 'submitted'
          ? 'warning'
          : 'default';

  const readinessBlocked = useMemo(
    () =>
      !canSubmitElectronicDocument ||
      Boolean(
        selectedInvoiceDocumentSupport &&
          !selectedInvoiceDocumentSupport.submitSupported,
      ),
    [canSubmitElectronicDocument, selectedInvoiceDocumentSupport],
  );

  const setupSummary = readinessBlocked
    ? 'Necesita intervención antes de operar con el SRI.'
    : 'La base electrónica está usable; entra al detalle solo si vas a conciliar, corregir o revisar evidencia.';
  const fallbackSummary = presignedInvoiceXml.trim()
    ? 'Hay un XML prefirmado listo para pruebas reales de sandbox.'
    : 'Ruta reservada para pruebas avanzadas con firma externa.';

  return (
    <div className={styles.detailCard}>
      <div className={styles.sectionHeading}>
        <div>
          <span className={styles.label}>Electronic status</span>
          <h3>Autorizacion SRI</h3>
        </div>
        <StatusPill tone={electronicStageTone}>
          {selectedInvoiceDetail.electronicStatus === 'authorized'
            ? 'Autorizada'
            : selectedInvoiceDetail.electronicStatus === 'rejected'
              ? 'Rechazada'
              : selectedInvoiceDetail.electronicStatus === 'submitted'
                ? 'En el SRI'
                : selectedInvoiceDetail.electronicStatus === 'pending_submission'
                  ? 'Pendiente'
                  : 'Borrador'}
        </StatusPill>
      </div>

      <div className={styles.invoicingSRIOverview}>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Documento</span>
          <strong>{humanizeDocumentStatus(selectedInvoiceDetail.status)}</strong>
          <small>Condición operativa interna</small>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Estado SRI</span>
          <strong>
            {humanizeElectronicStatus(selectedInvoiceDetail.electronicStatus)}
          </strong>
          <small>Condición legal del comprobante</small>
        </div>
        <div className={styles.commercialCard}>
          <span className={styles.muted}>Clave de acceso</span>
          <strong>{invoiceAccessKey.trim() ? 'Lista' : 'Derivable'}</strong>
          <small>
            {invoiceAccessKey.trim()
              ? 'Se enviará la clave indicada'
              : 'El backend puede componerla'}
          </small>
        </div>
      </div>

      <div className={styles.invoicingSRIActionCue}>
        <strong>{primaryGuidance(selectedInvoiceDetail.electronicStatus)}</strong>
        <p>
          {secondaryGuidance(
            selectedInvoiceDetail.electronicStatus,
            canSubmitElectronicDocument,
          )}
        </p>
      </div>

      <div className={styles.invoicingSRICompactRow}>
        <div className={styles.invoicingSRICompactCard}>
          <div className={styles.invoiceCardHeader}>
            <strong>Configuración y conciliación</strong>
            <StatusPill tone={readinessBlocked ? 'warning' : 'success'}>
              {readinessBlocked ? 'Atención' : 'Compacto'}
            </StatusPill>
          </div>
          <p>{setupSummary}</p>
          <div className={styles.invoicingSRICompactFacts}>
            <small>
              Documento: {humanizeDocumentStatus(selectedInvoiceDetail.status)}
            </small>
            <small>
              Legal: {humanizeElectronicStatus(selectedInvoiceDetail.electronicStatus)}
            </small>
          </div>
          <div className={styles.inlineActionRow}>
            <button
              className={styles.secondaryButton}
              onClick={() => setShowManualControl((value) => !value)}
              type="button"
            >
              {showManualControl ? 'Ocultar detalle SRI' : 'Ver detalle SRI'}
            </button>
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
          </div>
        </div>

        <div className={styles.invoicingSRICompactCard}>
          <div className={styles.invoiceCardHeader}>
            <strong>Sandbox real / fallback técnico</strong>
            <StatusPill>Opcional</StatusPill>
          </div>
          <p>{fallbackSummary}</p>
          <div className={styles.invoicingSRICompactFacts}>
            <small>
              Úsalo cuando necesites probar sandbox con firma externa real.
            </small>
          </div>
          <div className={styles.inlineActionRow}>
            <button
              className={styles.ghostButton}
              onClick={() => setShowFallbackBridge((value) => !value)}
              type="button"
            >
              {showFallbackBridge ? 'Ocultar fallback' : 'Ver fallback técnico'}
            </button>
          </div>
        </div>
      </div>

      {selectedInvoiceDocumentSupport && !selectedInvoiceDocumentSupport.submitSupported ? (
        <div className={styles.invoicingReadinessBlockers}>
          <strong>Compatibilidad documental</strong>
          <p>{documentSupportDetail}</p>
        </div>
      ) : null}

      {showManualControl ? (
        <form
          className={styles.invoicingSRIFormCard}
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
              Usa este bloque cuando necesites registrar una respuesta validada,
              corregir trazabilidad o conciliar una factura ya emitida con el
              estado legal que regresó desde el SRI.
            </p>
          </div>

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
                onChange={(event) => onInvoiceAuthorizedAtChange(event.target.value)}
                type="datetime-local"
                value={invoiceAuthorizedAt}
              />
            </label>
          </div>

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Clave de acceso</span>
              <input
                onChange={(event) => onInvoiceAccessKeyChange(event.target.value)}
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
            Puedes dejar vacia la clave de acceso para que el backend la genere
            desde el perfil fiscal y la numeracion Ecuador.
          </p>
        </form>
      ) : null}

      {showFallbackBridge ? (
        <form
          className={styles.invoicingSRIFormCard}
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
            <StatusPill>Fallback</StatusPill>
          </div>

          <div className={styles.invoicingSRISectionIntro}>
            <p>
              Este bloque existe para validar escenarios reales de sandbox
              mientras la firma XAdES nativa del producto sigue en evolución. No
              es la ruta principal del operador.
            </p>
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
              onChange={(event) => onPresignedInvoiceXmlChange(event.target.value)}
              placeholder="<factura ...><ds:Signature>...</ds:Signature></factura>"
              value={presignedInvoiceXml}
            />
          </label>

          <div className={styles.inlineActionRow}>
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
              className={styles.primaryButton}
              disabled={
                actionLoading === 'submit-presigned-invoice-electronic-document' ||
                selectedInvoiceDetail.status === 'draft' ||
                !canSubmitElectronicDocument ||
                !presignedInvoiceXml.trim()
              }
              type="submit"
            >
              {actionLoading === 'submit-presigned-invoice-electronic-document'
                ? 'Enviando XML firmado...'
                : 'Enviar XML prefirmado'}
            </button>
          </div>

          <p className={styles.muted}>
            Este camino sirve para probar SRI sandbox con una firma real generada
            fuera del sistema, mientras la firma XAdES nativa del repo sigue
            pendiente.
          </p>
        </form>
      ) : null}
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

      <div className={styles.invoicingSRICompactCard}>
        <p>
          Este bloque conserva evidencia técnica para soporte y diagnóstico, pero
          no debería competir visualmente con la operación diaria.
        </p>
        <div className={styles.inlineActionRow}>
          <button
            className={styles.ghostButton}
            onClick={() => setShowTrace((value) => !value)}
            type="button"
          >
            {showTrace ? 'Ocultar historial técnico' : 'Ver historial técnico'}
          </button>
        </div>
      </div>

      {showTrace ? (
        <div className={styles.stack}>
          {selectedInvoiceDetail.electronicEvents.map((event) => (
            <div className={styles.detailCard} key={event.id}>
              <span className={styles.muted}>
                {event.eventType === 'submission'
                  ? 'Envio'
                  : 'Consulta de autorizacion'}
              </span>
              <strong>
                {event.provider} / {event.providerStatus}
              </strong>
              <small>{formatDate(event.occurredAt)}</small>
              <small>{event.message}</small>
              {event.sriDiagnostics?.summary ? (
                <small>Diagnostico SRI: {event.sriDiagnostics.summary}</small>
              ) : null}
              <small>
                {event.soapAction ? `SOAP ${event.soapAction}` : 'Sin SOAP action'}
                {event.endpoint ? ` · ${event.endpoint}` : ''}
              </small>
              {event.submissionReference ? (
                <small>Ref: {event.submissionReference}</small>
              ) : null}
              {event.authorizationNumber ? (
                <small>Autorizacion: {event.authorizationNumber}</small>
              ) : null}
              {event.sriDiagnostics?.messages.length ? (
                <details>
                  <summary>Mensajes estructurados SRI</summary>
                  <div className={styles.stack}>
                    {event.sriDiagnostics.messages.map((message, index) => (
                      <div
                        className={styles.detailCard}
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
                <details>
                  <summary>Request payload</summary>
                  <pre className={styles.codeBlock}>{event.requestPayload}</pre>
                </details>
              ) : null}
              {event.responsePayload ? (
                <details>
                  <summary>Response payload</summary>
                  <pre className={styles.codeBlock}>{event.responsePayload}</pre>
                </details>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
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

function primaryGuidance(electronicStatus: string | null) {
  switch (electronicStatus) {
    case 'submitted':
      return 'Tu siguiente decisión es consultar la autorización del SRI.';
    case 'authorized':
      return 'El comprobante ya está listo para handoff tributario y contable.';
    case 'rejected':
      return 'Conviene corregir observaciones antes de regenerar el envío.';
    case 'pending_submission':
      return 'El siguiente paso operativo es firmar y enviar el comprobante.';
    default:
      return 'Primero confirma el estado documental antes de avanzar con SRI.';
  }
}

function secondaryGuidance(
  electronicStatus: string | null,
  canSubmitElectronicDocument: boolean,
) {
  if (!canSubmitElectronicDocument) {
    return 'Hay un bloqueo activo en el carril electrónico. Conviene resolverlo antes de intentar enviar o conciliar.';
  }

  switch (electronicStatus) {
    case 'submitted':
      return 'El documento ya fue entregado al SRI. Desde aquí solo deberías consultar autorización o registrar una respuesta manual validada.';
    case 'authorized':
      return 'Mantén visibles la clave de acceso y el número de autorización para soporte, contabilidad y fiscalidad.';
    case 'rejected':
      return 'Usa el mensaje SRI para documentar la devolución y luego regenera el artefacto correcto.';
    case 'pending_submission':
      return 'Puedes revisar el XML preliminar, validar clave de acceso y luego iniciar el envío.';
    default:
      return 'Este panel separa claramente la condición interna del documento de su condición legal frente al SRI.';
  }
}
