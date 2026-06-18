import styles from '../../app/app.module.css';
import type {
  InvoiceDocumentResponse,
  InvoiceDetailResponse,
  InvoiceElectronicArtifactsResponse,
  InvoiceRideResponse,
} from '../../app/types';
import {
  deriveCloseoutNextStep,
  deriveCloseoutVerdict,
  deriveDeliveryCloseoutMeta,
  deriveDeliveryCloseoutStatus,
  derivePaymentCloseoutMeta,
  derivePaymentCloseoutStatus,
  deriveSriCloseoutStatus,
  type InvoicingCloseoutTone,
} from './closeout';
import { canPrintRideAsAuthorized } from './documents/authorization';
import {
  deriveDocumentReadiness,
  type DocumentReadinessCheck,
} from './documents/readiness';

type InvoicingDocumentPreviewPanelProps = {
  actionLoading: string | null;
  formatBuyerIdentificationType: (value: string | null) => string;
  formatElectronicDocumentLabel: (value: string | null) => string;
  formatElectronicStatus: (value: string | null) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
  formatPercentage: (value: number) => string;
  onDownloadElectronicRide: () => void;
  onDownloadElectronicXml: () => void;
  onOpenElectronicRide: () => void;
  onOpenPrintableInvoice: () => void;
  selectedInvoiceArtifacts: InvoiceElectronicArtifactsResponse | null;
  selectedInvoiceDocument: InvoiceDocumentResponse | null;
  selectedInvoiceRide: InvoiceRideResponse | null;
};

type InvoicingNotificationsPanelProps = {
  actionLoading: string | null;
  formatElectronicStatus: (value: string | null) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
  invoiceEmailMessage: string;
  invoiceEmailRecipient: string;
  onInvoiceEmailMessageChange: (value: string) => void;
  onInvoiceEmailRecipientChange: (value: string) => void;
  onSendInvoiceEmail: () => void;
  selectedInvoiceDetail: InvoiceDetailResponse;
};

type Tone = 'danger' | 'info' | 'neutral' | 'success' | 'warning';

const invoiceStatusLabels: Record<string, string> = {
  draft: 'Borrador',
  issued: 'Emitida',
  paid: 'Pagada',
  void: 'Anulada',
};

const environmentLabels: Record<string, string> = {
  production: 'Producción',
  testing: 'Pruebas',
};

function getElectronicTone(status: string | null): Tone {
  if (status === 'authorized') {
    return 'success';
  }

  if (status === 'returned' || status === 'rejected') {
    return 'danger';
  }

  if (status === 'signed' || status === 'submitted') {
    return 'info';
  }

  return 'neutral';
}

function getInvoiceStatusLabel(status: string): string {
  return invoiceStatusLabels[status] ?? status;
}

function getEnvironmentLabel(value: string | null): string {
  if (!value) {
    return 'No configurado';
  }

  return environmentLabels[value] ?? value;
}

function formatSequence(value: number | null): string {
  return value === null ? 'Manual' : String(value).padStart(9, '0');
}

function ReadinessCheckPill({ check }: { check: DocumentReadinessCheck }) {
  return (
    <div
      className={
        check.ok
          ? `${styles.invoicingDocumentReadinessCheck} ${styles.invoicingDocumentReadinessCheckSuccess}`
          : `${styles.invoicingDocumentReadinessCheck} ${styles.invoicingDocumentReadinessCheckWarning}`
      }
      title={check.detail}
    >
      <span aria-hidden="true">{check.ok ? '✓' : '!'}</span>
      <div>
        <strong>{check.label}</strong>
        <small>{check.ok ? 'Completo' : 'Por revisar'}</small>
      </div>
    </div>
  );
}

function closeoutToneClass(tone: InvoicingCloseoutTone): string {
  if (tone === 'success') {
    return styles.statusPillSuccess;
  }

  if (tone === 'warning') {
    return styles.statusPillWarning;
  }

  if (tone === 'danger') {
    return styles.statusPillDanger;
  }

  if (tone === 'info') {
    return styles.statusPillInfo;
  }

  return '';
}

function CloseoutStatusCard({
  detail,
  label,
  tone,
  title,
}: {
  detail: string;
  label: string;
  tone: InvoicingCloseoutTone;
  title: string;
}) {
  return (
    <div className={styles.invoicingCloseoutTriadCard}>
      <span className={styles.label}>{title}</span>
      <strong>{label}</strong>
      <small>{detail}</small>
      <span className={`${styles.statusPill} ${closeoutToneClass(tone)}`}>
        {label}
      </span>
    </div>
  );
}

function DocumentFact({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className={styles.invoicingDocumentFactRow}>
      <span>{label}</span>
      <strong>{value?.trim() ? value : 'Sin dato'}</strong>
    </div>
  );
}

export function InvoicingDocumentPreviewPanel({
  actionLoading,
  formatBuyerIdentificationType,
  formatElectronicDocumentLabel,
  formatElectronicStatus,
  formatMoney,
  formatPercentage,
  onDownloadElectronicRide,
  onDownloadElectronicXml,
  onOpenElectronicRide,
  onOpenPrintableInvoice,
  selectedInvoiceArtifacts,
  selectedInvoiceDocument,
  selectedInvoiceRide,
}: InvoicingDocumentPreviewPanelProps) {
  if (!selectedInvoiceDocument) {
    return (
      <div className={styles.documentPreview}>
        <div className={styles.emptyState}>
          <span className={styles.label}>Invoicing · Revisión</span>
          <h3>Selecciona una factura para revisar</h3>
          <p>
            Elige una factura del listado para ver emisor, comprador,
            numeración, líneas, totales y artefactos disponibles.
          </p>
        </div>
      </div>
    );
  }

  const readinessChecks = deriveDocumentReadiness(selectedInvoiceDocument);
  const isReady = readinessChecks.every((check) => check.ok);
  const electronicTone = getElectronicTone(
    selectedInvoiceDocument.invoice.electronicStatus,
  );
  const isAuthorizedRide = canPrintRideAsAuthorized({
    document: selectedInvoiceDocument,
    ride: selectedInvoiceRide,
  });
  const currency = selectedInvoiceDocument.invoice.currency;

  return (
    <div className={styles.invoicingDocumentReview}>
      <section className={styles.invoicingDocumentReviewHero}>
        <div className={styles.invoicingDocumentReviewHeroMain}>
          <div>
            <span className={styles.label}>Invoicing · Revisión</span>
            <h3>
              {formatElectronicDocumentLabel(
                selectedInvoiceDocument.invoice.documentCode,
              )}{' '}
              {selectedInvoiceDocument.invoice.number}
            </h3>
            <p>
              Revisa el documento antes de abrir RIDE o XML. Esta superficie no
              firma, no envía al SRI y no marca autorización legal.
            </p>
          </div>
          <span
            className={
              isReady
                ? `${styles.statusPill} ${styles.statusPillSuccess}`
                : `${styles.statusPill} ${styles.statusPillWarning}`
            }
          >
            {isReady ? 'Listo para revisar' : 'Datos por revisar'}
          </span>
        </div>

        <div className={styles.invoicingDocumentReviewHeroMeta}>
          <span className={styles.statusPill}>
            {getInvoiceStatusLabel(selectedInvoiceDocument.invoice.status)}
          </span>
          <span
            className={`${styles.statusPill} ${
              electronicTone === 'success'
                ? styles.statusPillSuccess
                : electronicTone === 'danger'
                  ? styles.statusPillDanger
                  : electronicTone === 'info'
                    ? styles.statusPillInfo
                    : ''
            }`}
          >
            {formatElectronicStatus(
              selectedInvoiceDocument.invoice.electronicStatus,
            )}
          </span>
          <span className={styles.statusPill}>
            {getEnvironmentLabel(selectedInvoiceDocument.issuer.environment)}
          </span>
        </div>
      </section>

      <section className={styles.invoicingDocumentReadinessGrid}>
        {readinessChecks.map((check) => (
          <ReadinessCheckPill check={check} key={check.key} />
        ))}
      </section>

      <div className={styles.invoicingDocumentReviewLayout}>
        <div className={styles.invoicingDocumentReviewMain}>
          <section className={styles.invoicingDocumentReviewIdentityGrid}>
            <article className={styles.invoicingDocumentReviewCard}>
              <div className={styles.invoiceCardHeader}>
                <div>
                  <span className={styles.label}>Emisor</span>
                  <h3>{selectedInvoiceDocument.issuer.legalName}</h3>
                </div>
                <span className={styles.statusPill}>Fiscal</span>
              </div>
              <div className={styles.invoicingDocumentFactList}>
                <DocumentFact
                  label="RUC"
                  value={selectedInvoiceDocument.issuer.taxId}
                />
                <DocumentFact
                  label="Nombre comercial"
                  value={selectedInvoiceDocument.issuer.commercialName}
                />
                <DocumentFact
                  label="Ambiente"
                  value={getEnvironmentLabel(
                    selectedInvoiceDocument.issuer.environment,
                  )}
                />
                <DocumentFact
                  label="Emisión"
                  value={selectedInvoiceDocument.issuer.emissionType}
                />
                <DocumentFact
                  label="Dirección matriz"
                  value={selectedInvoiceDocument.issuer.matrixAddress}
                />
              </div>
            </article>

            <article className={styles.invoicingDocumentReviewCard}>
              <div className={styles.invoiceCardHeader}>
                <div>
                  <span className={styles.label}>Comprador</span>
                  <h3>{selectedInvoiceDocument.customer.name}</h3>
                </div>
                <span className={styles.statusPill}>Cliente</span>
              </div>
              <div className={styles.invoicingDocumentFactList}>
                <DocumentFact
                  label="Tipo"
                  value={
                    selectedInvoiceDocument.customer.identificationType
                      ? formatBuyerIdentificationType(
                          selectedInvoiceDocument.customer.identificationType,
                        )
                      : null
                  }
                />
                <DocumentFact
                  label="Identificación"
                  value={
                    selectedInvoiceDocument.customer.identification ??
                    selectedInvoiceDocument.customer.taxId
                  }
                />
                <DocumentFact
                  label="Email"
                  value={selectedInvoiceDocument.customer.email}
                />
                <DocumentFact
                  label="Dirección"
                  value={selectedInvoiceDocument.customer.billingAddress}
                />
              </div>
            </article>
          </section>

          <section className={styles.invoicingDocumentReviewCard}>
            <div className={styles.invoiceCardHeader}>
              <div>
                <span className={styles.label}>Numeración y contexto</span>
                <h3>{selectedInvoiceDocument.invoice.number}</h3>
              </div>
              <span className={styles.statusPill}>
                {formatElectronicDocumentLabel(
                  selectedInvoiceDocument.invoice.documentCode,
                )}
              </span>
            </div>
            <div className={styles.invoicingDocumentNumberingGrid}>
              <DocumentFact
                label="CodDoc"
                value={selectedInvoiceDocument.invoice.documentCode}
              />
              <DocumentFact
                label="Serie"
                value={`${selectedInvoiceDocument.invoice.establishmentCode ?? '---'}-${selectedInvoiceDocument.invoice.emissionPointCode ?? '---'}`}
              />
              <DocumentFact
                label="Secuencial"
                value={formatSequence(
                  selectedInvoiceDocument.invoice.sequenceNumber,
                )}
              />
              <DocumentFact
                label="Emitida"
                value={selectedInvoiceDocument.invoice.issuedAt}
              />
              <DocumentFact
                label="Vence"
                value={selectedInvoiceDocument.invoice.dueAt}
              />
            </div>
          </section>

          <section className={styles.invoicingDocumentReviewCard}>
            <div className={styles.invoiceCardHeader}>
              <div>
                <span className={styles.label}>Líneas del documento</span>
                <h3>
                  {selectedInvoiceDocument.lines.length}{' '}
                  {selectedInvoiceDocument.lines.length === 1
                    ? 'línea'
                    : 'líneas'}
                </h3>
              </div>
              <span className={styles.statusPill}>
                Total{' '}
                {formatMoney(
                  selectedInvoiceDocument.totals.totalInCents,
                  currency,
                )}
              </span>
            </div>
            <div className={styles.invoicingDocumentLineList}>
              {selectedInvoiceDocument.lines.length > 0 ? (
                selectedInvoiceDocument.lines.map((line) => (
                  <div
                    className={styles.invoicingDocumentLineRow}
                    key={line.id}
                  >
                    <span className={styles.invoicingDocumentLinePosition}>
                      {line.position}
                    </span>
                    <div>
                      <strong>{line.description}</strong>
                      <small>
                        {line.quantity} x{' '}
                        {formatMoney(line.unitPriceInCents, currency)} ·{' '}
                        {line.taxRateName && line.taxRatePercentage !== null
                          ? `${line.taxRateName} ${formatPercentage(
                              line.taxRatePercentage,
                            )}%`
                          : 'Sin impuesto'}{' '}
                        · IVA {formatMoney(line.lineTaxInCents, currency)}
                      </small>
                    </div>
                    <strong className={styles.invoicingDocumentLineTotal}>
                      {formatMoney(line.lineTotalInCents, currency)}
                    </strong>
                  </div>
                ))
              ) : (
                <div className={styles.calloutWarning}>
                  Agrega líneas antes de previsualizar el documento.
                </div>
              )}
            </div>

            {selectedInvoiceDocument.invoice.notes ? (
              <div className={styles.invoicingDocumentNotes}>
                <span className={styles.label}>Notas</span>
                <p>{selectedInvoiceDocument.invoice.notes}</p>
              </div>
            ) : null}
          </section>
        </div>

        <aside className={styles.invoicingDocumentReviewRail}>
          <section className={styles.invoicingDocumentTotalsCard}>
            <div>
              <span>Subtotal</span>
              <strong>
                {formatMoney(
                  selectedInvoiceDocument.totals.subtotalInCents,
                  currency,
                )}
              </strong>
            </div>
            <div>
              <span>IVA / impuesto</span>
              <strong>
                {formatMoney(
                  selectedInvoiceDocument.totals.taxInCents,
                  currency,
                )}
              </strong>
            </div>
            <div className={styles.invoicingDocumentGrandTotal}>
              <span>Total</span>
              <strong>
                {formatMoney(
                  selectedInvoiceDocument.totals.totalInCents,
                  currency,
                )}
              </strong>
            </div>
          </section>

          <section className={styles.invoicingDocumentArtifactCard}>
            <div className={styles.invoiceCardHeader}>
              <div>
                <span className={styles.label}>Artefactos</span>
                <h3>Previsualización</h3>
              </div>
              <span className={styles.statusPill}>
                {isAuthorizedRide
                  ? 'RIDE autorizado'
                  : selectedInvoiceRide
                    ? 'RIDE referencial'
                    : 'Sin RIDE'}
              </span>
            </div>

            <div className={styles.invoicingDocumentArtifactRow}>
              <div>
                <strong>Versión imprimible</strong>
                <small>Vista HTML del documento</small>
              </div>
              <button
                className={styles.secondaryButton}
                disabled={actionLoading === 'open-invoice-document'}
                onClick={onOpenPrintableInvoice}
                type="button"
              >
                {actionLoading === 'open-invoice-document'
                  ? 'Abriendo...'
                  : 'Abrir'}
              </button>
            </div>

            <div
              className={`${styles.invoicingDocumentArtifactRow} ${
                selectedInvoiceRide
                  ? ''
                  : styles.invoicingDocumentArtifactRowUnavailable
              }`}
            >
              <div>
                <strong>RIDE electrónico</strong>
                <small>
                  {selectedInvoiceArtifacts?.rideHtmlFileName ??
                    'Aún no generado'}
                </small>
                <em>
                  {isAuthorizedRide
                    ? 'Imprimible como comprobante autorizado'
                    : selectedInvoiceRide
                      ? 'Referencial / pendiente — no autorizado'
                      : 'No disponible todavía'}
                </em>
              </div>
              <div className={styles.invoicingDocumentActionGroup}>
                <button
                  className={styles.ghostButton}
                  disabled={
                    !selectedInvoiceRide ||
                    actionLoading === 'open-invoice-ride'
                  }
                  onClick={onOpenElectronicRide}
                  type="button"
                >
                  {actionLoading === 'open-invoice-ride'
                    ? 'Abriendo...'
                    : 'Abrir'}
                </button>
                <button
                  className={styles.ghostButton}
                  disabled={
                    actionLoading === 'download-invoice-ride' ||
                    !selectedInvoiceArtifacts?.canDownloadRide
                  }
                  onClick={onDownloadElectronicRide}
                  type="button"
                >
                  {actionLoading === 'download-invoice-ride'
                    ? 'Descargando...'
                    : 'RIDE'}
                </button>
              </div>
            </div>

            <div
              className={`${styles.invoicingDocumentArtifactRow} ${
                selectedInvoiceArtifacts?.canDownloadXml
                  ? ''
                  : styles.invoicingDocumentArtifactRowUnavailable
              }`}
            >
              <div>
                <strong>XML preliminar</strong>
                <small>
                  {selectedInvoiceArtifacts?.xmlFileName ?? 'Aún no generado'}
                </small>
                <em>
                  {selectedInvoiceArtifacts?.canDownloadXml
                    ? 'Disponible para descarga'
                    : 'No disponible todavía'}
                </em>
              </div>
              <button
                className={styles.ghostButton}
                disabled={
                  actionLoading === 'download-invoice-xml' ||
                  !selectedInvoiceArtifacts?.canDownloadXml
                }
                onClick={onDownloadElectronicXml}
                type="button"
              >
                {actionLoading === 'download-invoice-xml'
                  ? 'Descargando...'
                  : 'XML'}
              </button>
            </div>
          </section>

          {selectedInvoiceRide ? (
            <section
              className={`${styles.invoicingDocumentAuthorizationCard} ${
                isAuthorizedRide
                  ? styles.invoicingDocumentAuthorizationCardSuccess
                  : ''
              }`}
            >
              <span className={styles.label}>Estado RIDE</span>
              <h3>{selectedInvoiceRide.ride.electronicStatusLabel}</h3>
              <p>
                {isAuthorizedRide
                  ? 'Imprimible como comprobante autorizado.'
                  : 'Aún referencial o pendiente. No autorizado por el SRI.'}
              </p>
              <DocumentFact
                label="Ambiente"
                value={selectedInvoiceRide.ride.environmentLabel}
              />
              <DocumentFact
                label="Emisión"
                value={selectedInvoiceRide.ride.emissionTypeLabel}
              />
              <DocumentFact
                label="Autorización"
                value={selectedInvoiceRide.ride.authorizationNumber}
              />
              {selectedInvoiceRide.ride.accessKeyChunks.length > 0 ? (
                <div className={styles.invoicingDocumentAccessKey}>
                  <span>Clave de acceso</span>
                  <code>
                    {selectedInvoiceRide.ride.accessKeyChunks.join(' · ')}
                  </code>
                </div>
              ) : null}
              {selectedInvoiceRide.ride.additionalInfoFields.length > 0 ? (
                <div className={styles.invoicingDocumentFactList}>
                  {selectedInvoiceRide.ride.additionalInfoFields.map(
                    (field) => (
                      <DocumentFact
                        key={field.label}
                        label={field.label}
                        value={field.value}
                      />
                    ),
                  )}
                </div>
              ) : null}
            </section>
          ) : null}

          <section className={styles.invoicingDocumentReviewCard}>
            <strong>Revisar no es enviar al SRI</strong>
            <p className={styles.muted}>
              La firma, el envío y la autorización ocurren en su propio flujo.
              Aquí solo validamos que el documento y sus artefactos sean
              entendibles antes de avanzar.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export function InvoicingNotificationsPanel({
  actionLoading,
  formatElectronicStatus,
  formatMoney,
  invoiceEmailMessage,
  invoiceEmailRecipient,
  onInvoiceEmailMessageChange,
  onInvoiceEmailRecipientChange,
  onSendInvoiceEmail,
  selectedInvoiceDetail,
}: InvoicingNotificationsPanelProps) {
  const deliveryStatus = deriveDeliveryCloseoutStatus({
    isSending: actionLoading === 'send-invoice-email',
    recipientEmail: invoiceEmailRecipient,
  });
  const deliveryMeta = deriveDeliveryCloseoutMeta(deliveryStatus);
  const paymentStatus = derivePaymentCloseoutStatus(selectedInvoiceDetail);
  const paymentMeta = derivePaymentCloseoutMeta(selectedInvoiceDetail);
  const sriMeta = deriveSriCloseoutStatus(selectedInvoiceDetail);
  const verdict = deriveCloseoutVerdict({
    deliveryStatus,
    invoice: selectedInvoiceDetail,
    paymentStatus,
  });
  const nextStep = deriveCloseoutNextStep({
    deliveryStatus,
    invoice: selectedInvoiceDetail,
    paymentStatus,
  });
  const canSendEmail =
    selectedInvoiceDetail.status !== 'draft' &&
    selectedInvoiceDetail.status !== 'void' &&
    deliveryStatus !== 'no_email' &&
    actionLoading !== 'send-invoice-email';

  return (
    <div className={styles.invoicingCloseoutStack}>
      <section
        className={`${styles.invoicingCloseoutHero} ${
          verdict.tone === 'success'
            ? styles.invoicingCloseoutHeroSuccess
            : verdict.tone === 'warning'
              ? styles.invoicingCloseoutHeroWarning
              : verdict.tone === 'danger'
                ? styles.invoicingCloseoutHeroDanger
                : verdict.tone === 'info'
                  ? styles.invoicingCloseoutHeroInfo
                  : ''
        }`}
      >
        <div className={styles.invoicingCloseoutHeroMain}>
          <div>
            <span className={styles.label}>Invoicing · Cierre operativo</span>
            <h3>{verdict.label}</h3>
            <p>{verdict.detail}</p>
          </div>
          <span className={`${styles.statusPill} ${closeoutToneClass(verdict.tone)}`}>
            {formatElectronicStatus(selectedInvoiceDetail.electronicStatus)}
          </span>
        </div>

        <div className={styles.invoicingCloseoutTriad}>
          <CloseoutStatusCard
            detail={sriMeta.detail}
            label={sriMeta.label}
            title="SRI"
            tone={sriMeta.tone}
          />
          <CloseoutStatusCard
            detail={deliveryMeta.detail}
            label={deliveryMeta.label}
            title="Entrega"
            tone={deliveryMeta.tone}
          />
          <CloseoutStatusCard
            detail={paymentMeta.detail}
            label={paymentMeta.label}
            title="Pago"
            tone={paymentMeta.tone}
          />
        </div>

        <div className={styles.invoicingCloseoutNextStep}>
          <span>Proximo paso recomendado</span>
          <strong>{nextStep}</strong>
        </div>
      </section>

      <form
        className={styles.invoicingCloseoutCard}
        onSubmit={(event) => {
          event.preventDefault();
          onSendInvoiceEmail();
        }}
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Entrega al cliente</span>
            <h3>Compartir comprobante</h3>
          </div>
          <span className={`${styles.statusPill} ${closeoutToneClass(deliveryMeta.tone)}`}>
            {deliveryMeta.label}
          </span>
        </div>
        <p className={styles.muted}>
          Enviar el email no cambia el estado en el SRI ni registra el pago.
          Solo deja encaminada la entrega operativa al cliente.
        </p>

        <label className={styles.field}>
          <span>Destinatario</span>
          <input
            onChange={(event) =>
              onInvoiceEmailRecipientChange(event.target.value)
            }
            placeholder="cobranzas@cliente.ec"
            type="email"
            value={invoiceEmailRecipient}
          />
          {deliveryStatus === 'no_email' ? (
            <small className={styles.fieldHint}>
              Esta factura no tiene un correo de cliente confirmado.
            </small>
          ) : null}
        </label>

        <label className={styles.field}>
          <span>Mensaje opcional</span>
          <textarea
            onChange={(event) =>
              onInvoiceEmailMessageChange(event.target.value)
            }
            placeholder="Te compartimos el comprobante y el detalle del saldo."
            value={invoiceEmailMessage}
          />
        </label>

        <div className={styles.invoicingCloseoutDeliverySummary}>
          <span>
            Saldo actual{' '}
            <strong>
              {formatMoney(
                selectedInvoiceDetail.settlement.balanceDueInCents,
                selectedInvoiceDetail.currency,
              )}
            </strong>
          </span>
          <span>
            Documento <strong>{selectedInvoiceDetail.number}</strong>
          </span>
        </div>

        <button
          className={styles.primaryButton}
          disabled={!canSendEmail}
          type="submit"
        >
          {actionLoading === 'send-invoice-email'
            ? 'Enviando...'
            : 'Enviar factura'}
        </button>
      </form>
    </div>
  );
}
