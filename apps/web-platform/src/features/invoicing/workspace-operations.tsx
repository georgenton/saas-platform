import { useMemo, useState, type ReactNode } from 'react';
import styles from '../../app/app.module.css';
import { StatusPill } from '../../shared/design-system/status-pill';
import type { InvoiceDetailResponse, InvoiceSummaryResponse } from '../../app/types';
import { Stepper, deriveStageFromInvoiceDetail } from './workspace-shared';

type InvoicingWorkspaceOperationsProps = {
  detailChildren?: ReactNode;
  formatBuyerIdentificationType: (value: string | null) => string;
  formatDate: (value: string | null | undefined) => string;
  formatElectronicStatus: (value: string | null) => string;
  formatInvoiceStatus: (value: string) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
  invoiceDetailLoading: boolean;
  invoicingLoading: boolean;
  invoices: InvoiceSummaryResponse[];
  onMarkInvoicePaid: () => void;
  onMarkInvoiceIssued: () => void;
  onMarkInvoiceVoid: () => void;
  onSelectInvoice: (invoiceId: string) => void;
  resolveCustomerName: (customerId: string, buyerName?: string | null) => string;
  selectedInvoiceDetail: InvoiceDetailResponse | null;
  selectedInvoiceId: string | null;
  selectedInvoiceSummary: InvoiceSummaryResponse | null;
  statusActionLoadingKey: string | null;
};

export function InvoicingWorkspaceOperations({
  detailChildren,
  formatBuyerIdentificationType,
  formatDate,
  formatElectronicStatus,
  formatInvoiceStatus,
  formatMoney,
  invoiceDetailLoading,
  invoicingLoading,
  invoices,
  onMarkInvoicePaid,
  onMarkInvoiceIssued,
  onMarkInvoiceVoid,
  onSelectInvoice,
  resolveCustomerName,
  selectedInvoiceDetail,
  selectedInvoiceId,
  selectedInvoiceSummary,
  statusActionLoadingKey,
}: InvoicingWorkspaceOperationsProps) {
  const [queueFilter, setQueueFilter] = useState<
    'all' | 'draft' | 'attention' | 'authorized' | 'rejected'
  >('all');

  const filteredInvoices = useMemo(
    () =>
      invoices.filter((invoice) => matchesQueueFilter(invoice, queueFilter)),
    [invoices, queueFilter],
  );

  const selectedStage = selectedInvoiceDetail
    ? deriveStageFromInvoiceDetail(selectedInvoiceDetail)
    : 'none';
  const detailNextStep = selectedInvoiceDetail
    ? nextStepLabel(selectedInvoiceDetail, selectedStage)
    : null;

  return (
    <div className={styles.invoicingWorkspaceLayout}>
      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Invoices</span>
            <h3>{invoices.length} facturas</h3>
          </div>
        </div>

        <div
          className={styles.invoicingQueueFilter}
          aria-label="Filtro de facturas"
        >
          <QueueFilterButton
            active={queueFilter === 'all'}
            count={invoices.length}
            label="Todas"
            onClick={() => setQueueFilter('all')}
          />
          <QueueFilterButton
            active={queueFilter === 'draft'}
            count={countInvoicesByFilter(invoices, 'draft')}
            label="Borradores"
            onClick={() => setQueueFilter('draft')}
          />
          <QueueFilterButton
            active={queueFilter === 'attention'}
            count={countInvoicesByFilter(invoices, 'attention')}
            label="Por autorizar"
            onClick={() => setQueueFilter('attention')}
          />
          <QueueFilterButton
            active={queueFilter === 'authorized'}
            count={countInvoicesByFilter(invoices, 'authorized')}
            label="Autorizadas"
            onClick={() => setQueueFilter('authorized')}
          />
          <QueueFilterButton
            active={queueFilter === 'rejected'}
            count={countInvoicesByFilter(invoices, 'rejected')}
            label="Rechazadas"
            onClick={() => setQueueFilter('rejected')}
          />
        </div>

        {invoicingLoading ? (
          <p className={styles.muted}>Cargando invoices...</p>
        ) : filteredInvoices.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay facturas en este filtro todavía.</p>
          </div>
        ) : (
          <div className={styles.invoicingQueueList}>
            <div className={styles.invoicingQueueHeader} aria-hidden="true">
              <span>Número</span>
              <span>Cliente</span>
              <span>Total</span>
              <span>Estado</span>
            </div>
            {filteredInvoices.map((invoice) => (
              <button
                className={`${styles.invoiceQueueRow} ${
                  invoice.id === selectedInvoiceId ? styles.invoiceCardActive : ''
                }`}
                key={invoice.id}
                onClick={() => onSelectInvoice(invoice.id)}
                type="button"
              >
                <strong className={styles.invoiceQueueNumber}>{invoice.number}</strong>
                <span className={styles.invoiceQueueCustomer}>
                  {resolveCustomerName(invoice.customerId, invoice.buyerName)}
                </span>
                <span className={styles.invoiceQueueTotal}>
                  {formatMoney(invoice.totals.totalInCents, invoice.currency)}
                </span>
                <span className={styles.statusPill}>
                  {queueStatusLabel(invoice, formatInvoiceStatus)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className={`${styles.detailCard} ${styles.invoicingDetailPanel}`}
        id="invoicing-invoice-detail"
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Invoice detail</span>
            <h3>
              {selectedInvoiceDetail?.number ??
                selectedInvoiceSummary?.number ??
                'Selecciona una factura'}
            </h3>
          </div>
        </div>

        {invoiceDetailLoading ? (
          <p className={styles.muted}>Cargando detalle de factura...</p>
        ) : selectedInvoiceDetail ? (
          <>
            <div className={styles.invoiceItemCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>
                  {resolveCustomerName(
                    selectedInvoiceDetail.customerId,
                    selectedInvoiceDetail.buyerName,
                  )}
                </strong>
                <StatusPill>
                  {formatElectronicStatus(selectedInvoiceDetail.electronicStatus)}
                </StatusPill>
              </div>
              <small>
                {selectedInvoiceDetail.buyerIdentificationType
                  ? `${formatBuyerIdentificationType(
                      selectedInvoiceDetail.buyerIdentificationType,
                    )}: ${
                      selectedInvoiceDetail.buyerIdentification ??
                      'Sin identificacion'
                    }`
                  : 'Sin identificacion Ecuador'}
              </small>
              <Stepper stage={deriveStageFromInvoiceDetail(selectedInvoiceDetail)} />
            </div>

            <div className={styles.invoicingDetailFocusCard}>
              <div className={styles.invoiceCardHeader}>
                <strong>Siguiente paso</strong>
                <StatusPill tone={detailTone(selectedStage)}>
                  {detailStageLabel(selectedStage)}
                </StatusPill>
              </div>
              <p className={styles.invoicingDetailFocusText}>
                {detailNextStep}
              </p>
              <div className={styles.invoicingDetailSignalGrid}>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Documento</span>
                  <strong>{formatInvoiceStatus(selectedInvoiceDetail.status)}</strong>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Electrónico</span>
                  <strong>
                    {formatElectronicStatus(selectedInvoiceDetail.electronicStatus)}
                  </strong>
                </div>
              </div>
            </div>

            <div className={styles.invoiceDetailGrid}>
              <div>
                <span className={styles.muted}>Customer</span>
                <strong>
                  {resolveCustomerName(
                    selectedInvoiceDetail.customerId,
                    selectedInvoiceDetail.buyerName,
                  )}
                </strong>
                <small>
                  {selectedInvoiceDetail.buyerIdentificationType
                    ? `${formatBuyerIdentificationType(
                        selectedInvoiceDetail.buyerIdentificationType,
                      )}: ${
                        selectedInvoiceDetail.buyerIdentification ??
                        'Sin identificacion'
                      }`
                    : 'Sin identificacion Ecuador'}
                </small>
              </div>
              <div>
                <span className={styles.muted}>Issued</span>
                <strong>{formatDate(selectedInvoiceDetail.issuedAt)}</strong>
              </div>
              <div>
                <span className={styles.muted}>Due</span>
                <strong>{formatDate(selectedInvoiceDetail.dueAt)}</strong>
              </div>
              <div>
                <span className={styles.muted}>Currency</span>
                <strong>{selectedInvoiceDetail.currency}</strong>
              </div>
              <div>
                <span className={styles.muted}>Estado</span>
                <strong>{formatInvoiceStatus(selectedInvoiceDetail.status)}</strong>
              </div>
              <div>
                <span className={styles.muted}>Serie Ecuador</span>
                <strong>
                  {selectedInvoiceDetail.establishmentCode &&
                  selectedInvoiceDetail.emissionPointCode
                    ? `${selectedInvoiceDetail.establishmentCode}-${selectedInvoiceDetail.emissionPointCode}`
                    : 'No configurada'}
                </strong>
              </div>
              <div>
                <span className={styles.muted}>Secuencial</span>
                <strong>
                  {selectedInvoiceDetail.sequenceNumber !== null
                    ? String(selectedInvoiceDetail.sequenceNumber).padStart(9, '0')
                    : 'Manual'}
                </strong>
              </div>
            </div>

            <div className={styles.invoiceTotalsGrid}>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Estado electronico</span>
                <strong>
                  {formatElectronicStatus(selectedInvoiceDetail.electronicStatus)}
                </strong>
              </div>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Subtotal</span>
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.totals.subtotalInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </div>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Total</span>
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.totals.totalInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </div>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Pagado</span>
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.settlement.paidInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </div>
              <div className={styles.commercialCard}>
                <span className={styles.muted}>Saldo</span>
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.settlement.balanceDueInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </div>
            </div>

            <div className={styles.actionRow}>
              {selectedInvoiceDetail.status === 'draft' ? (
                <button
                  className={styles.secondaryButton}
                  disabled={statusActionLoadingKey === 'invoice-status:issued'}
                  onClick={onMarkInvoiceIssued}
                  type="button"
                >
                  {statusActionLoadingKey === 'invoice-status:issued'
                    ? 'Emitiendo...'
                    : 'Marcar como emitida'}
                </button>
              ) : null}

              {(selectedInvoiceDetail.status === 'issued' ||
                selectedInvoiceDetail.status === 'partially_paid') ? (
                <button
                  className={styles.primaryButton}
                  disabled={statusActionLoadingKey === 'invoice-status:paid'}
                  onClick={onMarkInvoicePaid}
                  type="button"
                >
                  {statusActionLoadingKey === 'invoice-status:paid'
                    ? 'Registrando...'
                    : 'Marcar como pagada'}
                </button>
              ) : null}

              {(selectedInvoiceDetail.status === 'draft' ||
                selectedInvoiceDetail.status === 'issued') ? (
                <button
                  className={styles.dangerButton}
                  disabled={statusActionLoadingKey === 'invoice-status:void'}
                  onClick={onMarkInvoiceVoid}
                  type="button"
                >
                  {statusActionLoadingKey === 'invoice-status:void'
                    ? 'Anulando...'
                    : 'Anular factura'}
                </button>
              ) : null}
            </div>

            {detailChildren}
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>Selecciona una factura para revisar su detalle operacional.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function QueueFilterButton({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.invoicingQueueFilterButton} ${
        active ? styles.invoicingQueueFilterButtonActive : ''
      }`}
      onClick={onClick}
      type="button"
    >
      <span>{label}</span>
      <small>{count}</small>
    </button>
  );
}

function matchesQueueFilter(
  invoice: InvoiceSummaryResponse,
  filter: 'all' | 'draft' | 'attention' | 'authorized' | 'rejected',
) {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'draft') {
    return invoice.status === 'draft';
  }

  const electronicStatus = invoice.electronicStatus?.toLowerCase() ?? '';

  if (filter === 'authorized') {
    return electronicStatus.includes('authorized');
  }

  if (filter === 'rejected') {
    return (
      electronicStatus.includes('rejected') ||
      electronicStatus.includes('returned')
    );
  }

  return (
    invoice.status === 'issued' ||
    invoice.status === 'partially_paid' ||
    electronicStatus.includes('generated') ||
    electronicStatus.includes('submitted')
  );
}

function countInvoicesByFilter(
  invoices: InvoiceSummaryResponse[],
  filter: 'draft' | 'attention' | 'authorized' | 'rejected',
) {
  return invoices.filter((invoice) => matchesQueueFilter(invoice, filter)).length;
}

function queueStatusLabel(
  invoice: InvoiceSummaryResponse,
  formatInvoiceStatus: (value: string) => string,
) {
  const electronicStatus = invoice.electronicStatus?.toLowerCase() ?? '';

  if (electronicStatus.includes('authorized')) {
    return 'Autorizada';
  }

  if (
    electronicStatus.includes('rejected') ||
    electronicStatus.includes('returned')
  ) {
    return 'Rechazada';
  }

  if (electronicStatus.includes('submitted')) {
    return 'En SRI';
  }

  if (electronicStatus.includes('generated')) {
    return 'Generada';
  }

  return formatInvoiceStatus(invoice.status);
}

function detailStageLabel(
  stage: ReturnType<typeof deriveStageFromInvoiceDetail>,
) {
  switch (stage) {
    case 'generated':
      return 'Generado';
    case 'submitted':
      return 'Enviado';
    case 'authorized':
      return 'Autorizado';
    case 'rejected':
      return 'Rechazado';
    default:
      return 'Borrador';
  }
}

function detailTone(
  stage: ReturnType<typeof deriveStageFromInvoiceDetail>,
): 'default' | 'success' | 'warning' | 'danger' {
  switch (stage) {
    case 'authorized':
      return 'success';
    case 'generated':
    case 'submitted':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'default';
  }
}

function nextStepLabel(
  invoice: InvoiceDetailResponse,
  stage: ReturnType<typeof deriveStageFromInvoiceDetail>,
) {
  if (stage === 'authorized') {
    return 'El comprobante ya está listo para handoff contable y seguimiento de cobro.';
  }

  if (stage === 'submitted') {
    return 'Conviene consultar autorización del SRI antes de seguir con el handoff tributario.';
  }

  if (stage === 'generated') {
    return 'El XML firmado ya existe; el siguiente paso operativo es enviarlo al SRI.';
  }

  if (stage === 'rejected') {
    return invoice.electronicStatusMessage?.trim()
      ? `Revisar observaciones del SRI: ${invoice.electronicStatusMessage.trim()}`
      : 'Revisa la observación del SRI, corrige el documento y regenera el envío.';
  }

  if (invoice.status === 'draft') {
    return 'Completa el documento, confirma numeración y emite antes de activar el flujo electrónico.';
  }

  return 'La factura ya puede seguir el flujo electrónico cuando el equipo lo confirme.';
}
