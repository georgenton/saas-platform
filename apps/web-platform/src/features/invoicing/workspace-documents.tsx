import styles from '../../app/app.module.css';
import type {
  InvoiceDocumentResponse,
  InvoiceElectronicArtifactsResponse,
  InvoiceRideResponse,
} from '../../app/types';

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
  invoiceEmailMessage: string;
  invoiceEmailRecipient: string;
  onInvoiceEmailMessageChange: (value: string) => void;
  onInvoiceEmailRecipientChange: (value: string) => void;
  onSendInvoiceEmail: () => void;
};

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
  return (
    <>
      {selectedInvoiceDocument ? (
        <div className={styles.documentPreview}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Document preview</span>
              <h3>
                {formatElectronicDocumentLabel(
                  selectedInvoiceDocument.invoice.documentCode,
                )}{' '}
                {selectedInvoiceDocument.invoice.number}
              </h3>
            </div>
            <button
              className={styles.secondaryButton}
              disabled={actionLoading === 'open-invoice-document'}
              onClick={onOpenPrintableInvoice}
              type="button"
            >
              {actionLoading === 'open-invoice-document'
                ? 'Abriendo...'
                : 'Abrir version imprimible'}
            </button>
            <button
              className={styles.ghostButton}
              disabled={actionLoading === 'open-invoice-ride'}
              onClick={onOpenElectronicRide}
              type="button"
            >
              {actionLoading === 'open-invoice-ride'
                ? 'Abriendo RIDE...'
                : 'Abrir RIDE electronico'}
            </button>
          </div>

          <div className={styles.invoiceDetailGrid}>
            <div className={styles.detailCard}>
              <span className={styles.muted}>Emisor</span>
              <strong>{selectedInvoiceDocument.issuer.legalName}</strong>
              <small>
                {selectedInvoiceDocument.issuer.taxId
                  ? `RUC ${selectedInvoiceDocument.issuer.taxId}`
                  : selectedInvoiceDocument.issuer.tenantSlug}
              </small>
            </div>
            <div className={styles.detailCard}>
              <span className={styles.muted}>Cliente</span>
              <strong>{selectedInvoiceDocument.customer.name}</strong>
              <small>
                {selectedInvoiceDocument.customer.identificationType
                  ? `${formatBuyerIdentificationType(
                      selectedInvoiceDocument.customer.identificationType,
                    )}: ${
                      selectedInvoiceDocument.customer.identification ??
                      'Sin identificacion'
                    }`
                  : selectedInvoiceDocument.customer.taxId ??
                    selectedInvoiceDocument.customer.email ??
                    'Sin identificacion fiscal'}
              </small>
              <small>
                {selectedInvoiceDocument.customer.billingAddress ??
                  'Sin direccion del comprador'}
              </small>
            </div>
          </div>

          <div className={styles.invoiceDetailGrid}>
            <div className={styles.detailCard}>
              <span className={styles.muted}>Ambiente</span>
              <strong>
                {selectedInvoiceDocument.issuer.environment ?? 'No configurado'}
              </strong>
              <small>
                Emision:{' '}
                {selectedInvoiceDocument.issuer.emissionType ?? 'No configurada'}
              </small>
            </div>
            <div className={styles.detailCard}>
              <span className={styles.muted}>Estado electronico</span>
              <strong>
                {formatElectronicStatus(
                  selectedInvoiceDocument.invoice.electronicStatus,
                )}
              </strong>
              <small>
                {selectedInvoiceDocument.invoice.authorizationNumber ??
                  selectedInvoiceDocument.invoice.accessKey ??
                  'Sin autorizacion registrada'}
              </small>
            </div>
            <div className={styles.detailCard}>
              <span className={styles.muted}>Numeracion</span>
              <strong>
                {selectedInvoiceDocument.invoice.documentCode ?? 'Sin codDoc'} ·{' '}
                {selectedInvoiceDocument.invoice.establishmentCode ?? '---'}-
                {selectedInvoiceDocument.invoice.emissionPointCode ?? '---'}
              </strong>
              <small>
                Secuencial:{' '}
                {selectedInvoiceDocument.invoice.sequenceNumber !== null
                  ? String(
                      selectedInvoiceDocument.invoice.sequenceNumber,
                    ).padStart(9, '0')
                  : 'Manual'}
              </small>
            </div>
          </div>

          <div className={styles.stack}>
            {selectedInvoiceDocument.lines.map((line) => (
              <div className={styles.documentLineCard} key={line.id}>
                <div className={styles.invoiceCardHeader}>
                  <strong>
                    #{line.position} · {line.description}
                  </strong>
                  <span className={styles.statusPill}>
                    {formatMoney(
                      line.lineTotalInCents,
                      selectedInvoiceDocument.invoice.currency,
                    )}
                  </span>
                </div>
                <small>
                  {line.quantity} x{' '}
                  {formatMoney(
                    line.unitPriceInCents,
                    selectedInvoiceDocument.invoice.currency,
                  )}{' '}
                  ={' '}
                  {formatMoney(
                    line.lineSubtotalInCents,
                    selectedInvoiceDocument.invoice.currency,
                  )}
                </small>
                <small>
                  Impuesto:{' '}
                  {line.taxRateName && line.taxRatePercentage !== null
                    ? `${line.taxRateName} (${formatPercentage(
                        line.taxRatePercentage,
                      )}%)`
                    : 'Sin impuesto'}
                </small>
                <small>
                  Tax line:{' '}
                  {formatMoney(
                    line.lineTaxInCents,
                    selectedInvoiceDocument.invoice.currency,
                  )}
                </small>
              </div>
            ))}
          </div>

          {selectedInvoiceDocument.invoice.notes ? (
            <div className={styles.detailCard}>
              <span className={styles.muted}>Notas</span>
              <strong>{selectedInvoiceDocument.invoice.notes}</strong>
            </div>
          ) : null}
        </div>
      ) : null}

      {selectedInvoiceRide ? (
        <div className={styles.documentPreview}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Electronic RIDE</span>
              <h3>{selectedInvoiceRide.ride.documentLabel}</h3>
            </div>
            <div className={styles.actionRow}>
              <button
                className={styles.ghostButton}
                disabled={actionLoading === 'download-invoice-ride'}
                onClick={onDownloadElectronicRide}
                type="button"
              >
                {actionLoading === 'download-invoice-ride'
                  ? 'Descargando RIDE...'
                  : 'Descargar RIDE'}
              </button>
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
                  ? 'Descargando XML...'
                  : 'Descargar XML'}
              </button>
            </div>
          </div>

          <div className={styles.invoiceDetailGrid}>
            <div className={styles.detailCard}>
              <span className={styles.muted}>Ambiente</span>
              <strong>{selectedInvoiceRide.ride.environmentLabel}</strong>
              <small>Emision {selectedInvoiceRide.ride.emissionTypeLabel}</small>
            </div>
            <div className={styles.detailCard}>
              <span className={styles.muted}>Estado RIDE</span>
              <strong>{selectedInvoiceRide.ride.electronicStatusLabel}</strong>
              <small>
                {selectedInvoiceRide.ride.canBePrintedAsAuthorized
                  ? 'Listo como comprobante autorizado'
                  : 'Aun referencial o pendiente'}
              </small>
            </div>
          </div>

          <div className={styles.detailCard}>
            <span className={styles.muted}>Clave de acceso</span>
            <pre className={styles.codeBlock}>
              {selectedInvoiceRide.ride.accessKeyChunks.length > 0
                ? selectedInvoiceRide.ride.accessKeyChunks.join(' · ')
                : 'No generada'}
            </pre>
          </div>

          {selectedInvoiceArtifacts ? (
            <div className={styles.invoiceDetailGrid}>
              <div className={styles.detailCard}>
                <span className={styles.muted}>Archivo RIDE</span>
                <strong>{selectedInvoiceArtifacts.rideHtmlFileName}</strong>
              </div>
              <div className={styles.detailCard}>
                <span className={styles.muted}>Archivo XML</span>
                <strong>{selectedInvoiceArtifacts.xmlFileName}</strong>
              </div>
            </div>
          ) : null}

          {selectedInvoiceRide.ride.additionalInfoFields.length > 0 ? (
            <div className={styles.stack}>
              {selectedInvoiceRide.ride.additionalInfoFields.map((field) => (
                <div className={styles.detailCard} key={field.label}>
                  <span className={styles.muted}>{field.label}</span>
                  <strong>{field.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export function InvoicingNotificationsPanel({
  actionLoading,
  invoiceEmailMessage,
  invoiceEmailRecipient,
  onInvoiceEmailMessageChange,
  onInvoiceEmailRecipientChange,
  onSendInvoiceEmail,
}: InvoicingNotificationsPanelProps) {
  return (
    <div className={styles.documentPreview}>
      <form
        className={styles.stack}
        onSubmit={(event) => {
          event.preventDefault();
          onSendInvoiceEmail();
        }}
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Notifications</span>
            <h3>Enviar factura por email</h3>
          </div>
        </div>

        <label className={styles.field}>
          <span>Destinatario</span>
          <input
            onChange={(event) => onInvoiceEmailRecipientChange(event.target.value)}
            placeholder="billing@customer.dev"
            type="email"
            value={invoiceEmailRecipient}
          />
        </label>

        <label className={styles.field}>
          <span>Mensaje opcional</span>
          <textarea
            onChange={(event) => onInvoiceEmailMessageChange(event.target.value)}
            placeholder="Te compartimos la factura del periodo."
            value={invoiceEmailMessage}
          />
        </label>

        <button
          className={styles.primaryButton}
          disabled={actionLoading === 'send-invoice-email'}
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
