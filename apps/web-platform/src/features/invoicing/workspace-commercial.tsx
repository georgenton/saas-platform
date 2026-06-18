import styles from '../../app/app.module.css';
import type { InvoiceDetailResponse, TaxRateResponse } from '../../app/types';
import { centsToCurrencyInput, currencyInputToCents } from './items/money';

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

function formatInvoiceStatus(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Borrador',
    issued: 'Emitida',
    paid: 'Pagada',
    void: 'Anulada',
  };

  return labels[status] ?? status;
}

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
                <small>
                  Referencia: {payment.reference ?? 'Sin referencia'}
                </small>
                <small>{payment.notes ?? 'Sin notas'}</small>
                {payment.reversedAt ? (
                  <small>
                    Revertido: {formatDate(payment.reversedAt)}
                    {payment.reversalReason
                      ? ` · ${payment.reversalReason}`
                      : ''}
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
          onChange={(event) =>
            onPaymentReversalReasonChange(event.target.value)
          }
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
              onChange={(event) =>
                onNewPaymentReferenceChange(event.target.value)
              }
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
  const activeTaxRates = taxRates.filter((taxRate) => taxRate.isActive);
  const selectedTaxRate =
    activeTaxRates.find((taxRate) => taxRate.id === newItemTaxRateId) ?? null;
  const quantity = Math.max(0, Number.parseInt(newItemQuantity, 10) || 0);
  const unitPriceInCents = Number.parseInt(newItemUnitPriceInCents, 10);
  const hasLinePreview =
    quantity > 0 && Number.isFinite(unitPriceInCents) && unitPriceInCents >= 0;
  const previewSubtotalInCents = hasLinePreview
    ? quantity * unitPriceInCents
    : 0;
  const previewTaxInCents =
    hasLinePreview && selectedTaxRate
      ? Math.round((previewSubtotalInCents * selectedTaxRate.percentage) / 100)
      : 0;
  const previewTotalInCents = previewSubtotalInCents + previewTaxInCents;
  const canAddItems = selectedInvoiceDetail.status === 'draft';
  const electronicStatus =
    selectedInvoiceDetail.electronicStatus ?? 'Documento no emitido al SRI';

  return (
    <section className={styles.invoicingItemsFlow}>
      <div className={styles.invoicingItemsPageHeader}>
        <div>
          <span className={styles.label}>Invoicing · Composicion</span>
          <h2>Lineas y totales</h2>
          <p>
            Agrega lo que estas cobrando y mira como se forman el subtotal, el
            IVA y el total sin lenguaje contable complicado.
          </p>
        </div>
        <span className={styles.statusPill}>Guia rapida</span>
      </div>

      <div className={styles.invoicingItemsContextCard}>
        <div className={styles.invoicingItemsContextMain}>
          <span className={styles.invoicingItemsContextIcon}>#</span>
          <div>
            <h3>{selectedInvoiceDetail.number}</h3>
            <p>
              {selectedInvoiceDetail.buyerName ?? 'Comprador sin nombre'} ·{' '}
              {selectedInvoiceDetail.buyerIdentification ??
                'Sin identificacion'}
            </p>
          </div>
          <span className={styles.statusPill}>
            {formatInvoiceStatus(selectedInvoiceDetail.status)}
          </span>
        </div>
        <div className={styles.invoicingItemsContextMeta}>
          <span>
            Moneda <strong>{selectedInvoiceDetail.currency}</strong>
          </span>
          <span>
            Items <strong>{selectedInvoiceDetail.items.length}</strong>
          </span>
          <span>
            Estado electronico <strong>{electronicStatus}</strong>
          </span>
        </div>
        <div className={styles.invoicingItemsQuietContext}>
          <strong>Contexto SRI</strong>
          <span>
            Aqui solo compones la factura. XML, RIDE, firma y envio al SRI
            vienen despues en sus propias pantallas.
          </span>
        </div>
      </div>

      <div className={styles.invoicingItemsLayout}>
        <div className={styles.stack}>
          <section className={styles.invoicingItemsCard}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>Lineas de la factura</span>
                <h3>
                  {selectedInvoiceDetail.items.length === 1
                    ? '1 linea'
                    : `${selectedInvoiceDetail.items.length} lineas`}
                </h3>
              </div>
              <span
                className={
                  selectedInvoiceDetail.items.length
                    ? styles.statusPill
                    : styles.statusPillInfo
                }
              >
                {selectedInvoiceDetail.items.length
                  ? 'En composicion'
                  : 'Sin lineas'}
              </span>
            </div>

            {selectedInvoiceDetail.items.length === 0 ? (
              <div className={styles.invoicingItemsEmptyState}>
                <strong>Empieza a componer la factura</strong>
                <p>
                  Agrega la primera linea con lo que estas cobrando. Veras el
                  subtotal y el impuesto formarse antes de guardar.
                </p>
              </div>
            ) : (
              <div className={styles.invoicingItemsList}>
                {selectedInvoiceDetail.items.map((item) => (
                  <div className={styles.invoicingItemRow} key={item.id}>
                    <span className={styles.invoicingItemPosition}>
                      {item.position}
                    </span>
                    <div>
                      <strong>{item.description}</strong>
                      <small>
                        {item.quantity} x{' '}
                        {formatMoney(
                          item.unitPriceInCents,
                          selectedInvoiceDetail.currency,
                        )}
                      </small>
                      <small>
                        <span className={styles.invoicingItemTaxTag}>
                          Impuesto{' '}
                        </span>
                        {item.taxRateName && item.taxRatePercentage !== null
                          ? `${item.taxRateName} (${formatPercentage(
                              item.taxRatePercentage,
                            )}%)`
                          : 'Sin impuesto'}{' '}
                        · IVA{' '}
                        {formatMoney(
                          item.lineTaxInCents,
                          selectedInvoiceDetail.currency,
                        )}
                      </small>
                    </div>
                    <strong className={styles.invoicingItemTotal}>
                      {formatMoney(
                        item.lineTotalInCents,
                        selectedInvoiceDetail.currency,
                      )}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </section>

          {!canAddItems ? (
            <section className={styles.invoicingItemsCard}>
              <div className={styles.invoicingCustomerInfoNote}>
                <strong>Esta factura ya no es un borrador.</strong>
                <span>
                  Las lineas quedan fijas cuando la factura cambia de estado.
                  Los ajustes posteriores se resuelven con notas de credito o
                  debito en otra superficie.
                </span>
              </div>
            </section>
          ) : (
            <form
              className={styles.invoicingItemsCard}
              onSubmit={(event) => {
                event.preventDefault();
                onCreateInvoiceItem();
              }}
            >
              <div className={styles.sectionHeading}>
                <div>
                  <span className={styles.label}>Agregar linea</span>
                  <h3>Servicio o producto</h3>
                </div>
                <span className={styles.statusPill}>Draft</span>
              </div>

              {activeTaxRates.length === 0 ? (
                <div className={styles.invoicingItemsWarning}>
                  <strong>No hay impuestos activos</strong>
                  <p>
                    Puedes agregar la linea como sin impuesto o activar tasas en
                    configuracion antes de continuar.
                  </p>
                </div>
              ) : null}

              <label className={styles.field}>
                <span>Descripcion</span>
                <input
                  onChange={(event) =>
                    onNewItemDescriptionChange(event.target.value)
                  }
                  placeholder="Servicio de logistica mensual"
                  value={newItemDescription}
                />
              </label>

              <div className={styles.invoiceInlineGrid}>
                <label className={styles.field}>
                  <span>Cantidad</span>
                  <input
                    min="1"
                    onChange={(event) =>
                      onNewItemQuantityChange(event.target.value)
                    }
                    type="number"
                    value={newItemQuantity}
                  />
                </label>
                <label className={styles.field}>
                  <span>Precio unitario</span>
                  <div className={styles.currencyInputShell}>
                    <span>$</span>
                    <input
                      inputMode="decimal"
                      onChange={(event) =>
                        onNewItemUnitPriceInCentsChange(
                          currencyInputToCents(event.target.value),
                        )
                      }
                      placeholder="120.00"
                      value={centsToCurrencyInput(newItemUnitPriceInCents)}
                    />
                  </div>
                  <small className={styles.fieldHint}>
                    En {selectedInvoiceDetail.currency}, impuestos aparte.
                  </small>
                </label>
              </div>

              <label className={styles.field}>
                <span>Impuesto</span>
                <select
                  className={styles.selectField}
                  onChange={(event) =>
                    onNewItemTaxRateIdChange(event.target.value)
                  }
                  value={newItemTaxRateId}
                >
                  <option value="">Sin impuesto</option>
                  {activeTaxRates.map((taxRate) => (
                    <option key={taxRate.id} value={taxRate.id}>
                      {taxRate.name} ({formatPercentage(taxRate.percentage)}%)
                    </option>
                  ))}
                </select>
              </label>

              <div className={styles.invoicingItemsEstimate}>
                <span>Estimado de la linea</span>
                <div>
                  <small>
                    Subtotal{' '}
                    <strong>
                      {hasLinePreview
                        ? formatMoney(
                            previewSubtotalInCents,
                            selectedInvoiceDetail.currency,
                          )
                        : '--'}
                    </strong>
                  </small>
                  <small>
                    IVA{' '}
                    <strong>
                      {hasLinePreview
                        ? formatMoney(
                            previewTaxInCents,
                            selectedInvoiceDetail.currency,
                          )
                        : '--'}
                    </strong>
                  </small>
                  <small>
                    Total{' '}
                    <strong>
                      {hasLinePreview
                        ? formatMoney(
                            previewTotalInCents,
                            selectedInvoiceDetail.currency,
                          )
                        : '--'}
                    </strong>
                  </small>
                </div>
              </div>

              <div className={styles.inlineActionRow}>
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
                    ? 'Agregando linea...'
                    : 'Agregar linea'}
                </button>
                <p className={styles.muted}>
                  El estimado guia la captura. El total oficial lo recalcula el
                  backend al guardar la linea.
                </p>
              </div>
            </form>
          )}
        </div>

        <aside className={styles.invoicingItemsTotalsRail}>
          <div className={styles.invoicingItemsTotalsCard}>
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.label}>Totales</span>
                <h3>Resumen</h3>
              </div>
              <span className={styles.statusPillSuccess}>Backend</span>
            </div>
            <div className={styles.invoicingItemsTotalsList}>
              <span>
                Subtotal{' '}
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.totals.subtotalInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </span>
              <span>
                IVA / impuesto{' '}
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.totals.taxInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </span>
              <span className={styles.invoicingItemsGrandTotal}>
                Total{' '}
                <strong>
                  {formatMoney(
                    selectedInvoiceDetail.totals.totalInCents,
                    selectedInvoiceDetail.currency,
                  )}
                </strong>
              </span>
            </div>
            <div className={styles.invoicingItemsTotalsFooter}>
              Totales calculados por el backend al guardar cada linea.
            </div>
          </div>
          <div className={styles.invoicingCustomerSRIReassurance}>
            <strong>Despues de componer</strong>
            <p>
              Cuando las lineas esten listas, sigue la revision del documento y
              el XML/RIDE en sus propias pantallas.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
