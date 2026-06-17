import type { FormEventHandler } from 'react';
import styles from '../../app/app.module.css';
import type { CustomerResponse } from '../../app/types';

type BuyerIdentificationType = '04' | '05' | '06' | '07' | '08';

type InvoicingCustomerDraftFlowProps = {
  actionLoading: string | null;
  customers: CustomerResponse[];
  formatBuyerIdentificationType: (value: string | null) => string;
  invoicingLoading: boolean;
  nextInvoiceNumberSuggestion: string;
  customerForm: {
    billingAddress: string;
    email: string;
    identificationType: BuyerIdentificationType;
    name: string;
    taxId: string;
    onBillingAddressChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onIdentificationTypeChange: (value: BuyerIdentificationType) => void;
    onNameChange: (value: string) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onTaxIdChange: (value: string) => void;
  };
  invoiceForm: {
    currency: string;
    customerId: string;
    dueAt: string;
    notes: string;
    number: string;
    status: string;
    onCurrencyChange: (value: string) => void;
    onCustomerIdChange: (value: string) => void;
    onDueAtChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onNumberChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
  };
};

export function InvoicingCustomerDraftFlow({
  actionLoading,
  customerForm,
  customers,
  formatBuyerIdentificationType,
  invoiceForm,
  invoicingLoading,
  nextInvoiceNumberSuggestion,
}: InvoicingCustomerDraftFlowProps) {
  return (
    <>
      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Customers</span>
            <h3>{customers.length} registrados</h3>
          </div>
          <span className={styles.statusPill}>
            {customers.length === 0 ? 'Primer comprador' : 'Directorio fiscal'}
          </span>
        </div>

        <div className={styles.invoicingSRIActionCue}>
          <strong>Comprador primero, factura despues</strong>
          <p>
            Este flujo prepara los datos fiscales del comprador antes de crear
            el borrador. Asi evitamos facturas incompletas y dejamos listo el
            camino hacia items, firma y SRI.
          </p>
        </div>

        <form className={styles.stack} onSubmit={customerForm.onSubmit}>
          <label className={styles.field}>
            <span>Nombre del customer</span>
            <input
              onChange={(event) => customerForm.onNameChange(event.target.value)}
              placeholder="Acme Corp"
              value={customerForm.name}
            />
          </label>
          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Email</span>
              <input
                onChange={(event) =>
                  customerForm.onEmailChange(event.target.value)
                }
                placeholder="billing@acme.com"
                type="email"
                value={customerForm.email}
              />
            </label>
            <label className={styles.field}>
              <span>Tipo identificacion</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  customerForm.onIdentificationTypeChange(
                    event.target.value as BuyerIdentificationType,
                  )
                }
                value={customerForm.identificationType}
              >
                <option value="04">04 · RUC</option>
                <option value="05">05 · Cedula</option>
                <option value="06">06 · Pasaporte</option>
                <option value="07">07 · Consumidor final</option>
                <option value="08">08 · Exterior</option>
              </select>
            </label>
          </div>
          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Identificacion</span>
              <input
                onChange={(event) => customerForm.onTaxIdChange(event.target.value)}
                placeholder={
                  customerForm.identificationType === '07'
                    ? '9999999999999'
                    : '0999999999'
                }
                value={customerForm.taxId}
              />
            </label>
            <label className={styles.field}>
              <span>Direccion</span>
              <input
                onChange={(event) =>
                  customerForm.onBillingAddressChange(event.target.value)
                }
                placeholder="Direccion del comprador"
                value={customerForm.billingAddress}
              />
            </label>
          </div>
          <button
            className={styles.primaryButton}
            disabled={
              !customerForm.name.trim() || actionLoading === 'create-customer'
            }
            type="submit"
          >
            {actionLoading === 'create-customer'
              ? 'Creando customer...'
              : 'Crear customer'}
          </button>
          <p className={styles.muted}>
            Cada customer queda aislado por tenant y ahora tambien puede guardar
            la semantica Ecuador del comprador para reutilizarla en multiples
            facturas.
          </p>
        </form>

        {invoicingLoading ? (
          <p className={styles.muted}>Cargando customers...</p>
        ) : customers.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Este tenant todavia no tiene customers registrados.</p>
          </div>
        ) : (
          <div className={styles.stack}>
            {customers.map((customer) => (
              <div className={styles.invoiceCard} key={customer.id}>
                <strong>{customer.name}</strong>
                <span>{customer.email ?? 'Sin email'}</span>
                <small>
                  {customer.identificationType
                    ? `${formatBuyerIdentificationType(
                        customer.identificationType,
                      )}: ${customer.identification ?? 'Sin identificacion'}`
                    : customer.taxId ?? 'Sin tax id'}
                </small>
                <small>{customer.billingAddress ?? 'Sin direccion'}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.detailCard} id="invoicing-create-invoice">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Create invoice</span>
            <h3>Nueva factura</h3>
          </div>
          <span className={styles.statusPill}>Draft primero</span>
        </div>

        <form className={styles.stack} onSubmit={invoiceForm.onSubmit}>
          {customers.length === 0 ? (
            <div className={styles.emptyState}>
              <p>
                Primero necesitamos al menos un customer para poder emitir la
                primera factura.
              </p>
            </div>
          ) : null}

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Customer</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  invoiceForm.onCustomerIdChange(event.target.value)
                }
                value={invoiceForm.customerId}
              >
                <option value="">Selecciona un customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>Numero</span>
              <input
                onChange={(event) =>
                  invoiceForm.onNumberChange(event.target.value)
                }
                placeholder={nextInvoiceNumberSuggestion}
                value={invoiceForm.number}
              />
            </label>
          </div>

          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Currency</span>
              <input
                maxLength={3}
                onChange={(event) =>
                  invoiceForm.onCurrencyChange(event.target.value)
                }
                placeholder="USD"
                value={invoiceForm.currency}
              />
            </label>
            <label className={styles.field}>
              <span>Status</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  invoiceForm.onStatusChange(event.target.value)
                }
                value={invoiceForm.status}
              >
                <option value="draft">draft</option>
                <option value="issued">issued</option>
                <option value="paid">paid</option>
                <option value="void">void</option>
              </select>
            </label>
          </div>

          <label className={styles.field}>
            <span>Due at</span>
            <input
              onChange={(event) => invoiceForm.onDueAtChange(event.target.value)}
              type="date"
              value={invoiceForm.dueAt}
            />
          </label>

          <label className={styles.field}>
            <span>Notes</span>
            <textarea
              onChange={(event) => invoiceForm.onNotesChange(event.target.value)}
              placeholder="Notas opcionales para la factura"
              value={invoiceForm.notes}
            />
          </label>

          <button
            className={styles.primaryButton}
            disabled={
              customers.length === 0 ||
              !invoiceForm.customerId ||
              !invoiceForm.currency.trim() ||
              actionLoading === 'create-invoice'
            }
            type="submit"
          >
            {actionLoading === 'create-invoice'
              ? 'Creando factura...'
              : 'Crear factura'}
          </button>
          <p className={styles.muted}>
            Tip: usa estado <strong>draft</strong> para ir agregando items antes
            de pasarla a emitida. Si dejas el numero vacio y ya configuraste la
            numeracion Ecuador, se autogenerara.
          </p>
        </form>
      </div>
    </>
  );
}
