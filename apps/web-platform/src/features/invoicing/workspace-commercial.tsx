import styles from '../../app/app.module.css';
import type {
  InvoiceDetailResponse,
  TaxRateResponse,
} from '../../app/types';

type InvoicingPaymentsPanelProps = {
  actionLoading: string | null;
  formatDate: (value: string | null | undefined) => string;
  formatMoney: (valueInCents: number, currency: string) => string;
  formatPaymentStatus: (status: string) => string;
  newPaymentAmountInCents: string;
  newPaymentMethod: string;
  newPaymentNotes: string;
  newPaymentPaidAt: string;
  newPaymentReference: string;
  onCreateInvoicePayment: () => void;
  onNewPaymentAmountInCentsChange: (value: string) => void;
  onNewPaymentMethodChange: (value: string) => void;
  onNewPaymentNotesChange: (value: string) => void;
  onNewPaymentPaidAtChange: (value: string) => void;
  onNewPaymentReferenceChange: (value: string) => void;
  onPaymentReversalReasonChange: (value: string) => void;
  onReverseInvoicePayment: (paymentId: string) => void;
  paymentReversalReason: string;
  selectedInvoiceDetail: InvoiceDetailResponse;
};

type InvoicingInvoiceItemsPanelProps = {
  actionLoading: string | null;
  formatMoney: (valueInCents: number, currency: string) => string;
  formatPercentage: (value: number) => string;
  newItemDescription: string;
  newItemQuantity: string;
  newItemTaxRateId: string;
  newItemUnitPriceInCents: string;
  onCreateInvoiceItem: () => void;
  onNewItemDescriptionChange: (value: string) => void;
  onNewItemQuantityChange: (value: string) => void;
  onNewItemTaxRateIdChange: (value: string) => void;
  onNewItemUnitPriceInCentsChange: (value: string) => void;
  selectedInvoiceDetail: InvoiceDetailResponse;
  taxRates: TaxRateResponse[];
};

export function InvoicingPaymentsPanel({
  actionLoading,
  formatDate,
  formatMoney,
  formatPaymentStatus,
  newPaymentAmountInCents,
  newPaymentMethod,
  newPaymentNotes,
  newPaymentPaidAt,
  newPaymentReference,
  onCreateInvoicePayment,
  onNewPaymentAmountInCentsChange,
  onNewPaymentMethodChange,
  onNewPaymentNotesChange,
  onNewPaymentPaidAtChange,
  onNewPaymentReferenceChange,
  onPaymentReversalReasonChange,
  onReverseInvoicePayment,
  paymentReversalReason,
  selectedInvoiceDetail,
}: InvoicingPaymentsPanelProps) {
  return (
    <>
      <div className={styles.stack}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Payments</span>
            <h3>{selectedInvoiceDetail.payments.length} pagos</h3>
          </div>
        </div>

        {selectedInvoiceDetail.payments.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Esta factura todavia no tiene pagos registrados.</p>
          </div>
        ) : (
          <div className={styles.stack}>
            {selectedInvoiceDetail.payments.map((payment) => (
              <div className={styles.invoiceItemCard} key={payment.id}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{payment.method}</strong>
                  <span className={styles.statusPill}>
                    {formatMoney(payment.amountInCents, payment.currency)}
                  </span>
                </div>
                <small>Estado: {formatPaymentStatus(payment.status)}</small>
                <small>Fecha: {formatDate(payment.paidAt)}</small>
                <small>Referencia: {payment.reference ?? 'Sin referencia'}</small>
                <small>{payment.notes ?? 'Sin notas'}</small>
                {payment.reversedAt ? (
                  <small>
                    Revertido: {formatDate(payment.reversedAt)}
                    {payment.reversalReason ? ` · ${payment.reversalReason}` : ''}
                  </small>
                ) : null}
                {payment.status === 'posted' ? (
                  <button
                    className={styles.secondaryButton}
                    disabled={actionLoading === `reverse-payment:${payment.id}`}
                    onClick={() => onReverseInvoicePayment(payment.id)}
                    type="button"
                  >
                    {actionLoading === `reverse-payment:${payment.id}`
                      ? 'Revirtiendo...'
                      : 'Revertir pago'}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      <label className={styles.field}>
        <span>Motivo de reversa</span>
        <input
          onChange={(event) => onPaymentReversalReasonChange(event.target.value)}
          placeholder="Pago duplicado, error de conciliacion, etc."
          value={paymentReversalReason}
        />
      </label>

      <form
        className={styles.stack}
        onSubmit={(event) => {
          event.preventDefault();
          onCreateInvoicePayment();
        }}
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Register payment</span>
            <h3>Nuevo pago</h3>
          </div>
        </div>

        <div className={styles.invoiceInlineGrid}>
          <label className={styles.field}>
            <span>Monto (cents)</span>
            <input
              min="1"
              onChange={(event) =>
                onNewPaymentAmountInCentsChange(event.target.value)
              }
              placeholder="6800"
              type="number"
              value={newPaymentAmountInCents}
            />
          </label>
          <label className={styles.field}>
            <span>Metodo</span>
            <input
              onChange={(event) => onNewPaymentMethodChange(event.target.value)}
              placeholder="transfer"
              value={newPaymentMethod}
            />
          </label>
        </div>

        <div className={styles.invoiceInlineGrid}>
          <label className={styles.field}>
            <span>Referencia</span>
            <input
              onChange={(event) => onNewPaymentReferenceChange(event.target.value)}
              placeholder="TRX-001"
              value={newPaymentReference}
            />
          </label>
          <label className={styles.field}>
            <span>Fecha de pago</span>
            <input
              onChange={(event) => onNewPaymentPaidAtChange(event.target.value)}
              type="datetime-local"
              value={newPaymentPaidAt}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>Notas</span>
          <textarea
            onChange={(event) => onNewPaymentNotesChange(event.target.value)}
            placeholder="Pago parcial del periodo."
            value={newPaymentNotes}
          />
        </label>

        <button
          className={styles.primaryButton}
          disabled={
            selectedInvoiceDetail.status === 'draft' ||
            selectedInvoiceDetail.status === 'void' ||
            selectedInvoiceDetail.settlement.balanceDueInCents === 0 ||
            actionLoading === 'create-invoice-payment'
          }
          type="submit"
        >
          {actionLoading === 'create-invoice-payment'
            ? 'Registrando pago...'
            : 'Registrar pago'}
        </button>
      </form>
    </>
  );
}

export function InvoicingInvoiceItemsPanel({
  actionLoading,
  formatMoney,
  formatPercentage,
  newItemDescription,
  newItemQuantity,
  newItemTaxRateId,
  newItemUnitPriceInCents,
  onCreateInvoiceItem,
  onNewItemDescriptionChange,
  onNewItemQuantityChange,
  onNewItemTaxRateIdChange,
  onNewItemUnitPriceInCentsChange,
  selectedInvoiceDetail,
  taxRates,
}: InvoicingInvoiceItemsPanelProps) {
  return (
    <>
      <div className={styles.stack}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Invoice items</span>
            <h3>{selectedInvoiceDetail.items.length} lineas</h3>
          </div>
        </div>

        {selectedInvoiceDetail.items.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Esta factura todavia no tiene items.</p>
          </div>
        ) : (
          <div className={styles.stack}>
            {selectedInvoiceDetail.items.map((item) => (
              <div className={styles.invoiceItemCard} key={item.id}>
                <div className={styles.invoiceCardHeader}>
                  <strong>
                    #{item.position} · {item.description}
                  </strong>
                  <span className={styles.statusPill}>
                    {formatMoney(
                      item.lineTotalInCents,
                      selectedInvoiceDetail.currency,
                    )}
                  </span>
                </div>
                <small>
                  {item.quantity} x{' '}
                  {formatMoney(
                    item.unitPriceInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </small>
                <small>
                  Impuesto:{' '}
                  {item.taxRateName && item.taxRatePercentage !== null
                    ? `${item.taxRateName} (${formatPercentage(
                        item.taxRatePercentage,
                      )}%)`
                    : 'Sin impuesto'}
                </small>
                <small>
                  Tax line:{' '}
                  {formatMoney(
                    item.lineTaxInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        className={styles.stack}
        onSubmit={(event) => {
          event.preventDefault();
          onCreateInvoiceItem();
        }}
      >
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Add item</span>
            <h3>Nueva linea</h3>
          </div>
        </div>

        <label className={styles.field}>
          <span>Descripcion</span>
          <input
            onChange={(event) => onNewItemDescriptionChange(event.target.value)}
            placeholder="Servicio mensual"
            value={newItemDescription}
          />
        </label>

        <div className={styles.invoiceInlineGrid}>
          <label className={styles.field}>
            <span>Quantity</span>
            <input
              min="1"
              onChange={(event) => onNewItemQuantityChange(event.target.value)}
              type="number"
              value={newItemQuantity}
            />
          </label>
          <label className={styles.field}>
            <span>Unit price (cents)</span>
            <input
              min="0"
              onChange={(event) =>
                onNewItemUnitPriceInCentsChange(event.target.value)
              }
              placeholder="2500"
              type="number"
              value={newItemUnitPriceInCents}
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>Impuesto</span>
          <select
            className={styles.selectField}
            onChange={(event) => onNewItemTaxRateIdChange(event.target.value)}
            value={newItemTaxRateId}
          >
            <option value="">Sin impuesto</option>
            {taxRates
              .filter((taxRate) => taxRate.isActive)
              .map((taxRate) => (
                <option key={taxRate.id} value={taxRate.id}>
                  {taxRate.name} ({formatPercentage(taxRate.percentage)}%)
                </option>
              ))}
          </select>
        </label>

        <button
          className={styles.primaryButton}
          disabled={
            !newItemDescription.trim() ||
            !newItemUnitPriceInCents.trim() ||
            actionLoading === 'create-invoice-item'
          }
          type="submit"
        >
          {actionLoading === 'create-invoice-item'
            ? 'Agregando item...'
            : 'Agregar item'}
        </button>
        <p className={styles.muted}>
          El backend calcula `lineTotalInCents`, `lineTaxInCents` y reordena la
          posicion automaticamente.
        </p>
      </form>
    </>
  );
}
